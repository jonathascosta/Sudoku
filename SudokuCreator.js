class Cell {
    constructor(board, line, column, value) {
        this.Board = board;
        this.Line = line;
        this.Column = column;
        this.Value = value;
    }

    Clone() {
        return new Cell(this.Board, this.Line, this.Column, this.Value);
    }

    IsEmpty() {
        return this.Value === 0;
    }

    SetEmpty() {
        this.Value = 0;
    }
}

class Board {
    constructor() {
        this.Cells = null;
    }

    Clone() {
        const board = new Board();
        board.Cells = new Array(9);
        for (let i = 0; i < 9; i++) {
            board.Cells[i] = new Array(9);
            for (let j = 0; j < 9; j++) {
                board.Cells[i][j] = this.Cells[i][j].Clone();
            }
        }
        return board;
    }

    IsValid() {
        for (let i = 0; i < 9; i++) {
            if (!this.IsCellValid(i, this.GetRow.bind(this)) || !this.IsCellValid(i, this.GetColumn.bind(this)) || !this.IsCellValid(i, this.GetBlock.bind(this))) {
                return false;
            }
        }
        return true;
    }

    ToString() {
        let str = '';
        for (let a = 0; a < 9; a++) {
            str += '-------------------------------------\n';
            for (let b = 0; b < 9; b++) {
                str += `| ${this.Cells[a][b].Value === 0 ? ' ' : this.Cells[a][b].Value} `;
            }
            str += '|\n';
        }
        str += '-------------------------------------\n';
        return str;
    }

    GetRow(index) {
        return this.Cells[index];
    }

    GetColumn(index) {
        return this.Cells.map(row => row[index]);
    }

    GetBlock(index) {
        const row = Math.floor(index / 3) * 3;
        const col = (index % 3) * 3;
        const block = [];
        for (let i = row; i < row + 3; i++) {
            for (let j = col; j < col + 3; j++) {
                block.push(this.Cells[i][j]);
            }
        }
        return block;
    }

    IsCellValid(index, getCells) {
        const cells = getCells(index).filter(c => !c.IsEmpty());
        const valueCount = cells.reduce((acc, c) => {
            acc[c.Value] = (acc[c.Value] || 0) + 1;
            return acc;
        }, {});
        return Object.values(valueCount).every(count => count === 1);
    }
}

export class BoardBuilder {
    constructor() {
        this._board = new Board();

        this.InitializeCells();
        this.InitializeCellValues();
        this.ShuffleNumbers();
        this.ShuffleRows();
        this.ShuffleColumns();
        this.Shuffle3X3Rows();
        this.Shuffle3X3Columns();
        this.RemoveRandomly();
    }

    InitializeCells() {
        this._board.Cells = new Array(9);
        for (let i = 0; i < 9; i++) {
            this._board.Cells[i] = new Array(9);
        }
    }

    InitializeCellValues() {
        for (let a = 0; a < 3; a++) {
            for (let b = 0; b < 3; b++) {
                let line = 3 * a + b;
                for (let c = 0; c < 3; c++) {
                    for (let d = 0; d < 3; d++) {
                        let column = 3 * c + d;
                        let number = (3 * (c + b) + ((d + a) % 3)) % 9 + 1;
                        this._board.Cells[line][column] = new Cell(this._board, line, column, number);
                    }
                }
            }
        }
    }

    ShuffleNumbers() {
        for (let i = 0; i < 9; i++) {
            let randomNumber = Math.floor(Math.random() * 9) + 1;
            this.SwapNumbers(i + 1, randomNumber);
        }
    }

    ShuffleRows() {
        let blockNumber = 0;

        for (let i = 0; i < 9; i++) {
            let randomNumber = Math.floor(Math.random() * 3);
            blockNumber = Math.floor(i / 3);
            this.SwapRows(i, blockNumber * 3 + randomNumber);
        }
    }

