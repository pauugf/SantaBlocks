import { FallingItem } from './FallingItem';
import { Application, Container } from 'pixi.js';
import { CatchedItem } from './CatchedItem';
import { FallingItemType } from './FallingItemType';
import { GameStatus } from './GameStatus';
import { Xtransformer } from './Xtransformer';

export class Game {
  private app: Application;
  private container: Container;
  private items: FallingItem[] = [];
  private onItemCatched: (item: CatchedItem) => void;
  private status: GameStatus = GameStatus.standBy;
  private itemInterval: number;
  private bodyWidth: number;
  private bodyHeight: number;
  private bodyY: number;
  private itemSpeed: number;
  private malusItemPercentage: number;
  private ground: number;
  private ceiling: number;
  private margin: number;
  private transformer: Xtransformer;

  constructor(width: number, height: number, margin: number, ground: number, ceiling: number, itemInterval: number, itemSpeed: number, malusItemPercentage: number, transformer: Xtransformer, bodyY: number, bodyWidth: number, bodyHeight: number) {
    this.app = new Application({ width: width, height: height, backgroundAlpha: 0 });
    // this.app = new Application({ width: width, height: height, backgroundColor: 'red' });
    this.container = new Container();
    this.app.stage.addChild(this.container);
    this.itemInterval = itemInterval;
    this.malusItemPercentage = malusItemPercentage;
    this.ground = ground;
    this.ceiling = ceiling;
    this.margin = margin;
    this.itemSpeed = itemSpeed;
    this.transformer = transformer;
    this.bodyWidth = bodyWidth;
    this.bodyHeight = bodyHeight;
    this.bodyY = bodyY;
    // listen for frame updates
    let tick = 0;
    this.app.ticker.add(() => {
      if(this.status === GameStatus.playing) {
        tick += 1;
        if(tick > this.itemInterval) {
          tick = 0;
          const x = Math.floor(Math.random() * (this.app.screen.width - this.margin * 2));
          let itemType = FallingItemType.red;
          if(Math.random() < this.malusItemPercentage) {
            itemType = FallingItemType.malus;
          }
          const item = new FallingItem(this.container, itemType, x, this.ceiling, this.itemSpeed, this.ground);
          this.items.push(item);
        }
      }
    });
  }

  update() {
    if(this.status === GameStatus.playing) {
      for(let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        item.update();
        // check collision with ground
        if(item.checkGroundCollision()) {
          this.finishItem(item, i, true);
        }
      }
    }
  }

  checkCollisions(skeletons: any) {
    if(this.status === GameStatus.playing) {
      for(let i = this.items.length - 1; i >= 0; i--) {
        const item = this.items[i];
        // check collision with blob
        // for (let skeleton of skeletons.values() || []) {
        //   const leftHand = { x: skeleton.hand_left.x, y: skeleton.hand_left.y, width: this.handWidth, height: this.handWidth };
        //   const rightHand = { x: skeleton.hand_right.x, y: skeleton.hand_right.y, width: this.handWidth, height: this.handWidth };
        //   if(item.checkCollision(leftHand) || item.checkCollision(rightHand)) {
        //     console.log('hand collision');
        //     this.onItemCatched({ type: item.getType(), position: item.getPosition() });
        //     this.finishItem(item, i, false);
        //     return;
        //   }
        // }
        for(let skeleton of skeletons || []) {
          let x = this.transformer.get(skeleton.neck?.x || skeleton.nose?.x || 0);
          x = Math.max(x, this.bodyWidth / 2 / this.app.screen.width);
          x = Math.min(x, (this.app.screen.width - this.bodyWidth / 2) / this.app.screen.width);
          const body = { x: x * this.app.screen.width - this.bodyWidth / 2, y: this.bodyY - this.bodyHeight / 2, width: this.bodyWidth, height: this.bodyHeight };
          if(item.checkCollision(body)) {
            console.log('item chatched', body, item);
            this.onItemCatched({ type: item.getType(), position: item.getPosition() });
            this.finishItem(item, i, false);
            return;
          }
          break;
        }
      }
    }
  }

  play() {
    this.status = GameStatus.playing;
  }

  finish() {
    for(let i = this.items.length - 1; i >= 0; i--) {
      this.items[i].dissapear(false);
      this.items.splice(i, 1);
    }
    this.status = GameStatus.standBy;
  }

  getStatus() {
    return this.status;
  }

  getView() {
    return this.app.view;
  }

  getContainer() {
    return this.container;
  }

  onCatch(callback: (item: CatchedItem) => void) {
    this.onItemCatched = callback;
  }

  setBodyWidth(value: number) {
    this.bodyWidth = value;
  }

  setBodyHeight(value: number) {
    this.bodyHeight = value;
  }

  setItemSpeed(value: number) {
    this.itemSpeed = value;
  }

  setItemInterval(value: number) {
    this.itemInterval = value;
  }

  setMalusItemPercentage(value: number) {
    this.malusItemPercentage = value;
  }

  private finishItem(item: FallingItem, index: number, onGround: boolean) {
    item.dissapear(onGround);
    this.items.splice(index, 1);
  }
}