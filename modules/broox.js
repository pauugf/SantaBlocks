const $4ffbf3df34b9aacd$export$fa3373cf5ebce5bf = (video, context, destinationWidth, destinationHeight, destinationX, destinationY, mirror = false)=>{
    $4ffbf3df34b9aacd$export$ea631e88b0322146(video, context, video.videoWidth, video.videoHeight, destinationWidth, destinationHeight, destinationX, destinationY, mirror);
};
const $4ffbf3df34b9aacd$export$ea631e88b0322146 = (element, context, sourceWidth, sourceHeight, destinationWidth, destinationHeight, destinationX, destinationY, mirror = false)=>{
    $4ffbf3df34b9aacd$export$586746d88f07c896(element, context, false, sourceWidth, sourceHeight, 0, 0, destinationWidth, destinationHeight, destinationX, destinationY, mirror);
};
const $4ffbf3df34b9aacd$export$586746d88f07c896 = (element, context, cutToScale, sourceWidth, sourceHeight, sourceX, sourceY, destinationWidth, destinationHeight, destinationX, destinationY, mirror = false)=>{
    // get ratios
    const horizontalRatio = Math.round(destinationWidth / sourceWidth * 100) / 100;
    const verticalRatio = Math.round(destinationHeight / sourceHeight * 100) / 100;
    let height = 0;
    let width = 0;
    let leftOffset = 0;
    let topOffset = 0;
    // take center of element vertically or horizontally depending on ratio
    if (verticalRatio === horizontalRatio) {
        width = sourceWidth;
        height = sourceHeight;
        leftOffset = 0;
        topOffset = 0;
    } else if (verticalRatio > horizontalRatio && cutToScale || verticalRatio < horizontalRatio && !cutToScale) {
        height = sourceHeight;
        width = destinationWidth / verticalRatio;
        leftOffset = (sourceWidth - width) / 2;
    } else {
        width = sourceWidth;
        height = destinationHeight / horizontalRatio;
        topOffset = (sourceHeight - height) / 2;
    }
    if (mirror) {
        context.scale(-1, 1);
        context.drawImage(element, sourceX + leftOffset, sourceY + topOffset, width, height, -destinationX, destinationY, -destinationWidth, destinationHeight);
    } else context.drawImage(element, sourceX + leftOffset, sourceY + topOffset, width, height, destinationX, destinationY, destinationWidth, destinationHeight);
};


let $679b1f8aa2eb188d$var$Message;
(function(Message) {
    Message["deviceNotFound"] = 'Device not found';
    Message["forbiddenProjectName"] = 'Please use a different project name';
})($679b1f8aa2eb188d$var$Message || ($679b1f8aa2eb188d$var$Message = {
}));
var $679b1f8aa2eb188d$export$2e2bcd8739ae039 = $679b1f8aa2eb188d$var$Message;


const $0af19e6dc1be2ad2$export$13a2ac54ef3e3802 = ()=>{
    return new Promise((resolve, reject)=>{
        navigator.mediaDevices.enumerateDevices().then((devices)=>{
            const result = devices.map((d)=>{
                return {
                    id: d.deviceId,
                    name: d.label
                };
            });
            resolve(result);
        }).catch((error)=>{
            reject(error.message);
        });
    });
};
const $0af19e6dc1be2ad2$export$be262d700bd1c696 = (name)=>{
    return new Promise((resolve, reject)=>{
        navigator.mediaDevices.enumerateDevices().then((devices)=>{
            for(let i = 0; i < devices.length; i++)if (devices[i].label === name) {
                resolve(devices[i].deviceId);
                return;
            }
            reject($679b1f8aa2eb188d$export$2e2bcd8739ae039.deviceNotFound);
        }).catch((error)=>{
            reject(error.message);
        });
    });
};
const $0af19e6dc1be2ad2$export$b04c27f4306c4f03 = (deviceId, width, height)=>{
    return navigator.mediaDevices.getUserMedia({
        video: {
            deviceId: deviceId,
            width: width,
            height: height
        }
    });
};


const $c3263300ab5ba544$export$408b3c1884176160 = (blob)=>{
    return new Promise((resolve)=>{
        const image = new Image();
        image.onload = ()=>{
            URL.revokeObjectURL(image.src);
            resolve(image);
        };
        image.src = URL.createObjectURL(blob);
    });
};



