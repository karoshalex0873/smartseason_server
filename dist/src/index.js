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
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const prisma_1 = __importDefault(require("./lib/prisma"));
const fieldRoutes_1 = __importDefault(require("./routes/fieldRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const stageRoutes_1 = __importDefault(require("./routes/stageRoutes"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// config the dotenv file
dotenv_1.default.config();
// 1. Instance of express
const app = (0, express_1.default)();
// 2. Load port from .env file
const PORT = process.env.PORT || 3000;
// 3. Middleware to parse JSON bodies
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// cors origins and  methods 
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));
// 4. Api welcome to test
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'welcome to Smart Season API'
    });
});
// 5. Routes layer
// 5.1. Auth routes
app.use('/auth', authRoutes_1.default);
// 5.2. Field routes
app.use('/field', fieldRoutes_1.default);
// 5.3. track status and stages routes
app.use('/stage', stageRoutes_1.default);
// 5.4. User routes
app.use('/users', userRoutes_1.default);
// 5.4. Episode routes
// 5.5. Comment routes
// 6. Data base connection
// 7. Start the server after the database connection succeeds
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.$connect();
        console.log('Database connection established ');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to connect to the database. Server startup aborted.');
        console.error(error);
        process.exit(1);
    }
});
void startServer();
