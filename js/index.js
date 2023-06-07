window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    car.start();
  };

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const background = new Image();
  background.src = "./images/road.png";
  let backgroundY = 0;
  let gameSpeed = 5;

  class Car {
    constructor() {
      this.x = 230;
      const img = document.createElement("img");
      img.addEventListener("load", () => {
        this.img = img;
      });
      img.src = "./images/car.png";
    }

    draw() {
      ctx.drawImage(
        this.img,
        this.x,
        600,
        this.img.width / 4,
        this.img.height / 4
      );
    }

    moveRight() {
      this.x += 50;
    }

    moveLeft() {
      this.x -= 50;
    }

    start() {
      this.interval = setInterval(updateCanvas, 20);
    }
  }

  class Obstacle {
    constructor(x) {
      this.x = x;
      this.y = 0;
      this.width = 50;
      this.height = 50;
      this.speed = 5; 
    }

    update() {
      this.y += this.speed;
      if (this.y > canvas.height) {
       
        obstacles = obstacles.filter((obstacle) => obstacle !== this);
      }
    }

    draw() {
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  const car = new Car();
  let obstacles = [];
  let obstacleInterval = 2000; 
  let lastObstacleTime = 0;

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowRight":
        car.moveRight();
        break;
      case "ArrowLeft":
        car.moveLeft();
        break;
    }
  });

  function setBackground() {
    ctx.drawImage(background, 0, backgroundY, canvas.width, canvas.height);
    ctx.drawImage(
      background,
      0,
      backgroundY - canvas.height,
      canvas.width,
      canvas.height
    );
  }

  function checkCollision(car, obstacle) {
    return (
      car.x < obstacle.x + obstacle.width &&
      car.x + car.img.width / 4 > obstacle.x &&
      car.y < obstacle.y + obstacle.height &&
      car.y + car.img.height / 4 > obstacle.y
    );
  }

  function gameOver() {
    clearInterval(car.interval);
    alert("Game Over");
  }

  function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setBackground();
    backgroundY += gameSpeed;

    if (backgroundY >= canvas.height) {
      backgroundY = 0;
    }

    const currentTime = Date.now();
    if (currentTime - lastObstacleTime > obstacleInterval) {
      const obstacleX = Math.random() * (canvas.width - 50);
      const obstacle = new Obstacle(obstacleX);
      obstacles.push(obstacle);
      lastObstacleTime = currentTime;
    }

    obstacles.forEach((obstacle) => {
      obstacle.update();
      obstacle.draw();

      if (checkCollision(car, obstacle)) {
        gameOver();
      }
    });

    car.draw();
  }
};
