"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signUp_1 = require("../controllers/auth/signUp");
const signIn_1 = require("../controllers/auth/signIn");
const logout_1 = require("../controllers/auth/logout");
const getCurrent_1 = require("../controllers/auth/getCurrent");
const protect_1 = require("../middlewares/auth/protect");
const router = express_1.default.Router();
// 1. signup route
router.post('/signup', signUp_1.signUp);
// 2. login route
router.post('/signin', signIn_1.signIn);
// 3 logout route
router.post('/logout', logout_1.logout);
// 4 current user route
router.get('/current', protect_1.protect, getCurrent_1.getCurrentUser);
// 5. route to get roles
router.get('/roles', getCurrent_1.Roles);
exports.default = router;
