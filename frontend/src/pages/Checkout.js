import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ street: '', city: '', state: '', zip: '', paymentMethod: 'COD' });
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!user) { navigate('/login'); return null; }
  if (cart.length === 0 && !ordered) { navigate('/cart'); return null; }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.state || !form.zip) {
      toast.error('Please fill all address fields');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: cart.map((i) => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: { street: form.street, city: form.city, state: form.state, zip: form.zip },
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      setOrderId(data._id);
      setOrdered(true);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (ordered) {
    return (
      <div style={styles.success}>
        <FaCheckCircle size={72} color="#2e7d32" />
        <h2>Order Placed Successfully!</h2>
        <p>Order ID: <strong>{orderId}</strong></p>
        <p>We'll deliver your medicines soon. Thank you for shopping with PharmaCare!</p>
        <div style={styles.successBtns}>
          <button onClick={() => navigate('/orders')} style={styles.ordersBtn}>View My Orders</button>
          <button onClick={() => navigate('/')} style={styles.homeBtn}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Checkout</h2>
      <div style={styles.layout}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={styles.sectionTitle}>Shipping Address</h3>
          {[
            { name: 'street', label: 'Street Address', placeholder: '123 Main St' },
            { name: 'city', label: 'City', placeholder: 'Mumbai' },
            { name: 'state', label: 'State', placeholder: 'Maharashtra' },
            { name: 'zip', label: 'ZIP Code', placeholder: '400001' },
          ].map(({ name, label, placeholder }) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} style={styles.input} required />
            </div>
          ))}

          <h3 style={styles.sectionTitle}>Payment Method</h3>
          {['COD', 'Online'].map((method) => (
            <label key={method} style={styles.radioLabel}>
              <input type="radio" name="paymentMethod" value={method} checked={form.paymentMethod === method} onChange={handleChange} />
              {method === 'COD' ? 'Cash on Delivery' : 'Online Payment (Coming Soon)'}
            </label>
          ))}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Placing Order...' : `Place Order • ₹${total.toFixed(2)}`}
          </button>
        </form>

        <div style={styles.summary}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>
          {cart.map((item) => (
            <div key={item._id} style={styles.summaryItem}>
              <img src={item.image || 'https://placehold.co/50x50/e8f5e9/2e7d32?text=Med'} alt={item.name} style={styles.summaryImg} />
              <div style={{ flex: 1 }}>
                <p style={styles.summaryName}>{item.name}</p>
                <p style={styles.summaryQty}>Qty: {item.quantity}</p>
              </div>
              <span style={styles.summaryPrice}>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={styles.divider} />
          <div style={styles.totalRow}>
            <span>Subtotal</span><span>₹{total.toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <span>Delivery</span><span style={{ color: '#2e7d32' }}>FREE</span>
          </div>
          <div style={{ ...styles.totalRow, fontWeight: 700, fontSize: 18, marginTop: 8 }}>
            <span>Total</span><span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 1000, margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 28, color: '#1a1a1a' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28 },
  form: { background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 16, marginTop: 8 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#444', marginBottom: 10, cursor: 'pointer' },
  submitBtn: { width: '100%', padding: '14px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 20 },
  summary: { background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: 'fit-content' },
  summaryItem: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
  summaryImg: { width: 48, height: 48, objectFit: 'cover', borderRadius: 6 },
  summaryName: { fontSize: 13, fontWeight: 600, margin: 0, color: '#1a1a1a' },
  summaryQty: { fontSize: 12, color: '#888', margin: 0 },
  summaryPrice: { fontSize: 14, fontWeight: 700, color: '#2e7d32' },
  divider: { borderTop: '1px solid #eee', margin: '12px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#444', marginBottom: 8 },
  success: { textAlign: 'center', padding: '80px 24px', color: '#1a1a1a' },
  successBtns: { display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24 },
  ordersBtn: { padding: '12px 28px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15 },
  homeBtn: { padding: '12px 28px', background: '#fff', color: '#2e7d32', border: '2px solid #2e7d32', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15 },
};