    ShuffleColumns() {
        let blockNumber = 0;

        for (let i = 0; i < 9; i++) {
            let randomNumber = Math.floor(Math.random() * 3);
            blockNumber = Math.floor(i / 3);
            this.SwapColumns(i, blockNumber * 3 + randomNumber);
        }
    }

    Shuffle3X3Rows() {
        for (let i = 0; i < 3; i++) {
            let randomNumber = Math.floor(Math.random() * 3);
            this.Swap3X3Rows(i, randomNumber);
        }
    }

    Shuffle3X3Columns() {
        for (let i = 0; i < 3; i++) {
            let randomNumber = Math.floor(Math.random() * 3);
            this.Swap3X3Columns(i, randomNumber);
        }
    }

    RemoveRandomly() {
        let solver = new Solver();
        let remaining = [...Array(81).keys()];
        while (remaining.length > 0) {
            let randomIndex = Math.floor(Math.random() * remaining.length);
            let number = remaining[randomIndex];
            let correctValue = this._board.Cells[Math.floor(number / 9)][number % 9].Value;
            this._board.Cells[Math.floor(number / 9)][number % 9].SetEmpty();
            let clone = this._board.Clone();
            let solved = false;

            try {
                solved = solver.Solve(clone);
            } catch {
                solved = false;
            }

            if (!solved) {
                this._board.Cells[Math.floor(number / 9)][number % 9].Value = correctValue;
            }

            remaining.splice(randomIndex, 1);
        }
    }

    Build() {
        return this._board;
    }

    SwapNumbers(n1, n2) {
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (this._board.Cells[x][y].Value === n1) {
                    this._board.Cells[x][y].Value = n2;
                } else if (this._board.Cells[x][y].Value === n2) {
                    this._board.Cells[x][y].Value = n1;
                }
            }
        }
    }

    SwapRows(r1, r2) {
        let row = this._board.Cells[r1].map(cell => cell.Clone());
        this._board.Cells[r1] = this._board.Cells[r2].map(cell => cell.Clone());
        this._board.Cells[r2] = row;
    }

    SwapColumns(c1, c2) {
        for (let i = 0; i < 9; i++) {
            let cell1 = this._board.Cells[i][c1].Clone();
            let cell2 = this._board.Cells[i][c2].Clone();

            this._board.Cells[i][c1] = cell2;
            this._board.Cells[i][c2] = cell1;
        }
    }

    Swap3X3Rows(r1, r2) {
        r1 = Math.floor(r1);
        r2 = Math.floor(r2);
        if (r1 < 0 || r1 > 2 || r2 < 0 || r2 > 2) {
            throw new Error('Invalid row index');
        }
        for (let i = 0; i < 3; i++) {
            this.SwapRows(r1 * 3 + i, r2 * 3 + i);
        }
    }

    Swap3X3Columns(c1, c2) {
        c1 = Math.floor(c1);
        c2 = Math.floor(c2);
        if (c1 < 0 || c1 > 2 || c2 < 0 || c2 > 2) {
            throw new Error('Invalid column index');
        }
        for (let i = 0; i < 3; i++) {
            this.SwapColumns(c1 * 3 + i, c2 * 3 + i);
        }
    }
}

class Solver {
    Solve(board, row = 0, column = 0) {
        let solutionsCount = 0;

        if (!board || !board.Cells) {
            throw "Invalid board";
        }

        if (column === 9) {
            column = 0;
            row++;

            if (row === 9) {
                return true;
            }
        }

        if (!board.Cells[row][column].IsEmpty()) {
            return this.Solve(board, row, column + 1);
        }

        for (let i = 1; i <= 9; i++) {
            board.Cells[row][column].Value = i;
            if (board.IsValid()) {
                if (this.Solve(board, row, column + 1)) {
                    if (++solutionsCount > 1) {
                        throw "More than 1 solution";
                    }
                }
            }
            board.Cells[row][column].SetEmpty();
        }

        return solutionsCount === 1;
    }
}