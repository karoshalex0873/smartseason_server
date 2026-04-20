import express from "express";
import { addUser } from "../controllers/users/addUsers";
import { deleteUser } from "../controllers/users/deleteUser";
import { getUsers } from "../controllers/users/getUsers";
import { updateUser } from "../controllers/users/updateUser";
import { protect } from "../middlewares/auth/protect";
import { admin } from "../middlewares/auth/roleGuard";

const router = express.Router();

router.get("/", protect, admin, getUsers);
router.post("/", protect, admin, addUser);
router.patch("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
