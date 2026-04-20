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
exports.getUsers = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
exports.getUsers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({
            message: "Not authorized"
        });
        return;
    }
    const [users, roles] = yield Promise.all([
        prisma_1.default.user.findMany({
            include: {
                role: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma_1.default.role.findMany({
            orderBy: {
                name: "asc",
            },
        }),
    ]);
    res.status(200).json({
        message: "Users retrieved successfully",
        users: users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            roleId: user.roleId,
            role: user.role.name,
            createdAt: user.createdAt,
        })),
        roles: roles.map((role) => ({
            id: role.id,
            name: role.name,
        })),
    });
}));
