
export class PuzzleCell {
    constructor(line, column, value) {
        this.Line = line;
        this.Column = column;
        this.Value = value;
    }

    Clone() {
        return new PuzzleCell(this.Line, this.Column, this.Value);
    }

    IsEmpty() {
        return this.Value === 0;
    }

    SetEmpty() {
        this.Value = 0;
    }
}
