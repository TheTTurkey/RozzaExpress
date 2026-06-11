import React, { useState, useMemo } from 'react';
import { MenuItem, User } from '@rozza-express/shared';
import './Home.css';

interface HomeProps {
  currentUser: User;
  onAddToCart: (item: MenuItem) => void;
  onNavigate: (screen: 'Home' | 'Wallet' | 'Tracking') => void;
}

interface DealItem {
  id: string;
  badgeText: string;
  badgeType: 'discount' | 'deal' | 'save' | 'new';
  title: string;
  desc: string;
  points: number;
  imageUrl: string;
}

const TODAY_DEALS: DealItem[] = [
  {
    id: 'deal-1',
    badgeText: '50% OFF',
    badgeType: 'discount',
    title: '2-for-1 Juicies',
    desc: 'Interval only · Expires 1:10pm',
    points: 80,
    imageUrl: '🍊'
  },
  {
    id: 'deal-2',
    badgeText: 'DEAL',
    badgeType: 'deal',
    title: 'Cheeseburger Deal',
    desc: 'Add a drink for $1.50',
    points: 120,
    imageUrl: '🍔'
  },
  {
    id: 'deal-3',
    badgeText: 'SAVE $1',
    badgeType: 'save',
    title: 'Sausage Roll Combo',
    desc: 'Sausage roll + chips',
    points: 60,
    imageUrl: '🥖'
  },
  {
    id: 'deal-4',
    badgeText: 'NEW',
    badgeType: 'new',
    title: 'Smash Burger Special',
    desc: 'Double smash, special sauce',
    points: 110,
    imageUrl: '🍔'
  }
];

const RECOMMENDED_ITEMS: MenuItem[] = [
  { itemId: 'rec-1', name: 'Steamed Pork Buns', price: 4.50, stockCount: 12, dietaryFilters: ['Soy', 'Gluten'] },
  { itemId: 'rec-2', name: 'Chocolate Milk', price: 3.50, stockCount: 8, dietaryFilters: ['Dairy'] },
  { itemId: 'rec-3', name: 'Garlic Bread Slice', price: 2.00, stockCount: 0, dietaryFilters: ['Gluten', 'Dairy', 'Vegetarian'] },
  { itemId: 'rec-4', name: 'Hot Chips (Cup)', price: 3.00, stockCount: 20, dietaryFilters: ['Vegetarian'] }
];

const MENU_ITEMS: MenuItem[] = [
  { itemId: 'menu-1', name: 'Butter Chicken & Rice', price: 6.50, stockCount: 15, dietaryFilters: ['Gluten-Free'] },
  { itemId: 'menu-2', name: 'Mince & Cheese Pie', price: 4.50, stockCount: 4, dietaryFilters: ['Gluten', 'Dairy'] },
  { itemId: 'menu-3', name: 'Vegetarian Sushi Roll', price: 5.00, stockCount: 0, dietaryFilters: ['Gluten-Free', 'Vegetarian'] },
  { itemId: 'menu-4', name: 'Rosmini College Sausage Roll', price: 3.20, stockCount: 35, dietaryFilters: ['Gluten'] },
  { itemId: 'menu-5', name: 'Fresh Fruit Cup', price: 2.50, stockCount: 10, dietaryFilters: ['Vegetarian', 'Gluten-Free'] },
  { itemId: 'menu-6', name: 'Chocolate Fudge Brownie', price: 3.00, stockCount: 0, dietaryFilters: ['Gluten', 'Dairy', 'Nut-Free'] }
];

