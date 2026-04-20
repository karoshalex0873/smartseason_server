"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrAgent = exports.agent = exports.admin = void 0;
const asyncHandler_1 = __importDefault(require("../asyncHandler"));
const roleGuard = (allowedRoles) => {
    return (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.user || !allowedRoles.includes(req.user.role.name)) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        console.log(`User role: ${req.user.role.name}, Allowed roles: ${allowedRoles.join(", ")}`);
        next();
    }));
};
const admin = roleGuard(['Admin']);
exports.admin = admin;
const agent = roleGuard(['Agent']);
exports.agent = agent;
const adminOrAgent = roleGuard(['Admin', 'Agent']);
exports.adminOrAgent = adminOrAgent;
