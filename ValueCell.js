import { Cell } from './Cell.js';

export class ValueCell extends Cell {
  constructor(value, i, j) {
    super(i, j);
    this.value = value;
  }

  handleKeyPress(event) {
    const number = parseInt(event.key);
    if (!isNaN(number) && number >= 1 && number <= 9) {
      this.value = number;
    }
    return this;
  }

  render() {
    return `<div>${this.value}</div>`;
  }
}