class $d7e6bea30dda6116$export$d955f48b7132ae28 {
    /**
   * Generates an instance of the Composition class.
   * @param width Composition width.
   * @param height Composition height.
   * @param borderWidth Border width.
   */ constructor(width, height, borderWidth){
        this.borderWidth = borderWidth;
        this.canvas = document.createElement('canvas');
        this.scale = (width - this.borderWidth * 2) / width;
        this.canvas.width = width;
        this.canvas.height = height * this.scale + this.borderWidth * 2;
        this.context = this.canvas.getContext('2d');
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
   * Adds an element to the composition.
   * @param element Element to add.
   * @param x Element X position.
   * @param y Element Y position.
   * @param width Element width.
   * @param height Element height.
   * @param scale Element scale.
   * @param mirror Value indicating whether to mirror the image.
   * ``` typescript
   * // example
   * const composition = new broox.media.Composition(width, height, borderWidth);
   * composition.addElement(webcam, 0, 0, webcam.videoWidth, webcam.videoHeight, 1, false);
   * composition.addElement(image, 0, 0, image.width, image.height, 1, false);
   * ```
   */ addElement(element, x, y, width, height, scale, mirror) {
        const destinationWidth = width * this.scale * scale;
        const destinationHeight = height * this.scale * scale;
        const destinationX = this.borderWidth + x * scale * this.scale;
        const destinationY = this.borderWidth + y * scale * this.scale;
        $4ffbf3df34b9aacd$export$ea631e88b0322146(element, this.context, width, height, destinationWidth, destinationHeight, destinationX, destinationY, mirror);
    }
    /**
   * Clears the composition.
   */ clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    /**
   * Gets the resulting composition.
   * @returns A promise with a blob containing the composition.
   * ``` typescript
   * // example
   * composition.get().then(blob => {
   *   image.src = URL.createObjectURL(blob);
   * )};
   * ```
   */ get() {
        return new Promise((resolve)=>{
            this.canvas.toBlob((blob)=>resolve(blob)
            , 'image/jpeg', 1);
        });
    }
}


class $647f5b764790ed4d$export$336a011955157f9a {
    constructor(stream){
        this.stream = stream;
    }
    /**
   * Sets a stream to record.
   * @param stream Stream to record.
   */ setStream(stream) {
        this.stream = stream;
    }
    /**
   * Starts recording.
   */ start(options) {
        const self = this;
        this.promise = new Promise((resolve, reject)=>{
            self.resolve = resolve;
        });
        let data = [];
        this.recorder = new MediaRecorder(this.stream, options || {
        });
        this.recorder.ondataavailable = (e)=>data.push(e.data)
        ;
        this.recorder.onstop = ()=>{
            self.resolve(new Blob(data, {
                type: 'video/webm'
            }));
        };
        this.recorder.start();
    }
    /**
   * Stops recording.
   */ stop() {
        this.recorder.state === 'recording' && this.recorder.stop();
        return this.promise;
    }
}




let $dc7e17fc971b80b3$export$ff50662d7c6e93a2;
(function($dc7e17fc971b80b3$export$ff50662d7c6e93a2) {
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["LeftHandUp"] = 'left_hand_up';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["RightHandUp"] = 'right_hand_up';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["BothHandsUp"] = 'both_hands_up';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["PointsLeft"] = 'points_left';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["PointsRight"] = 'points_right';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["LeftHandOnChest"] = 'left_hand_on_chest';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["RightHandOnChest"] = 'right_hand_on_chest';
    $dc7e17fc971b80b3$export$ff50662d7c6e93a2["BothHandsOnChest"] = 'both_hands_on_chest';
})($dc7e17fc971b80b3$export$ff50662d7c6e93a2 || ($dc7e17fc971b80b3$export$ff50662d7c6e93a2 = {
}));


class $e80f1c37eac2ba65$export$61ce360501d38a6f {
    /**
   * Creates an instance of the Gesture class.
   * @param types Gesture types.
   * @param timestamp Timestamp.
   */ constructor(types, timestamp){
        this.types = [];
        this.timestamp = 0;
        this.types = types;
        this.timestamp = timestamp;
    }
    /**
   * Gets the types.
   * @returns Gesture types.
   */ getTypes() {
        return this.types;
    }
    /**
   * Gets the timestamp.
   * @returns Timestamp.
   */ getTimestamp() {
        return this.timestamp;
    }
}



class $479e08f957450ed1$export$dfd4fa32db6567bf {
    /**
   * Creates an instance of the GestureHandler class.
   * @param time Time lapse in milliseconds before accepting a gesture as such.
   * @param delay Time lapse in seconds before listening to other gestures once a gesture is accepted.
   */ constructor(time, delay){
        this.listening = true;
        this.gestures = [];
        this.time = time;
        this.delay = delay;
        const self = this;
        // listen osc events
        window.addEventListener('message', (event)=>{
            for(let i = 0; i < event.data.length; i++)if (event.data[i].address === '/de/person') self.add(event.data[i].args);
        }, false);
    }
    /**
   * Adds a potential gesture to be processed.
   * @param args OSC event args.
   */ add(args) {
        if (this.listening) {
            if (args[0] === 'id') this.presenceCallback && this.presenceCallback();
            else if (args[0] === 'prop' && args[2] === 'poses') {
                const types = args.slice(3);
                if (types.length && types.indexOf($dc7e17fc971b80b3$export$ff50662d7c6e93a2.LeftHandUp) >= 0 || types.indexOf($dc7e17fc971b80b3$export$ff50662d7c6e93a2.RightHandUp) >= 0 || types.indexOf($dc7e17fc971b80b3$export$ff50662d7c6e93a2.BothHandsUp) >= 0 || types.indexOf($dc7e17fc971b80b3$export$ff50662d7c6e93a2.LeftHandOnChest) >= 0 || types.indexOf($dc7e17fc971b80b3$export$ff50662d7c6e93a2.RightHandOnChest) >= 0 || types.indexOf($dc7e17fc971b80b3$export$ff50662d7c6e93a2.BothHandsOnChest) >= 0) {
                    const gesture = new $e80f1c37eac2ba65$export$61ce360501d38a6f(types, new Date().getTime());
                    this.gestures.push(gesture);
                    this.check();
                }
            }
        }
    }
    /**
   * Adds a callback function for the "presence" gesture.
   * @param callback Function that will be executed when the presence gesture is detected.
   */ onPresence(callback) {
        this.presenceCallback = callback;
    }
    /**
   * Adds a callback function for the "both hands up" gesture.
   * @param callback Function that will be executed when the "both hands up" gesture is detected.
   */ onBothHandsUp(callback) {
        this.bothHandsUpCallback = callback;
    }
    /**
   * Adds a callback function for the "left hand up" gesture.
   * @param callback Function that will be executed when the "left hand up" gesture is detected.
   */ onLeftHandUp(callback) {
        this.leftHandUpCallback = callback;
    }
    /**
   * Adds a callback function for the "right hand up" gesture.
   * @param callback Function that will be executed when the "right hand up" gesture is detected.
   */ onRightHandUp(callback) {
        this.rightHandUpCallback = callback;
    }
    /**
   * Adds a callback function for the "both hands on chest" gesture.
   * @param callback Function that will be executed when the "both hands on chest" gesture is detected.
   */ onBothHandsOnChest(callback) {
        this.bothHandsOnChestCallback = callback;
    }
    /**
   * Adds a callback function for the "left hand on chest" gesture.
   * @param callback Function that will be executed when the "left hand on chest" gesture is detected.
   */ onLeftHandOnChest(callback) {
        this.leftHandOnChestCallback = callback;
    }
    /**
   * Adds a callback function for the "right hand on chest" gesture.
   * @param callback Function that will be executed when the "right hand on chest" gesture is detected.
   */ onRightHandOnChest(callback) {
        this.rightHandOnChestCallback = callback;
    }
    /**
   * Checks whether a gesture was made. 
   */ check() {
        // get last gesture
        const lastIndex = this.gestures.length - 1;
        const lastGesture = this.gestures[lastIndex];
        const lastGestureTypes = lastGesture.getTypes();
        if (lastGestureTypes.length === 1) {
            const type = lastGestureTypes[0];
            // if gesture is BothHandsUp or BothHandsOnChest, send the event
            if (type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.BothHandsUp || type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.BothHandsOnChest) this.send(type);
            else if (this.gestures.length > 1) {
                const lastTimestamp = lastGesture.getTimestamp();
                let i = lastIndex;
                let gesture = null;
                // find last gesture before the time lapse defined
                while(!gesture && --i >= 0 && this.gestures[i].getTypes().indexOf(type) >= 0)if (lastTimestamp - this.gestures[i].getTimestamp() > this.time) gesture = this.gestures[i];
                if (gesture) this.send(type);
            }
        }
    }
    /**
   * Executes a callback function based on the gesture made.
   * @param type Gesture made.
   */ send(type) {
        console.log('Gesture ' + type + ' sent');
        this.listening = false;
        this.gestures = [];
        setTimeout(()=>{
            this.listening = true;
        }, this.delay * 1000);
        if (type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.BothHandsUp) this.bothHandsUpCallback && this.bothHandsUpCallback();
        else if (type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.LeftHandUp) this.leftHandUpCallback && this.leftHandUpCallback();
        else if (type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.RightHandUp) this.rightHandUpCallback && this.rightHandUpCallback();
        else if (type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.BothHandsOnChest) this.bothHandsOnChestCallback && this.bothHandsOnChestCallback();
        else if (type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.LeftHandOnChest) this.leftHandOnChestCallback && this.leftHandOnChestCallback();
        else if (type === $dc7e17fc971b80b3$export$ff50662d7c6e93a2.RightHandOnChest) this.rightHandOnChestCallback && this.rightHandOnChestCallback();
    }
}


class $05bc0747749da3f4$export$410db1ee4b845acb {
    /**
   * 
   * @param writeJson Function to write a json
   * @param readJson Function to read a json 
   */ constructor(writeJson, readJson){
        this.writeJson = writeJson;
        this.readJson = readJson;
    }
    /**
   * 
   * @param name File name
   * @param json Json content
   */ write(name, json) {
        this.writeJson(name, JSON.stringify(json));
    }
    /**
    * 
    * @param name File name
    */ read(name) {
        const content = JSON.parse(this.readJson(name));
        return content;
    }
}


class $73385285ce406fe8$export$19fffca37ef3e106 {
    /**
   * 
   * @param name File name
   * @param content Json content
   */ write(name, content) {
        localStorage.setItem(name, JSON.stringify(content));
    }
    /**
   * 
   * @param name File name
   * @returns Json content for the given project
   */ read(name) {
        const content = localStorage.getItem(name);
        if (content) return JSON.parse(content);
        return null;
    }
}


class $94dc54fe1b2e5635$export$cec157cbbbaf65c9 {
    static inElectron() {
        // @ts-ignore
        return !!window.electron;
    }
    static writeJson(name, json) {
        // @ts-ignore
        return window.app && window.app.writeJson(name, json);
    }
    static readJson(name) {
        // @ts-ignore
        return window.app && window.app.readJson(name);
    }
    static downloadFile(url, name, onUpdate, onError, onSuccess) {
        // @ts-ignore
        return window.app && window.app.downloadFile && window.app.downloadFile(url, name, onUpdate, onError, onSuccess);
    }
    static getMediaInfo() {
        // @ts-ignore
        return window.app && window.app.media;
    }
    static getDeviceInfo() {
        // @ts-ignore
        return window.app && window.app.device;
    }
    static logAlarm(subject, text) {
        //@ts-ignore
        window.app && window.app.logAlarm(subject, text);
    }
}



class $5ed460d269917590$export$12b3cc2522c3bba5 {
    /**
   * Creates an instance of the KeyValue class.
   */ constructor(){
        this.contents = {
        };
        if ($94dc54fe1b2e5635$export$cec157cbbbaf65c9.inElectron()) this.storage = new $05bc0747749da3f4$export$410db1ee4b845acb($94dc54fe1b2e5635$export$cec157cbbbaf65c9.writeJson, $94dc54fe1b2e5635$export$cec157cbbbaf65c9.readJson);
        else this.storage = new $73385285ce406fe8$export$19fffca37ef3e106();
    }
    /**
   * Sets a value in storage
   * @param name File name
   * @param key Key assigned to the value to store
   * @param value Value to store
   * ``` typescript
   * // example
   * const user = {
   *   firstName: 'John',
   *   lastName: 'Doe'
   * };
   * const keyValue = new broox.mediaPlayer.KeyValue();
   * keyValue.set('testApp', 'profile', user);
   * ```
   */ setValue(name, key, value) {
        if (name === 'config') {
            console.error($679b1f8aa2eb188d$export$2e2bcd8739ae039.forbiddenProjectName);
            return;
        }
        // get storage
        let content = this.getContent(name);
        if (!content) content = {
        };
        content[key] = value;
        this.storage.write(name, content);
    }
    /**
   * Gets a value from a content in storage
   * @param name File name
   * @param key Key
   * @returns The value for the given key
   * ``` typescript
   * // example
   * const keyValue = new broox.mediaPlayer.KeyValue();
   * const user = keyValue.get('testApp', 'profile');
   * console.log('User', user);
   * ```
   */ getValue(name, key) {
        const storage = this.getContent(name);
        return storage ? storage[key] : null;
    }
    /**
   * Gets a content from memory or storage
   * @param name File name
   * @returns The content with the given name if exists, null otherwise
   */ getContent(name) {
        // get storage from memory
        if (this.contents[name]) return this.contents[name];
        else // get content from storage
        try {
            return this.storage.read(name);
        } catch (error) {
            // the content does not exist
            return null;
        }
    }
}


let $94391c9343d0bcc2$export$189c6ba3eaa96ac2;
(function($94391c9343d0bcc2$export$189c6ba3eaa96ac2) {
    $94391c9343d0bcc2$export$189c6ba3eaa96ac2["object"] = '/tuio/2Dobj';
    $94391c9343d0bcc2$export$189c6ba3eaa96ac2["cursor"] = '/tuio/2Dcur';
    $94391c9343d0bcc2$export$189c6ba3eaa96ac2["blob"] = '/tuio/2Dblb';
    $94391c9343d0bcc2$export$189c6ba3eaa96ac2["marker"] = '/tuio/broox_markers';
    $94391c9343d0bcc2$export$189c6ba3eaa96ac2["skel"] = '/tuio/skel';
})($94391c9343d0bcc2$export$189c6ba3eaa96ac2 || ($94391c9343d0bcc2$export$189c6ba3eaa96ac2 = {
}));


class $98edaf7c8e167d5f$var$SingleBlob {
    constructor(id, classId = ''){
        this.id = id;
        this.classId = classId;
    }
    update(x, y, width, height, rotation = 0, velocityX = null, velocityY = null, timeAlive = 0) {
        this.rect = {
            x: x,
            y: y,
            width: width,
            height: height
        };
        this.rotation = rotation;
        this.timeAlive = timeAlive;
        if (velocityX === null && velocityY === null && this.rect.x !== null && this.rect.y !== null) {
            this.velocityX = x - this.rect.x;
            this.velocityY = y - this.rect.y;
        } else {
            this.velocityX = velocityX;
            this.velocityY = velocityY;
        }
    }
    get() {
        return {
            id: this.id,
            classId: this.classId,
            rect: this.rect,
            rotation: this.rotation,
            timeAlive: this.timeAlive,
            velocityX: this.velocityX,
            velocityY: this.velocityY
        };
    }
}
var $98edaf7c8e167d5f$export$2e2bcd8739ae039 = $98edaf7c8e167d5f$var$SingleBlob;


class $c33a2b1d8f95ab84$var$SkeletonBlob {
    constructor(id){
        this.id = id;
    }
    update(leftHand, rightHand, scale) {
        this.leftHand.x = leftHand.x;
        this.leftHand.y = leftHand.y;
        this.leftHand.width = leftHand.width;
        this.leftHand.height = leftHand.height;
        this.rightHand.x = rightHand.x;
        this.rightHand.y = rightHand.y;
        this.rightHand.width = rightHand.width;
        this.rightHand.height = rightHand.height;
        this.scale = scale;
    }
    get() {
        return {
            id: this.id,
            leftHand: this.leftHand,
            rightHand: this.rightHand,
            scale: this.scale
        };
    }
}
var $c33a2b1d8f95ab84$export$2e2bcd8739ae039 = $c33a2b1d8f95ab84$var$SkeletonBlob;


const $29ce27527f9f9422$var$mouseBlobId = 'mouse';
const $29ce27527f9f9422$var$randomBlobId = 'random';
class $29ce27527f9f9422$export$b6c32681ca39b455 {
    constructor(type, width, height, scale, onUpdate, onBlobAdded, onBlobDeleted, onFrameUpdated){
        this.blobs = new Map();
        this.mouseEnabled = false;
        this.calculateBlobTimeAlive = true;
        this.randomBlobsEnabled = false;
        this.randomBlobsTimeout = null;
        this.randomBlobsCounter = 0;
        this.scale = 1;
        this.type = type;
        this.activeArea = {
            x: 0,
            y: 0,
            width: width,
            height: height
        };
        this.scale = scale;
        this.onUpdateCallback = onUpdate;
        this.onBlobAddedCallback = onBlobAdded;
        this.onBlobDeletedCallback = onBlobDeleted;
        this.onFrameUpdatedCallback = onFrameUpdated;
    }
    getBlobs() {
        return this.blobs;
    }
    setScale(scale) {
        this.scale = scale;
    }
    setActiveArea(x, y, width, height) {
        this.activeArea = {
            x: x,
            y: y,
            width: width,
            height: height
        };
    }
    enableMouseBlob(enabled, domElement) {
        this.mouseEnabled = enabled;
        if (domElement === null) return;
        const f = (evt)=>{
            this.updateBlob($29ce27527f9f9422$var$mouseBlobId, evt.pageX / document.body.clientWidth, evt.pageY / document.body.clientHeight, 0, 0, 0, 0, 0, 0, '');
        };
        if (enabled) domElement.addEventListener('mousemove', f, false);
        else {
            this.updateBlobsAlive([]);
            domElement.removeEventListener('mousemove', f, false);
        }
    }
    enableRandomBlobs(enabled) {
        this.randomBlobsEnabled = enabled;
        if (this.randomBlobsTimeout !== null) {
            clearTimeout(this.randomBlobsTimeout);
            this.randomBlobsTimeout = null;
        }
        this.randomBlobsCounter = 0;
        enabled && this.createRandomBlob();
    }
    isMouseEnabled() {
        return this.mouseEnabled;
    }
    areRandomBlobsEnabled() {
        return this.randomBlobsEnabled;
    }
    killBlobs() {
        this.updateBlobsAlive([]);
    }
    update() {
        if (this.randomBlobsEnabled) {
            let idsToRemove = [];
            for (let [id, blob] of this.blobs)if (id.includes($29ce27527f9f9422$var$randomBlobId)) {
                if (this.isBlobInBounds(blob)) {
                    const b = blob.get();
                    blob.update(b.x + b.velocityX, b.y + b.velocityY, 10, 10, 0, b.velocityX, b.velocityY);
                } else {
                    this.onBlobDeletedCallback(id);
                    idsToRemove.push(id);
                }
            }
            for (let id1 of idsToRemove)this.blobs.delete(id1);
        }
    }
    onOSCMessage(json) {
        for(var i in json){
            var args = json[i].args;
            if (args == undefined) continue;
            var address = json[i].address;
            if (address !== this.type) continue;
            switch(args[0]){
                case 'fseq':
                    if (args.length > 1) this.onFrameUpdatedCallback && this.onFrameUpdatedCallback(args[1]);
                    break;
                case 'set':
                    const blobData = this.parseBlobData(json[i].address, args);
                    if (blobData == null) continue;
                    this.updateBlobWithData(address, blobData);
                    this.onUpdateCallback && this.onUpdateCallback();
                    break;
                case 'alive':
                    this.updateBlobsAlive(args);
                    this.onUpdateCallback && this.onUpdateCallback();
                    break;
                default:
                    break;
            }
        }
    }
    parseBlobData(address, args) {
        if (address === $94391c9343d0bcc2$export$189c6ba3eaa96ac2.skel) return this.parseBlobSkeletonData(address, args);
        var blobData = {
        };
        blobData.id = args[1].toString();
        switch(address){
            case $94391c9343d0bcc2$export$189c6ba3eaa96ac2.blob:
                if (!this.checkBlobDataFormat(args, 13)) return null;
                blobData.x = args[2];
                blobData.y = args[3];
                blobData.rotation = args[4];
                blobData.width = args[5];
                blobData.height = args[6];
                blobData.velocityX = args[8];
                blobData.velocityY = args[9];
                blobData.timeAlive = args[12];
                break;
            case $94391c9343d0bcc2$export$189c6ba3eaa96ac2.object:
                if (!this.checkBlobDataFormat(args, 11)) return null;
                blobData.classId = args[2];
                blobData.x = args[3];
                blobData.y = args[4];
                blobData.rotation = args[5];
                break;
            case $94391c9343d0bcc2$export$189c6ba3eaa96ac2.cursor:
                if (!this.checkBlobDataFormat(args, 7)) return null;
                blobData.x = args[2];
                blobData.y = args[3];
                blobData.width = 60 / this.activeArea.width;
                blobData.height = blobData.width;
                break;
            case $94391c9343d0bcc2$export$189c6ba3eaa96ac2.marker:
                console.log('is marker');
                blobData.classId = args[2];
                blobData.x = args[3];
                blobData.y = args[4];
                blobData.rotation = args[5];
                blobData.width = args[6];
                console.log(args[2]);
                break;
        }
        // let corrected = blobData;
        // blobData.x = corrected.x * this.activeArea.width + this.activeArea.x;
        // blobData.y = corrected.y * this.activeArea.height + this.activeArea.y;
        // blobData.width *= this.activeArea.width * this.scale;
        // blobData.height *= this.activeArea.height * this.scale;
        return blobData;
    }
    parseBlobSkeletonData(address, args) {
        if (address !== $94391c9343d0bcc2$export$189c6ba3eaa96ac2.skel) {
            console.log('Wrong address, expected ' + $94391c9343d0bcc2$export$189c6ba3eaa96ac2.skel + ' but got ' + address);
            return null;
        }
        let blobData = {
        };
        blobData.id = args[1].toString();
        const scale = args[6];
        blobData.leftHand = {
            x: args[2],
            y: args[3],
            width: scale * this.activeArea.width * this.scale,
            height: scale * this.activeArea.height * this.scale
        };
        blobData.rightHand = {
            x: args[4],
            y: args[5],
            width: scale * this.activeArea.width * this.scale,
            height: scale * this.activeArea.height * this.scale
        };
        blobData.scale = scale;
        if (this.isSkeletonJointDetected(blobData.leftHand)) {
            blobData.leftHand.x = blobData.leftHand.x * this.activeArea.width + this.activeArea.x;
            blobData.leftHand.y = blobData.leftHand.y * this.activeArea.height + this.activeArea.y;
        }
        if (this.isSkeletonJointDetected(blobData.rightHand)) {
            blobData.rightHand.x = blobData.rightHand.x * this.activeArea.width + this.activeArea.x;
            blobData.rightHand.y = blobData.rightHand.y * this.activeArea.height + this.activeArea.y;
        }
        return blobData;
    }
    isSkeletonJointDetected(joint) {
        return joint.x >= 0 && joint.y >= 0;
    }
    checkBlobDataFormat(args, length) {
        if (args.length !== length) {
            console.log('Wrong Tuio set format. Supposed to have length ' + length + ' and has length ' + args.length);
            return false;
        }
        return true;
    }
    updateBlobWithData(type, blobData) {
        switch(type){
            case $94391c9343d0bcc2$export$189c6ba3eaa96ac2.skel:
                let id = blobData.id;
                if (!this.blobs.has(id)) {
                    const blob = new $c33a2b1d8f95ab84$export$2e2bcd8739ae039(id);
                    this.blobs.set(id, blob);
                    blob.update(blobData.leftHand, blobData.rightHand, blobData.scale);
                    this.onBlobAddedCallback && this.onBlobAddedCallback(id, 0, 0);
                } else {
                    const blob = this.blobs.get(id);
                    blob.update(blobData.leftHand, blobData.rightHand, blobData.scale);
                }
                break;
            default:
                this.updateBlob(blobData.id, blobData.x, blobData.y, blobData.width, blobData.height, blobData.rotation, blobData.velocityX, blobData.velocityY, blobData.timeAlive, blobData.classId);
        }
    }
    updateBlob(id, x, y, width, height, rotation, velocityX, velocityY, timeAlive = 0, classId = '') {
        if (!this.blobs.has(id)) {
            const blob = new $98edaf7c8e167d5f$export$2e2bcd8739ae039(id, classId);
            this.blobs.set(id, blob);
            blob.update(x, y, width, height, rotation, velocityX, velocityY, timeAlive);
            this.onBlobAddedCallback && this.onBlobAddedCallback(id, x, y);
        } else {
            const blob = this.blobs.get(id);
            let blobTimeAlive = timeAlive;
            if (this.calculateBlobTimeAlive && blobTimeAlive <= 0) blobTimeAlive = blob.timeAlive + 0.01;
            blob.update(x, y, width, height, rotation, velocityX, velocityY, blobTimeAlive);
        }
        this.onUpdateCallback && this.onUpdateCallback();
    }
    updateBlobsAlive(idsAlive) {
        const idsToRemove = [];
        if (!idsAlive || idsAlive.length === 0) this.blobs.clear();
        else {
            for (let [id, blob] of this.blobs){
                let isAlive = false;
                for (let aliveItem of idsAlive){
                    isAlive = aliveItem === id;
                    if (isAlive) break;
                }
                if (!isAlive) {
                    this.onBlobDeletedCallback && this.onBlobDeletedCallback(id);
                    idsToRemove.push(id);
                }
            }
            for (let id2 of idsToRemove)this.blobs.delete(id2);
        }
    }
    // private onMouseUpdate(evt: any) {
    //   this.updateBlob(mouseBlobId, evt.pageX / document.body.clientWidth, evt.pageY / document.body.clientHeight, 0, 0, 0, 0, 0, 0, '');
    // }
    createRandomBlob() {
        if (!this.randomBlobsEnabled) return;
        const fromTopOrBottom = Math.random() <= 0.5;
        const dirX = Math.random() <= 0.5 ? 1 : -1;
        const dirY = Math.random() <= 0.5 ? 1 : -1;
        const minVelX = fromTopOrBottom ? 0 : 0.5;
        const minVelY = fromTopOrBottom ? 0.5 : 0;
        const velocityX = (Math.random() * 2 + minVelX) * dirX;
        const velocityY = (Math.random() * 2 + minVelY) * dirY;
        const x = fromTopOrBottom ? this.activeArea.width * Math.random() + this.activeArea.x : velocityX > 0 ? this.activeArea.x : this.activeArea.width + this.activeArea.x;
        const y = fromTopOrBottom ? velocityY > 0 ? this.activeArea.y : this.activeArea.height + this.activeArea.y : this.activeArea.height * Math.random() + this.activeArea.y;
        this.updateBlob('random_' + this.randomBlobsCounter, x, y, 10, 10, 0, velocityX, velocityY);
        this.randomBlobsCounter++;
        this.randomBlobsTimeout = setTimeout(()=>{
            this.createRandomBlob();
        }, Math.random() * 3000 + 1000);
    }
    isBlobInBounds(blob) {
        return !(blob.x < -9 + this.activeArea.x || blob.x > this.activeArea.width + this.activeArea.x || blob.y < -this.activeArea.height * 0.5 + this.activeArea.y || blob.y > this.activeArea.height + this.activeArea.y);
    }
}



class $adefdebbb6d956e3$export$bf5acd943326457 {
    /**
   * Creates an instance of the OscListener class.
   */ constructor(){
        this.events = new Map();
        const self = this;
        // listen osc events
        window.addEventListener('message', (event)=>{
            for(let i = 0; i < event.data.length; i++){
                const e = event.data[i].address;
                if (self.events.has(e)) {
                    const callback = self.events.get(e);
                    callback();
                }
            }
        }, false);
    }
    /**
   * Adds a callback function to the given event.
   * @param event Event name to listen to.
   * @param callback Function to execute when the event is recieved.
   */ add(event, callback) {
        this.events.set(event, callback);
    }
}



const $0cc22e263482b346$export$498ecf32d8e5038b = ()=>{
    return $94dc54fe1b2e5635$export$cec157cbbbaf65c9.getMediaInfo();
};
const $0cc22e263482b346$export$a5202107d3e3cdb0 = ()=>{
    return $94dc54fe1b2e5635$export$cec157cbbbaf65c9.getDeviceInfo();
};



const $e3bbfca4405f77b1$export$4b2634a642f10d54 = (subject, text)=>{
    return $94dc54fe1b2e5635$export$cec157cbbbaf65c9.logAlarm(subject, text);
};



const $3dcbb90849a52359$export$bb3b75778e3e272 = (url, name, onUpdate)=>{
    return new Promise((resolve, reject)=>{
        $94dc54fe1b2e5635$export$cec157cbbbaf65c9.inElectron() ? $94dc54fe1b2e5635$export$cec157cbbbaf65c9.downloadFile(url, name, onUpdate, (error)=>reject(error)
        , (path)=>resolve(path)
        ) : resolve(url);
    });
};




const $149c1bd638913645$var$broox = {
    media: {
        getAvailableDevices: $0af19e6dc1be2ad2$export$13a2ac54ef3e3802,
        getDeviceId: $0af19e6dc1be2ad2$export$be262d700bd1c696,
        startDevice: $0af19e6dc1be2ad2$export$b04c27f4306c4f03,
        drawElement: $4ffbf3df34b9aacd$export$ea631e88b0322146,
        drawPartOfElement: $4ffbf3df34b9aacd$export$586746d88f07c896,
        drawVideo: $4ffbf3df34b9aacd$export$fa3373cf5ebce5bf,
        blobToImage: $c3263300ab5ba544$export$408b3c1884176160,
        Composition: $d7e6bea30dda6116$export$d955f48b7132ae28,
        Recorder: $647f5b764790ed4d$export$336a011955157f9a
    },
    mediaPlayer: {
        Blobs: $29ce27527f9f9422$export$b6c32681ca39b455,
        AddressType: $94391c9343d0bcc2$export$189c6ba3eaa96ac2,
        KeyValue: $5ed460d269917590$export$12b3cc2522c3bba5,
        GestureHandler: $479e08f957450ed1$export$dfd4fa32db6567bf,
        GestureType: $dc7e17fc971b80b3$export$ff50662d7c6e93a2,
        OscListener: $adefdebbb6d956e3$export$bf5acd943326457,
        getMediaInfo: $0cc22e263482b346$export$498ecf32d8e5038b,
        getDeviceInfo: $0cc22e263482b346$export$a5202107d3e3cdb0,
        logAlarm: $e3bbfca4405f77b1$export$4b2634a642f10d54,
        downloadFile: $3dcbb90849a52359$export$bb3b75778e3e272
    }
};
var $149c1bd638913645$export$2e2bcd8739ae039 = $149c1bd638913645$var$broox;


export {$149c1bd638913645$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=broox.js.map
