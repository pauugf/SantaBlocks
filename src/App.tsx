import React, { useState, useRef, useEffect } from 'react';
import './styles/styles.scss';
import broox from '../modules/broox';
import { Game } from './components/Game';
import Webcam from './components/Webcam';
import AnimatedCountdown from './components/AnimatedCountdown';
import StaticImage from './components/Image';
import Countdown from './components/Countdown';
import Photo from './components/Photo';
import Video from './components/Video';
import AnimatedText from './components/AnimatedText';
import { MediaEdition } from './components/MediaEdition';
import { Status } from './model/Status';
import photoConfig from './config/photo.json';
import screenConfig from './config/screen.json';
import { Score } from './components/Score';

const App = ({ webcamConfig, repository }) => {
  const [status, setStatus] = useState(Status.idle);
  const [photo, setPhoto] = useState('');
  const [score, setScore] = useState(0);
  const [prize, setPrize] = useState<any>(null);
  const [frame, setFrame] = useState<HTMLImageElement | null>(null);
  const [keyValue] = useState(new broox.mediaPlayer.KeyValue());
  const [videos] = useState(keyValue.getValue('santaGame', 'videos') || [
    { src: 'content/santa.webm', left: 700, top: 100, scale: 0.3 },
    { src: 'content/galleta.webm', left: 700, top: 100, scale: 0.3 }
  ]);
  const [currentVideo, setCurrentVideo] = useState(videos[0]);
  const [videoEditMode, setVideoEditMode] = useState(false);
  const [playersCount, setPlayersCount] = useState(1);
  const videoEditModeRef = useRef(false);
  const statusRef = useRef(status);
  const frameRef = useRef(frame);

  useEffect(() => {
    // listen keydown event
    window.addEventListener('keydown', event => {
      if(event.key === '1' && !videoEditModeRef.current) {
        setCurrentVideo(videos[0]);
        setVideoEditMode(true);
      }
      else if(event.key === '2' && !videoEditModeRef.current) {
        setCurrentVideo(videos[1]);
        setVideoEditMode(true);
      }
    });
    // load frame
    const frame = new Image();
    frame.onload = () => {
      console.log('frame loaded');
      setFrame(frame);
    }
    frame.src = 'content/frame@3x.png';
    repository.getPlayersCount().then(value => {
      setPlayersCount(value || 0);
    });
  }, []);

  useEffect(() => {
    videoEditModeRef.current = videoEditMode;
  }, [ videoEditMode ]);

  useEffect(() => {
    frameRef.current = frame;
  }, [ frame ]);

  const onChangeVideoSettings = (settings: any) => {
    currentVideo.left = settings.left;
    currentVideo.top = settings.top;
    currentVideo.scale = settings.scale;
    setCurrentVideo({ ... currentVideo });
    keyValue.setValue('santaGame', 'videos', videos);
  }

  const onFinishVideoSettings = () => {
    setVideoEditMode(false);
    setStatus(Status.idle);
  }

  const onPresence = () => {
    if(statusRef.current === Status.idle && !videoEditModeRef.current) {
      changeStatus(Status.game);
    }
  }

  const onFinishGame = (score: number) => {
    setScore(score);
    changeStatus(Status.postGame);
  }

  const onCompleteScore = (prize: any) => {
    console.log(prize);
    setPrize(prize);
    // changeStatus(Status.video);
    changeStatus(Status.idle);
  }

  const onGetPhoto = async () => {
    const container = document.getElementById('stream');
    console.log('container', container?.clientWidth, container?.clientHeight);
    const webcam = document.getElementById('webcam');
    const video: HTMLVideoElement = document.getElementById('video') as HTMLVideoElement;
    const width = (container?.clientWidth || 654) * 3;
    const height = (container?.clientHeight || 350) * 3;
    const composition = new broox.media.Composition(width, height, 0);
    webcam && broox.media.drawPartOfElement(webcam, composition.context, true, webcamConfig.width, webcamConfig.height, 0, 0, width, height, 0, 0, false);
    video && composition.addElement(video, currentVideo.left, currentVideo.top, video.videoWidth, video.videoHeight, currentVideo.scale * 3, false);
    const frame = frameRef.current;
    if(frame) {
      const frameComposition = new broox.media.Composition(frame.width, frame.height, 0);
      frameComposition.addElement(frame, 0, 0, frame.width, frame.height, 1, false);
      const border = 60;
      broox.media.drawPartOfElement(composition.canvas, frameComposition.context, true, composition.canvas.width, composition.canvas.height, 0, 0, frame.width - border * 2, 1060, border, border, false);
      try {
        const blob = await frameComposition.get();
        setPhoto(URL.createObjectURL(blob));
        // await repository.save(blob, prize);
      }
      catch(error: any) {
        console.log(error);
      }
      changeStatus(Status.preview);
    }
  }

  const onWorkflowComplete = () => {
    if(score !== 0) {
      const value = playersCount + 1;
      setPlayersCount(value);
      repository.setPlayersCount(value);
    }
    changeStatus(Status.idle);
  }

  const changeStatus = (status: Status) => {
    setStatus(status);
    statusRef.current = status;
  }

  return (
    <>
      <StaticImage show={status === Status.idle} src={'content/idle_new2.png'} settings={{ width: '100%', height: '100%' }} />
      {/* <Video show={status === Status.idle} id="snow" src={'content/snowIdle.webm'} settings={{ width: '100%', height: '100%' }} loop={true} /> */}
      {/* <div className="playersCount" style={{ display: status === Status.idle ? 'block' : 'none' }}>
        <div className="top">{playersCount} <span>kg</span></div>
        <div className="bottom">De comida solidaria<br/>conseguidos</div>
      </div> */}
      <StaticImage show={status === Status.game || status === Status.postGame || status === Status.video} src={'content/background_new2.png'} settings={{ width: '100%', height: '100%' }} />
      {/* <Video show={status === Status.game || status === Status.postGame || status === Status.video} id="snow" src={'content/snow.webm'} settings={{ width: '100%', height: '100%' }} loop={true} /> */}
      <Game show={status === Status.game} onPresence={onPresence} onFinish={onFinishGame} />
      <Score show={status === Status.postGame} value={score} onComplete={onCompleteScore} />
      <div id="stream" className="stream" style={{ display: status === Status.video || videoEditMode ? 'block' : 'none' }}>
        <Webcam webcamName={webcamConfig.name} webcamWidth={webcamConfig.width} webcamHeight={webcamConfig.height} />
        <Video show={status === Status.video || videoEditMode} id="video" src={currentVideo.src} settings={currentVideo} loop={videoEditMode} />
      </div>
      <MediaEdition show={videoEditMode} settings={currentVideo} onChange={onChangeVideoSettings} onFinish={onFinishVideoSettings} />
      <StaticImage show={status === Status.video} src={'content/stream.png'} settings={{ width: '100%', height: '100%' }} />
      <AnimatedCountdown show={status === Status.video} endTime={5} totalTime={10} onComplete={onGetPhoto} />
      <StaticImage show={status === Status.preview} src={'content/background.png'} settings={{ width: '100%', height: '100%' }} />
      <Photo show={status === Status.preview} image={photo} scale={photoConfig.scale} initialTop={photoConfig.scale * document.body.clientHeight} finalTop={photoConfig.top}></Photo>
      <AnimatedText show={status === Status.preview} initialTop={screenConfig.height} finalTop={screenConfig.height - 100} value={'¡Gracias por participar!'} color={'#0c424d'} fontSize={'51px'} />
      <Countdown show={status === Status.preview} totalTime={15} onComplete={onWorkflowComplete} />
    </>
  );
}

export { App };