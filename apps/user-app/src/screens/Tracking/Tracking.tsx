import React from 'react';
import { User, Order } from '@rozza-express/shared';
import './Tracking.css';

interface TrackingProps {
  currentUser: User;
  activeOrder: Order | null;
  onAdvanceOrder: () => void;
  onNavigate: (screen: 'Home' | 'Wallet' | 'Tracking') => void;
}

export default function Tracking({ currentUser, activeOrder, onAdvanceOrder, onNavigate }: TrackingProps): React.ReactElement {
  
  const getStatusStepIndex = (status: Order['status']): number => {
    switch (status) {
      case 'Pending': return 0;
      case 'Preparing': return 1;
      case 'In-Transit': return 2;
      case 'Completed': return 3;
    }
  };

  const getRemainingMinutes = (etaString: string | null): number => {
    if (!etaString) return 0;
    const diffMs = new Date(etaString).getTime() - Date.now();
    const diffMins = Math.ceil(diffMs / (60 * 1000));
    return diffMins > 0 ? diffMins : 0;
  };

  return (
    <div className="tracking-screen-content">
      <div className="tracking-layout">
        
        {/* LEFT COLUMN: ACTIVE TRACKING */}
        <div className="tracking-main-col">
          <section className="tracking-section-box">
            <h3>Live Order Tracker</h3>
            <p className="section-hint-text">
              Track the exact progress of your lunch. Status updates in real-time as Austin's backend processes your request.
            </p>

            {!activeOrder ? (
              <div className="empty-tracking-state">
                <span>📦</span>
                <p>No active orders currently under delivery.</p>
                <button className="back-home-btn" onClick={() => onNavigate('Home')}>
                  Order Food Now
                </button>
              </div>
            ) : (
              <div className="active-order-tracking-card">
                
                {/* Header Info */}
                <div className="tracking-card-header">
                  <div>
                    <h4>Order ID: <span className="highlight-text">{activeOrder.orderId}</span></h4>
                    <p className="items-summary">
                      {activeOrder.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                    </p>
                  </div>
                  <div className="eta-badge-container">
                    {activeOrder.status === 'In-Transit' && activeOrder.deliveryEta ? (
                      <div className="eta-badge active">
                        <span className="eta-timer-icon">🛵</span>
                        <span className="eta-number">{getRemainingMinutes(activeOrder.deliveryEta)} mins</span>
                      </div>
                    ) : (
                      <div className="eta-badge">
                        <span>{activeOrder.status}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step Visualizer */}
                <div className="tracking-steps-container">
                  <div className="progress-line">
                    <div 
                      className="progress-line-fill" 
                      style={{ width: `${(getStatusStepIndex(activeOrder.status) / 3) * 100}%` }}
                    />
                  </div>

                  {[
                    { label: 'Pending', icon: '📝' },
                    { label: 'Preparing', icon: '🍳' },
                    { label: 'In-Transit', icon: '🛵' },
                    { label: 'Completed', icon: '✅' }
                  ].map((step, index) => {
                    const currentStep = getStatusStepIndex(activeOrder.status);
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
                  {activeOrder.status === 'Pending' && (
                    <p className="detail-status-text">
                      👍 Your order has been submitted. Austin's tuckshop backend is waiting to queue it.
                    </p>
                  )}
                  {activeOrder.status === 'Preparing' && (
                    <p className="detail-status-text">
                      🔥 The tuckshop staff is preparing your hot meals! Almost ready for dispatch.
                    </p>
                  )}
                  {activeOrder.status === 'In-Transit' && (
                    <p className="detail-status-text">
                      🚀 A certified student runner has collected your order and is heading towards your homeroom classroom.
                    </p>
                  )}
                  {activeOrder.status === 'Completed' && (
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
                    onClick={onAdvanceOrder}
                  >
                    Advance Order Status (Backend Mock)
                  </button>
                </div>

              </div>
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
    </div>
  );
}
