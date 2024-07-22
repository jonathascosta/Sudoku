export class PuzzleBoard {
    constructor() {
        this.Cells = null;
    }

    Clone() {
        const board = new PuzzleBoard();
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
