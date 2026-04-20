"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.addUser = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const argon2 = __importStar(require("argon2"));
exports.addUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. get user data from request body
    const { name, email, roleId } = req.body;
    // 2. validate user data
    if (!name || !email || !roleId) {
        res.status(400).json({
            message: "All fields are required"
        });
        return;
    }
    // check if user with the same email already exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (existingUser) {
        res.status(409).json({
            message: "User with this email already exists"
        });
        return;
    }
    // create a default password and hash it before saving to the database
    const defaultPassword = "password123";
    const hashedPassword = yield argon2.hash(defaultPassword);
    const selectedRole = yield prisma_1.default.role.findUnique({
        where: {
            id: roleId,
        },
    });
    if (!selectedRole) {
        res.status(400).json({
            message: "Selected role does not exist"
        });
        return;
    }
    // 3. create new user in the database
    const newUser = yield prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            roleId: selectedRole.id,
        },
        include: {
            role: true,
        },
    });
    res.status(201).json({
        message: "User created successfully",
        temporaryPassword: defaultPassword,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            roleId: newUser.roleId,
            role: newUser.role.name,
            createdAt: newUser.createdAt,
        }
    });
}));
