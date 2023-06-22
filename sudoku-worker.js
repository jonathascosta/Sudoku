import { BoardBuilder } from './SudokuCreator.js';

self.onmessage = (event) => {
    let builder = new BoardBuilder();
    let sudokuPuzzle = builder.Build();

    self.postMessage(sudokuPuzzle);
};