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
    this.history = [];
    this.mode = 'Value';
  }

  setMode(mode) {
    this.mode = mode;
  }

  getSquareCoordinates(i, j) {
    const startRow = Math.floor(i / 3) * 3;
    const startCol = Math.floor(j / 3) * 3;

    let coordinates = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        coordinates.push({ i: startRow + row, j: startCol + col });
      }
    }
    return coordinates;
  }

  deselectCell() {
    if (this.selectedCell) {
      document.removeEventListener('keydown', this.selectedCell.handleKeyPress);
      const oldSelectedCellElement = document.getElementById(`cell-${this.selectedCell.i}-${this.selectedCell.j}`);
      oldSelectedCellElement.className = "";

      // Remove the highlights
      for (let k = 0; k < 9; k++) {
        document.getElementById(`cell-${this.selectedCell.i}-${k}`).classList.remove('highlighted');
        document.getElementById(`cell-${k}-${this.selectedCell.j}`).classList.remove('highlighted');
      }

      const squareCoordinates = this.getSquareCoordinates(this.selectedCell.i, this.selectedCell.j);
      for (let { i: squareI, j: squareJ } of squareCoordinates) {
        document.getElementById(`cell-${squareI}-${squareJ}`).classList.remove('highlighted');
      }

      this.selectedCell = null;
    }
  }

  removeAnnotations(number, i, j) {
    for (let k = 0; k < 9; k++) {
      this.boardData[i][k].removeAnnotation(number);
      this.boardData[k][j].removeAnnotation(number);
    }

    const squareCoordinates = this.getSquareCoordinates(i, j);
    for (let { i: squareI, j: squareJ } of squareCoordinates) {
      this.boardData[squareI][squareJ].removeAnnotation(number);
    }
  }

  selectCell(i, j) {
    this.selectedCell = { i, j, handleKeyPress: this.handleKeyPress.bind(this) };
    const newSelectedCellElement = document.getElementById(`cell-${i}-${j}`);
    newSelectedCellElement.className = window.board.cellModeSelector.mode == "Value" ? "selected-value" : "selected-annotations";
    document.addEventListener('keydown', this.selectedCell.handleKeyPress);

    // Highlight the row, column, and square
    for (let k = 0; k < 9; k++) {
      document.getElementById(`cell-${i}-${k}`).classList.add('highlighted');
      document.getElementById(`cell-${k}-${j}`).classList.add('highlighted');
    }

    const squareCoordinates = this.getSquareCoordinates(i, j);
    for (let { i: squareI, j: squareJ } of squareCoordinates) {
      document.getElementById(`cell-${squareI}-${squareJ}`).classList.add('highlighted');
    }
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
    const action = {
      i: this.selectedCell.i,
      j: this.selectedCell.j,
      state: {
        value: this.boardData[i][j].value,
        annotations: [...this.boardData[i][j].annotations],
        type: this.boardData[i][j].type
      },
      type: this.mode,
      number: number
    };
    this.history.push(action);

    switch (this.mode) {
      case 'Value':
        this.boardData[i][j].setValue(number);
        this.removeAnnotations(number, i, j);
        break;
      case 'Annotations':
        this.boardData[i][j].toggleAnnotation(number);
        break;
      default:
        break;
    }

    document.body.innerHTML = this.render();
  }

  undo() {
    const lastAction = this.history.pop();
    if (lastAction) {
      const cell = this.boardData[lastAction.i][lastAction.j];
      cell.value = lastAction.state.value;
      cell.annotations = lastAction.state.annotations;
      cell.type = lastAction.state.type;
    }

    document.body.innerHTML = this.render();
  }

  renderRow(i) {
    const rowHtml = this.boardData[i].map((_, j) => this.renderCell(i, j)).join('');
    return `<tr>${rowHtml}</tr>`;
  }

  eraseSelected() {
    if (this.selectedCell) {
      this.boardData[this.selectedCell.i][this.selectedCell.j].value = null;
      this.boardData[this.selectedCell.i][this.selectedCell.j].annotations = [];
      this.boardData[this.selectedCell.i][this.selectedCell.j].type = "Annotations";
      document.body.innerHTML = this.render();
    }
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
      <div>
        <button id="undo-button" onclick="window.board.undo()">Undo</button>
        <button id="erase-button" onclick="window.board.eraseSelected()">Erase</button>
      </div>
    </div>`;
  }

  toggleMode(checkbox) {
    this.mode = checkbox.checked ? 'Annotations' : 'Value';
  }
}
