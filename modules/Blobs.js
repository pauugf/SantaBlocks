const TUIOSetTypes = {
    object: "/tuio/2Dobj",
    cursor: "/tuio/2Dcur",
    blob: "/tuio/2Dblb",
    marker: "/tuio/broox_markers",
    skel: "/tuio/skel"
}


const BlobData = {
    type: null,
    id: "",
    classId: "",
    x: 0,
    y: 0,
    rotation: 0,
    width: 0,
    height: 0,
    velocityX: 0,
    velocityY: 0,
    timeAlive: 0
}

function Blob(id, classId = ""){
    this.id = id;
    this.classId = classId;

    this.update = (x, y, width, height, rotation = 0, velocityX = null, velocityY = null, timeAlive = 0) => {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.timeAlive = timeAlive;

        if(velocityX == null && velocityY == null && this.x != null && this.y != null){
            this.velocityX = x - this.x;
            this.velocityY = y - this.y;
        }
        else{
            this.velocityX = velocityX;
            this.velocityY = velocityY;
        }
    }
}


function BlobSkel(id){
    this.id = id;
    this.hand_left = {
        x: -1,
        y: -1
    }
    this.hand_right = {
        x: -1,
        y: -1
    }

    this.scale = -1.0;

    this.update = (data) => {
        this.hand_left.x = data.hand_left.x;
        this.hand_left.y = data.hand_left.y;
        this.hand_left.width = data.hand_left.width;
        this.hand_left.height = data.hand_left.height;

        this.hand_right.x = data.hand_right.x;
        this.hand_right.y = data.hand_right.y;
        this.hand_right.width = data.hand_right.width;
        this.hand_right.height = data.hand_right.height;

        this.scale = data.scale;
    }
}

function isSkelJointDetected(joint){
    return joint.x >= 0 && joint.y >= 0
}


