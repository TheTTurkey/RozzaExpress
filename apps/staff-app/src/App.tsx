import React, { useState } from 'react';
import { Order, InventoryItem, User } from '@rozza-express/shared';

// Mock data typed using the shared interfaces
const initialOrders: Order[] = [
  {
    orderId: 'ORD-1001',
    studentId: 'STU-0042',
    items: [
      { itemId: 'INV-001', name: 'Steamed Pork Buns', price: 4.50, quantity: 2 },
      { itemId: 'INV-003', name: 'Chocolate Milk', price: 3.50, quantity: 1 }
    ],
    status: 'Pending',
    deliveryTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    deliveryRunnerId: null
  },
  {
    orderId: 'ORD-1002',
    studentId: 'STU-0077',
    items: [
      { itemId: 'INV-002', name: 'Margherita Pizza Slice', price: 4.00, quantity: 1 }
    ],
    status: 'Preparing',
    deliveryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    deliveryRunnerId: 'RUN-009'
  }
];

const initialInventory: InventoryItem[] = [
  { itemId: 'INV-001', name: 'Steamed Pork Buns', price: 4.50, stockCount: 15, dietaryFilters: ['Soy', 'Gluten'] },
  { itemId: 'INV-002', name: 'Margherita Pizza Slice', price: 4.00, stockCount: 2, dietaryFilters: ['Dairy', 'Gluten'] },
  { itemId: 'INV-003', name: 'Chocolate Milk', price: 3.50, stockCount: 24, dietaryFilters: ['Dairy'] },
  { itemId: 'INV-004', name: 'Gluten-Free Sushi Roll', price: 5.50, stockCount: 10, dietaryFilters: ['Seafood'] }
];

const mockVoluntaryWorkers: User[] = [
  { id: 'STU-0042', name: 'Austin (Back-end)', email: 'austin@rosmini.school.nz', walletBalance: 12.50, loyaltyPoints: 120, voluntaryHoursCount: 4.5 },
  { id: 'STU-0077', name: 'Joseph (Front-end)', email: 'joseph@rosmini.school.nz', walletBalance: 8.20, loyaltyPoints: 80, voluntaryHoursCount: 8.0 }
];

function App(): React.ReactElement {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [inventory] = useState<InventoryItem[]>(initialInventory);

  const advanceOrderStatus = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.orderId !== orderId) return order;
      let nextStatus: Order['status'] = order.status;
      if (order.status === 'Pending') nextStatus = 'Preparing';
      else if (order.status === 'Preparing') nextStatus = 'In-Transit';
      else if (order.status === 'In-Transit') nextStatus = 'Completed';
      return { ...order, status: nextStatus };
    }));
  };

  const getStatusBadgeClass = (status: Order['status']): string => {
    switch (status) {
      case 'Pending': return 'badge badge--pending';
      case 'Preparing': return 'badge badge--preparing';
      case 'In-Transit': return 'badge badge--intransit';
      case 'Completed': return 'badge badge--completed';
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>RozzaExpress <span>Staff Dashboard</span></h1>
          <p style={{ color: 'var(--clr-text-muted)', marginTop: '0.25rem' }}>
            Rosmini Tuckshop Admin & Vendor Panel
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 600 }}>Orlando (Design Mode)</p>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>Role: Admin</p>
        </div>
      </header>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Active Orders List */}
        <section className="section-card">
          <h2>Active Fulfillments ({orders.filter(o => o.status !== 'Completed').length})</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Student ID</th>
                <th>Items Ordered</th>
                <th>Delivery Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td style={{ fontWeight: 600 }}>{order.orderId}</td>
                  <td>{order.studentId}</td>
                  <td>
                    {order.items.map(item => (
                      <div key={item.itemId}>
                        {item.name} <span style={{ color: 'var(--clr-text-muted)' }}>x{item.quantity}</span>
                      </div>
                    ))}
                  </td>
                  <td>{new Date(order.deliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status !== 'Completed' && (
                      <button
                        onClick={() => advanceOrderStatus(order.orderId)}
                        style={{
                          background: 'var(--clr-accent)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          padding: '0.4rem 0.8rem',
                          borderRadius: 'var(--radius-sm)',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        {order.status === 'Pending' ? 'Start Preparing' : order.status === 'Preparing' ? 'Dispatch' : 'Complete'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Side Panel: Inventory & Voluntaries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Inventory Summary */}
          <section className="section-card">
            <h2>Inventory Stock</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {inventory.map(item => (
                <div
                  key={item.itemId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--clr-border)',
                    paddingBottom: '0.75rem'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600 }}>{item.name}</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.15rem' }}>
                      {item.dietaryFilters.map(allergen => (
                        <span key={allergen} className="badge badge--allergen">{allergen}</span>
                      ))}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 600, color: item.stockCount <= 5 ? '#ef4444' : 'inherit' }}>
                      {item.stockCount} left
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Voluntary Hours Overview */}
          <section className="section-card">
            <h2>Voluntary Helpers</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {mockVoluntaryWorkers.map(worker => (
                <div
                  key={worker.id}
                  style={{
                    borderBottom: '1px solid var(--clr-border)',
                    paddingBottom: '0.75rem'
                  }}
                >
                  <p style={{ fontWeight: 600 }}>{worker.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', margin: '0.15rem 0' }}>
                    {worker.email}
                  </p>
                  <p style={{ fontSize: '0.85rem' }}>
                    Hours Approved: <span style={{ fontWeight: 700, color: 'var(--clr-accent)' }}>{worker.voluntaryHoursCount}h</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
