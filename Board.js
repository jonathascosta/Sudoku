import { CellModeSelector } from './CellModeSelector.js';
import { Cell } from './Cell.js';

export class Board {
  constructor(boardData = []) {
    this.cellModeSelector = new CellModeSelector('Value', mode => this.setMode(mode));
    this.selectedCell = null;
    window.addEventListener('click', this.handleOutsideClick.bind(this));
    this.boardData = boardData.map((row, i) =>
      row.map((cellData, j) =>
        Array.isArray(cellData) ? new AnnotationsCell(cellData, () => this.handleClick(i, j)) : new ValueCell(cellData, () => this.handleClick(i, j))
      )
    );
    this.mode = 'Value';
  }

  setMode(mode) {
    this.mode = mode;
  }

  handleOutsideClick(event) {
    if (event.target.closest('table.sudoku')) {
      return;
    }
    if (this.selectedCell) {
      document.removeEventListener('keydown', this.selectedCell.handleKeyPress);
      const oldSelectedCellElement = document.getElementById(`cell-${this.selectedCell.i}-${this.selectedCell.j}`);
      oldSelectedCellElement.className = "";
      this.selectedCell = null;
    }
  }

  handleClick(i, j) {
    if (this.selectedCell) {
      document.removeEventListener('keydown', this.selectedCell.handleKeyPress);
      const oldSelectedCellElement = document.getElementById(`cell-${this.selectedCell.i}-${this.selectedCell.j}`);
      oldSelectedCellElement.className = "";
    }

    this.selectedCell = { i, j, handleKeyPress: this.handleKeyPress.bind(this) };
    const newSelectedCellElement = document.getElementById(`cell-${i}-${j}`);
    newSelectedCellElement.className = window.board.cellModeSelector.mode == "Value" ? "selected-value" : "selected-annotations";
    document.addEventListener('keydown', this.selectedCell.handleKeyPress);
  }

  handleKeyPress(event) {
    const number = parseInt(event.key);
    const { i, j } = this.selectedCell;
    if (!isNaN(number) && number >= 1 && number <= 9) {
      if (this.mode === 'Value') {
        this.boardData[i][j].setValue(number);
      } else if (this.mode === 'Annotations') {
        this.boardData[i][j].toggleAnnotation(number);
      }
      document.body.innerHTML = this.render();
    }
  }
  
  render() {
    let html = `<div class="sudoku-container">
                    <table class="sudoku">`;
    for (let i = 0; i < 9; i++) {
      html += `<tr>`;
      for (let j = 0; j < 9; j++) {
        const cell = this.boardData[i][j];
        const isSelected = this.selectedCell && this.selectedCell.i === i && this.selectedCell.j === j;
        const selectedClass = isSelected ? (this.mode === 'Value' ? 'selected-value' : 'selected-annotations') : '';
        const backgroundColorClass = cell instanceof AnnotationsCell || cell instanceof ValueCell ? selectedClass : '';
        html += `<td id="cell-${i}-${j}" onclick="window.board.handleClick(${i}, ${j})" class="${backgroundColorClass}">${cell.render()}</td>`;
      }
      html += `</tr>`;
    }
    html += `</table>`;
    html += this.cellModeSelector.render();
    html += `</div>`;
    return html;
  }

  toggleMode(checkbox) {
    this.mode = checkbox.checked ? 'Annotations' : 'Value';
  }
}