function Blobs(type, onUpdate){
    var self = this;

    this.blobs = new Map();
    this.onBlobAdded = null;
    this.onBlobDeleted = null;
    this.onFrameUpdate = null;
    
    let isMouseBlobEnabled = false;
    const idMouseBlob = "mouse"

    let CALCULATE_BLOB_TIME_ALIVE = true;

    let isRandomBlobsEnabled = false;
    let timeoutRandomBlobs = null;
    let randomBlobCounter = 0;

    this.activeArea = {
        width: window.innerWidth,
        height: window.innerHeight,
        offset: {x: 0, y: 0}
    };

    this.blobsScale = 1.0;

    this.setBlobsScale = function(blobsScale){
        this.blobsScale = blobsScale;
    }

    this.setActiveArea = function(width, height, x = 0, y = 0){
        this.activeArea.width = width;
        this.activeArea.height = height;
        this.activeArea.offset = {x, y};
    }

    this.enableMouseBlob = function(isEnabled, domElement){
        isMouseBlobEnabled = isEnabled;

        if(domElement == null){return;}

        if(isEnabled){
            domElement.addEventListener('mousemove', onMouseUpdate, false);
        }
        else{
            updateBlobsAlive([]);
            domElement.removeEventListener('mousemove', onMouseUpdate, false);
        }
    }

    this.enableRandomBlobs = function(isEnabled){
        isRandomBlobsEnabled = isEnabled;
        if(timeoutRandomBlobs != null){
            clearTimeout(timeoutRandomBlobs);
            timeoutRandomBlobs = null;
        }
        randomBlobCounter = 0;
        if(isEnabled){
            createRandomBlob();
        }
    }

    this.getIsMouseBlonEnabled = function(){
        return isMouseBlobEnabled;
    }

    this.getIsRandomBlobsEnabled = function(){
        return isRandomBlobsEnabled;
    }

    this.killBlobs = function() {
      updateBlobsAlive([]);
    }

    this.update = function(){
        if(isRandomBlobsEnabled){
            let idsToRemove = [];
            for(let [id, blob] of self.blobs){
                if(id.includes("random")){
                    if(isBlobInBounds(blob)){
                        blob.update(blob.x + blob.velocityX, blob.y + blob.velocityY, 10, 10,0, blob.velocityX, blob.velocityY);
                    }
                    else{
                        onDeleted(id);
                        idsToRemove.push(id);
                    }
                }
            }

            for(let id of idsToRemove){
                self.blobs.delete(id);
            }
        }
    }
   

    this.onOSCMessage = function(json){
        for(var i in json){
            var args = json[i].args
            if(args == undefined){continue;}
            var address = json[i].address;

            if(address !== type ){continue;}

            switch(args[0]){
                case "fseq":
                    if(args.length > 1){onNewFrame(args[1]);}
                    break;

                case "set":
                    const blobData = parseBlobData(json[i].address, args, self.activeArea.width, self.activeArea.height, self.activeArea.offset, self.blobsScale);
                    if(blobData == null){continue;}
                    updateBlobWithData(address, blobData);
                    onUpdate && onUpdate();
                    break;

                case "alive":
                    updateBlobsAlive(args);
                    onUpdate && onUpdate();
                    break;
                default:
                break;
            }
        }
    }


    function parseBlobData(address, args, winWidth, winHeight, offset = {x: 0, y: 0}, blobsScale = 1.0){

        if(address === TUIOSetTypes.skel){
            return parseBlobSkelData(address, args, winWidth, winHeight, offset, blobsScale);
        }

        var blobData = Object.assign({}, BlobData);
        blobData.id = args[1].toString();

        switch(address){
            case TUIOSetTypes.blob:
                if(!checkBlobDataFormat(args, 13)){return null;}
                blobData.x = args[2];
                blobData.y = args[3];
                blobData.rotation = args[4];
                blobData.width = args[5];
                blobData.height = args[6];
                blobData.velocityX = args[8];
                blobData.velocityY = args[9];
                blobData.timeAlive = args[12];
                break;
            case TUIOSetTypes.object:
                if(!checkBlobDataFormat(args, 11)){return null;}
                blobData.classId = args[2];
                blobData.x = args[3];
                blobData.y = args[4];
                blobData.rotation = args[5];
                break;
            case TUIOSetTypes.cursor:
                if(!checkBlobDataFormat(args, 7)){return null;}
                blobData.x = args[2];
                blobData.y = args[3];
                blobData.width = 60 / winWidth;
                blobData.height = blobData.width;
               break;
            case TUIOSetTypes.marker:
                console.log("Is markers");
                blobData.classId = args[2];
                blobData.x = args[3];
                blobData.y = args[4];
                blobData.rotation = args[5];
                blobData.width = args[6];
                console.log(args[2]);
                break;
        }

        var corrected = blobData;

        // blobData.x = corrected.x * winWidth + offset.x;
        // blobData.y = corrected.y * winHeight + offset.y;
        // blobData.width *= winWidth * blobsScale;
        // blobData.height *= winHeight * blobsScale;

        return blobData;
    }



    function parseBlobSkelData(address, args, winWidth, winHeight, offset = {x: 0, y: 0}, blobsScale = 1.0){
        if(address !== TUIOSetTypes.skel){
            console.log("Wrong address, expected "+ TUIOSetTypes.skel +" but got "+ address);
            return null;
        }

        var blobData = {};
        blobData.id = args[1].toString();

        let scale = args[6];

        blobData.hand_left = {
            x: args[2],
            y: args[3],
            width: scale * winWidth * blobsScale,
            height: scale * winHeight * blobsScale
        }

        blobData.hand_right = {
            x: args[4],
            y: args[5],
            width: scale * winWidth * blobsScale,
            height: scale * winHeight * blobsScale
        }
        blobData.scale = scale;

        if(isSkelJointDetected(blobData.hand_left)){
            blobData.hand_left.x = blobData.hand_left.x * winWidth + offset.x;
            blobData.hand_left.y = blobData.hand_left.y * winHeight + offset.y;
        }
        
        if(isSkelJointDetected(blobData.hand_right)){
            blobData.hand_right.x = blobData.hand_right.x * winWidth + offset.x;
            blobData.hand_right.y = blobData.hand_right.y * winHeight + offset.y;
        }

        return blobData;
    }


    function checkBlobDataFormat(args, length){
        if(args.length != length){
            console.log("Wrong Tuio set format. Supposed to have length "+ length + " and has length "+ args.length);
            return false;
        }
        return true;
    }

    function onNewFrame(fseq){
        if(self.onFrameUpdate == null){return;}
        self.onFrameUpdate(fseq);
    }


    function updateBlobWithData(type, blobData){

        switch(type){
            case TUIOSetTypes.skel:
                let id = blobData.id;
                if (!self.blobs.has(id)) {
                    var blob = new BlobSkel(id);
                    self.blobs.set(id, blob);
                    blob.update(blobData);
                    onAdded(id);
                }
                else {
                    var blob = self.blobs.get(id);
                    blob.update(blobData);
                }
                break;
            default:
                updateBlob(blobData.id, blobData.x, blobData.y, blobData.width, blobData.height, blobData.rotation, blobData.velocityX, blobData.velocityY, blobData.timeAlive, blobData.classId);
        }

    }



    function updateBlob(id, x, y, width, height, rotation, velocityX, velocityY, timeAlive = 0, classId= ""){

        if (!self.blobs.has(id)) {
            var blob = new Blob(id, classId);
            self.blobs.set(id, blob);
            blob.update(x, y, width, height, rotation, velocityX, velocityY, timeAlive);
            onAdded(id, x, y);
        }
        else {
            var blob = self.blobs.get(id);
            let blobTimeAlive = timeAlive;
            if(CALCULATE_BLOB_TIME_ALIVE && blobTimeAlive <= 0){
                blobTimeAlive = blob.timeAlive + 0.01;
            }
            blob.update(x, y, width, height, rotation, velocityX, velocityY, blobTimeAlive);
        }
        onUpdate();
    }

    function updateBlobsAlive(idsAlive){
      var idsToRemove = []
  
      if(!idsAlive || idsAlive.length === 0) {
        self.blobs.clear();
      }
      else {
        for (let [id, blob] of self.blobs) {
          let isAlive = false
          for (var aliveItem of idsAlive) {
            isAlive = aliveItem == id
            if (isAlive) {
              break
            }
          }
  
          if (!isAlive) {
            onDeleted(id)
            idsToRemove.push(id)
          }
        }
  
        for (let id of idsToRemove) {
          self.blobs.delete(id)
        }
      }
      //console.log(idsAlive);
    }

    function onAdded(id, x, y){
        if(self.onBlobAdded == null){return;}
        
        self.onBlobAdded(id, x, y);
    }

    function onDeleted(id){
        if(self.onBlobDeleted == null){return;}
        
        self.onBlobDeleted(id);
    }



    // Mouse Blob
    
    function onMouseUpdate(evt){
        updateBlob(idMouseBlob, evt.pageX / document.body.clientWidth, evt.pageY / document.body.clientHeight, 0, 0)
    }


    // Random blobs

    function createRandomBlob(){

        if(!isRandomBlobsEnabled){return;}
        const winWidth = self.activeArea.width;
        const winHeight = self.activeArea.height;

        const fromTopOrBottom = Math.random() <= 0.5;
        const dirX = Math.random() <= 0.5 ? 1 : -1;
        const dirY = Math.random() <= 0.5 ? 1 : -1;

        const minVelX = fromTopOrBottom ? 0 : 0.5;
        const minVelY = fromTopOrBottom ? 0.5 : 0;
        const velocityX = (Math.random() * 2 + minVelX) * dirX;
        const velocityY = (Math.random() * 2 + minVelY) * dirY;

        const x = fromTopOrBottom ? winWidth * Math.random() + self.activeArea.offset.x : (velocityX > 0 ? self.activeArea.offset.x : winWidth + self.activeArea.offset.x);
        const y = fromTopOrBottom ? (velocityY > 0 ? self.activeArea.offset.y : winHeight + self.activeArea.offset.y) : winHeight * Math.random() + self.activeArea.offset.y;

        updateBlob("random_"+ randomBlobCounter, x, y, 10, 10, 0, velocityX, velocityY);
        randomBlobCounter++;

        
        timeoutRandomBlobs = setTimeout(function(){
            createRandomBlob()
        }, Math.random() * 3000 + 1000);
        
    }

    function isBlobInBounds(blob){
        const winWidth = self.activeArea.width;
        const winHeight = self.activeArea.height;
        return !(blob.x < -9 + self.activeArea.offset.x || blob.x > winWidth + self.activeArea.offset.x || blob.y < -winHeight * 0.5 + self.activeArea.offset.y || blob.y > winHeight + self.activeArea.offset.y)
    }

}


