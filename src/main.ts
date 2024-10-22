import { getRandomInt } from "./getRandomInt";
import { logger } from "./utilities/logger";
import vm from "./vm";

const idleMargin = 100;
const idleDetectionDelay = 1e3;
const idleThreshold = 4;

let previousX: number | undefined = undefined;
let previousY: number | undefined = undefined;
let idleCounter = 0;

const main = async () => {
  const { x, y } = vm.getMousePos();
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
    const x = currentPossition.x + getRandomInt() * 10;
    let y = currentPossition.y + getRandomInt() * 10;
    const topBarMargin = Math.abs(vm.getScreenSize().height * 0.1);
    if (y <= topBarMargin) y = y + 25;
    logger.debug(`New position: x: ${x}, y: ${y}. Top bar margin: ${topBarMargin}`);
    return { x, y };
  };

  logger.debug("Moving mouse");
  const newPosition = computeNewPosition({ x, y });
  vm.moveMouseSmooth(newPosition.x, newPosition.y);
  await new Promise((resolve) => setTimeout(resolve, getRandomInt(idleDetectionDelay, 5e3)));
};

// noinspection InfiniteLoopJS
while (true) {
  vm.setMouseDelay(2);
  await main();
}
