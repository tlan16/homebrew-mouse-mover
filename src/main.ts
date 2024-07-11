import robot from "robotjs";
import sleepSynchronously from "sleep-synchronously";
import { getRandomInt } from "./getRandomInt";
import { logger } from "./utilities/logger";

const idleMargin = 100;
const idleDetectionDelay = 1e3;
const idleThreshold = 4;

// Speed up the mouse.
robot.setMouseDelay(2);

const main = ({
  previousX,
  previousY,
  idleCounter = 0,
}: {
  previousX?: number;
  previousY?: number;
  idleCounter?: number;
} = {}) => {
  const { x, y } = robot.getMousePos();
  const gap = {
    x: Math.abs((previousX ?? x) - x),
    y: Math.abs((previousY ?? y) - y),
  };

  logger.debug({
    idleCounter: `${idleCounter}/${idleThreshold}`,
    gap: `x: ${gap.x}/${idleMargin}, y: ${gap.y}/${idleMargin}`,
    previousX,
    previousY,
  });

  if (gap.x > idleMargin || gap.y > idleMargin) {
    sleepSynchronously(idleDetectionDelay);
    main({ previousX: x, previousY: y, idleCounter: 0 });
    logger.debug("Idle counter reset");
    return;
  }

  if (idleCounter < idleThreshold) {
    sleepSynchronously(idleDetectionDelay);
    main({ previousX: x, previousY: y, idleCounter: idleCounter + 1 });
    logger.debug("Idle counter incremented");
    return;
  }

  logger.debug("Moving mouse");
  robot.moveMouseSmooth(
    (previousX ?? robot.getMousePos().x) + getRandomInt(),
    (previousY ?? robot.getMousePos().y) + getRandomInt(),
  );
  sleepSynchronously(getRandomInt(idleDetectionDelay, 5e3));
  main({ previousX: x, previousY: y, idleCounter: idleCounter });
};

main();
