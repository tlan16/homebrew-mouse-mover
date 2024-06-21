import robot from "robotjs";
import sleepSynchronously from "sleep-synchronously";
import { getRandomInt } from "./getRandomInt";

// Speed up the mouse.
robot.setMouseDelay(2);

const main = (offsetX = getRandomInt(), offsetY = getRandomInt()) => {
  robot.moveMouseSmooth(
    robot.getMousePos().x + offsetX,
    robot.getMousePos().y + offsetY,
  );
  sleepSynchronously(getRandomInt(1e3, 5e3));
  main(-offsetX + getRandomInt(), -offsetY + getRandomInt());
};

main();
