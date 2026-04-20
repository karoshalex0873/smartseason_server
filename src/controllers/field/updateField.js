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
exports.updateField = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
exports.updateField = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. destructure body and get param from request
    const { id } = req.params;
    const { name, cropType, plantingDate, agentId } = req.body;
    if (!req.user) {
        res.status(401).json({
            message: 'Not authorized'
        });
        return;
    }
    // 2. Check if the field exists
    const existingField = yield prisma_1.default.field.findUnique({
        where: { id },
        include: {
            agent: {
                include: { role: true }
            }
        }
    });
    if (!existingField) {
        res.status(404).json({
            message: 'Field not found'
        });
        return;
    }
    const isAdmin = req.user.role.name === 'Admin';
    const isAssignedAgent = req.user.role.name === 'Agent' && existingField.agentId === req.user.id;
    if (!isAdmin && !isAssignedAgent) {
        res.status(403).json({
            message: 'You are not authorized to update this field'
        });
        return;
    }
    if (!isAdmin && agentId !== undefined) {
        res.status(403).json({
            message: 'Only admins can reassign fields'
        });
        return;
    }
    // 3. If agentId is provided, check the he is a field agent
    if (agentId !== undefined && agentId !== '') {
        const assignedAgent = yield prisma_1.default.user.findUnique({
            where: { id: agentId },
            include: { role: true }
        });
        if (!assignedAgent) {
            res.status(404).json({
                message: 'Assigned agent not found'
            });
            return;
        }
        if (assignedAgent.role.name !== 'Agent') {
            res.status(400).json({
                message: 'Selected user is not a field agent'
            });
            return;
        }
    }
    // 4. update the field
    const updatedField = yield prisma_1.default.field.update({
        where: { id },
        data: Object.assign(Object.assign(Object.assign(Object.assign({}, (name && { name })), (cropType && { cropType })), (plantingDate && { plantingDate: new Date(plantingDate) })), (agentId !== undefined
            ? agentId === ''
                ? { agent: { disconnect: true } }
                : {
                    agent: {
                        connect: { id: agentId }
                    }
                }
            : {})),
        include: {
            agent: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            updates: true
        }
    });
    res.status(200).json({
        message: 'Field updated successfully',
        field: updatedField
    });
}));
