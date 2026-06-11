import React, { useState } from 'react';
import { User, MenuItem, Order, OrderItem } from '@rozza-express/shared';
import Login from './screens/Auth/Login';
import Home from './screens/Home/Home';
import Wallet from './screens/Wallet/Wallet';
import Tracking from './screens/Tracking/Tracking';

type ScreenName = 'Login' | 'Home' | 'Wallet' | 'Tracking';

export default function App(): React.ReactElement {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Shopping Cart state
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartError, setCartError] = useState('');

  // Active tracked order
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const handleLoginSuccess = (validatedUser: { id: string; name: string; email: string }) => {
    // Preload student profile with visual details matching the mock screenshot
    const fullUserProfile: User = {
      id: validatedUser.id,
      name: validatedUser.name,
      email: validatedUser.email,
      walletBalance: 25.50,
      loyaltyPoints: 425,
      isDeliveryRunner: true,
      voluntaryHours: 8.0
    };
    setCurrentUser(fullUserProfile);
    setCurrentScreen('Home');
  };

  const handleTopUp = (amount: number) => {
    if (!currentUser) return;
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        walletBalance: prev.walletBalance + amount
      };
    });
    console.log(`[Wallet] Preloaded topup of +$${amount.toFixed(2)} completed.`);
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const exists = prev.find(i => i.itemId === item.itemId);
      if (exists) {
        return prev.map(i => i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { itemId: item.itemId, name: item.name, price: item.price, quantity: 1 }];
    });
    console.log(`[Cart] Added "${item.name}" to cart.`);
  };

  const updateCartQty = (itemId: string, change: number) => {
    setCart(prev => prev.map(item => {
      if (item.itemId !== itemId) return item;
      const nextQty = item.quantity + change;
      return nextQty > 0 ? { ...item, quantity: nextQty } : null;
    }).filter((item): item is OrderItem => item !== null));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    setCartError('');
    if (!currentUser) return;

    if (currentUser.walletBalance < cartTotal) {
      setCartError('Insufficient wallet balance. Please top up funds.');
      return;
    }

    // Deduct from wallet, add loyalty points (1 point per dollar spent)
    const pointsEarned = Math.round(cartTotal);
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        walletBalance: prev.walletBalance - cartTotal,
        loyaltyPoints: prev.loyaltyPoints + pointsEarned
      };
    });

    // Create and track order
    const newOrder: Order = {
      orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      studentId: currentUser.id,
      items: [...cart],
      totalPrice: cartTotal,
      status: 'Pending',
      isPreOrder: false,
      pickupTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      deliveryEta: null
    };

    setActiveOrder(newOrder);
    setCart([]); // Clear cart
    setCartOpen(false); // Close cart drawer
    setCurrentScreen('Tracking'); // Auto-route to live tracking
  };

  // Simulator control for delivery runner updates ( Liam T )
  const handleAdvanceOrder = () => {
    if (!activeOrder) return;
    setActiveOrder(prev => {
      if (!prev) return null;
      let nextStatus: Order['status'] = prev.status;
      let nextEta: string | null = prev.deliveryEta;

      if (prev.status === 'Pending') {
        nextStatus = 'Preparing';
      } else if (prev.status === 'Preparing') {
        nextStatus = 'In-Transit';
        nextEta = new Date(Date.now() + 8 * 60 * 1000).toISOString();
      } else if (prev.status === 'In-Transit') {
        nextStatus = 'Completed';
        nextEta = null;
      } else {
        nextStatus = 'Pending';
      }

      return {
        ...prev,
        status: nextStatus,
        deliveryEta: nextEta
      };
    });
  };

  // Authentication gate
  if (!currentUser || currentScreen === 'Login') {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '75px' }}>
      
      {/* PERSISTENT HEADER (Navbar identical on all screens) */}
      <header className="home-header">
        <div className="header-logo" onClick={() => setCurrentScreen('Home')}>
          <div className="logo-badge">R</div>
          <div>
            <span className="logo-title">Rozza Express</span>
            <span className="logo-subtitle">Rosmini College Tuck Shop</span>
          </div>
        </div>

        <nav className="header-nav">
          <button className={`nav-btn ${currentScreen === 'Home' ? 'active' : ''}`} onClick={() => setCurrentScreen('Home')}>Home</button>
          <button className={`nav-btn ${currentScreen === 'Wallet' ? 'active' : ''}`} onClick={() => setCurrentScreen('Wallet')}>Wallet</button>
          <button className={`nav-btn ${currentScreen === 'Tracking' ? 'active' : ''}`} onClick={() => setCurrentScreen('Tracking')}>Tracking</button>
        </nav>

        <div className="header-actions">
          <div className="points-pill" onClick={() => setCurrentScreen('Wallet')}>
            <span className="points-icon">⚡</span>
            <span className="points-count">{currentUser.loyaltyPoints} pts</span>
          </div>
          <button className="cart-pill" onClick={() => setCartOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span className="cart-text">Cart</span>
            {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* SCREEN ROUTING */}
      <main style={{ flex: 1 }}>
        {currentScreen === 'Home' && (
          <Home
            currentUser={currentUser}
            onAddToCart={handleAddToCart}
            onNavigate={setCurrentScreen}
          />
        )}
        {currentScreen === 'Wallet' && (
          <Wallet
            currentUser={currentUser}
            onTopUp={handleTopUp}
            onNavigate={setCurrentScreen}
          />
        )}
        {currentScreen === 'Tracking' && (
          <Tracking
            currentUser={currentUser}
            activeOrder={activeOrder}
            onAdvanceOrder={handleAdvanceOrder}
            onNavigate={setCurrentScreen}
          />
        )}
      </main>

      {/* PERSISTENT BOTTOM NAVIGATION BAR */}
      <footer className="footer-nav-bar">
        <button className={`footer-nav-item ${currentScreen === 'Home' ? 'active' : ''}`} onClick={() => setCurrentScreen('Home')}>
          <span className="footer-nav-icon">🏠</span>
          <span>Home</span>
        </button>
        <button className={`footer-nav-item ${currentScreen === 'Wallet' ? 'active' : ''}`} onClick={() => setCurrentScreen('Wallet')}>
          <span className="footer-nav-icon">💳</span>
          <span>Wallet</span>
        </button>
        <button className={`footer-nav-item ${currentScreen === 'Tracking' ? 'active' : ''}`} onClick={() => setCurrentScreen('Tracking')}>
          <span className="footer-nav-icon">📍</span>
          <span>Tracking</span>
        </button>
      </footer>

      {/* CART DRAWER SLIDE-OUT MODAL */}
      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => { setCartOpen(false); setCartError(''); }} />
      
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>Shopping Cart</h3>
          <button className="close-cart-btn" onClick={() => { setCartOpen(false); setCartError(''); }}>&times;</button>
        </div>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <p className="empty-cart-msg">Your shopping cart is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.itemId} className="cart-item-row">
                <div className="cart-item-info">
                  <h5>{item.name}</h5>
                  <p>${item.price.toFixed(2)}</p>
                </div>
                
                <div className="cart-qty-controls">
                  <button className="qty-change-btn" onClick={() => updateCartQty(item.itemId, -1)}>-</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-change-btn" onClick={() => updateCartQty(item.itemId, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-checkout-box">
            {cartError && <div className="cart-error-banner">{cartError}</div>}
            
            <div className="cart-total-row">
              <span>Order Total:</span>
              <span className="cart-total-value">${cartTotal.toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout (${cartTotal.toFixed(2)})
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
