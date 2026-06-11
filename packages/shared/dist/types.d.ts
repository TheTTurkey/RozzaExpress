/**
 * Represents a student or user in the RozzaExpress school tuckshop ecosystem.
 */
export interface User {
    id: string;
    name: string;
    /** Must end with @rosmini.school.nz and the local part must start with a digit */
    email: string;
    /** Balance in dollars, represented as a float (e.g. 15.50) */
    walletBalance: number;
    loyaltyPoints: number;
    /** Indicates if the student is certified to deliver orders to classrooms */
    isDeliveryRunner: boolean;
    /** Count of approved voluntary service hours worked by the student */
    voluntaryHours: number;
}
/**
 * Valid states for a tuckshop order.
 */
export type OrderStatus = 'Pending' | 'Preparing' | 'In-Transit' | 'Completed';
/**
 * An item inside the tuckshop's stock/menu.
 */
export interface MenuItem {
    itemId: string;
    name: string;
    /** Price of the item in dollars (e.g., 4.50) */
    price: number;
    stockCount: number;
    /** Array of dietary filters (e.g., 'Gluten-Free', 'Nut-Free', 'Vegetarian', 'Dairy-Free') */
    dietaryFilters: string[];
}
/**
 * An item contained within a student's order.
 */
export interface OrderItem {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
}
/**
 * An order placed by a student.
 */
export interface Order {
    orderId: string;
    studentId: string;
    items: OrderItem[];
    totalPrice: number;
    status: OrderStatus;
    isPreOrder: boolean;
    /** ISO 8601 formatted date-time string indicating target pickup or delivery time */
    pickupTime: string;
    /** ISO 8601 formatted date-time string indicating expected delivery completion, or null if self-pickup */
    deliveryEta: string | null;
}
//# sourceMappingURL=types.d.ts.map