import { Container, Graphics, Sprite } from 'pixi.js';
import { Xtransformer } from './Xtransformer';
import bag from '../assets/bag_new.png';

export class Body {
  private container: Container;
  private item: Sprite;
  private graphics: Graphics;
  private show: boolean = false;
  private size: number;
  private transformer: Xtransformer;

  constructor(container: Container, size: number, show: boolean, width: number, height: number, y: number, transformer: Xtransformer) {
    this.container = new Container();
    this.item = Sprite.from(bag);
    this.item.width = width;
    this.item.height = height;
    this.item.position.y = y - this.item.height / 2;
    this.container.addChild(this.item);
    this.size = size;
    this.show = show;
    this.transformer = transformer;
    container.addChild(this.container);
    // add graphics
    this.graphics = new Graphics();
    this.container.addChild(this.graphics);
  }

  // show(value: boolean) {
  //   this.container.visible = value;
  // }

  update(skeletons: any) {
    this.graphics.clear();
    if(this.show) {
      // for(let skeleton of skeletons.values() || []) {
      //   this.draw(skeleton.hand_left.x, skeleton.hand_left.y, this.handWidth);
      //   this.draw(skeleton.hand_right.x, skeleton.hand_right.y, this.handWidth);
      // }
      for(let skeleton of skeletons || []) {
        const x = this.transformer.get(skeleton.neck?.x || skeleton.nose?.x || 0);
        let pos = x * this.size - (this.item.width / 2);
        pos = Math.max(pos, 0);
        pos = Math.min(pos, this.size - this.item.width);
        this.item.position.x = pos;
        // this.item.position.x = x * this.size - this.item.width / 2;
        break;
        // this.draw(x * this.size, this.y, this.width, this.height);
      }
    }
  }

  // private draw(x: number, y: number, width: number, height: number) {
  //   if(x > 0 && y > 0 && width > 0 && height > 0) {
  //     this.graphics.lineStyle(1, 16092361, 0.9);
  //     this.graphics.beginFill(16092361, 0.5);
  //     // this.graphics.drawCircle(x, y, width);
  //     this.graphics.drawRect(x - width / 2, y - height / 2, width, height);
  //     this.graphics.endFill();
  //   }
  // }
}