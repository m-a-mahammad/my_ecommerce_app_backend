import rateLimit from "express-rate-limit";

export const readLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: "🚫 طلبات كثيرة جدًا، برجاء إعادة المحاولة لاحقًا.",
});

export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "🚫 عدد كبير من محاولات التعديل، تم إيقافك مؤقتًا.",
});
