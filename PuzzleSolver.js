export class PuzzleSolver {
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

    getSolutionValue(board, row, column) {
        if (!board || !board.Cells) {
            throw "Invalid board";
        }

        if (!board.Cells[row][column].IsEmpty()) {
            return board.Cells[row][column].Value;
        }

        for (let i = 1; i <= 9; i++) {
            board.Cells[row][column].Value = i;
            if (this.Solve(board, 0, 0)) {
                return i;
            }
            board.Cells[row][column].SetEmpty();
        }

        return null;
    }
}
