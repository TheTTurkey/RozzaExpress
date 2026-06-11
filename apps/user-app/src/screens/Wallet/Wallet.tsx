import React from 'react';
import { User } from '@rozza-express/shared';
import './Wallet.css';

interface WalletProps {
  currentUser: User;
  onTopUp: (amount: number) => void;
  onNavigate: (screen: 'Home' | 'Wallet' | 'Tracking') => void;
}

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended: boolean;
  accentColor: string;
}

const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'plan-1',
    name: 'Weekly Lunch Pass',
    price: 25.00,
    period: 'week',
    features: [
      '1 Custom Hot Main per day',
      '1 Cold drink or juice box per day',
      'Skip the main queue at pickup',
      '+50 bonus loyalty points'
    ],
    recommended: true,
    accentColor: '#ef4444' // Red brand brand accent
  },
  {
    id: 'plan-2',
    name: 'Voluntary Helper Club',
    price: 15.00,
    period: 'week',
    features: [
      'Available only to Voluntary Runners',
      'Free cookie on Friday service',
      'Double points on delivery tasks',
      'Exclusive uniform runner cap'
    ],
    recommended: false,
    accentColor: '#10b981' // Green volunteer accent
  },
  {
    id: 'plan-3',
    name: 'VIP Golden Pass',
    price: 90.00,
    period: 'month',
    features: [
      'Unlimited daily mains & snacks',
      'Free delivery to any homeroom',
      'Invitation to monthly food testing panel',
      '+250 bonus loyalty points'
    ],
    recommended: false,
    accentColor: '#fbbf24' // Gold VIP accent
  }
];

