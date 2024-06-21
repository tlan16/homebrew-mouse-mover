import robot from "robotjs";
import sleepSynchronously from "sleep-synchronously";
import { getRandomInt } from "./getRandomInt";

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
  // console.debug({
  //   previousX,
  //   previousY,
  //   idleCounter,
  //   gap,
  // });
  if (gap.x > idleMargin || gap.y > idleMargin) {
    sleepSynchronously( idleDetectionDelay);
    main({ previousX: x, previousY: y, idleCounter: 0 });
    return;
  }
  if (idleCounter < idleThreshold) {
    sleepSynchronously( idleDetectionDelay);
    main({ previousX: x, previousY: y, idleCounter: idleCounter + 1 });
    return;
  }

  robot.moveMouseSmooth(
    (previousX ?? robot.getMousePos().x) + getRandomInt(),
    (previousY ?? robot.getMousePos().y) + getRandomInt(),
  );
  sleepSynchronously( getRandomInt(idleDetectionDelay, 5e3));
  main({ previousX: x, previousY: y, idleCounter: idleCounter });
};

main();
