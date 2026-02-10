"use server";

import { adminOnly } from "@/lib/auth-server";

export type GenerateCouponsResult = {
  created: number;
  skipped: number;
  couponId: string | null;
  promotionCodes: Array<{
    id: string;
    userId: string;
    email: string;
    code: string;
    stripePromotionCodeId: string;
    stripeCouponId: string;
    createdAt: string;
  }>;
};

export const generateStripeCouponsForUsers = adminOnly(
  async function generateStripeCouponsForUsers(
    _adminUser,
    _input: unknown,
  ): Promise<GenerateCouponsResult> {
    throw new Error("Not available in self-hosted mode");
  },
);
