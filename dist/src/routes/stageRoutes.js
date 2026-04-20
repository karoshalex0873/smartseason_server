"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trackStage_1 = require("../controllers/stageAndStatus/trackStage");
const protect_1 = require("../middlewares/auth/protect");
const roleGuard_1 = require("../middlewares/auth/roleGuard");
const router = express_1.default.Router();
router.post('/track/:id', protect_1.protect, roleGuard_1.adminOrAgent, trackStage_1.trackStage);
exports.default = router;
