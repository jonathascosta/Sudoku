import { PuzzleBoard } from "./PuzzleBoard.js";
import { PuzzleCell } from "./PuzzleCell.js";
import { PuzzleSolver } from "./PuzzleSolver.js";

export class PuzzleBoardBuilder {
    constructor() {
        this._board = new PuzzleBoard();

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
                        this._board.Cells[line][column] = new PuzzleCell(line, column, number);
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
        let solver = new PuzzleSolver();
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