export {Blobs, TUIOSetTypes}





// const TUIOSetTypes = {
//     object: "/tuio/2Dobj",
//     cursor: "/tuio/2Dcur",
//     blob: "/tuio/2Dblb",
//     marker: "/tuio/broox_markers"
// }

// const BlobSpaceTransform = {
//     camwidth: 1080,
//     camheight: 1920,
//     topcut: 400,
//     leftcut: 0,
//     enginewidth: 640,
//     engineheight: 480,
//     engineSpaceToCamera: function (x, y) {
//         var xx = (x*this.enginewidth + this.leftcut)/this.camwidth;
//         var yy = (y*this.engineheight + this.topcut)/this.camheight;
//         return {x: xx, y: yy};
//     }  
// }

// const BlobData = {
//     type: null,
//     id: "",
//     classId: "",
//     x: 0,
//     y: 0,
//     rotation: 0,
//     width: 0,
//     height: 0,
//     velocityX: 0,
//     velocityY: 0,
//     timeAlive: 0
// }


// function Blob(id, classId = ""){
//     this.id = id;
//     this.classId = classId;

//     this.update = (x, y, width, height, rotation = 0, velocityX = null, velocityY = null, timeAlive = 0) => {
//         //console.log("Update blob:"+ x, y, width, height);
//         this.x = x;
//         this.y = y;
//         this.width = width;
//         this.height = height;
//         this.rotation = rotation;
//         this.timeAlive = timeAlive;

