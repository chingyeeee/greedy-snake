import { Button, Center, Divider } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from "react";

interface SnakeCube {
  x: number;
  y: number;
}

const PlayGround: React.FC = () => {
  const unit = 20;
  const [isGameStarted, setIsGameStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<SnakeCube[]>([]);
  const directionRef = useRef<"Up" | "Down" | "Right" | "Left">("Right");
  const [score, setScore] = useState<number>(0);
  const [highestScore, setHighestScore] = useState<number>(0);
  const [myFruit, setMyFruit] = useState<SnakeCube>({ x: 0, y: 0 });

  useEffect(() => {
    createSnake();
    generateFruit();
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (isGameStarted) {
      const interval = setInterval(() => {
        moveSnake();
        checkSnakeAction();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isGameStarted, snake]);

  const createSnake = (): void => {
    setSnake([
      { x: 80, y: 0 },
      { x: 60, y: 0 },
      { x: 40, y: 0 },
      { x: 20, y: 0 },
    ]);
  };

  // 控制方向
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

  // 畫snake
  const drawSnake = (ctx: CanvasRenderingContext2D): void => {
    ctx.strokeStyle = "white";

    snake.forEach((bodyPart, idx) => {
      const { x, y } = bodyPart;

      if (idx === 0) {
        ctx.fillStyle = "#9d87ff";
      } else {
        ctx.fillStyle = "#fd9572";
      }

      ctx.fillRect(x, y, unit, unit);
      ctx.strokeRect(x, y, unit, unit);
    });
  };

  // 畫果實
  const drawFruit = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = "yellow";
    ctx.fillRect(myFruit.x, myFruit.y, unit, unit);
  };

  // 控制左右
  const getMoveX = (): number => {
    if (directionRef.current === "Left") return -unit;
    if (directionRef.current === "Right") return unit;
    return 0;
  };

  // 控制上下
  const getMoveY = (): number => {
    if (directionRef.current === "Up") return -unit;
    if (directionRef.current === "Down") return unit;
    return 0;
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

    const canvas = canvasRef.current;
    if (canvas) {
      // 如果超出canvas的右邊，把snake移到canvas的左邊
      if (newHead.x >= canvas.width) {
        newHead.x = 0;
      }
      // 如果snake超出canvas的左邊，把snake移到canvas的右邊
      else if (newHead.x < 0) {
        newHead.x = canvas.width - unit;
      }
      // 如果snake超出canvas的底部，把snake移到canvas的上面
      if (newHead.y >= canvas.height) {
        newHead.y = 0;
      }
      // 如果snake超出canvas的上面，把snake移到canvas的底部
      else if (newHead.y < 0) {
        newHead.y = canvas.height - unit;
      }
    }

    newSnake.unshift(newHead);
    newSnake.pop();

    setSnake(newSnake);

    // checkCollision();
  };

  // 產生隨機數字
  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // 產生隨機的果實
  const generateFruit = (): void => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const x = getRandomNumber(0, canvas.width / unit - 1) * unit;
    const y = getRandomNumber(0, canvas.height / unit - 1) * unit;

    setMyFruit({ x, y });
  };

  // 檢查snake有沒有撞到自己 / 吃到果實
  const checkSnakeAction = (): void => {
    const head = snake[0];

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

  // 增加snake長度
  const growSnake = (): void => {
    const tail = snake[snake.length - 1];
    const newSnake = [...snake, { x: tail.x, y: tail.y }];
    setSnake(newSnake);
  };

  // 重新開始遊戲
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
    setIsGameStarted(false);
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
    <>
      <canvas
        ref={canvasRef}
        id="myCanvas"
        className="m-auto bg-[#242424] border-2 border-[#ebffb5] rounded-md"
        width={700}
        height={500}
      ></canvas>
      <Center height="50px">
        <Divider />
      </Center>
      {!isGameStarted && (
        <Button onClick={() => setIsGameStarted(true)}>Start Game</Button>
      )}
      <div className="text-white">Game Score: {score}</div>
      <div className="text-white">Highest Score: {highestScore}</div>
    </>
  );
};

export default PlayGround;
