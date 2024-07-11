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

  logger.debug("Moving mouse");
  vm.moveMouseSmooth(
    (previousX ?? vm.getMousePos().x) + getRandomInt(),
    (previousY ?? vm.getMousePos().y) + getRandomInt(),
  );
  await new Promise((resolve) => setTimeout(resolve, getRandomInt(idleDetectionDelay, 5e3)));
};

while (true) {
  vm.setMouseDelay(2);
  await main();
}
