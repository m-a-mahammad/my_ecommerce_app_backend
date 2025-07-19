import express from "express";
import {
  /* getAllPaymentData, */
  createIntentionAndLinkToUser,
} from "../controllers/paymentController";
import { protect } from "../middleware/authMiddleware";
// import { readLimiter, writeLimiter } from "../middleware/limiter";

const router = express.Router();

router.use(express.json());

// router.get("/transaction/:transaction_id", getAllPaymentData);
router.post("/create-payment", protect, createIntentionAndLinkToUser);

export default router;
