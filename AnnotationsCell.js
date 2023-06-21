import { Cell } from './Cell.js';

export class AnnotationsCell extends Cell {
  constructor(annotations = [], i, j) {
    super(i, j);
    this.annotations = annotations;
  }

  handleKeyPress(event) {
    const number = parseInt(event.key);
    if (!isNaN(number) && number >= 1 && number <= 9) {
      if (this.annotations.includes(number)) {
        this.hideAnnotation(number);
      } else {
        this.showAnnotation(number);
      }
    }
    return this;
  }

  showAnnotation(number) {
    if (!this.annotations.includes(number)) {
      this.annotations.push(number);
    }
  }

  hideAnnotation(number) {
    this.annotations = this.annotations.filter(annotation => annotation !== number);
  }

  render() {
    let html = '<table class="annotations">';
    for (let i = 1; i <= 3; i++) {
      html += '<tr>';
      for (let j = 1; j <= 3; j++) {
        let value = i * 3 + j - 3;
        if (this.annotations.includes(value)) {
          html += `<td>${value}</td>`;
        } else {
          html += '<td></td>';
        }
      }
      html += '</tr>';
    }
    html += '</table>';
    return html;
  }
}
