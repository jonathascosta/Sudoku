export class Timer {
    constructor(timerElementId) {
        this.timerElement = document.getElementById(timerElementId);
        this.startTime = 0;
        this.timerInterval = null;
    }

    start() {
        this.startTime = Date.now();
        this.update();  // Atualiza imediatamente para evitar atraso inicial

        this.timerInterval = setInterval(() => {
            this.update();
        }, 1000);
    }

    stop() {
        clearInterval(this.timerInterval);
    }

    reset() {
        this.stop();
        this.timerElement.textContent = "00:00";
    }

    update() {
        const elapsedTime = Date.now() - this.startTime;
        const totalSeconds = Math.floor(elapsedTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = hours.toString().padStart(1, '0');
        const formattedMinutes = minutes.toString().padStart(1, '0');
        const formattedSeconds = seconds.toString().padStart(1, '0');

        if (hours > 0) {
            this.timerElement.textContent = `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
        } else if (minutes > 0) {
            this.timerElement.textContent = `${formattedMinutes}m ${formattedSeconds}s`;
        } else {
            this.timerElement.textContent = `${formattedSeconds}s`;
        }
    }
}