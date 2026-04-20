"use strict";
// function that computes the status of a field based on the data 
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeFieldStatus = void 0;
const enums_1 = require("../../generated/prisma/enums");
// working thershold in days
const STAGE_MAX_DAYS = {
    planted: 14, // 14 days for the seed to germinate
    growing: 90, // 90 days for the plant to grow and mature
    ready: 120, // 120 days for the plant to be ready for harvest
};
// get days since planting
const getDaysSincePlanting = (plantingDate, now) => {
    return Math.floor((now.getTime() - plantingDate.getTime()) / (1000 * 60 * 60 * 24));
};
const computeFieldStatus = ({ currentStage, plantingDate, now = new Date() }) => {
    // 1. if the stage is harvested, the status is completed
    if (currentStage === enums_1.Stage.harvested) {
        return enums_1.FieldStatus.completed;
    }
    // 2. using max threshold for the current stage, compute the status
    const daysSincePlanting = getDaysSincePlanting(plantingDate, now);
    const maxDaysForStage = STAGE_MAX_DAYS[currentStage];
    // 3. flag if the plant takes too long
    if (daysSincePlanting > maxDaysForStage) {
        return enums_1.FieldStatus.atRisk;
    }
    return enums_1.FieldStatus.active;
};
exports.computeFieldStatus = computeFieldStatus;
