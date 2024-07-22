import { PuzzleBoardBuilder } from './PuzzleBoardBuilder.js';

self.onmessage = (event) => {
    let builder = new PuzzleBoardBuilder();
    let sudokuPuzzle = builder.Build();

    self.postMessage(sudokuPuzzle);
};