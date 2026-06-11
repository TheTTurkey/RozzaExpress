import { z } from 'zod';
/**
 * Validates that an email is a valid format, ends with `@rosmini.school.nz`,
 * AND starts with a student ID number (e.g., 24015@rosmini.school.nz).
 */
export declare const RosminiEmailSchema: z.ZodEffects<z.ZodString, string, string>;
/**
 * Zod validation schema for a User.
 */
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodEffects<z.ZodString, string, string>;
    walletBalance: z.ZodNumber;
    loyaltyPoints: z.ZodNumber;
    isDeliveryRunner: z.ZodBoolean;
    voluntaryHours: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    email: string;
    walletBalance: number;
    loyaltyPoints: number;
    isDeliveryRunner: boolean;
    voluntaryHours: number;
}, {
    id: string;
    name: string;
    email: string;
    walletBalance: number;
    loyaltyPoints: number;
    isDeliveryRunner: boolean;
    voluntaryHours: number;
}>;
/**
 * Zod validation schema for a Menu Item.
 */
export declare const MenuItemSchema: z.ZodObject<{
    itemId: z.ZodString;
    name: z.ZodString;
    price: z.ZodNumber;
    stockCount: z.ZodNumber;
    dietaryFilters: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    itemId: string;
    price: number;
    stockCount: number;
    dietaryFilters: string[];
}, {
    name: string;
    itemId: string;
    price: number;
    stockCount: number;
    dietaryFilters: string[];
}>;
/**
 * Zod validation schema for an item inside an order.
 */
export declare const OrderItemSchema: z.ZodObject<{
    itemId: z.ZodString;
    name: z.ZodString;
    price: z.ZodNumber;
    quantity: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    itemId: string;
    price: number;
    quantity: number;
}, {
    name: string;
    itemId: string;
    price: number;
    quantity: number;
}>;
/**
 * Zod validation schema for an Order.
 */
export declare const OrderSchema: z.ZodObject<{
    orderId: z.ZodString;
    studentId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        itemId: z.ZodString;
        name: z.ZodString;
        price: z.ZodNumber;
        quantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        itemId: string;
        price: number;
        quantity: number;
    }, {
        name: string;
        itemId: string;
        price: number;
        quantity: number;
    }>, "many">;
    totalPrice: z.ZodNumber;
    status: z.ZodEnum<["Pending", "Preparing", "In-Transit", "Completed"]>;
    isPreOrder: z.ZodBoolean;
    pickupTime: z.ZodString;
    deliveryEta: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "Pending" | "Preparing" | "In-Transit" | "Completed";
    orderId: string;
    studentId: string;
    items: {
        name: string;
        itemId: string;
        price: number;
        quantity: number;
    }[];
    totalPrice: number;
    isPreOrder: boolean;
    pickupTime: string;
    deliveryEta: string | null;
}, {
    status: "Pending" | "Preparing" | "In-Transit" | "Completed";
    orderId: string;
    studentId: string;
    items: {
        name: string;
        itemId: string;
        price: number;
        quantity: number;
    }[];
    totalPrice: number;
    isPreOrder: boolean;
    pickupTime: string;
    deliveryEta: string | null;
}>;
export type RosminiEmail = z.infer<typeof RosminiEmailSchema>;
export type UserValidated = z.infer<typeof UserSchema>;
export type MenuItemValidated = z.infer<typeof MenuItemSchema>;
export type OrderValidated = z.infer<typeof OrderSchema>;
//# sourceMappingURL=validation.d.ts.map