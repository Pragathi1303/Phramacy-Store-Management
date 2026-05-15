import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaCheckCircle, FaTruck, FaClock, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const statusConfig = {
  pending:   { icon: <FaClock />,        color: '#f57c00', bg: '#fff3e0' },
  confirmed: { icon: <FaCheckCircle />,  color: '#1565c0', bg: '#e3f2fd' },
  shipped:   { icon: <FaTruck />,        color: '#6a1b9a', bg: '#f3e5f5' },
  delivered: { icon: <FaCheckCircle />,  color: '#2e7d32', bg: '#e8f5e9' },
  cancelled: { icon: <FaTimesCircle />,  color: '#c62828', bg: '#ffebee' },
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders/my')
      .then(({ data }) => setOrders(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (loading) return <div style={styles.center}>Loading orders...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}><FaBox style={{ color: '#2e7d32', marginRight: 10 }} />My Orders</h2>
      {orders.length === 0 ? (
        <div style={styles.empty}>
          <FaBox size={64} color="#ccc" />
          <p>No orders yet. Start shopping!</p>
          <button onClick={() => navigate('/')} style={styles.shopBtn}>Browse Medicines</button>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map((order) => {
            const cfg = statusConfig[order.status] || statusConfig.pending;
            return (
              <div key={order._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <p style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div style={{ ...styles.statusBadge, background: cfg.bg, color: cfg.color }}>
                    {cfg.icon} <span style={{ marginLeft: 6, textTransform: 'capitalize' }}>{order.status}</span>
                  </div>
                </div>
                <div style={styles.items}>
                  {order.items.map((item) => (
                    <div key={item._id} style={styles.item}>
                      <img
                        src={item.product?.image || 'https://placehold.co/50x50/e8f5e9/2e7d32?text=Med'}
                        alt={item.product?.name}
                        style={styles.img}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={styles.itemName}>{item.product?.name || 'Product'}</p>
                        <p style={styles.itemQty}>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <span style={styles.itemTotal}>₹{(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.cardFooter}>
                  <div style={styles.address}>
                    📍 {order.shippingAddress?.street}, {order.shippingAddress?.city}
                  </div>
                  <div style={styles.total}>Total: <strong>₹{order.totalAmount.toFixed(2)}</strong></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 860, margin: '0 auto', padding: '32px 24px' },
  center: { textAlign: 'center', padding: 80, color: '#888', fontSize: 18 },
  title: { fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 28, display: 'flex', alignItems: 'center' },
  empty: { textAlign: 'center', padding: '60px 24px', color: '#aaa' },
  shopBtn: { marginTop: 16, padding: '12px 28px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15 },
  list: { display: 'flex', flexDirection: 'column', gap: 20 },
  card: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f0f0f0' },
  orderId: { fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: 0 },
  orderDate: { fontSize: 13, color: '#888', margin: '3px 0 0' },
  statusBadge: { display: 'flex', alignItems: 'center', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 },
  items: { padding: '12px 20px' },
  item: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f9f9f9' },
  img: { width: 44, height: 44, objectFit: 'cover', borderRadius: 6 },
  itemName: { fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: 0 },
  itemQty: { fontSize: 12, color: '#888', margin: '2px 0 0' },
  itemTotal: { fontSize: 14, fontWeight: 700, color: '#2e7d32' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: '#fafafa' },
  address: { fontSize: 13, color: '#666' },
  total: { fontSize: 15, color: '#1a1a1a' },
};
