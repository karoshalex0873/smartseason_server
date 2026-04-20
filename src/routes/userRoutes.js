"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addUsers_1 = require("../controllers/users/addUsers");
const deleteUser_1 = require("../controllers/users/deleteUser");
const getUsers_1 = require("../controllers/users/getUsers");
const updateUser_1 = require("../controllers/users/updateUser");
const protect_1 = require("../middlewares/auth/protect");
const roleGuard_1 = require("../middlewares/auth/roleGuard");
const router = express_1.default.Router();
router.get("/", protect_1.protect, roleGuard_1.admin, getUsers_1.getUsers);
router.post("/", protect_1.protect, roleGuard_1.admin, addUsers_1.addUser);
router.patch("/:id", protect_1.protect, roleGuard_1.admin, updateUser_1.updateUser);
router.delete("/:id", protect_1.protect, roleGuard_1.admin, deleteUser_1.deleteUser);
exports.default = router;
