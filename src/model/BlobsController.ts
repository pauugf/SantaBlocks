import broox from '../../modules/broox';

class BlobsController {
  private simulate: boolean = false;
  private skeletonBlobs;
  private personBlobs;

  constructor(simulate: boolean, onUpdate: () => void) {
    this.simulate = simulate;
    this.skeletonBlobs = new broox.mediaPlayer.Blobs('/tuio/skel', document.body.clientWidth, document.body.clientHeight, 1, onUpdate);
    this.personBlobs = new broox.mediaPlayer.Blobs('/tuio/2Dblb', document.body.clientWidth, document.body.clientHeight, 1, onUpdate);
    this.simulate && this.personBlobs.enableMouseBlob(true, window);
    window.addEventListener('message', (event) => {
      // console.log('event data', event.data);
      this.personBlobs.onOSCMessage(event.data);
    }, false);
  }

  getSkeletons() {
    return this.skeletonBlobs.getBlobs();
  }

  getPersons() {
    return this.personBlobs.getBlobs();
  }

  setActiveArea(x: number, y: number, width: number, height: number) {
    this.skeletonBlobs.setActiveArea(x, y, width, height);
    this.personBlobs.setActiveArea(x, y, width, height);
  }

  setBlobsScale(handsScale: number, personsScale: number) {
    this.skeletonBlobs.setScale(handsScale);
    this.personBlobs.setScale(personsScale);
  }

  setSimulate(value: boolean) {
    this.simulate = value;
    this.personBlobs.enableMouseBlob(value, window);
  }

  killBlobs() {
    this.skeletonBlobs.killBlobs();
    this.personBlobs.killBlobs();
  }
}

export { BlobsController };