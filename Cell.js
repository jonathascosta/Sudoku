export class Cell {
  constructor(value = null, annotations = [], onClick = () => { }) {
    this.value = Array.isArray(value) ? null : value;
    this.annotations = Array.isArray(value) ? value : annotations;
    this.type = Array.isArray(value) ? 'Annotations' : 'Value';
    this.onClick = onClick;
  }

  setValue(value, saveToHistory = true) {
    if (typeof value === 'number') {
      this.value = value;
      this.type = 'Value';
    }
  }

  removeAnnotation(number) {
    const index = this.annotations.indexOf(number);
    if (index > -1) {
      this.annotations.splice(index, 1);
    }
  }

  addAnnotation(number) {
    if (!this.annotations.includes(number)) {
      this.annotations.push(number);
    }
  }

  toggleAnnotation(number) {
    if (this.annotations.includes(number)) {
      this.removeAnnotation(number);
    } else {
      this.addAnnotation(number);
    }
    this.type = 'Annotations';
  }

  renderValue() {
    return `<div>${this.value}</div>`;
  }

  renderAnnotations() {
    const rows = [1, 2, 3].map(i => this.renderAnnotationsRow(i)).join("");
    return `<table class="annotations">${rows}</table>`;
  }

  renderAnnotationsRow(row) {
    const cells = [1, 2, 3].map(j => this.renderAnnotationsCell(row, j)).join("");
    return `<tr>${cells}</tr>`;
  }

  renderAnnotationsCell(row, cell) {
    let value = row * 3 + cell - 3;
    if (this.annotations.includes(value)) {
      return `<td>${value}</td>`;
    } else {
      return '<td></td>';
    }
  }

  render() {
    if (this.type === 'Value') {
      return this.renderValue();
    } else {
      return this.renderAnnotations();
    }
  }
}
