"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
// funtion to generate token using jwt
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const generateToken = (res, userId) => {
    const jwt_secret = process.env.JWT_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!jwt_secret || !refreshSecret) {
        throw new Error('JWT_SECRET and REFRESH_TOKEN_SECRET must be defined in the .env file');
    }
    try {
        const accessToken = jsonwebtoken_1.default.sign({ userId }, jwt_secret, { expiresIn: "30min" });
        const refreshToken = jsonwebtoken_1.default.sign({ userId }, refreshSecret, { expiresIn: "7d" });
        // Set the access token in an HTTP-only cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
            maxAge: 30 * 60 * 1000,
        });
        //  Set the refresh token in a cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
    catch (error) {
        console.error('Error generating tokens:', error);
        throw new Error('Failed to generate tokens');
    }
};
exports.generateToken = generateToken;
