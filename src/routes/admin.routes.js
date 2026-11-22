import { Router } from "express";
import {
    getAllUsers,
    updateUserRole,
    getAllServices,
    updateApproval,
    getAllBookings,
    getAllPayments,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyAdmin } from "../middlewares/verifyRole.js";

const router = Router();

// every admin route needs a valid token AND the admin role
router.use(verifyToken, verifyAdmin);

router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.get("/services", getAllServices);
router.patch("/services/:id/approval", updateApproval);
router.get("/bookings", getAllBookings);
router.get("/payments", getAllPayments);

export default router;