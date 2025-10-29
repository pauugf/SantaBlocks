import { Joint } from './Joint';
import { Rect } from './Rect';

export interface Skeleton {
  id: string,
  neck?: Joint,
  nose?: Joint,
  leftHip?: Joint,
  rightHip?: Joint,
  centerHip?: Joint,
  leftShoulder?: Joint,
  rightShoulder?: Joint,
  leftElbow?: Joint,
  rightElbow?: Joint,
  leftWrist?: Joint,
  rightWrist?: Joint,
  leftKnee?: Joint,
  rightKnee?: Joint,
  leftAnkle?: Joint,
  rightAnkle?: Joint,
  leftEye?: Joint,
  rightEye?: Joint,
  leftEar?: Joint,
  rightEar?: Joint,
  zone: string,
  gender: string,
  action: string,
  dwellTime: number,
  zoneDwellTime: number,
  box?: Rect
}