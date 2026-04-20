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
exports.deleteField = void 0;
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
exports.deleteField = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.user) {
        res.status(401).json({
            message: 'Not authorized'
        });
        return;
    }
    if (req.user.role.name !== 'Admin') {
        res.status(403).json({
            message: 'Access denied. Admin only.'
        });
        return;
    }
    if (!id) {
        res.status(400).json({
            message: 'Please provide the field id'
        });
        return;
    }
    const field = yield prisma_1.default.field.findUnique({
        where: { id }
    });
    if (!field) {
        res.status(404).json({
            message: 'Field not found'
        });
        return;
    }
    yield prisma_1.default.fieldUpdate.deleteMany({
        where: { fieldId: id }
    });
    yield prisma_1.default.field.delete({
        where: { id }
    });
    res.status(200).json({
        message: 'Field deleted successfully'
    });
}));
