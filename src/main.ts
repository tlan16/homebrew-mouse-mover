import { logger } from "./utilities/logger"
import robot from "robotjs"
import random from "lodash.random"

const idleDetectionDelay = 1e3
const idleThreshold = 4

let previousX: number | undefined = undefined
let previousY: number | undefined = undefined
let idleCounter = 0

// noinspection InfiniteLoopJS
while (true) {
  robot.setMouseDelay(2)
  await main()
}

async function main() {
  const { x, y } = robot.getMousePos()
  const gap = {
    x: Math.abs((previousX ?? x) - x),
    y: Math.abs((previousY ?? y) - y),
  }
  previousX = x
  previousY = y
  const idleMarginX = robot.getScreenSize().width * 0.1
  const idleMarginY = robot.getScreenSize().height * 0.1

  logger.debug({
    idleCounter: `${idleCounter}/${idleThreshold}`,
    gap: `x: ${gap.x}/${idleMarginX}, y: ${gap.y}/${idleMarginY}`,
    previousX,
    previousY,
  })

  if (gap.x > idleMarginX || gap.y > idleMarginY) {
    await new Promise((resolve) => setTimeout(resolve, idleDetectionDelay))
    idleCounter = 0
    logger.debug("Idle counter reset")
    return
  }

  if (idleCounter < idleThreshold) {
    await new Promise((resolve) => setTimeout(resolve, idleDetectionDelay))
    idleCounter = idleCounter + 1
    logger.debug("Idle counter incremented")
    return
  }

  const computeNewPosition = (currentPossition: { x: number, y: number }) => {
    let x: number
    let y: number
    let circuitBreaker = 0

    do {
      x = currentPossition.x + random(robot.getScreenSize().width * -0.1, robot.getScreenSize().width * 0.1, false)
      y = currentPossition.y + random(robot.getScreenSize().height * -0.1, robot.getScreenSize().height * 0.1, false)
      circuitBreaker = circuitBreaker + 1
    } while (
      circuitBreaker < 100 ||
      (!x || !y) ||
      !(x > robot.getScreenSize().width * 0.1 &&
        x < robot.getScreenSize().width * 0.9 &&
        y > robot.getScreenSize().height * 0.1 &&
        y < robot.getScreenSize().height * 0.9)
    )

    return { x, y }
  }

  const newPosition = computeNewPosition({ x, y })
  logger.debug(`Moving mouse to x: ${newPosition.x}, y: ${newPosition.y}.`)
  robot.moveMouseSmooth(newPosition.x, newPosition.y)
  await new Promise((resolve) => setTimeout(resolve, random(idleDetectionDelay, 5e3, false)))
}
