import React, { useState } from 'react';
import { User, MenuItem } from '@rozza-express/shared';
import Login from './screens/Auth/Login';
import Home from './screens/Home/Home';
import Wallet from './screens/Wallet/Wallet';
import Tracking from './screens/Tracking/Tracking';

type ScreenName = 'Login' | 'Home' | 'Wallet' | 'Tracking';

export default function App(): React.ReactElement {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});

  const handleLoginSuccess = (validatedUser: { id: string; name: string; email: string }) => {
    // Preload student profile with visual details matching the mock screenshot:
    // e.g. Josh Tuilagi, 425 loyalty points, $25.50 balance, 8.0 voluntary hours
    const fullUserProfile: User = {
      id: validatedUser.id,
      name: validatedUser.name,
      email: validatedUser.email,
      walletBalance: 25.50, // Preloaded balance for testing
      loyaltyPoints: 425,   // Preloaded points matching design screenshot
      isDeliveryRunner: true, // Preloaded to demonstrate the helper status widget
      voluntaryHours: 8.0    // Preloaded hours matching design screenshot
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
    setCart(prev => ({
      ...prev,
      [item.itemId]: (prev[item.itemId] || 0) + 1
    }));
    
    // Dynamically calculate loyalty points addition: $1 spend = 1 point
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        loyaltyPoints: prev.loyaltyPoints + Math.round(item.price)
      };
    });
    console.log(`[Cart] Added "${item.name}" to cart.`);
  };

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  // Screen Routing switch
  const renderScreen = () => {
    if (!currentUser || currentScreen === 'Login') {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentScreen) {
      case 'Home':
        return (
          <Home
            currentUser={currentUser}
            onAddToCart={handleAddToCart}
            cartCount={cartCount}
            onNavigate={setCurrentScreen}
          />
        );
      case 'Wallet':
        return (
          <Wallet
            currentUser={currentUser}
            onTopUp={handleTopUp}
            onNavigate={setCurrentScreen}
          />
        );
      case 'Tracking':
        return (
          <Tracking
            currentUser={currentUser}
            onNavigate={setCurrentScreen}
          />
        );
      default:
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return <React.Fragment>{renderScreen()}</React.Fragment>;
}
