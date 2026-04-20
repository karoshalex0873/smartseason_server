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
exports.deleteUser = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
exports.deleteUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.user) {
        res.status(401).json({
            message: "Not authorized"
        });
        return;
    }
    if (!id) {
        res.status(400).json({
            message: "User id is required"
        });
        return;
    }
    if (req.user.id === id) {
        res.status(400).json({
            message: "You cannot delete your own account"
        });
        return;
    }
    const user = yield prisma_1.default.user.findUnique({
        where: { id },
        include: {
            fields: true,
            updates: true,
            role: true,
        },
    });
    if (!user) {
        res.status(404).json({
            message: "User not found"
        });
        return;
    }
    if (user.fields.length > 0 || user.updates.length > 0) {
        res.status(400).json({
            message: "Cannot delete a user who is assigned to fields or has progress updates"
        });
        return;
    }
    yield prisma_1.default.user.delete({
        where: { id },
    });
    res.status(200).json({
        message: "User deleted successfully"
    });
}));
