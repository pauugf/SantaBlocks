import {Client as $hQBWe$Client} from "rpc-websockets";
import {readPacket as $hQBWe$readPacket} from "osc";

/**
 * Provides context to communicate with Vision Node.
 * #### Usage
 *
 * ``` typescript
 * import { VisionNodeClient } from './brooxVisionNode.js';
 * ```
 * <br/>
 *
 * #### {@link VisionNodeClient}
 *
 * <br/>
 * 
 * @module visionNode
 */ 

class $96e7f0e3fb235949$export$aea29d2c014998ee {
    /**
   * Initializes a new instance of the WebRtcClient class.
   * @param WebRTC channel.
   */ constructor(channel){
        this.startTime = 0;
        this.dataChannelInterval = null;
        this.channel = '';
        this.channel = channel;
        const config = {
            sdpSemantics: 'unified-plan',
            iceServers: [
                {
                    urls: [
                        'stun:stun.l.google.com:19302'
                    ]
                }
            ]
        };
        console.log('creating_connection', Date.now());
        this.connection = new RTCPeerConnection(config);
        console.log('connection_created', Date.now());
    }
    /**
   * Connects to the OSC server.
   */ connect() {
        const parameters = {
            ordered: true
        };
        const dataChannel = this.connection.createDataChannel('chat', parameters);
        dataChannel.addEventListener('close', ()=>{
            clearInterval(this.dataChannelInterval);
        });
        dataChannel.addEventListener('open', ()=>{
            console.log('connection_open', Date.now());
            this.onConnectCallback && this.onConnectCallback();
        // this.dataChannelInterval = setInterval(() => {
        //   const message = 'ping ' + this.getCurrentStamp();
        //   dataChannel.send(message);
        // }, 1000);
        });
        dataChannel.addEventListener('message', (event)=>{
            if (navigator.userAgent.includes('Firefox')) event.data.arrayBuffer().then((buffer)=>{
                const message = (0, $hQBWe$readPacket)(buffer, {
                    metadata: true
                });
                this.onMessageCallback && this.onMessageCallback(message.packets);
            });
            else {
                const message = (0, $hQBWe$readPacket)(event.data, {
                    metadata: true
                });
                this.onMessageCallback && this.onMessageCallback(message.packets);
            }
        });
        const constraints = {
            audio: false,
            video: false
        };
        this.negotiate();
    }
    /**
   * Sets the callback function that fires when the client gets connected.
   * @param callback Callback fired when a client gets connected.
   */ onConnect(callback) {
        this.onConnectCallback = callback;
    }
    /**
   * Sets the callback function that fires when the client is ready to receive messages.
   * @param callback Callback fired when a client is ready to receive messages.
   */ onReady(callback) {
        this.onReadyCallback = callback;
    }
    /**
   * Sets the callback function that fires when a message is received.
   * @param callback Callback fired when a new message is received.
   */ onMessage(callback) {
        this.onMessageCallback = callback;
    }
    negotiate() {
        return this.connection.createOffer().then((offer)=>{
            console.log('offer_created', Date.now());
            return this.connection.setLocalDescription(offer);
        }).then(()=>{
            const offer = this.connection.localDescription;
            const options = {
                body: JSON.stringify({
                    sdp: offer.sdp,
                    type: offer.type,
                    video_transform: 'none'
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            };
            console.log('post', Date.now());
            return fetch(this.channel, options);
        }).then((response)=>{
            return response.json();
        }).then((answer)=>{
            console.log('post_finished', Date.now());
            this.connection.setRemoteDescription(answer);
            this.onReadyCallback && this.onReadyCallback();
        }).catch((error)=>{
            alert(error);
        });
    }
}


class $f090479e8bc93dbc$export$f73d3eb6fd876d80 {
    /**
   * Creates an instance of the Actor class.
   * @param id Actor id.
   */ constructor(id){
        this.id = id;
        this.skeleton = {
            poses: []
        };
    }
    /**
   * Gets actor id.
   * @returns Actor id.
   */ getId() {
        return this.id;
    }
    /**
   * Gets actor skeleton.
   * @returns Actor skeleton.
   */ getSkeleton() {
        return this.skeleton;
    }
    /**
   * Gets actor current zone.
   * @returns Actor current zone.
   */ getCurrentZone() {
        return this.currentZone;
    }
    /**
   * Gets actor last zone.
   * @returns Actor last zone.
   */ getLastZone() {
        return this.lastZone;
    }
    /**
   * Gets actor gender.
   * @returns Actor gender.
   */ getGender() {
        return this.gender;
    }
    /**
   * Gets actor attention.
   * @returns Actor attention.
   */ getAttention() {
        return this.attention;
    }
    /**
   * Gets actor age.
   * @returns Actor age.
   */ getAge() {
        return this.age;
    }
    /**
   * Gets actor dwell time.
   * @returns Actor dwell time.
   */ getDwellTime() {
        return this.dwellTime;
    }
    /**
   * Gets actor dominant emotion.
   * @returns Actor dominant emotion.
   */ getDominantEmotion() {
        return this.dominantEmotion;
    }
    /**
   * Gets actor angle.
   * @returns Actor angle.
   */ getAngle() {
        return this.angle;
    }
    /**
   * Gets actor containig box.
   * @returns Actor containing box.
   */ getBox() {
        return this.box;
    }
    /**
   * Gets actor face box.
   * @returns Actor face box.
   */ getFaceBox() {
        return this.faceBox;
    }
    /**
   * Sets actor skeleton.
   * @param skeleton Actor skeleton.
   */ setSkeleton(skeleton) {
        this.skeleton = skeleton;
    }
    /**
   * Sets actor current zone.
   * @param skeleton Actor current zone.
   */ setCurrentZone(currentZone) {
        this.currentZone = currentZone;
    }
    /**
   * Sets actor last zone.
   * @param skeleton Actor last zone.
   */ setLastZone(lastZone) {
        this.lastZone = lastZone;
    }
    /**
   * Sets actor gender.
   * @param skeleton Actor gender.
   */ setGender(gender) {
        this.gender = gender;
    }
    /**
   * Sets actor attention.
   * @param skeleton Actor attention.
   */ setAttention(attention) {
        this.attention = attention;
    }
    /**
   * Sets actor age.
   * @param skeleton Actor age.
   */ setAge(age) {
        this.age = age;
    }
    /**
   * Sets actor dwell time.
   * @param skeleton Actor dwell time.
   */ setDwellTime(dwellTime) {
        this.dwellTime = dwellTime;
    }
    /**
   * Sets actor dominant emotion.
   * @param skeleton Actor dominant emotion.
   */ setDominantEmotion(dominantEmotion) {
        this.dominantEmotion = dominantEmotion;
    }
    /**
   * Sets actor angle.
   * @param skeleton Actor angle.
   */ setAngle(angle) {
        this.angle = angle;
    }
    /**
   * Sets actor containing box.
   * @param skeleton Actor containing box.
   */ setBox(box) {
        this.box = box;
    }
    /**
   * Sets actor face box.
   * @param skeleton Actor face box.
   */ setFaceBox(faceBox) {
        this.faceBox = faceBox;
    }
}


var $789ffa4afb9d677c$export$d8c34c2371473e33 = /*#__PURE__*/ function(JointType) {
    JointType[JointType["Neck"] = 0] = "Neck";
    JointType[JointType["Nose"] = 1] = "Nose";
    JointType[JointType["CenterHip"] = 2] = "CenterHip";
    JointType[JointType["LeftShoulder"] = 3] = "LeftShoulder";
    JointType[JointType["LeftElbow"] = 4] = "LeftElbow";
    JointType[JointType["LeftWrist"] = 5] = "LeftWrist";
    JointType[JointType["LeftHip"] = 6] = "LeftHip";
    JointType[JointType["LeftKnee"] = 7] = "LeftKnee";
    JointType[JointType["LeftAnkle"] = 8] = "LeftAnkle";
    JointType[JointType["RightShoulder"] = 9] = "RightShoulder";
    JointType[JointType["RightElbow"] = 10] = "RightElbow";
    JointType[JointType["RightWrist"] = 11] = "RightWrist";
    JointType[JointType["RightHip"] = 12] = "RightHip";
    JointType[JointType["RightKnee"] = 13] = "RightKnee";
    JointType[JointType["RightAnkle"] = 14] = "RightAnkle";
    JointType[JointType["RightEye"] = 15] = "RightEye";
    JointType[JointType["LeftEye"] = 16] = "LeftEye";
    JointType[JointType["RightEar"] = 17] = "RightEar";
    JointType[JointType["LeftEar"] = 18] = "LeftEar";
    return JointType;
}({});


var $a3b3a260ba28bc56$export$eba093c1480613f4 = /*#__PURE__*/ function(BoxType) {
    BoxType["Person"] = "person";
    BoxType["Face"] = "face";
    return BoxType;
}({});


class $386af1ad4bee9291$export$7b66729c83b2e494 {
    /**
   * Parses an OSC bundle and create, update or delete a skeleton.
   * @param event OSC event.
   */ set(event) {
        let actor = null;
        for (const data of event){
            if (data.address == '/snap') {
                const args = data.args.map((d)=>d.value);
                this.checkAlive(args.slice(1));
            } else if (data.address === '/vac') {
                const args = data.args.map((d)=>d.value);
                if (args[0] === 'actor') {
                    actor = this.actors.get(args[1]);
                    if (!actor) {
                        actor = new (0, $f090479e8bc93dbc$export$f73d3eb6fd876d80)(args[1]);
                        this.actors.set(actor.getId(), actor);
                    } else actor.setSkeleton({
                        poses: []
                    });
                } else if (args[0] === 'box') this.setBox(actor, args);
                else if (args[0] === 'skel') this.setSkeleton(actor, args);
                else if (args[0] === 'prop') this.setProp(actor, args);
            }
        }
        actor && this.onActorUpdateCallback && this.onActorUpdateCallback(actor);
        this.onUpdateCallback && this.onUpdateCallback();
    }
    /**
   * Gets all alive actors.
   * @returns Array of actors.
   */ getActors() {
        return Array.from(this.actors.values());
    }
    /**
   * Sets a callback that will be fired when there is an update in the skeletons list.
   * @param callback Callback that will be fired when there is an update in the skeletons list.
   */ onUpdate(callback) {
        this.onUpdateCallback = callback;
    }
    /**
   * Sets a callback that will be fired when there is an update in an actor.
   * @param callback Callback that will be fired when there is an update in an actor.
   */ onActorUpdate(callback) {
        this.onActorUpdateCallback = callback;
    }
    checkAlive(aliveActors) {
        for (let key of this.actors.keys())if (!aliveActors.includes(key)) this.actors.delete(key);
    }
    setBox(actor, args) {
        const box = {
            x: args[3],
            y: args[4],
            width: args[5],
            height: args[6]
        };
        if (args[2] === (0, $a3b3a260ba28bc56$export$eba093c1480613f4).Person) actor.setBox(box);
        else if (args[2] === (0, $a3b3a260ba28bc56$export$eba093c1480613f4).Face) actor.setFaceBox(box);
    }
    setProp(actor, args) {
        if (args[2] === 'current_zone') actor.setCurrentZone(args.length > 3 ? args[3] : '');
        else if (args[2] === 'last_zone') actor.setLastZone(args.length > 3 ? args[3] : '');
        else if (args[2] === 'attention') actor.setAttention(args[3]);
        else if (args[2] === 'age') actor.setAge(args[3]);
        else if (args[2] === 'gender') actor.setCurrentZone(args[3] === 'F' ? 'Female' : 'Male');
        else if (args[2] === 'dwell') actor.setDwellTime(args[3]);
        else if (args[2] === 'dominant_emotion') actor.setDominantEmotion(args[3]);
        else if (args[2] === 'angle') actor.setAngle(args[3]);
    }
    setSkeleton(actor, args) {
        const skeleton = {};
        this.setSkeletonJoint(skeleton, {
            x: args[2],
            y: args[3]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).Neck);
        this.setSkeletonJoint(skeleton, {
            x: args[4],
            y: args[5]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).Nose);
        this.setSkeletonJoint(skeleton, {
            x: args[6],
            y: args[7]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).CenterHip);
        this.setSkeletonJoint(skeleton, {
            x: args[8],
            y: args[9]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftShoulder);
        this.setSkeletonJoint(skeleton, {
            x: args[10],
            y: args[11]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftElbow);
        this.setSkeletonJoint(skeleton, {
            x: args[12],
            y: args[13]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftWrist);
        this.setSkeletonJoint(skeleton, {
            x: args[14],
            y: args[15]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftHip);
        this.setSkeletonJoint(skeleton, {
            x: args[16],
            y: args[17]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftKnee);
        this.setSkeletonJoint(skeleton, {
            x: args[18],
            y: args[19]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftAnkle);
        this.setSkeletonJoint(skeleton, {
            x: args[20],
            y: args[21]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightShoulder);
        this.setSkeletonJoint(skeleton, {
            x: args[22],
            y: args[23]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightElbow);
        this.setSkeletonJoint(skeleton, {
            x: args[24],
            y: args[25]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightWrist);
        this.setSkeletonJoint(skeleton, {
            x: args[26],
            y: args[27]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightHip);
        this.setSkeletonJoint(skeleton, {
            x: args[28],
            y: args[29]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightKnee);
        this.setSkeletonJoint(skeleton, {
            x: args[30],
            y: args[31]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightAnkle);
        this.setSkeletonJoint(skeleton, {
            x: args[32],
            y: args[33]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightEye);
        this.setSkeletonJoint(skeleton, {
            x: args[34],
            y: args[35]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftEye);
        this.setSkeletonJoint(skeleton, {
            x: args[36],
            y: args[37]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightEar);
        this.setSkeletonJoint(skeleton, {
            x: args[38],
            y: args[39]
        }, (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftEar);
        skeleton.poses = args.slice(40);
        actor.setSkeleton(skeleton);
    }
    setSkeletonJoint(skeleton, joint, type) {
        if (joint.x > 0 && joint.y > 0) {
            if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).CenterHip) skeleton.centerHip = joint;
            else if (type == (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftAnkle) skeleton.leftAnkle = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftEar) skeleton.leftEar = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftElbow) skeleton.leftElbow = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftEye) skeleton.leftEye = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftHip) skeleton.leftHip = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftKnee) skeleton.leftKnee = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftShoulder) skeleton.leftShoulder = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).LeftWrist) skeleton.leftWrist = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).Neck) skeleton.neck = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).Nose) skeleton.nose = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightAnkle) skeleton.rightAnkle = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightEar) skeleton.rightEar = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightElbow) skeleton.rightElbow = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightEye) skeleton.rightEye = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightHip) skeleton.rightHip = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightKnee) skeleton.rightKnee = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightShoulder) skeleton.rightShoulder = joint;
            else if (type === (0, $789ffa4afb9d677c$export$d8c34c2371473e33).RightWrist) skeleton.rightWrist = joint;
        }
    }
    constructor(){
        this.actors = new Map();
    }
}


