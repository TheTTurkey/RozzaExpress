import { useState } from 'react';
import './RoleSelect.css';

const roles = [
  {
    id: 'student',
    title: 'Student',
    description: 'Order your lunch and snacks for pickup at the tuckshop',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="role-icon">
        <rect x="14" y="8" width="36" height="48" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <rect x="20" y="16" width="24" height="6" rx="2" fill="currentColor" opacity="0.25" />
        <line x1="20" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="37" x2="38" y2="37" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="44" x2="32" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="48" cy="48" r="12" fill="currentColor" opacity="0.15" />
        <path d="M44 48l3 3 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'staff',
    title: 'Staff',
    description: 'Manage orders, update the menu, and view daily reports',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="role-icon">
        <circle cx="32" cy="20" r="10" stroke="currentColor" strokeWidth="2.5" />
        <path d="M12 54c0-11.046 8.954-20 20-20s20 8.954 20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="38" y="38" width="18" height="18" rx="4" fill="currentColor" opacity="0.15" />
        <path d="M44 47h6M47 44v6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function RoleSelect() {
  const [hoveredRole, setHoveredRole] = useState(null);

  const handleSelect = (roleId) => {
    // Future: navigate to login page for the chosen role
    console.log(`Selected role: ${roleId}`);
  };

  return (
    <div className="role-page">
      {/* Animated background blobs */}
      <div className="bg-blob bg-blob--1" />
      <div className="bg-blob bg-blob--2" />
      <div className="bg-blob bg-blob--3" />

      <div className="role-page__content">
        {/* Header */}
        <header className="role-header">
          <div className="role-header__badge">
            <span className="role-header__emoji">🍕</span>
          </div>
          <h1 className="role-header__title">
            Rosmini <span className="role-header__highlight">Tuckshop</span>
          </h1>
          <p className="role-header__subtitle">
            Welcome! Choose how you'd like to sign in.
          </p>
        </header>

        {/* Role cards */}
        <div className="role-cards">
          {roles.map((role) => (
            <button
              key={role.id}
              id={`role-card-${role.id}`}
              className={`role-card role-card--${role.id} ${
                hoveredRole === role.id ? 'role-card--active' : ''
              }`}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => handleSelect(role.id)}
            >
              {/* Glow ring */}
              <div className="role-card__glow" />

              <div className="role-card__icon-wrap">{role.icon}</div>
              <h2 className="role-card__title">{role.title}</h2>
              <p className="role-card__desc">{role.description}</p>

              <div className="role-card__cta">
                Continue
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <footer className="role-footer">
          <p>Rosmini College &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}

export default RoleSelect;
