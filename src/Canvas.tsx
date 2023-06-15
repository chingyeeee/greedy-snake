import React, { useState, useEffect, useRef } from "react";

interface SnakePart {
  x: number;
  y: number;
}

const Game: React.FC = () => {
  const unit = 20;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<SnakePart[]>([]);
  const [myFruit, setMyFruit] = useState<SnakePart>({ x: 0, y: 0 });
  const directionRef = useRef<"Up" | "Down" | "Left" | "Right">("Right");
  const [score, setScore] = useState<number>(0);
  const [highestScore, setHighestScore] = useState<number>(0);

  useEffect(() => {
    createSnake();
    generateFruit();
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      moveSnake();
      checkCollision();
    }, 100);
    return () => clearInterval(interval);
  }, [snake]);

  useEffect(() => {
    localStorage.setItem("highestScore", highestScore.toString());
  }, [highestScore]);

  const createSnake = (): void => {
    setSnake([
      { x: 80, y: 0 },
      { x: 60, y: 0 },
      { x: 40, y: 0 },
      { x: 20, y: 0 },
    ]);
  };

  const handleKeyPress = (e: KeyboardEvent): void => {
    if (e.code === "ArrowUp" && directionRef.current !== "Down") {
      directionRef.current = "Up";
    } else if (e.code === "ArrowDown" && directionRef.current !== "Up") {
      directionRef.current = "Down";
    } else if (e.code === "ArrowLeft" && directionRef.current !== "Right") {
      directionRef.current = "Left";
    } else if (e.code === "ArrowRight" && directionRef.current !== "Left") {
      directionRef.current = "Right";
    }
  };

  const drawSnake = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = "lightgreen";
    ctx.strokeStyle = "white";

    snake.forEach((bodyPart) => {
      const { x, y } = bodyPart;

      ctx.fillRect(x, y, unit, unit);
      ctx.strokeRect(x, y, unit, unit);
    });
  };

  const drawFruit = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = "yellow";
    ctx.fillRect(myFruit.x, myFruit.y, unit, unit);
  };

  const moveSnake = (): void => {
    const newSnake = [...snake];
    const head = newSnake[0];

    const moveX = getMoveX();
    const moveY = getMoveY();

    const newHead = {
      x: head.x + moveX,
      y: head.y + moveY,
    };

    newSnake.unshift(newHead);
    newSnake.pop();

    setSnake(newSnake);

    checkCollision();
  };

  const getMoveX = (): number => {
    if (directionRef.current === "Left") return -unit;
    if (directionRef.current === "Right") return unit;
    return 0;
  };

  const getMoveY = (): number => {
    if (directionRef.current === "Up") return -unit;
    if (directionRef.current === "Down") return unit;
    return 0;
  };

  const growSnake = (): void => {
    const tail = snake[snake.length - 1];
    const newSnake = [...snake, { x: tail.x, y: tail.y }];
    setSnake(newSnake);
  };

  const checkCollision = (): void => {
    const head = snake[0];

    if (
      head.x >= canvasRef.current!.width ||
      head.x < 0 ||
      head.y >= canvasRef.current!.height ||
      head.y < 0
    ) {
      resetGame();
    }

    snake.slice(1).forEach((bodyPart) => {
      if (bodyPart.x === head.x && bodyPart.y === head.y) {
        resetGame();
      }
    });

    if (head.x === myFruit.x && head.y === myFruit.y) {
      setScore((prevScore) => prevScore + 10);
      generateFruit();
      growSnake();
    }
  };

  const resetGame = (): void => {
    setScore(0);
    setSnake([
      { x: 80, y: 0 },
      { x: 60, y: 0 },
      { x: 40, y: 0 },
      { x: 20, y: 0 },
    ]);
    directionRef.current = "Right";
    setHighestScore(Math.max(score, highestScore));
  };

  const generateFruit = (): void => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const x = getRandomNumber(0, canvas.width / unit - 1) * unit;
    const y = getRandomNumber(0, canvas.height / unit - 1) * unit;

    setMyFruit({ x, y });
  };

  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake(ctx);
    drawFruit(ctx);
  }, [snake, myFruit]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="myCanvas"
        className="m-auto bg-[#242424] border-2 border-[#ebffb5] rounded-md"
        width={700}
        height={500}
      ></canvas>
      <div>Game Score: {score}</div>
      <div>Highest Score: {highestScore}</div>
    </div>
  );
};

export default Game;
