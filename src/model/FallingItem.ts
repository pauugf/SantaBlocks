import { Container, Sprite, Texture } from 'pixi.js';
import redGift from '../assets/redGift_new.png';
import greenGift from '../assets/greenGift_new.png';
import { FallingItemType } from './FallingItemType';
import { Position } from './Position';

export class FallingItem {
  private container: Container;
  private type: FallingItemType;
  private item: Sprite;
  private ground: number;
  private speed: number;

  constructor(container: Container, type: FallingItemType, initialX: number, initialY: number, speed: number, ground: number) {
    this.container = container;
    this.type = type;
    this.item = Sprite.from(type === FallingItemType.malus ? greenGift : redGift);
    this.item.x = initialX;
    this.item.y = initialY;
    this.item.rotation = Math.random() - 0.5;
    this.container.addChild(this.item);
    this.speed = speed;
    this.ground = ground;
  }

  update() {
    this.item.y += this.speed;
  }

  dissapear(onGround: boolean) {
    if(onGround) {
      const interval = setInterval(() => {
        if(this.item.alpha <= 0) {
          clearInterval(interval);
        }
        else {
          this.item.alpha -= 0.01;
        }
      }, 1);
    }
    else {
      this.container.removeChild(this.item);
    }
  }

  checkGroundCollision() {
    if(this.item.y >= (this.ground - this.item.height)) {
      return true;
    }
    return false;
  }

  checkCollision(body: any) {
    if(body.x < 0 || body.y < 0 || body.y < 0 || body.width < 0 || body.height < 0) {
      return false;
    }
    const itemBody = { x: this.item.position.x, y: this.item.position.y, width: this.item.width, height: this.item.height };
    return this.intersects(body, itemBody);
  }

  getType() {
    return this.type;
  }

  getPosition(): Position {
    return { x: this.item.position.x + (this.item.width / 2), y: this.item.position.y + (this.item.height / 2) };
  }

  // private getRandomItem() {
  //   const random = Math.floor(Math.random() * 5);
  //   switch(random) {
  //     case 0: return item1;
  //     case 1: return item2;
  //     case 2: return item3;
  //     case 3: return item4;
  //     case 4: return item5;
  //     case 5: return item6;
  //   }
  // }

  private intersects(body1: any, body2: any) {
    if(body1.x > (body2.x + body2.width) || body2.x > (body1.x + body1.width)) {
      return false
    };
    if (body1.y > (body2.y + body2.height) || body2.y > (body1.y + body1.height)) {
      return false
    };
    return true;
  }
}