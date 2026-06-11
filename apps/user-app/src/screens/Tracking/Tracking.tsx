import React, { useState } from 'react';
import { User, Order } from '@rozza-express/shared';
import './Tracking.css';

interface TrackingProps {
  currentUser: User;
  onNavigate: (screen: 'Home' | 'Wallet' | 'Tracking') => void;
}

// Mock active orders for tracking demonstration
const mockActiveOrders: Order[] = [
  {
    orderId: 'ORD-5502',
    studentId: 'STU-22235',
    items: [
      { itemId: 'menu-4', name: 'Rosmini College Sausage Roll', price: 3.20, quantity: 2 },
      { itemId: 'menu-2', name: 'Mince & Cheese Pie', price: 4.50, quantity: 1 }
    ],
    totalPrice: 10.90,
    status: 'In-Transit',
    isPreOrder: false,
    pickupTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    deliveryEta: new Date(Date.now() + 8 * 60 * 1000).toISOString()
  }
];

export default function Tracking({ currentUser, onNavigate }: TrackingProps): React.ReactElement {
  const [activeOrders, setActiveOrders] = useState<Order[]>(mockActiveOrders);

  // Helper to determine the step index of the order status
  const getStatusStepIndex = (status: Order['status']): number => {
    switch (status) {
      case 'Pending': return 0;
      case 'Preparing': return 1;
      case 'In-Transit': return 2;
      case 'Completed': return 3;
    }
  };

  // Calculates remaining minutes based on the ISO deliveryEta
  const getRemainingMinutes = (etaString: string | null): number => {
    if (!etaString) return 0;
    const diffMs = new Date(etaString).getTime() - Date.now();
    const diffMins = Math.ceil(diffMs / (60 * 1000));
    return diffMins > 0 ? diffMins : 0;
  };

  // Simulated button to toggle status for hackathon integration testing (Liam T)
  const toggleOrderStatus = (orderId: string) => {
    setActiveOrders(prev => prev.map(order => {
      if (order.orderId !== orderId) return order;
      let nextStatus: Order['status'] = order.status;
      let nextEta: string | null = order.deliveryEta;
      
      if (order.status === 'Pending') {
        nextStatus = 'Preparing';
      } else if (order.status === 'Preparing') {
        nextStatus = 'In-Transit';
        nextEta = new Date(Date.now() + 12 * 60 * 1000).toISOString();
      } else if (order.status === 'In-Transit') {
        nextStatus = 'Completed';
        nextEta = null;
      } else {
        nextStatus = 'Pending';
      }
      
      return { ...order, status: nextStatus, deliveryEta: nextEta };
    }));
  };

  return (
    <div className="tracking-screen">
      {/* HEADER */}
      <header className="tracking-header">
        <div className="header-logo" onClick={() => onNavigate('Home')}>
          <div className="logo-badge">R</div>
          <div>
            <span className="logo-title">Rozza Express</span>
            <span className="logo-subtitle">Live Tracking & Service</span>
          </div>
        </div>

        <nav className="header-nav">
          <button className="nav-btn" onClick={() => onNavigate('Home')}>Home</button>
          <button className="nav-btn" onClick={() => onNavigate('Wallet')}>Wallet</button>
          <button className="nav-btn active">Tracking</button>
        </nav>

        <div className="header-profile">
          <div className="profile-initials">JT</div>
        </div>
      </header>

      <div className="tracking-layout">
        
        {/* LEFT COLUMN: ACTIVE TRACKING */}
        <div className="tracking-main-col">
          <section className="tracking-section-box">
            <h3>Live Order Tracker</h3>
            <p className="section-hint-text">
              Track the exact progress of your lunch. Status updates in real-time as Austin's backend processes your request.
            </p>

            {activeOrders.length === 0 ? (
              <div className="empty-tracking-state">
                <span>📦</span>
                <p>No active orders currently under delivery.</p>
                <button className="back-home-btn" onClick={() => onNavigate('Home')}>
                  Order Food Now
                </button>
              </div>
            ) : (
              activeOrders.map((order) => {
                const currentStep = getStatusStepIndex(order.status);
                const remainingMinutes = getRemainingMinutes(order.deliveryEta);

                return (
                  <div key={order.orderId} className="active-order-tracking-card">
                    
                    {/* Header Info */}
                    <div className="tracking-card-header">
                      <div>
                        <h4>Order ID: <span className="highlight-text">{order.orderId}</span></h4>
                        <p className="items-summary">
                          {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                        </p>
                      </div>
                      <div className="eta-badge-container">
                        {order.status === 'In-Transit' && order.deliveryEta ? (
                          <div className="eta-badge active">
                            <span className="eta-timer-icon">🛵</span>
                            <span className="eta-number">{remainingMinutes} mins</span>
                          </div>
                        ) : (
                          <div className="eta-badge">
                            <span>{order.status}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step Visualizer */}
                    <div className="tracking-steps-container">
                      <div className="progress-line">
                        <div 
                          className="progress-line-fill" 
                          style={{ width: `${(currentStep / 3) * 100}%` }}
                        />
                      </div>

                      {[
                        { label: 'Pending', icon: '📝' },
                        { label: 'Preparing', icon: '🍳' },
                        { label: 'In-Transit', icon: '🛵' },
                        { label: 'Completed', icon: '✅' }
                      ].map((step, index) => {
                        const isDone = index <= currentStep;
                        const isActive = index === currentStep;

                        return (
                          <div 
                            key={step.label} 
                            className={`step-node ${isDone ? 'done' : ''} ${isActive ? 'active-pulse' : ''}`}
                          >
                            <div className="step-icon-wrap">
                              {step.icon}
                            </div>
                            <span className="step-label">{step.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Additional Tracking Details */}
                    <div className="tracking-info-details">
                      {order.status === 'Pending' && (
                        <p className="detail-status-text">
                          👍 Your order has been submitted. Austin's tuckshop backend is waiting to queue it.
                        </p>
                      )}
                      {order.status === 'Preparing' && (
                        <p className="detail-status-text">
                          🔥 The tuckshop staff is preparing your hot meals! Almost ready for dispatch.
                        </p>
                      )}
                      {order.status === 'In-Transit' && (
                        <p className="detail-status-text">
                          🚀 A certified student runner has collected your order and is heading towards your homeroom classroom.
                        </p>
                      )}
                      {order.status === 'Completed' && (
                        <p className="detail-status-text" style={{ color: '#059669' }}>
                          🎉 Order successfully delivered! Enjoy your lunch. Thank you for using RozzaExpress!
                        </p>
                      )}
                    </div>

                    {/* HACKATHON HELP: Action to simulate status triggers */}
                    <div className="hackathon-simulation-panel">
                      <span className="simulation-tag">TEST TOOL</span>
                      <p>Simulation controls for Liam T to test status changes:</p>
                      <button 
                        className="simulate-next-btn"
                        onClick={() => toggleOrderStatus(order.orderId)}
                      >
                        Advance Order Status (Backend Mock)
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: VOLUNTARY PROFILE */}
        <div className="tracking-side-col">
          <section className="voluntary-hours-card">
            <div className="runner-avatar-wrapper">
              <div className="runner-avatar">JT</div>
              {currentUser.isDeliveryRunner && (
                <span className="certified-badge" title="Certified Delivery Runner">⚡</span>
              )}
            </div>

            <div className="runner-info">
              <h3>{currentUser.name}</h3>
              <p className="runner-email">{currentUser.email}</p>
              
              <div className="runner-status-tag">
                {currentUser.isDeliveryRunner ? (
                  <span className="tag-runner active">Certified Delivery Runner</span>
                ) : (
                  <span className="tag-runner inactive">General Student Portal</span>
                )}
              </div>
            </div>

            <div className="voluntary-stats-box">
              <div className="stat-item">
                <span className="stat-number">{currentUser.voluntaryHours.toFixed(1)}</span>
                <span className="stat-label">Hours Worked</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">
                  {currentUser.isDeliveryRunner ? '10%' : 'None'}
                </span>
                <span className="stat-label">Runner Discount</span>
              </div>
            </div>

            <div className="voluntary-level-detail">
              <p className="detail-title">Rosmini Volunteer Service Level</p>
              <p className="detail-level">🏆 Silver Level Helper</p>
              
              <div className="hours-progress-bar-bg">
                <div 
                  className="hours-progress-bar-fill" 
                  style={{ width: `${(currentUser.voluntaryHours / 12) * 100}%` }}
                />
              </div>
              <p className="hours-progress-hint">
                Accumulate 12.0 hours to unlock the Golden level and 15% tuckshop discount.
              </p>
            </div>

            <div className="runner-delivery-history">
              <h4>Recent Deliveries</h4>
              <div className="delivery-log-row">
                <span>Room 102 (Lunch)</span>
                <span className="log-time">+0.5 hrs</span>
              </div>
              <div className="delivery-log-row">
                <span>Room 205 (Interval)</span>
                <span className="log-time">+0.5 hrs</span>
              </div>
              <div className="delivery-log-row">
                <span>Room 104 (Lunch)</span>
                <span className="log-time">+0.5 hrs</span>
              </div>
            </div>
          </section>
        </div>

      </div>

      {/* FOOTER NAVIGATION */}
      <footer className="footer-nav-bar">
        <button className="footer-nav-item" onClick={() => onNavigate('Home')}>
          <span className="footer-nav-icon">🏠</span>
          <span>Home</span>
        </button>
        <button className="footer-nav-item" onClick={() => onNavigate('Wallet')}>
          <span className="footer-nav-icon">💳</span>
          <span>Wallet</span>
        </button>
        <button className="footer-nav-item active" onClick={() => onNavigate('Tracking')}>
          <span className="footer-nav-icon">📍</span>
          <span>Tracking</span>
        </button>
      </footer>
    </div>
  );
}
