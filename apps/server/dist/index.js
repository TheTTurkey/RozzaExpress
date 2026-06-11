import express from 'express';
import cors from 'cors';
import { OrderSchema, RosminiEmailSchema } from '@rozza-express/shared';
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
// In-memory mock database
let users = [
    {
        id: 'STU-22235',
        name: 'Josh Tuilagi',
        email: '22235@rosmini.school.nz',
        walletBalance: 25.50,
        loyaltyPoints: 425,
        isDeliveryRunner: true,
        voluntaryHours: 8.0
    }
];
let menuItems = [
    { itemId: 'menu-1', name: 'Butter Chicken & Rice', price: 6.50, stockCount: 15, dietaryFilters: ['Gluten-Free'] },
    { itemId: 'menu-2', name: 'Mince & Cheese Pie', price: 4.50, stockCount: 4, dietaryFilters: ['Gluten', 'Dairy'] },
    { itemId: 'menu-3', name: 'Vegetarian Sushi Roll', price: 5.00, stockCount: 0, dietaryFilters: ['Gluten-Free', 'Vegetarian'] },
    { itemId: 'menu-4', name: 'Rosmini College Sausage Roll', price: 3.20, stockCount: 35, dietaryFilters: ['Gluten'] }
];
let orders = [];
// --- API Routes matching the contract ---
// 1. POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    const { email, name } = req.body;
    // Run shared email validation
    const emailCheck = RosminiEmailSchema.safeParse(email);
    if (!emailCheck.success) {
        return res.status(400).json({
            error: 'Validation failed',
            details: emailCheck.error.errors
        });
    }
    // Look up existing user or register a mock one
    const cleanEmail = email.toLowerCase().trim();
    let user = users.find(u => u.email === cleanEmail);
    if (!user) {
        const localPart = cleanEmail.split('@')[0];
        user = {
            id: `STU-${localPart}`,
            name: name || 'Student User',
            email: cleanEmail,
            walletBalance: 20.00, // Preloaded sign-up balance
            loyaltyPoints: 0,
            isDeliveryRunner: false,
            voluntaryHours: 0
        };
        users.push(user);
    }
    res.json({
        token: 'jwt_mock_token_for_student',
        user
    });
});
// 2. GET /api/menu
app.get('/api/menu', (req, res) => {
    res.json(menuItems);
});
// 3. POST /api/orders/create
app.post('/api/orders/create', (req, res) => {
    // Extract fields and inject mock ID/pricing check for validation
    const orderPayload = {
        orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        ...req.body
    };
    const result = OrderSchema.safeParse(orderPayload);
    if (!result.success) {
        return res.status(400).json({
            error: 'Validation failed',
            details: result.error.errors
        });
    }
    const newOrder = result.data;
    // Verify wallet balance of student
    const student = users.find(u => u.id === newOrder.studentId);
    if (!student) {
        return res.status(404).json({ error: 'Student profile not found.' });
    }
    if (student.walletBalance < newOrder.totalPrice) {
        return res.status(400).json({ error: 'Insufficient wallet balance.' });
    }
    // Deduct balance, add points
    student.walletBalance -= newOrder.totalPrice;
    student.loyaltyPoints += Math.round(newOrder.totalPrice);
    orders.push(newOrder);
    res.status(201).json({
        message: 'Order created successfully',
        order: newOrder,
        newBalance: student.walletBalance
    });
});
// 4. POST /api/wallet/topup
app.post('/api/wallet/topup', (req, res) => {
    const { studentId, amount } = req.body;
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Invalid top-up amount.' });
    }
    const student = users.find(u => u.id === studentId);
    if (!student) {
        return res.status(404).json({ error: 'Student profile not found.' });
    }
    student.walletBalance += amount;
    res.json({
        message: 'Top-up completed',
        studentId: student.id,
        newBalance: student.walletBalance
    });
});
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.listen(PORT, () => {
    console.log(`[RozzaExpress Server] Running on http://localhost:${PORT}`);
});