var $fa9a28ae4e9dc6d3$export$7bb68dd2f8771783 = /*#__PURE__*/ function(VisionNodeProtocol) {
    VisionNodeProtocol["MQTT"] = "mqtt";
    VisionNodeProtocol["WebRTC"] = "webRtc";
    return VisionNodeProtocol;
}({});
class $fa9a28ae4e9dc6d3$export$ae9b8b72b643631d {
    /**
   * Creates a new instance of the VisionNodeClient class.
   * @param config Vision Node configuration.
   */ constructor(config){
        this.onConnectCallback = config.onConnect;
        this.onReadyCallback = config.onReady;
        this.onChangeCallback = config.onChange;
        this.webSocketUrl = `ws://localhost:${config.port}/ws`;
        this.iniUrl = `http://localhost:${config.port}/ini`;
        this.calibrationUrl = `http://localhost:${config.port}/calibration`;
        if (config.protocol === "webRtc") {
            this.parser = new (0, $386af1ad4bee9291$export$7b66729c83b2e494)();
            this.client = new (0, $96e7f0e3fb235949$export$aea29d2c014998ee)(`http://localhost:${config.port}/webrtc`);
            this.client.onConnect(()=>config.onConnect && config.onConnect(this));
            this.client.onReady(()=>config.onReady && config.onReady(this));
        }
    }
    /**
   * Connects to Vision Node.
   */ connect() {
        this.client.connect();
        this.client.onMessage((message)=>{
            this.parser.set(message);
        });
        this.onChangeCallback && this.parser.onUpdate(this.onChangeCallback);
    }
    /**
   * Gets all actors.
   * @returns Array of actors.
   */ getActors() {
        return this.parser.getActors();
    }
    /**
   * Sets the callback function that fires when the client gets connected.
   * @param callback Callback fired when a client gets connected.
   */ onConnect(callback) {
        this.onConnectCallback = callback;
    }
    /**
   * Sets a callback that will be fired when there is a change.
   * @param callback Callback that will be fired when there is a change.
   */ onChange(callback) {
        this.onChangeCallback = callback;
        this.parser.onUpdate(this.onChangeCallback);
    }
    /**
   * Gets Vision Node current configuration.
   * @returns Vision Node current configuration in json format.
   */ getConfig() {
        return new Promise((resolve, reject)=>{
            const ws = new $hQBWe$Client(this.webSocketUrl);
            ws.on('open', async ()=>{
                const config = await ws.call('getConfig');
                ws.close();
                resolve(config);
            });
            ws.on('error', ()=>{
                reject(false);
            });
        });
    }
    /**
   * Gets an extrinsics calibration for the given params.
   * @param model Camera model.
   * @param points Reference polygon.
   * @param distance Distance to camera.
   * @param length Reference length.
   * @param height Reference height.
   * @returns An extrinsics calibration in json format.
   */ getExtrinsicsCalibration(model, points, distance, length, height) {
        return new Promise((resolve, reject)=>{
            const ws = new $hQBWe$Client(this.webSocketUrl);
            ws.on('open', async ()=>{
                const calibration = await ws.call('calibrateExtrinsics', [
                    model,
                    points,
                    distance,
                    length,
                    height
                ]);
                console.log('extrinsics calibration', calibration);
                ws.close();
                resolve(calibration);
            });
            ws.on('error', ()=>{
                reject(false);
            });
        });
    }
    /**
   * Gets an intrinsics calibration for the given params.
   * @param model Camera model.
   * @param sensor Camera sensor.
   * @param aspect Camera aspect.
   * @param width Camera width.
   * @param height Camera height.
   * @param focalLength Camera focal length.
   * @returns An intrinsics calibration in json format.
   */ getIntrinsicsCalibration(model, sensor, aspect, width, height, focalLength) {
        return new Promise((resolve, reject)=>{
            const ws = new $hQBWe$Client(this.webSocketUrl);
            ws.on('open', async ()=>{
                const calibration = await ws.call('calibrateIntrinsics', [
                    model,
                    sensor,
                    aspect,
                    width,
                    height,
                    focalLength
                ]);
                console.log('intrinsics calibration', calibration);
                ws.close();
                resolve(calibration);
            });
            ws.on('error', ()=>{
                reject(false);
            });
        });
    }
    /**
   * Sets a list of params that will remain until Vision Node is open.
   * @param params Params to update Vision Node.
   */ setParams(params) {
        const ws = new $hQBWe$Client(this.webSocketUrl);
        ws.on('open', async ()=>{
            for (const param of params)await ws.call('setParam', [
                param.processor,
                param.name,
                param.value
            ]);
            ws.close();
        });
        ws.on('error', ()=>{
            console.log('Error settings params');
        });
    }
    /**
   * Sets a list of areas that will remain until Vision Node is open.
   * @param processor Pipeline processor.
   * @param camera Current camera.
   * @param areaIndex Area index.
   * @param areaName Area name.
   * @param areaPoints Area polygon.
   */ setAreaParams(processor, camera, areaIndex, areaName, areaPoints) {
        const ws = new $hQBWe$Client(this.webSocketUrl);
        ws.on('open', async ()=>{
            await ws.call('setCameraZone', [
                processor,
                camera,
                areaIndex,
                areaName,
                areaPoints
            ]);
            ws.close();
        });
        ws.on('error', ()=>{
            console.log('Error settings area params');
        });
    }
    /**
   * Gets the ini configuration.
   * @returns Ini configuration in json format.
   */ async getIni() {
        const result = await fetch(this.iniUrl);
        return await result.json();
    }
    /**
   * Gets a section from ini.
   * @param section Section name.
   * @returns Section from ini in json format.
   */ async getSection(section) {
        const result = await fetch(`${this.iniUrl}/${section}`);
        return await result.json();
    }
    /**
   * Gets an option from a section in ini.
   * @param section Section name.
   * @param option Option name.
   * @returns Option from ini section in json format.
   */ async getOption(section, option) {
        const result = await fetch(`${this.iniUrl}/${section}/${option}`);
        return await result.json();
    }
    /**
   * Deletes a section from ini.
   * @param section Section name.
   */ async deleteSection(section) {
        const options = {
            method: 'delete'
        };
        await fetch(`${this.iniUrl}/${section}`, options);
    }
    /**
   * Deletes an option from a section in ini.
   * @param section Section name.
   * @param option Option name.
   */ async deleteOption(section, option) {
        const options = {
            method: 'delete'
        };
        await fetch(`${this.iniUrl}/${section}/${option}`, options);
    }
    /**
   * Sets an option value in ini.
   * @param section Section name.
   * @param option Option name.
   * @param value Option value.
   */ async postOption(section, option, value) {
        const options = {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(value)
        };
        await fetch(`${this.iniUrl}/${section}/${option}`, options);
    }
    /**
   * Sets values of a section in ini.
   * @param section Section name.
   * @param values Section values.
   */ async postSection(section, values) {
        const options = {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(values)
        };
        await fetch(`${this.iniUrl}/${section}`, options);
    }
    /**
   * Sets partial values of a section in ini.
   * @param section Section name.
   * @param values Section values.
   */ async putSection(section, values) {
        const options = {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(values)
        };
        await fetch(`${this.iniUrl}/${section}`, options);
    }
    /**
   * Gets a calibration.
   * @param name Calibration name.
   * @returns Calibration in json format.
   */ async getCalibration(name) {
        const result = await fetch(`${this.calibrationUrl}/${name}`);
        return await result.json();
    }
    /**
   * Sets a calibration.
   * @param name Calibration name.
   * @param value Calibration value.
   * @returns Result.
   */ async postCalibration(name, value) {
        const options = {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(value)
        };
        const result = await fetch(`${this.calibrationUrl}/${name}`, options);
        return await result.json();
    }
}





export {$fa9a28ae4e9dc6d3$export$ae9b8b72b643631d as VisionNodeClient, $f090479e8bc93dbc$export$f73d3eb6fd876d80 as Actor};
//# sourceMappingURL=brooxVisionNode.js.map
