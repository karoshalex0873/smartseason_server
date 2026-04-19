// function that computes the status of a field based on the data 

import { FieldStatus, Stage } from "../../generated/prisma/enums"

type fieldStatusInput = {
  currentStage: Stage
  plantingDate?: Date
  now?: Date
}

// working thershold in days
const STAGE_MAX_DAYS = {
  planted: 14, // 14 days for the seed to germinate
  growing: 90, // 90 days for the plant to grow and mature
  ready: 120, // 120 days for the plant to be ready for harvest
}

// get days since planting
const getDaysSincePlanting = (plantingDate: Date, now: Date) => {
  return Math.floor((now.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24))
}



export const computeFieldStatus = ({ currentStage, plantingDate, now = new Date() }: fieldStatusInput) => {

  // 1. if the stage is harvested, the status is completed
  if (currentStage === Stage.harvested){
    return FieldStatus.completed
  }

  // 2. using max threshold for the current stage, compute the status
  const daysSincePlanting = getDaysSincePlanting(plantingDate!, now)
  const maxDaysForStage = STAGE_MAX_DAYS[currentStage]

  // 3. flag if the plant takes too long
  if (daysSincePlanting > maxDaysForStage) {
    return FieldStatus.atRisk
  }

  return FieldStatus.active
 }