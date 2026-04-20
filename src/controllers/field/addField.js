"use strict";
// function to add new field by admin
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
exports.addField = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
exports.addField = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. destructure field data from request body
    const { name, cropType, plantingDate, agentId } = req.body;
    // 2. validate the field data
    if (!name || !cropType || !plantingDate || !agentId) {
        res.status(400).json({
            message: 'Please provide all the required fields'
        });
        return;
    }
    // 3. check if the field exists
    const fieldExists = yield prisma_1.default.field.findFirst({
        where: { name }
    });
    if (fieldExists) {
        res.status(400).json({
            message: 'Field with this name already exists'
        });
        return;
    }
    // 4. create the field
    const newField = yield prisma_1.default.field.create({
        data: {
            name: name,
            cropType: cropType,
            plantingDate: new Date(plantingDate),
            currentStage: 'planted',
            status: 'active',
            agent: {
                connect: { id: agentId }
            }
        }
    });
    // 5. return the created field
    res.status(201).json({
        message: 'Field created successfully',
        field: newField
    });
}));
