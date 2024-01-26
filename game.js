const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');

let mapWidth = 25;
let mapHeight = 25;
let tileSize = 20;
let score = 0;

function createRect(x,y,width, height,color) {
    canvasContext.fillStyle = color
    canvasContext.fillRect(x, y, width, height)
}

const Direction = {
    Up: 0,
    Down: 1,
    Left: 2,
    Right: 3
}

class Snake {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = Direction.Right;
        this.body = [{x:this.x, y:this.y}];
    }

    update(apple) {
        this.move();
        this.eat(apple);
        this.die();
    }

    render() {
        for (const element of this.body) {
            createRect(element.x + 0.5, element.y + 0.5, tileSize - 1, tileSize - 1, '#00FF00');
        }

        // Draw eyes on the head of the snake
        let head = this.body[this.body.length - 1];
        let eyeSize = tileSize / 5;
        let eyePosX, eyePosY;

        switch (this.direction) {
            case Direction.Up:
                eyePosX = head.x + tileSize / 4;
                eyePosY = head.y;
                break;
            case Direction.Down:
                eyePosX = head.x + tileSize / 4;
                eyePosY = head.y + tileSize / 2;
                break;
            case Direction.Left:
                eyePosX = head.x;
                eyePosY = head.y + tileSize / 4;
                break;
            case Direction.Right:
                eyePosX = head.x + tileSize / 2;
                eyePosY = head.y + tileSize / 4;
                break;
        }

        createRect(eyePosX, eyePosY, eyeSize, eyeSize, 'white'); // Left eye
        createRect(eyePosX + tileSize / 4, eyePosY, eyeSize, eyeSize, 'white'); // Right eye
    }
    
    move() {
        let newSquareBody;

        switch (this.direction) {
            case Direction.Up:
                newSquareBody = {
                    x: this.x, 
                    y: this.y - tileSize
                };
                break;
            case Direction.Down:
                newSquareBody = {
                    x: this.x, 
                    y: this.y + tileSize
                };
                break;
            case Direction.Left:
                newSquareBody = {
                    x: this.x - tileSize, 
                    y: this.y
                };
                break;
            case Direction.Right:
                newSquareBody = {
                    x: this.x + tileSize, 
                    y: this.y
                };
                break;
        }

        this.body.shift();
        this.body.push(newSquareBody);
        this.x = newSquareBody.x;
        this.y = newSquareBody.y;
    }

    eat(apple) {
        if(this.x === apple.x && this.y === apple.y) {
            apple.x = Math.floor(Math.random() * mapWidth) * tileSize;
            apple.y = Math.floor(Math.random() * mapHeight) * tileSize;

            this.body.push({
                x:this.x, 
                y:this.y
            });

            score++;
        }

    }

    die() {
        let bodyWithoutHead = this.body.slice(0, this.body.length - 2);

        if(this.x < 0 || this.x >= mapWidth * tileSize 
            || this.y < 0 || this.y >= mapHeight * tileSize
            || bodyWithoutHead.some(point => point.x === this.x && point.y === this.y)) {
            
            window.location.reload();
        }
    }
};

class Apple {
    constructor() {
        this.x = Math.floor(Math.random() * mapWidth) * tileSize;
        this.y = Math.floor(Math.random() * mapHeight) * tileSize;
    }

    render() {
        createRect(this.x + 0.5, this.y + 0.5, tileSize - 1, tileSize - 1, 'red');
    }
};

window.onload = () => {
    gameLoop();
}

window.addEventListener('keydown', (event) => {
    if((event.key == 'ArrowUp' || event.key == 'z') && snake.direction !== Direction.Down) 
        snake.direction = Direction.Up;
    else if((event.key == 'ArrowDown' || event.key == 's') && snake.direction !== Direction.Up)
        snake.direction = Direction.Down;
    else if((event.key == 'ArrowLeft' || event.key == 'q') && snake.direction !== Direction.Right)
        snake.direction = Direction.Left;
    else if((event.key == 'ArrowRight' || event.key == 'd') && snake.direction !== Direction.Left)
        snake.direction = Direction.Right;
});

function gameLoop() {
    setInterval(play, 1000 / 5);
}

function play() {
    update();
    render();
}

function update() {
    snake.update(apple);
}

function render() {
    createRect(0, 0, canvas.width, canvas.height, 'white');

    for (let i = 0; i < mapWidth; i++) {
        for (let j = 0; j < mapHeight; j++) {
            let color = '#393939';

            if((i + j) % 2 == 0)
                color = '#2E2E2E';

            createRect(i * tileSize, j * tileSize, tileSize, tileSize, color);
        }
    }

    snake.render();
    apple.render();

    scoreDiv.innerHTML = "Score : " + score;
}

let snake = new Snake(
    Math.floor((mapWidth / 2)) * tileSize, 
    Math.floor((mapHeight / 2)) * tileSize
);
    
let apple = new Apple();
