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
const prisma_1 = __importDefault(require("../src/lib/prisma"));
// function to seed the roles
function seedRoles() {
    return __awaiter(this, void 0, void 0, function* () {
        const roles = [
            { name: 'Admin' },
            { name: 'Agent' },
        ];
        for (const role of roles) {
            yield prisma_1.default.role.upsert({
                where: { name: role.name },
                update: {},
                create: role
            });
        }
    });
}
console.log('Seeding roles...');
seedRoles()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.$disconnect();
    console.log('Seeding completed successfully.');
}))
    .catch((error) => __awaiter(void 0, void 0, void 0, function* () {
    console.error('Error seeding data:', error);
    yield prisma_1.default.$disconnect();
    process.exit(1);
}));
