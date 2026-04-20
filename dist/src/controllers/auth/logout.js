"use strict";
// function to logou
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
exports.logout = void 0;
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
exports.logout = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieSameSite = isProduction ? 'none' : 'strict';
    // Clear the access token cookie
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: cookieSameSite
    });
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: cookieSameSite
    });
    res.status(200).json({
        message: 'User logged out successfully'
    });
}));
