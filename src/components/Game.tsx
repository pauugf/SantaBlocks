import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import Stats  from 'stats.js';
import { Game as SantaGame } from '../model/Game';
import { SkeletonController, KeyValue } from '../../modules/brooxVisionNode';
import gameConfig from '../config/game.json';
import { FallingItemType } from '../model/FallingItemType';
import SmallBox from './SmallBox';
import { RollingNumber } from './RollingNumber';
import { Body } from '../model/Body';
import { GameStatus } from '../model/GameStatus';
import SimpleCountdown from './SimpleCountdown';
import { Xtransformer } from '../model/Xtransformer';
import { VisionNodeClient } from '../../modules/visionNode';

const Game = ({ show, onPresence, onFinish }: Props) => {
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [keyValue] = useState(new KeyValue());
  const [config] = useState(keyValue.getValue('santaGame', 'config') || gameConfig);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<SantaGame | null>(null);
  const bodyRef = useRef<Body | null>(null);
  const visionNodeClientRef = useRef<VisionNodeClient>(new VisionNodeClient({ port: 5000, protocol: 'webRtc',}));
  const transformerRef = useRef(new Xtransformer(config.accelerationFactor));
  const scoreContainerRef = useRef<HTMLDivElement | null>(null);
  const infoPanelRef = useRef<HTMLDivElement | null>(null);
  const scoreRef = useRef(score);

  useEffect(() => {
    const gameContainer = gameContainerRef.current;
    const scoreContainer = scoreContainerRef.current;
    if(gameContainer && scoreContainer) {
      const ground = config.height - config.ground;
      gameRef.current = new SantaGame(config.width, config.height, config.margin + 100, ground + 20, config.ceiling, config.itemInterval, config.itemSpeed, config.malusItemPercentage, transformerRef.current, ground - config.bodyHeight / 2, config.bodyWidth, config.bodyHeight);
      bodyRef.current = new Body(gameRef.current.getContainer(), config.width, true, config.bodyWidth, config.bodyHeight, ground - config.bodyHeight / 2, transformerRef.current);
      gameRef.current.onCatch(catchedItem => {
        const e = document.createElement('div');
        e.className = 'catch';
        if(catchedItem.type === FallingItemType.malus) {
          e.className += ' red';
          e.innerText = '-' + config.malusScore;
          scoreRef.current -= config.malusScore;
        }
        else {
          e.innerText = '+' + config.itemScore;
          scoreRef.current += config.itemScore;
        }
        scoreContainer.appendChild(e);
        setScore(scoreRef.current);
        gsap.set(e, { css: { y: catchedItem.position.y, x: catchedItem.position.x, opacity: 1 }});
        gsap.to(e, { y: catchedItem.position.y - 200, x: catchedItem.position.x, duration: 2, opacity: 0, onComplete: () => {
          scoreContainer.removeChild(e);
        }});
      });
      gameContainer.appendChild(gameRef.current.getView() as unknown as Node);
      visionNodeClientRef.current.onChange(() => {
        const skeletons = visionNodeClientRef.current.getActors().map(a => a.getSkeleton()).filter(s => s.neck?.x || s.nose?.x);
        if(gameRef.current?.getStatus() === GameStatus.playing) {
          bodyRef.current?.update(skeletons);
          gameRef.current?.checkCollisions(skeletons);
        }
        else {
          onPresence();
        }
      });
      visionNodeClientRef.current.connect();
      visionNodeClientRef.current.setParams([ { processor: 'webrtc', name: 'enabled', value: true } ]);
      const update = () => {
        window.requestAnimationFrame(() => {
          // stats.begin();
          gameRef.current?.update();
          // stats.end();
          update();
        });
      };
      update();
      var gui = new dat.GUI({ hideable: true });
      gui.hide();
      gui.width = 400;
      gui.add(config, 'itemSpeed', 0.1, 8).name('Velocidad de los regalos').onFinishChange(() => {
        gameRef.current && gameRef.current.setItemSpeed(config.itemSpeed);
        keyValue.setValue('santaGame', 'config', config);
      });
      gui.add(config, 'itemInterval', 10, 500, 5).name('Tiempo entre regalos').onFinishChange(() => {
        gameRef.current && gameRef.current.setItemInterval(config.itemInterval);
        keyValue.setValue('santaGame', 'config', config);
      });
      gui.add(config, 'malusItemPercentage', 0.1, 0.9).name('Porcentaje de items "malos"').onFinishChange(() => {
        gameRef.current && gameRef.current.setMalusItemPercentage(config.malusItemPercentage);
        keyValue.setValue('santaGame', 'config', config);
      });
      gui.add(config, 'itemScore', 1, 20, 1).name('Puntuación de regalos').onFinishChange(() => {
        keyValue.setValue('santaGame', 'config', config);
      });
      gui.add(config, 'malusScore', 1, 20, 1).name('Puntuación de items "malos"').onFinishChange(() => {
        keyValue.setValue('santaGame', 'config', config);
      });
      gui.add(config, 'bodyWidth', 5, 100, 1).name('Ancho del jugador').onFinishChange(() => {
        gameRef.current && gameRef.current.setBodyWidth(config.bodyWidth);
        bodyRef.current && bodyRef.current.setWidth(config.bodyWidth);
        keyValue.setValue('santaGame', 'config', config);
      });
      gui.add(config, 'bodyHeight', 5, 100, 1).name('Alto del jugador').onFinishChange(() => {
        gameRef.current && gameRef.current.setBodyHeight(config.bodyHeight);
        bodyRef.current && bodyRef.current.setHeight(config.bodyHeight);
        keyValue.setValue('santaGame', 'config', config);
      });
      gui.add(config, 'accelerationFactor', 1, 5, 0.1).name('Factor de aceleración').onFinishChange(() => {
        transformerRef.current && transformerRef.current.setFactor(config.accelerationFactor);
        keyValue.setValue('santaGame', 'config', config);
      });
      return () => {
        gui.destroy();
      }
    }
  }, []);

  useEffect(() => {
    const infoPanel = infoPanelRef.current;
    const gameContainer = gameContainerRef.current;
    if(show && infoPanel && gameContainer) {
      scoreRef.current = 0;
      setScore(0);
      gsap.set(infoPanel, { css: { top: -529, display: 'block', opacity: 0 }});
      gsap.to(infoPanel, { top: document.body.clientHeight / 2 - 264,  duration: 2, opacity: 1 });
      setTimeout(() => {
        gsap.to(infoPanel, { top: -529,  duration: 2, opacity: 0, onComplete: () => {
          infoPanel.style.display = 'none';
          setStarted(true);
        }});
        gameRef.current && gameRef.current.play();
        setTimeout(() => {
          gameRef.current?.finish();
          setStarted(false);
          onFinish(scoreRef.current);
        }, config.duration * 1000);
      }, config.instructionsTime * 1000);
    }
  }, [ show ]);

  return (
    <>
      <div ref={infoPanelRef} className="box">
        <div style={{ fontSize: '27px', lineHeight: '36px', textAlign: 'left', color: '#35384e' }}>
          <ol>
            <li>Sitúate en la marca del suelo.</li>
            <li>Muévete con el cuerpo a la izquierda o a la derecha y atrapa los regalos dentro de la caja.</li>
            <li>Los <span style={{ color: '#f7231a' }}>regalos rojos</span> suman puntos, los <span style={{ color: 'green' }}>regalos verdes</span> restan.</li>
            <li>Tienes 30 segundos para conseguir el mayor puntaje.</li>
          </ol>
        </div>
      </div>
      <div className="game" style={{ display: show && started ? 'block' : 'none' }}>
      <div ref={gameContainerRef} className="house" style={{ width: config.width, height: config.height }}>
        <div ref={scoreContainerRef} className="scoreContainer"></div>
      </div>
      <SmallBox type="score" top={30} left={30}><div><RollingNumber value={0} to={score} /></div></SmallBox>
      <SmallBox type="time" top={100} left={30}><div>00:<SimpleCountdown show={started} totalTime={config.duration} digits={2} onComplete={() => {}} /></div></SmallBox>
    </div>
    </>
  );
}

interface Props {
  show: boolean,
  onPresence: () => void,
  onFinish: (score: number) => void
}

export { Game };