//         if(velocityX == null && velocityY == null && this.x != null && this.y != null){
//             this.velocityX = x - this.x;
//             this.velocityY = y - this.y;
//         }
//         else{
//             this.velocityX = velocityX;
//             this.velocityY = velocityY;
//         }
//     }
// }


// function Blobs(){

//     var self = this;

//     this.blobs = new Map();
//     this.onBlobAdded = null;
//     this.onBlobDeleted = null;
//     this.onFrameUpdate = null;
    

//     let isMouseBlobEnabled = false;
//     const idMouseBlob = "mouse"

//     let CALCULATE_BLOB_TIME_ALIVE = true;

//     let isRandomBlobsEnabled = false;
//     let timeoutRandomBlobs = null;
//     let randomBlobCounter = 0;

//     this.activeArea = {
//         width: window.innerWidth,
//         height: window.innerHeight,
//         offset: {x: 0, y: 0}
//     };

//     this.setActiveArea = function(width, height, x = 0, y = 0){
//         this.activeArea.width = width;
//         this.activeArea.height = height;
//         this.activeArea.offset = {x, y};
//     }


//     this.enableMouseBlob = function(isEnabled, domElement){
//         isMouseBlobEnabled = isEnabled;

//         if(domElement == null){return;}

//         if(isEnabled){
//             domElement.addEventListener('mousemove', onMouseUpdate, false);
//         }
//         else{
//             updateBlobsAlive([]);
//             domElement.removeEventListener('mousemove', onMouseUpdate, false);
//         }
//     }

//     this.enableRandomBlobs = function(isEnabled){
//         isRandomBlobsEnabled = isEnabled;
//         if(timeoutRandomBlobs != null){
//             clearTimeout(timeoutRandomBlobs);
//             timeoutRandomBlobs = null;
//         }
//         randomBlobCounter = 0;
//         if(isEnabled){
//             createRandomBlob();
//         }
//     }

//     this.getIsMouseBlonEnabled = function(){
//         return isMouseBlobEnabled;
//     }

//     this.getIsRandomBlobsEnabled = function(){
//         return isRandomBlobsEnabled;
//     }

//     this.update = function(){
//         if(isRandomBlobsEnabled){
//             let idsToRemove = [];
//             for(let [id, blob] of self.blobs){
//                 if(id.includes("random")){
//                     if(isBlobInBounds(blob)){
//                         blob.update(blob.x + blob.velocityX, blob.y + blob.velocityY, 10, 10,0, blob.velocityX, blob.velocityY);
//                     }
//                     else{
//                         onDeleted(id);
//                         idsToRemove.push(id);
//                     }
//                 }
//             }

//             for(let id of idsToRemove){
//                 self.blobs.delete(id);
//             }
//         }
//     }
   
//     window.addEventListener("message", onMessage, false);
    
//     function onMessage(evt) {
//         onOSCMessage(evt.data);
//     }

//     function onOSCMessage(json){
//         // const winWidth = window.innerWidth;
//         // const winHeight = window.innerHeight;
        
