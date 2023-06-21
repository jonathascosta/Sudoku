import { CellModeSelector } from './CellModeSelector.js';
import { Cell } from './Cell.js';

export class Board {
  constructor(boardData = []) {
    this.cellModeSelector = new CellModeSelector('Value', mode => this.setMode(mode));
    this.selectedCell = null;
    window.addEventListener('click', this.handleOutsideClick.bind(this));
    this.boardData = boardData.map((row, i) =>
      row.map((cellData, j) => new Cell(cellData, [], () => this.handleClick(i, j)))
    );
    this.mode = 'Value';
  }

  setMode(mode) {
    this.mode = mode;
  }

  deselectCell() {
    if (this.selectedCell) {
      document.removeEventListener('keydown', this.selectedCell.handleKeyPress);
      const oldSelectedCellElement = document.getElementById(`cell-${this.selectedCell.i}-${this.selectedCell.j}`);
      oldSelectedCellElement.className = "";
      this.selectedCell = null;
    }
  }

  selectCell(i, j) {
    this.selectedCell = { i, j, handleKeyPress: this.handleKeyPress.bind(this) };
    const newSelectedCellElement = document.getElementById(`cell-${i}-${j}`);
    newSelectedCellElement.className = window.board.cellModeSelector.mode == "Value" ? "selected-value" : "selected-annotations";
    document.addEventListener('keydown', this.selectedCell.handleKeyPress);
  }

  handleOutsideClick(event) {
    if (event.target.closest('table.sudoku')) {
      return;
    }
    this.deselectCell();
  }

  handleClick(i, j) {
    this.deselectCell();
    this.selectCell(i, j);
  }

  handleKeyPress(event) {
    const number = parseInt(event.key);
    
    if (isNaN(number) || number < 1 || number > 9) {
      return;
    }

    const { i, j } = this.selectedCell;

    switch (this.mode) {
      case 'Value':
        this.boardData[i][j].setValue(number);
        break;
      case 'Annotations':
        this.boardData[i][j].toggleAnnotation(number);
        break;
      default:
        break;
    }

    document.body.innerHTML = this.render();
  }

  renderRow(i) {
    const rowHtml = this.boardData[i].map((_, j) => this.renderCell(i, j)).join('');
    return `<tr>${rowHtml}</tr>`;
  }


  renderCell(i, j) {
    const cell = this.boardData[i][j];
    const isSelected = this.selectedCell && this.selectedCell.i === i && this.selectedCell.j === j;
    const selectedClass = isSelected ? (this.mode === 'Value' ? 'selected-value' : 'selected-annotations') : '';
    const backgroundColorClass = (cell instanceof Cell) ? selectedClass : '';
    return `<td id="cell-${i}-${j}" onclick="window.board.handleClick(${i}, ${j})" class="${backgroundColorClass}">${cell.render()}</td>`;
  }

  render() {
    const tableHtml = this.boardData.map((_, i) => this.renderRow(i)).join('');
    return `
    <div class="sudoku-container">
      <table class="sudoku">${tableHtml}</table>
      ${this.cellModeSelector.render()}
    </div>`;
  }

  toggleMode(checkbox) {
    this.mode = checkbox.checked ? 'Annotations' : 'Value';
  }
}
