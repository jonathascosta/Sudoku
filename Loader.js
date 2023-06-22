export class Loader {
    constructor(elementId, interval) {        
        this.phrases = [
            'Warming up the Sudoku engine...',
            'Polishing Sudoku cells...',
            'Shuffling numbers...',
            'Double checking the solutions...',
            'Herding some wild numbers...',
            'Proving P=NP...',
            'Rounding up the digits...',
            'Putting numbers in their places...',
            'Calculating the square root of 81...',
            'Balancing numerical equations...',
            'Convincing 9 to be nice with other numbers...',
            'Explaining 1 why it can\'t always be the first...',
            'Teaching 7 that it\'s not always lucky...',
            'Negotiating peace treaty between 3 and 6...',
            'Begging 2 not to be too even...',
            'Organizing numerical family reunion...',
            'Untangling numerical mess...',
            'Ensuring every number is in the right row...',
            'Asking columns to stay vertical...',
            'Confirming that every grid has 9 children...',
            'Reassuring 5 it\'s at the center of attention...',
            'Making sure 0 isn\'t feeling left out...',
            'Asking 4 not to be so square...',
            'Teaching 8 about infinity...',
            'Counting all Sudoku cells...',
            'Inviting numbers to the Sudoku party...',
            'Creating a number lineup...',
            'Working out Sudoku strategy...',
            'Hiding numbers in the right spots...',
            'Figuring out the numerical mysteries...',
            'Formulating Sudoku theory...',
            'Aligning digits harmoniously...',
            'Performing Sudoku magic tricks...',
            'Playing hide and seek with the numbers...',
            'Giving each square a number to look after...',
            'Summoning the Sudoku spirits...'
        ];

        this.element = document.getElementById(elementId);
        this.textElement = this.element.querySelector('#loading-text');
        this.interval = interval;
        this.currentPhraseIndex = 0;
        this.loadingInterval = null;
    }

    start() {
        this.element.style.display = 'flex';
        this.updatePhrase();
        this.loadingInterval = setInterval(() => this.updatePhrase(), this.interval);
    }

    updatePhrase() {
        const randomIndex = Math.floor(Math.random() * this.phrases.length);
        this.textElement.innerText = this.phrases[randomIndex];
    }
    
    stop() {
        clearInterval(this.loadingInterval);
        this.element.style.opacity = '0';
        setTimeout(() => {
            this.element.style.display = 'none';
        }, 3000);
    }
}
