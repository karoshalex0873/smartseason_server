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
exports.updateUser = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
exports.updateUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, roleId } = req.body;
    if (!id) {
        res.status(400).json({
            message: "User id is required"
        });
        return;
    }
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id },
        include: { role: true },
    });
    if (!existingUser) {
        res.status(404).json({
            message: "User not found"
        });
        return;
    }
    if (email && email !== existingUser.email) {
        const emailExists = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (emailExists) {
            res.status(409).json({
                message: "User with this email already exists"
            });
            return;
        }
    }
    if (roleId) {
        const selectedRole = yield prisma_1.default.role.findUnique({
            where: { id: roleId },
        });
        if (!selectedRole) {
            res.status(400).json({
                message: "Selected role does not exist"
            });
            return;
        }
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { id },
        data: Object.assign(Object.assign(Object.assign({}, (name !== undefined ? { name } : {})), (email !== undefined ? { email } : {})), (roleId !== undefined ? { roleId } : {})),
        include: {
            role: true,
        },
    });
    res.status(200).json({
        message: "User updated successfully",
        user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            roleId: updatedUser.roleId,
            role: updatedUser.role.name,
            createdAt: updatedUser.createdAt,
        }
    });
}));
