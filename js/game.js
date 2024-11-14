class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        this.timer = null;
        this.timeElapsed = 0;

        this.boardElement = document.getElementById('game-board');
        this.startButton = document.getElementById('start-game');
        this.difficultySelect = document.getElementById('difficulty');

        this.startButton.addEventListener('click', () => this.startGame());
        document.addEventListener('cardFlipped', (e) => this.handleCardFlip(e.detail));
    }

    startGame() {
        this.resetGame();
        this.createBoard();
        this.startTimer();
        this.gameStarted = true;
    }

    resetGame() {
        this.cards = [];
        this.flippedCards = [];
        this.moves = 0;
        this.score = 0;
        this.timeElapsed = 0;
        this.updateStats();
        this.boardElement.innerHTML = '';
        if (this.timer) clearInterval(this.timer);
    }

    createBoard() {
        const difficulty = this.difficultySelect.value;
        const gridSizes = {
            easy: 4,
            medium: 6,
            hard: 8
        };
        const size = gridSizes[difficulty];
        const pairs = (size * size) / 2;

        this.boardElement.style.gridTemplateColumns = `repeat(${size}, 100px)`;

        const values = this.generateCardValues(pairs);
        this.cards = values.map(value => new Card(value));

        this.cards.forEach(card => {
            this.boardElement.appendChild(card.element);
        });
    }

    generateCardValues(pairs) {
        const values = [];
        for (let i = 1; i <= pairs; i++) {
            values.push(i, i);
        }
        return this.shuffle(values);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    handleCardFlip(card) {
        if (!this.gameStarted) return;

        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();

            if (this.flippedCards[0].value === this.flippedCards[1].value) {
                this.handleMatch();
            } else {
                this.handleMismatch();
            }
        }
    }

    handleMatch() {
        this.flippedCards.forEach(card => card.match());
        this.score += 10;
        this.updateStats();
        this.flippedCards = [];

        if (this.checkWin()) {
            this.endGame();
        }
    }

    handleMismatch() {
        setTimeout(() => {
            this.flippedCards.forEach(card => card.unflip());
            this.flippedCards = [];
        }, 1000);
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeElapsed++;
            this.updateStats();
        }, 1000);
    }

    updateStats() {
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('score').textContent = this.score;
        document.getElementById('time').textContent = this.formatTime(this.timeElapsed);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    checkWin() {
        return this.cards.every(card => card.isMatched);
    }

    endGame() {
        clearInterval(this.timer);
        this.gameStarted = false;
        alert(`Congratulations! You won!\nScore: ${this.score}\nTime: ${this.formatTime(this.timeElapsed)}\nMoves: ${this.moves}`);
    }
}

// Initialize the game
const game = new MemoryGame();