export default function Wallet({ currentUser, onTopUp, onNavigate }: WalletProps): React.ReactElement {
  // Constants for points tiers
  const tierLimit = 500;
  const progressPercent = Math.min((currentUser.loyaltyPoints / tierLimit) * 100, 100);

  return (
    <div className="wallet-screen">
      {/* HEADER */}
      <header className="wallet-header">
        <div className="header-logo" onClick={() => onNavigate('Home')}>
          <div className="logo-badge">R</div>
          <div>
            <span className="logo-title">Rozza Express</span>
            <span className="logo-subtitle">Student Wallet & Loyalty</span>
          </div>
        </div>

        <nav className="header-nav">
          <button className="nav-btn" onClick={() => onNavigate('Home')}>Home</button>
          <button className="nav-btn active">Wallet</button>
          <button className="nav-btn" onClick={() => onNavigate('Tracking')}>Tracking</button>
        </nav>

        <div className="header-profile">
          <div className="profile-initials">JT</div>
        </div>
      </header>

      <div className="wallet-layout">
        
        {/* LEFT COLUMN: WALLET BALANCE & TOP-UP */}
        <div className="wallet-main-col">
          {/* Card Wallet details */}
          <div className="digital-wallet-card">
            <div className="wallet-card-overlay" />
            <div className="wallet-card-header">
              <span className="wallet-chip"></span>
              <span className="wallet-issuer">ROZZA PAY</span>
            </div>
            
            <div className="wallet-balance-row">
              <p className="balance-label">Available Balance</p>
              <h2 className="balance-amount">${currentUser.walletBalance.toFixed(2)}</h2>
            </div>

            <div className="wallet-card-footer">
              <div>
                <p className="card-holder-lbl">CARD HOLDER</p>
                <p className="card-holder-name">{currentUser.name}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="card-holder-lbl">STUDENT ID</p>
                <p className="card-holder-name">{currentUser.id}</p>
              </div>
            </div>
          </div>

          {/* Secure Top-Up Section */}
          <section className="wallet-section-box">
            <h3>Secure Top-up Funds</h3>
            <p className="section-hint-text">
              Hackathon Preloader: Simulate an instant deposit to your student card using the quick buttons below.
            </p>

            <div className="topup-options-grid">
              {[5.00, 10.00, 20.00, 50.00].map((amount) => (
                <button
                  key={amount}
                  className="topup-amount-btn"
                  onClick={() => onTopUp(amount)}
                >
                  +${amount.toFixed(0)}
                </button>
              ))}
            </div>

            <div className="secure-checkout-notice">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Pre-authorized via Rosmini College Tuition Account. Encrypted & Secure.</span>
            </div>
          </section>

          {/* Membership Plans Section */}
          <section className="wallet-section-box" style={{ marginTop: '2rem' }}>
            <h3>Tuckshop Membership Plans</h3>
            <p className="section-hint-text">
              Subscribe to a lunch pass to save money, skip queues, and automatically receive credits.
            </p>

            <div className="memberships-grid">
              {MEMBERSHIP_PLANS.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`membership-card ${plan.recommended ? 'recommended-border' : ''}`}
                >
                  {plan.recommended && <div className="rec-ribbon">Best Value</div>}
                  
                  <div className="membership-card-header">
                    <h4>{plan.name}</h4>
                    <div className="plan-price-row">
                      <span className="price-symbol">$</span>
                      <span className="price-value">{plan.price.toFixed(0)}</span>
                      <span className="price-period">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="plan-features-list">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <span className="feature-check" style={{ color: plan.accentColor }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button 
                    className="plan-select-btn"
                    style={{ 
                      backgroundColor: plan.recommended ? 'var(--clr-accent)' : 'rgba(255,255,255,0.05)',
                      border: plan.recommended ? 'none' : '1px solid var(--clr-border)',
                      color: plan.recommended ? '#0f172a' : '#fff'
                    }}
                  >
                    Subscribe Now
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: LOYALTY PROGRESS TRACKER */}
        <div className="wallet-side-col">
          <section className="loyalty-box-card">
            <div className="loyalty-box-header">
              <span className="loyalty-lightning">⚡</span>
              <h3>Loyalty Rewards</h3>
            </div>

            <div className="loyalty-points-stats">
              <p className="stat-label">Active Points Balance</p>
              <h2 className="stat-value">{currentUser.loyaltyPoints} <span>pts</span></h2>
            </div>

            {/* Loyalty Tracker Progress Bar */}
            <div className="loyalty-progress-container">
              <div className="loyalty-progress-labels">
                <span>Bronze Tier</span>
                <span>500 pts Goal</span>
              </div>
              
              <div className="loyalty-progress-bar-bg">
                <div 
                  className="loyalty-progress-bar-fill" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="loyalty-progress-detail">
                You are <strong>{tierLimit - currentUser.loyaltyPoints} points</strong> away from a **Free Sausage Roll**!
              </p>
            </div>

            <div className="loyalty-earning-rules">
              <h4>How you earn points:</h4>
              <div className="rule-item">
                <span className="rule-number">1</span>
                <div>
                  <p className="rule-title">$1 Spent = 1 Reward Point</p>
                  <p className="rule-desc">Order lunch, snacks, or drinks via the app.</p>
                </div>
              </div>
              <div className="rule-item">
                <span className="rule-number">2</span>
                <div>
                  <p className="rule-title">+10 Points on Deliveries</p>
                  <p className="rule-desc">Earn bonus points when you deliver lunch for peers.</p>
                </div>
              </div>
              <div className="rule-item">
                <span className="rule-number">3</span>
                <div>
                  <p className="rule-title">Double Points Hours</p>
                  <p className="rule-desc">Place orders during interval pre-order periods.</p>
                </div>
              </div>
            </div>

            <button 
              className="view-rewards-catalog-btn"
              onClick={() => onNavigate('Home')}
            >
              Browse Rewards Menu
            </button>
          </section>
        </div>

      </div>

      {/* FOOTER NAVIGATION */}
      <footer className="footer-nav-bar">
        <button className="footer-nav-item" onClick={() => onNavigate('Home')}>
          <span className="footer-nav-icon">🏠</span>
          <span>Home</span>
        </button>
        <button className="footer-nav-item active" onClick={() => onNavigate('Wallet')}>
          <span className="footer-nav-icon">💳</span>
          <span>Wallet</span>
        </button>
        <button className="footer-nav-item" onClick={() => onNavigate('Tracking')}>
          <span className="footer-nav-icon">📍</span>
          <span>Tracking</span>
        </button>
      </footer>
    </div>
  );
}
