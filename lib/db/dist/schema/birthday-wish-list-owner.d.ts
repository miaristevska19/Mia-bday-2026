import { z } from "zod/v4";
export declare const wishListOwnerTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "birthday_wish_list_owner";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "birthday_wish_list_owner";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_id";
            tableName: "birthday_wish_list_owner";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: number | undefined;
        }>;
        claimedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "claimed_at";
            tableName: "birthday_wish_list_owner";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const insertWishListOwnerSchema: z.ZodObject<{
    userId: z.ZodString;
}, {
    out: {};
    in: {};
}>;
export type InsertWishListOwner = z.infer<typeof insertWishListOwnerSchema>;
export type WishListOwner = typeof wishListOwnerTable.$inferSelect;
//# sourceMappingURL=birthday-wish-list-owner.d.ts.map