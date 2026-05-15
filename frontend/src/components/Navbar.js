import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaPills, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        <FaPills style={{ marginRight: 8, color: '#4caf50' }} />
        PharmaCare
      </Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        {user && <Link to="/prescriptions" style={styles.link}>Prescriptions</Link>}
        {user && <Link to="/orders" style={styles.link}>My Orders</Link>}
        <Link to="/cart" style={{ ...styles.link, position: 'relative' }}>
          <FaShoppingCart />
          {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
        </Link>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" style={styles.link}><FaTachometerAlt /></Link>
            )}
            <span style={styles.userName}><FaUser style={{ marginRight: 4 }} />{user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}><FaSignOutAlt /></button>
          </>
        ) : (
          <Link to="/login" style={styles.loginBtn}>Login</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 32px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 },
  brand: { fontSize: 22, fontWeight: 700, color: '#2e7d32', textDecoration: 'none', display: 'flex', alignItems: 'center' },
  links: { display: 'flex', alignItems: 'center', gap: 20 },
  link: { color: '#333', textDecoration: 'none', fontSize: 15, fontWeight: 500 },
  badge: { position: 'absolute', top: -8, right: -8, background: '#e53935', color: '#fff', borderRadius: '50%', fontSize: 11, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  userName: { fontSize: 14, color: '#555', display: 'flex', alignItems: 'center' },
  logoutBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#e53935', fontSize: 18 },
  loginBtn: { background: '#2e7d32', color: '#fff', padding: '8px 18px', borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 600 },
};
