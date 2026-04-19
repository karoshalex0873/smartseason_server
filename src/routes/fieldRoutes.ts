import express from "express"
import { protect } from "../middlewares/auth/protect"
import { admin, adminOrAgent } from "../middlewares/auth/roleGuard"
import { addField } from "../controllers/Field/addField"
import { getFieldById, getFields } from "../controllers/Field/getField"
import { updateField } from "../controllers/Field/updateField"


const router = express.Router()

// 1. Get all fields
router.get('/', protect, adminOrAgent, getFields)

// 2. Get field by id
router.get('/:id', protect, adminOrAgent, getFieldById)

// 3. Add new field by admin
router.post('/add', protect, admin, addField)

// 4. Update field by admin
router.patch('/update/:id', protect, admin, updateField)



export default router
