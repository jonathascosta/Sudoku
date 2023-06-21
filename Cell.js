export class Cell {
    constructor(value = null, annotations = [], onClick = () => {}) {
      this.value = Array.isArray(value) ? null : value;
      this.annotations = Array.isArray(value) ? value : annotations;
      this.type = Array.isArray(value) ? 'Annotations' : 'Value';
      this.onClick = onClick;
    }
  
    setValue(value) {
      if (typeof value === 'number') {
        this.value = value;
        this.type = 'Value';
      }
    }

    toggleAnnotation(number) {
      const index = this.annotations.indexOf(number);
      if (index > -1) {
        this.annotations.splice(index, 1);
      } else {
        this.annotations.push(number);
      }
      this.type = 'Annotations';
    }
  
    render() {
      if (this.type === 'Value') {
        return `<div>${this.value}</div>`;
      } else {
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
}
