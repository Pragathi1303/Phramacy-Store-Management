import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div style={styles.empty}>
        <FaShoppingBag size={64} color="#ccc" />
        <h2>Your cart is empty</h2>
        <p>Browse our medicines and add items to your cart</p>
        <Link to="/" style={styles.shopBtn}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.back}><FaArrowLeft /> Continue Shopping</button>
        <h2 style={styles.title}>Shopping Cart ({cart.length} items)</h2>
        <button onClick={clearCart} style={styles.clearBtn}>Clear All</button>
      </div>

      <div style={styles.layout}>
        <div style={styles.items}>
          {cart.map((item) => (
            <div key={item._id} style={styles.item}>
              <img
                src={item.image || 'https://placehold.co/80x80/e8f5e9/2e7d32?text=Med'}
                alt={item.name}
                style={styles.img}
              />
              <div style={styles.itemInfo}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemCat}>{item.category}</p>
                {item.requiresPrescription && (
                  <span style={styles.rxTag}>Rx Required</span>
                )}
              </div>
              <div style={styles.qtyRow}>
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={styles.qtyBtn}>−</button>
                <span style={styles.qty}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={styles.qtyBtn}>+</button>
              </div>
              <div style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</div>
              <button onClick={() => removeFromCart(item._id)} style={styles.removeBtn}><FaTrash /></button>
            </div>
          ))}
        </div>

        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          {cart.map((item) => (
            <div key={item._id} style={styles.summaryRow}>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={styles.divider} />
          <div style={styles.summaryRow}>
            <span>Delivery</span>
            <span style={{ color: '#2e7d32' }}>FREE</span>
          </div>
          <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 18 }}>
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button onClick={() => navigate('/checkout')} style={styles.checkoutBtn}>
            Proceed to Checkout
          </button>
          {cart.some((i) => i.requiresPrescription) && (
            <p style={styles.rxNote}>⚠️ Some items require a prescription. Please upload before checkout.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  empty: { textAlign: 'center', padding: '80px 24px', color: '#888' },
  shopBtn: { display: 'inline-block', marginTop: 20, padding: '12px 28px', background: '#2e7d32', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  back: { background: 'none', border: 'none', cursor: 'pointer', color: '#2e7d32', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 },
  title: { fontSize: 22, fontWeight: 700, color: '#1a1a1a' },
  clearBtn: { background: 'none', border: '1.5px solid #e53935', color: '#e53935', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28 },
  items: { display: 'flex', flexDirection: 'column', gap: 16 },
  item: { display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  img: { width: 72, height: 72, objectFit: 'cover', borderRadius: 8 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' },
  itemCat: { fontSize: 12, color: '#888', margin: 0 },
  rxTag: { fontSize: 11, background: '#ffebee', color: '#c62828', padding: '2px 7px', borderRadius: 4, fontWeight: 600 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 10 },
  qtyBtn: { width: 30, height: 30, borderRadius: 6, border: '1.5px solid #ddd', background: '#f5f5f5', cursor: 'pointer', fontSize: 16, fontWeight: 700 },
  qty: { fontSize: 15, fontWeight: 700, minWidth: 24, textAlign: 'center' },
  itemPrice: { fontSize: 16, fontWeight: 700, color: '#2e7d32', minWidth: 80, textAlign: 'right' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#e53935', fontSize: 16 },
  summary: { background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content' },
  summaryTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#1a1a1a' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#444', marginBottom: 10 },
  divider: { borderTop: '1px solid #eee', margin: '12px 0' },
  checkoutBtn: { width: '100%', padding: '14px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 16 },
  rxNote: { fontSize: 12, color: '#e65100', marginTop: 12, background: '#fff3e0', padding: '8px 12px', borderRadius: 6 },
};
