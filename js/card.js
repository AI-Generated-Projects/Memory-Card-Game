class Card {
    constructor(value) {
        this.value = value;
        this.isFlipped = false;
        this.isMatched = false;
        this.element = this.createElement();
    }

    createElement() {
        const card = document.createElement('div');
        card.className = 'card';

        const front = document.createElement('div');
        front.className = 'card-front';

        const back = document.createElement('div');
        back.className = 'card-back';
        back.textContent = this.value;

        card.appendChild(front);
        card.appendChild(back);

        card.addEventListener('click', () => this.flip());

        return card;
    }

    flip() {
        if (!this.isMatched && !this.isFlipped) {
            this.isFlipped = true;
            this.element.classList.add('flipped');
            document.dispatchEvent(new CustomEvent('cardFlipped', { detail: this }));
        }
    }

    unflip() {
        this.isFlipped = false;
        this.element.classList.remove('flipped');
    }

    match() {
        this.isMatched = true;
        this.element.classList.add('matched');
    }
}
