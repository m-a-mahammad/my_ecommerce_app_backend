// controllers/paymentController
import fetch from "node-fetch";
import User from "../models/User";
import Cart from "../models/Cart";
import { Request, Response } from "express";
import { CartItem } from "../types/cart.types";
import env from "../types/env";

export const createIntentionAndLinkToUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "غير مصرح" });
      return;
    }

    // 🛒 اسحب السلة من MongoDB
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ error: "السلة فارغة" });
      return;
    }
    if (cart && typeof cart === "object") {
      // 💰 احسب الإجمالي من المنتجات داخل السلة
      const totalEGP = cart.items.reduce((acc: number, item: CartItem) => {
        if (
          item.product &&
          typeof item.product === "object" &&
          "price" in item.product
        ) {
          const price = item.product.price;
          return acc + price * item.quantity;
        } else {
          return acc;
        }
      }, 0);
      if (typeof totalEGP === "number") {
        const amount = Number(totalEGP * 100); // لتحويله إلى قروش (paymob cents)

        const paymentMethodId = Number(req.body.payment_methods);

        if (!amount || amount < 100 || isNaN(paymentMethodId)) {
          res.status(400).json({ error: "Invalid payment parameters" });
          return;
        }

        const response = await fetch(
          "https://accept.paymob.com/v1/intention/",
          {
            method: "POST",
            headers: {
              Authorization: `Token ${env.PAYMOB_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount,
              currency: "EGP",
              payment_methods: [paymentMethodId],
              billing_data: req.body.billing_data,
            }),
          }
        );

        const raw = await response.text();
        console.error("🧨 Paymob raw response:", raw);

        let data;
        try {
          data = JSON.parse(raw);
        } catch (e) {
          res.status(502).json({ error: "Paymob returned invalid JSON", raw });
          return;
        }

        if (!response.ok || !data.client_secret) {
          res
            .status(502)
            .json({ error: "Failed to get client_secret from Paymob" });
          return;
        }

        await User.findByIdAndUpdate(userId, {
          paymob_client_secret: data.client_secret,
          last_intention_id: data.id,
        });

        res.status(200).json({
          message: "تم توليد client_secret وربطه بالمستخدم",
          client_secret: data.client_secret,
        });
      }
    }
  } catch (err) {
    console.error("❌ Error creating client_secret:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
