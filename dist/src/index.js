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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const prisma_1 = __importDefault(require("./lib/prisma"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const fieldRoutes_1 = __importDefault(require("./routes/fieldRoutes"));
const stageRoutes_1 = __importDefault(require("./routes/stageRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// Load env
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// cors
const parseOrigins = (value) => (value === null || value === void 0 ? void 0 : value.split(',').map(o => o.trim()).filter(Boolean)) || [];
const allowedOrigins = parseOrigins(process.env.CORS_ORIGINS);
console.log('Allowed Origins:', allowedOrigins);
// middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.warn(`CORS blocked: ${origin}`);
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
// test route
app.get('/', (_, res) => {
    res.json({ message: 'SmartSeason API is running 🚀' });
});
// routes
app.use('/auth', authRoutes_1.default);
app.use('/field', fieldRoutes_1.default);
app.use('/stage', stageRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🚀 Server running on port ${PORT}`);
    // DB connects AFTER server is alive (CRITICAL FIX)
    try {
        yield prisma_1.default.$connect();
        console.log('🔥 Database connected');
    }
    catch (error) {
        console.error('❌ DB connection failed (non-fatal):', error);
    }
}));
