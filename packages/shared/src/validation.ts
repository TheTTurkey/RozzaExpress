import { z } from 'zod';

/**
 * Validates that an email is a valid format, ends with `@rosmini.school.nz`,
 * AND starts with a student ID number (e.g., 24015@rosmini.school.nz).
 */
export const RosminiEmailSchema = z
  .string()
  .email('Invalid email address format')
  .refine(
    (email) => {
      const parts = email.toLowerCase().split('@');
      if (parts.length !== 2) return false;
      const [localPart, domain] = parts;
      
      const isCorrectDomain = domain === 'rosmini.school.nz';
      const startsWithDigit = /^\d/.test(localPart);
      
      return isCorrectDomain && startsWithDigit;
    },
    {
      message: 'Email must be a Rosmini College student email starting with a number (e.g., 24015@rosmini.school.nz)',
    }
  );

/**
 * Zod validation schema for a User.
 */
export const UserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: RosminiEmailSchema,
  walletBalance: z.number().nonnegative('Wallet balance cannot be negative'),
  loyaltyPoints: z.number().int().nonnegative('Loyalty points must be a non-negative integer'),
  isDeliveryRunner: z.boolean(),
  voluntaryHours: z.number().nonnegative('Voluntary hours cannot be negative'),
});

/**
 * Zod validation schema for a Menu Item.
 */
export const MenuItemSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  name: z.string().min(1, 'Item name is required'),
  price: z.number().positive('Price must be greater than zero'),
  stockCount: z.number().int().nonnegative('Stock count cannot be negative'),
  dietaryFilters: z.array(z.string()),
});

/**
 * Zod validation schema for an item inside an order.
 */
export const OrderItemSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  name: z.string().min(1, 'Item name is required'),
  price: z.number().positive('Price must be greater than zero'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

/**
 * Zod validation schema for an Order.
 */
export const OrderSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  studentId: z.string().min(1, 'Student ID is required'),
  items: z.array(OrderItemSchema).min(1, 'Order must contain at least one item'),
  totalPrice: z.number().nonnegative('Total price cannot be negative'),
  status: z.enum(['Pending', 'Preparing', 'In-Transit', 'Completed']),
  isPreOrder: z.boolean(),
  pickupTime: z.string().min(1, 'Pickup/Delivery target time is required'),
  deliveryEta: z.string().nullable(),
});
export type RosminiEmail = z.infer<typeof RosminiEmailSchema>;
export type UserValidated = z.infer<typeof UserSchema>;
export type MenuItemValidated = z.infer<typeof MenuItemSchema>;
export type OrderValidated = z.infer<typeof OrderSchema>;
