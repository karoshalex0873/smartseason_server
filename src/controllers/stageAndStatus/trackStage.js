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
exports.trackStage = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const statusCompute_1 = require("../../services/statusCompute");
exports.trackStage = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // 1. get field id
    const { id } = req.params;
    // 2. get stage and note from the body
    const { stage, notes } = req.body;
    // 3.validate
    if (!stage) {
        res.status(400).json({
            message: 'Stage is required'
        });
        return;
    }
    // 4. find the field
    const field = yield prisma_1.default.field.findUnique({
        where: { id },
        include: {
            agent: {
                select: {
                    name: true,
                    id: true
                }
            }
        }
    });
    if (!field) {
        return res.status(404).json({
            message: 'Field not found'
        });
    }
    // 5. Check if current user can update  the field stage (only assigned agent or admin can update)
    if (field.agentId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role.name) !== 'Admin') {
        return res.status(403).json({
            message: 'You are not authorized to update the stage of this field'
        });
    }
    // 6. compute status 
    const status = (0, statusCompute_1.computeFieldStatus)({
        currentStage: stage,
        plantingDate: field.plantingDate
    });
    // 7. use a transaction to update
    const [fieldUpdate, updatedField] = yield prisma_1.default.$transaction([
        prisma_1.default.fieldUpdate.create({
            data: {
                fieldId: field.id,
                agentId: req.user.id,
                stage,
                notes
            }
        }),
        prisma_1.default.field.update({
            where: { id: field.id },
            data: {
                currentStage: stage,
                status
            },
            include: {
                agent: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                updates: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                }
            }
        })
    ]);
    res.status(200).json({
        message: 'Field stage updated successfully',
        update: fieldUpdate,
        field: updatedField
    });
}));
