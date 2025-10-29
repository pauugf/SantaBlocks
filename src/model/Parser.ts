import { Skeleton } from './Skeleton';
import { Joint } from './Joint';
import { JointType } from './JointType';

export class Parser {
  private skeletons: Map<string, Skeleton> = new Map<string, Skeleton>();

  setJoint(args: any[]) {
    const skeleton = this.getSkeleton(args);
    if(skeleton) {
      const joint = args[3] > -1 && args[4] > -1 ? { x: args[3], y: args[4] } : undefined;
      this.setSkeletonJoint(args[2], skeleton, joint);
    }
  }

  setFeature(args: any[]) {
    const skeleton = this.getSkeleton(args);
    if(skeleton) {
      if(args[2] === 'dwell') {
        skeleton.dwellTime = args[3].toFixed(1);
      }
      else if(args[2] === 'gender') {
        skeleton.gender = args[4] === 'F' ? 'Female' : 'Male';
      }
      else if(args[2] === 'zone_dwell') {
        skeleton.zoneDwellTime = args[3].toFixed(1);
        skeleton.zone = args[4];
      }
      else if(args[2] === 'action') {
        skeleton.action = args[4] === 'standing' ? 'Standing' : 'Walking';
      }
    }
  }

  setBox(args: any[]) {
    const skeleton = this.getSkeleton(args);
    if(skeleton) {
      skeleton.box = { x: args[2], y: args[3], width: args[5], height: args[6] };
    }
  }

  checkAlive(aliveSkeletons: string[]) {
    for(let key of this.skeletons.keys()) {
      if(!aliveSkeletons.includes(key)) {
        this.skeletons.delete(key);
      }
    }
  }

  getSkeletons() {
    return Array.from(this.skeletons.values());
  }

  private getSkeleton(args: any[]) {
    let skeleton = null;
    if(args[0] === 'set') {
      skeleton = this.skeletons.get(args[1]);
      if(!skeleton) {
        skeleton = {
          id: args[1]
        };
        this.skeletons.set(skeleton.id, skeleton);
      }
    }
    return skeleton;
  }

  private setSkeletonJoint(type: number, skeleton: Skeleton, joint: Joint) {
    switch(type) {
      case JointType.CenterHip:
        skeleton.centerHip = joint;
        break;
      case JointType.LeftAnkle:
        skeleton.leftAnkle = joint;
        break;
      case JointType.LeftEar:
        skeleton.leftEar = joint;
        break;
      case JointType.LeftElbow:
        skeleton.leftElbow = joint;
        break;
      case JointType.LeftEye:
        skeleton.leftEye = joint;
        break;
      case JointType.LeftHip:
        skeleton.leftHip = joint;
        break;
      case JointType.LeftKnee:
        skeleton.leftKnee = joint;
        break;
      case JointType.LeftShoulder:
        skeleton.leftShoulder = joint;
        break;
      case JointType.LeftWrist:
        skeleton.leftWrist = joint;
        break;
      case JointType.Neck:
        skeleton.neck = joint;
        break;
      case JointType.Nose:
        skeleton.nose = joint;
        break;
      case JointType.RightAnkle:
        skeleton.rightAnkle = joint;
        break;
      case JointType.RightEar:
        skeleton.rightEar = joint;
        break;
      case JointType.RightElbow:
        skeleton.rightElbow = joint;
        break;
      case JointType.RightEye:
        skeleton.rightEye = joint;
        break;
      case JointType.RightHip:
        skeleton.rightHip = joint;
        break;
      case JointType.RightKnee:
        skeleton.rightKnee = joint;
        break;
      case JointType.RightShoulder:
        skeleton.rightShoulder = joint;
        break;
      case JointType.RightWrist:
        skeleton.rightWrist = joint;
        break;
    }
  }
}