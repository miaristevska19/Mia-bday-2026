import { createInsertSchema } from "drizzle-zod";
import { integer, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { usersTable } from "./auth";

export const wishListOwnerTable = pgTable(
  "birthday_wish_list_owner",
  {
    id: integer("id").primaryKey().notNull().default(1),
    userId: varchar("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    claimedAt: timestamp("claimed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("birthday_wish_list_owner_user_id_idx").on(table.userId)],
);

export const insertWishListOwnerSchema = createInsertSchema(wishListOwnerTable).omit({
  id: true,
  claimedAt: true,
});
export type InsertWishListOwner = z.infer<typeof insertWishListOwnerSchema>;
export type WishListOwner = typeof wishListOwnerTable.$inferSelect;