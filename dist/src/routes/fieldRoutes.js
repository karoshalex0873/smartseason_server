"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protect_1 = require("../middlewares/auth/protect");
const roleGuard_1 = require("../middlewares/auth/roleGuard");
const addField_1 = require("../controllers/Field/addField");
const deleteField_1 = require("../controllers/Field/deleteField");
const getField_1 = require("../controllers/Field/getField");
const updateField_1 = require("../controllers/Field/updateField");
const router = express_1.default.Router();
// 1. Get all fields
router.get('/', protect_1.protect, roleGuard_1.adminOrAgent, getField_1.getFields);
// 2. Get field by id
router.get('/:id', protect_1.protect, roleGuard_1.adminOrAgent, getField_1.getFieldById);
// 3. Add new field by admin
router.post('/add', protect_1.protect, roleGuard_1.admin, addField_1.addField);
// 4. Update field by admin or assigned agent
router.patch('/update/:id', protect_1.protect, roleGuard_1.adminOrAgent, updateField_1.updateField);
// 5. Delete field by admin
router.delete('/:id', protect_1.protect, roleGuard_1.admin, deleteField_1.deleteField);
exports.default = router;
