"use strict";
// sing up controller
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
exports.signUp = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const argon2 = __importStar(require("argon2"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Get the user data from the request body
    const { name, email, password, roleId } = req.body;
    // 2. Validate the user data
    if (!name || !email || !password || !roleId) {
        return res.status(400).json({
            message: 'Please provide all the required fields, including roleId'
        });
    }
    // 3. Hash the password
    const hashedPassword = yield argon2.hash(password);
    // 4. Check if the user already exists
    const userExists = yield prisma_1.default.user.findUnique({
        where: { email: email }
    });
    if (userExists) {
        return res.status(400).json({
            message: 'User already exists'
        });
    }
    // 5. Make sure the selected role exists
    const selectedRole = yield prisma_1.default.role.findUnique({
        where: { id: roleId }
    });
    if (!selectedRole) {
        return res.status(400).json({
            message: 'Selected role does not exist'
        });
    }
    // 6. Create the user with the selected role
    const newUser = yield prisma_1.default.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
            roleId: selectedRole.id
        },
        include: {
            role: true
        }
    });
    // 7. Return the created user
    return res.status(201).json({
        message: 'User created successfully',
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role.name
        }
    });
});
exports.signUp = signUp;
