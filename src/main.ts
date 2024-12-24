import { logger } from "./utilities/logger";
import robot from "robotjs";
import random from "lodash.random";

const idleMargin = 100;
const idleDetectionDelay = 1e3;
const idleThreshold = 4;

let previousX: number | undefined = undefined;
let previousY: number | undefined = undefined;
let idleCounter = 0;

const main = async () => {
  const { x, y } = robot.getMousePos();
  const gap = {
    x: Math.abs((previousX ?? x) - x),
    y: Math.abs((previousY ?? y) - y),
  };
  previousX = x;
  previousY = y;

  logger.debug({
    idleCounter: `${idleCounter}/${idleThreshold}`,
    gap: `x: ${gap.x}/${idleMargin}, y: ${gap.y}/${idleMargin}`,
    previousX,
    previousY,
  });

  if (gap.x > idleMargin || gap.y > idleMargin) {
    await new Promise((resolve) => setTimeout(resolve, idleDetectionDelay));
    idleCounter = 0;
    logger.debug("Idle counter reset");
    return;
  }

  if (idleCounter < idleThreshold) {
    await new Promise((resolve) => setTimeout(resolve, idleDetectionDelay));
    idleCounter = idleCounter + 1;
    logger.debug("Idle counter incremented");
    return;
  }

  const computeNewPosition = (currentPossition: { x: number, y: number }) => {
    let x: number;
    let y: number;
    let circuitBreaker = 0;

    do {
      x = currentPossition.x + random(robot.getScreenSize().width * -0.01, robot.getScreenSize().width * 0.01);
      y = currentPossition.y + random(robot.getScreenSize().height * -0.01, robot.getScreenSize().height * 0.01);
      circuitBreaker = circuitBreaker + 1;
    } while (
      circuitBreaker < 100 ||
      (!x || !y) ||
      !(x > robot.getScreenSize().width * 0.1 &&
        x < robot.getScreenSize().width * 0.9 &&
        y > robot.getScreenSize().height * 0.1 &&
        y < robot.getScreenSize().height * 0.9)
    );

    logger.debug(`New position: x: ${x}, y: ${y}.`);
    return { x, y };
  };

  const newPosition = computeNewPosition({ x, y });
  logger.debug(`Moving mouse to x: ${newPosition.x}, y: ${newPosition.y}.`);
  robot.moveMouseSmooth(newPosition.x, newPosition.y);
  await new Promise((resolve) => setTimeout(resolve, random(idleDetectionDelay, 5e3)));
};

// noinspection InfiniteLoopJS
while (true) {
  robot.setMouseDelay(2);
  await main();
}
