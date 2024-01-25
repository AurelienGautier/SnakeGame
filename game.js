const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');

let mapWidth = 20;
let mapHeight = 20;
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
            createRect(element.x, element.y, tileSize - 2, tileSize - 2, 'green');
        }
    }
    
    move() {
        let newSquareBody;

        switch (this.direction) {
            case Direction.Up:
                newSquareBody = {
                    x: this.body[this.body.length - 1].x, 
                    y: this.body[this.body.length - 1].y - tileSize
                };
                break;
            case Direction.Down:
                newSquareBody = {
                    x: this.body[this.body.length - 1].x, 
                    y: this.body[this.body.length - 1].y + tileSize
                };
                break;
            case Direction.Left:
                newSquareBody = {
                    x: this.body[this.body.length - 1].x - tileSize, 
                    y: this.body[this.body.length - 1].y
                };
                break;
            case Direction.Right:
                newSquareBody = {
                    x: this.body[this.body.length - 1].x + tileSize, 
                    y: this.body[this.body.length - 1].y
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
        createRect(this.x, this.y, tileSize - 2, tileSize - 2, 'red');
    }
};

window.onload = () => {
    gameLoop();
}

window.addEventListener('keydown', (event) => {
    if(event.key == 'ArrowUp' && snake.direction !== Direction.Down) 
        snake.direction = Direction.Up;
    else if(event.key == 'ArrowDown' && snake.direction !== Direction.Up)
        snake.direction = Direction.Down;
    else if(event.key == 'ArrowLeft' && snake.direction !== Direction.Right)
        snake.direction = Direction.Left;
    else if(event.key == 'ArrowRight' && snake.direction !== Direction.Left)
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
            createRect(i * tileSize, j * tileSize, tileSize - 2, tileSize - 2, 'black');
        }
    }

    snake.render();
    apple.render();

    scoreDiv.innerHTML = score;
}

let snake = new Snake((mapWidth * tileSize) / 2, (mapHeight * tileSize) / 2);
let apple = new Apple();
