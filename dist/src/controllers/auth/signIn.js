"use strict";
// signIn
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const argon2 = __importStar(require("argon2"));
const generateToken_1 = require("../../utils/generateToken");
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
exports.signIn = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Get the user data from the request body
    const { email, password } = req.body;
    // 2. Validate the user data
    if (!email || !password) {
        res.status(400).json({
            message: 'Please provide both email and password'
        });
        return;
    }
    // 3. Find the user by email
    const findUser = yield prisma_1.default.user.findUnique({
        where: { email: email },
        include: { role: true }
    });
    // 4. If user not found, return error
    if (!findUser) {
        res.status(400).json({
            message: 'Invalid email or password'
        });
        return;
    }
    // 5. Verify the password
    const isPasswordMatch = yield argon2.verify(findUser.password, password);
    // 6. If password is incorrect, return error
    if (!isPasswordMatch) {
        res.status(400).json({
            message: 'Invalid email or password'
        });
        return;
    }
    // 7. Generate JWT token
    (0, generateToken_1.generateToken)(res, findUser.id);
    // 8. Return the user data without password
    const { password: _ } = findUser, userWithoutPassword = __rest(findUser, ["password"]);
    res.status(200).json({
        message: 'User logged in successfully',
        user: userWithoutPassword
    });
}));