//         for(var i in json){
//             var args = json[i].args
//             if(args == undefined){continue;}
//             var address = json[i].address;

//             switch(args[0]){

//                 case "fseq":
//                     if(args.length > 1){onNewFrame(args[1]);}
//                     break;

//                 case "set":
//                 var address = json[i].address;

//                 const blobData = parseBlobData(json[i].address, args, self.activeArea.width, self.activeArea.height, self.activeArea.offset);
//                 if(blobData == null){continue;}

                
//                 updateBlobWithData(blobData);

//                 /*var id = args[1].toString();
//                 var xindex = 2;
                
//                 if(address == TUIOSetTypes.object){xindex = 3;}

//                 if(args.length <= xindex + 1){continue;}
//                 var x = args[xindex];
//                 var y = args[xindex + 1];
//                 var velocityX = 0;
//                 var velocityY = 0;
                
//                 let blobWidth = 10;
//                 let blobHeight = 10;

//                 if(address == TUIOSetTypes.blob && args.length > xindex + 4){
//                     blobWidth = args[xindex + 3];
//                     blobHeight = args[xindex + 4];
//                 }


//                 //["set", 2, x0.26093751192092896, y0.4416666626930237, a0, w0.10625000298023224, h0.3375000059604645, f0.035859376192092896, X-0.0006456786650232971, Y-0.0016954377060756087, 0, 0, 0]
//                 //tuio/2Dblb set s x y a w h f X Y A m r
                
//                 console.log(args);
//                 //=5=[/tuio/2Dblb, set, 22, 367, 335, 0, 29, 90, 2610, -0.15519742667675018, -1.194331407546997, 0, 0, 0]

//                 if(x <= 1){ x = x * winWidth;}
//                 if(y <= 1){ y = y * winHeight;}

//                 //console.log("Update::", x, y, blobWidth, blobHeight, winWidth, winHeight);
//                 updateBlob(id, x, y, blobWidth * winWidth, blobHeight * winHeight);*/




//                 break;

//                 case "alive":
//                     updateBlobsAlive(args);
//                     break;
//                 default:
//                 break;
//             }
//         }
//     }


//     function parseBlobData(address, args, winWidth, winHeight, offset = {x: 0, y: 0}){
//         var blobData = Object.assign({}, BlobData);
//         blobData.id = args[1].toString();

//         switch(address){
//             case TUIOSetTypes.blob:
//                 if(!checkBlobDataFormat(args, 13)){return null;}
//                 blobData.x = args[2];
//                 blobData.y = args[3];
//                 blobData.rotation = args[4];
//                 blobData.width = args[5];
//                 blobData.height = args[6];
//                 blobData.velocityX = args[8];
//                 blobData.velocityY = args[9];
//                 blobData.timeAlive = args[12];
//                 break;
//             case TUIOSetTypes.object:
//                 if(!checkBlobDataFormat(args, 11)){return null;}
//                 blobData.classId = args[2];
//                 blobData.x = args[3];
//                 blobData.y = args[4];
//                 blobData.rotation = args[5];
//                 break;
//             case TUIOSetTypes.cursor:
//                 if(!checkBlobDataFormat(args, 7)){return null;}
//                 blobData.x = args[2];
//                 blobData.y = args[3];
//                 blobData.width = 60 / winWidth;
//                 blobData.height = blobData.width;
//                break;
//             case TUIOSetTypes.marker:
//                 console.log("Is markers");
//                 blobData.classId = args[2];
//                 blobData.x = args[3];
//                 blobData.y = args[4];
//                 blobData.rotation = args[5];
//                 blobData.width = args[6];
//                 console.log(args[2]);
//                 break;
//         }

//         var corrected = blobData;//BlobSpaceTransform.engineSpaceToCamera(blobData.x, blobData.y);


//         blobData.x = corrected.x * winWidth + offset.x;
//         blobData.y = corrected.y * winHeight + offset.y;
//         blobData.width *= winWidth;
//         blobData.height *= winHeight;

//         return blobData;
//     }

//     function checkBlobDataFormat(args, length){
//         if(args.length != length){
//             console.log("Wrong Tuio set format. Supposed to have length "+ length + " and has length "+ args.length);
//             return false;
//         }
//         return true;
//     }

//     function onNewFrame(fseq){
//         if(self.onFrameUpdate == null){return;}
//         self.onFrameUpdate(fseq);
//     }


