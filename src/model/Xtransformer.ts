export class Xtransformer {
  private factor: number = 1;

  constructor(factor: number) {
    this.factor = factor;
  }

  get(x: number) {
    return Math.min(1, Math.max(0, ((x - 0.5) * this.factor + 0.5)));
  }

  setFactor(value: number) {
    this.factor = value;
  }
}