export default function Home({ currentUser, onAddToCart, onNavigate }: HomeProps): React.ReactElement {
  const [orderMode, setOrderMode] = useState<'pre-order' | 'delivery'>('pre-order');
  const [selectedDietaryTags, setSelectedDietaryTags] = useState<string[]>([]);

  const handleTagToggle = (tag: string) => {
    setSelectedDietaryTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredMenuItems = useMemo(() => {
    if (selectedDietaryTags.length === 0) return MENU_ITEMS;
    return MENU_ITEMS.filter(item => 
      selectedDietaryTags.every(tag => 
        item.dietaryFilters.some(filter => filter.toLowerCase().includes(tag.toLowerCase()))
      )
    );
  }, [selectedDietaryTags]);

  const pointsMax = 500;
  const pointsPercent = Math.min((currentUser.loyaltyPoints / pointsMax) * 100, 100);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pointsPercent / 100) * circumference;

  return (
    <div className="home-screen-content">
      {/* HERO BANNER SECTION */}
      <div className="hero-container">
        {/* Left Side Info */}
        <div className="hero-details">
          <p className="hero-greeting">Good afternoon,</p>
          <h2 className="hero-name">{currentUser.name} 👋</h2>
          <p className="hero-desc">
            Order your interval & lunch from Rosmini's tuck shop — skip the queue, earn points.
          </p>

          <div className="hero-action-row">
            <div className="toggle-container">
              <button 
                className={`toggle-btn ${orderMode === 'pre-order' ? 'active-amber' : ''}`}
                onClick={() => setOrderMode('pre-order')}
              >
                <span className="toggle-icon">🕒</span>
                Pre-Order
              </button>
              <button 
                className={`toggle-btn ${orderMode === 'delivery' ? 'active-grey' : ''}`}
                onClick={() => setOrderMode('delivery')}
              >
                <span className="toggle-icon">📦</span>
                Delivery
              </button>
            </div>

            <button className="order-now-btn">
              Order Now &rarr;
            </button>
          </div>
        </div>

        {/* Right Side: Circular Rewards Widget */}
        <div className="hero-rewards-card" onClick={() => onNavigate('Wallet')}>
          <div className="radial-progress-container">
            <svg className="radial-progress-svg" viewBox="0 0 100 100">
              <circle className="progress-bg" cx="50" cy="50" r={radius} />
              <circle 
                className="progress-fill" 
                cx="50" 
                cy="50" 
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="radial-progress-text">
              <span className="radial-points-icon">⚡</span>
              <span className="radial-points-val">{currentUser.loyaltyPoints}</span>
              <span className="radial-points-lbl">pts</span>
            </div>
          </div>

          <div className="rewards-summary">
            <h3>Rozza Rewards</h3>
            <p className="rewards-hint">
              <span>{pointsMax - currentUser.loyaltyPoints} pts</span> to a free sausage roll!
            </p>
            <button className="earn-more-link">
              Earn more &gt;
            </button>
          </div>
        </div>
      </div>

      {/* TODAY'S DEALS SECTION */}
      <section className="dashboard-section">
        <div className="section-title-row">
          <h3>Today's Deals</h3>
          <span className="see-all-link">See all &gt;</span>
        </div>

        <div className="deals-grid">
          {TODAY_DEALS.map((deal) => (
            <div key={deal.id} className="deal-card">
              <div className="deal-image-wrapper">
                <span className={`deal-badge badge--${deal.badgeType}`}>{deal.badgeText}</span>
                <div className="deal-placeholder-img">
                  <span className="food-emoji">{deal.imageUrl}</span>
                  <div className="deal-overlay-gradient" />
                </div>
              </div>
              <div className="deal-info">
                <h4>{deal.title}</h4>
                <p>{deal.desc}</p>
                <span className="deal-points">+{deal.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECOMMENDED / FREQUENTLY BOUGHT CAROUSEL */}
      <section className="dashboard-section">
        <div className="section-title-row">
          <h3>Recommended Buys (Frequently Bought)</h3>
        </div>

        <div className="horizontal-scroll-container">
          {RECOMMENDED_ITEMS.map((item) => {
            const isOutOfStock = item.stockCount === 0;
            return (
              <div key={item.itemId} className={`recommended-card ${isOutOfStock ? 'card-disabled' : ''}`}>
                <div className="rec-food-avatar">🍔</div>
                <div className="rec-info">
                  <h5>{item.name}</h5>
                  <p className="rec-price">${item.price.toFixed(2)}</p>
                  
                  {isOutOfStock ? (
                    <span className="out-of-stock-badge">Out of Stock</span>
                  ) : (
                    <span className="stock-count-label">{item.stockCount} left</span>
                  )}
                </div>
                <button 
                  className="add-to-cart-small"
                  disabled={isOutOfStock}
                  onClick={() => onAddToCart(item)}
                  title={isOutOfStock ? 'Item is out of stock' : 'Add to cart'}
                >
                  +
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* STATEFUL DIETARY FILTER SYSTEM */}
      <section className="dashboard-section">
        <div className="section-title-row">
          <h3>Tuckshop Menu</h3>
        </div>

        <div className="dietary-filter-bar">
          {['Gluten-Free', 'Nut-Free', 'Vegetarian', 'Dairy-Free'].map((tag) => {
            const isActive = selectedDietaryTags.includes(tag);
            return (
              <button
                key={tag}
                className={`filter-tag-pill ${isActive ? 'active' : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* MAIN MENU GRID WITH STOCK CHECKS */}
        <div className="menu-grid">
          {filteredMenuItems.map((item) => {
            const isOutOfStock = item.stockCount === 0;
            return (
              <div key={item.itemId} className={`menu-card ${isOutOfStock ? 'card-disabled' : ''}`}>
                <div className="menu-card-image">
                  {isOutOfStock && <div className="out-of-stock-overlay">Out of Stock</div>}
                  <span className="menu-food-emoji">🍕</span>
                </div>
                
                <div className="menu-card-body">
                  <div className="menu-card-header">
                    <h4>{item.name}</h4>
                    <span className="menu-price">${item.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="menu-card-tags">
                    {item.dietaryFilters.map(tag => (
                      <span key={tag} className="menu-dietary-badge">{tag}</span>
                    ))}
                  </div>

                  <div className="menu-card-footer">
                    <span className={`stock-indicator ${isOutOfStock ? 'extinct' : item.stockCount <= 5 ? 'critical' : 'healthy'}`}>
                      {isOutOfStock ? 'Sold Out' : `${item.stockCount} items left`}
                    </span>

                    <button 
                      className="menu-add-btn"
                      disabled={isOutOfStock}
                      onClick={() => onAddToCart(item)}
                    >
                      {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
