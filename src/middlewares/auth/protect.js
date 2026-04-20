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
exports.protect = void 0;
const asyncHandler_1 = __importDefault(require("../asyncHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
exports.protect = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //  1.Get token from cookies
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    if (!token) {
        res.status(401).json({
            message: 'Not authorized, no token'
        });
        return;
    }
    try {
        //2. verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 3. Find user from decoded token
        const user = yield prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            include: { role: true }
        });
        if (!user) {
            res.status(401).json({
                message: 'Not authorized, user not found'
            });
            return;
        }
        // 4. attach user to request object
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: 'Not authorized, token failed'
        });
        return;
    }
}));