//     function updateBlobWithData(blobData){
//         updateBlob(blobData.id, blobData.x, blobData.y, blobData.width, blobData.height, blobData.rotation, blobData.velocityX, blobData.velocityY, blobData.timeAlive, blobData.classId);

//     }

//     function updateBlob(id, x, y, width, height, rotation, velocityX, velocityY, timeAlive = 0, classId= ""){

//         if (!self.blobs.has(id)) {
//             var blob = new Blob(id, classId);
//             self.blobs.set(id, blob);
//             blob.update(x, y, width, height, rotation, velocityX, velocityY, timeAlive);
//             onAdded(id, x, y);
//         }
//         else {
//             var blob = self.blobs.get(id);
//             let blobTimeAlive = timeAlive;
//             if(CALCULATE_BLOB_TIME_ALIVE && blobTimeAlive <= 0){
//                 blobTimeAlive = blob.timeAlive + 0.01;
//             }
//             blob.update(x, y, width, height, rotation, velocityX, velocityY, blobTimeAlive);
//         }
//     }

//     function updateBlobsAlive(idsAlive){
//         var idsToRemove = [];

//         if(isMouseBlobEnabled){idsAlive.push(idMouseBlob);}

//         for(let [id, blob] of self.blobs){

//             let isAlive = false;
//             for(var aliveItem of idsAlive){
//                 isAlive = aliveItem == id;
//                 if(isAlive){
//                     break;
//                 }
//             }

//             if(!isAlive){
//                 onDeleted(id);
//                 idsToRemove.push(id);
//             }
//         }

//         for(let id of idsToRemove){
//             self.blobs.delete(id);
//         }

//         //console.log(idsAlive);
//     }

//     function onAdded(id, x, y){
//         if(self.onBlobAdded == null){return;}
        
//         self.onBlobAdded(id, x, y);
//     }

//     function onDeleted(id){
//         if(self.onBlobDeleted == null){return;}
        
//         self.onBlobDeleted(id);
//     }



//     // Mouse Blob
    
//     function onMouseUpdate(evt){
//         updateBlob(idMouseBlob, evt.pageX, evt.pageY, 10, 10)
//     }


//     // Random blobs

//     function createRandomBlob(){

//         if(!isRandomBlobsEnabled){return;}
//         const winWidth = self.activeArea.width;
//         const winHeight = self.activeArea.height;

//         const fromTopOrBottom = Math.random() <= 0.5;
//         const dirX = Math.random() <= 0.5 ? 1 : -1;
//         const dirY = Math.random() <= 0.5 ? 1 : -1;

//         const minVelX = fromTopOrBottom ? 0 : 0.5;
//         const minVelY = fromTopOrBottom ? 0.5 : 0;
//         const velocityX = (Math.random() * 2 + minVelX) * dirX;
//         const velocityY = (Math.random() * 2 + minVelY) * dirY;

//         const x = fromTopOrBottom ? winWidth * Math.random() + self.activeArea.offset.x : (velocityX > 0 ? self.activeArea.offset.x : winWidth + self.activeArea.offset.x);
//         const y = fromTopOrBottom ? (velocityY > 0 ? self.activeArea.offset.y : winHeight + self.activeArea.offset.y) : winHeight * Math.random() + self.activeArea.offset.y;

//         updateBlob("random_"+ randomBlobCounter, x, y, 10, 10, 0, velocityX, velocityY);
//         randomBlobCounter++;
        
//         timeoutRandomBlobs = setTimeout(function(){
//             createRandomBlob()
//         }, Math.random() * 3000 + 1000);
        
//     }

//     function isBlobInBounds(blob){
//         const winWidth = self.activeArea.width;
//         const winHeight =self.activeArea.height;

//         // console.log(winWidth +"/"+winHeight);
//         // console.log("isBlobInBounds???: "+ blob.x +"/" + blob.y);
//         // console.log(!(blob.x < -9 || blob.x > winWidth || blob.y < -winHeight * 0.5 || blob.y > winHeight));

//         return !(blob.x < -9 + self.activeArea.offset.x || blob.x > winWidth + self.activeArea.offset.x || blob.y < -winHeight * 0.5 + self.activeArea.offset.y || blob.y > winHeight + self.activeArea.offset.y)
//     }

// }



// export default Blobs;