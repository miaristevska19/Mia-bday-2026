import {
  ClaimWishListOwnerAccessResponse,
  GetWishListOwnerAccessResponse,
} from "@workspace/api-zod";
import { db, wishListOwnerTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

async function getOwner(userId?: string) {
  const [owner] = await db
    .select()
    .from(wishListOwnerTable)
    .where(eq(wishListOwnerTable.id, 1))
    .limit(1);
  return {
    claimed: Boolean(owner),
    isOwner: Boolean(userId && owner?.userId === userId),
  };
}

router.get("/auth/owner", async (req: Request, res: Response) => {
  const access = await getOwner(req.user?.id);
  res.json(GetWishListOwnerAccessResponse.parse(access));
});

router.post("/auth/owner/claim", async (req: Request, res: Response) => {
  if (!req.isAuthenticated() || !req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  await db
    .insert(wishListOwnerTable)
    .values({ id: 1, userId: req.user.id })
    .onConflictDoNothing();

  const access = await getOwner(req.user.id);
  if (!access.isOwner) {
    res.status(409).json({ error: "This wish list already has an owner" });
    return;
  }
  res.json(ClaimWishListOwnerAccessResponse.parse(access));
});

export default router;