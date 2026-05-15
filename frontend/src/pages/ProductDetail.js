import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft, FaPills, FaWarehouse } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (!product) return null;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.back}><FaArrowLeft /> Back</button>
      <div style={styles.card}>
        <img
          src={product.image || 'https://placehold.co/500x350/e8f5e9/2e7d32?text=Medicine'}
          alt={product.name}
          style={styles.img}
        />
        <div style={styles.info}>
          <span style={styles.category}>{product.category}</span>
          <h1 style={styles.name}>{product.name}</h1>
          {product.requiresPrescription && (
            <div style={styles.rxAlert}>⚠️ Prescription Required</div>
          )}
          <p style={styles.desc}>{product.description}</p>
          <div style={styles.meta}>
            <div style={styles.metaItem}><FaPills style={{ color: '#2e7d32' }} /> <strong>Manufacturer:</strong> {product.manufacturer || 'N/A'}</div>
            <div style={styles.metaItem}><FaWarehouse style={{ color: '#2e7d32' }} /> <strong>Stock:</strong> {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}</div>
          </div>
          <div style={styles.priceRow}>
            <span style={styles.price}>₹{product.price}</span>
          </div>
          {product.stock > 0 && (
            <div style={styles.qtyRow}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn}>−</button>
              <span style={styles.qtyVal}>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} style={styles.qtyBtn}>+</button>
            </div>
          )}
          <button
            onClick={() => { addToCart(product, qty); navigate('/cart'); }}
            disabled={product.stock === 0}
            style={{ ...styles.addBtn, opacity: product.stock === 0 ? 0.5 : 1 }}
          >
            <FaShoppingCart style={{ marginRight: 8 }} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 960, margin: '0 auto', padding: '32px 24px' },
  center: { textAlign: 'center', padding: 80, fontSize: 18, color: '#888' },
  back: { background: 'none', border: 'none', cursor: 'pointer', color: '#2e7d32', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 },
  card: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, background: '#fff', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', minHeight: 360 },
  info: { padding: '36px 32px 36px 0' },
  category: { fontSize: 12, color: '#2e7d32', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 },
  name: { fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: '8px 0 12px' },
  rxAlert: { background: '#fff3e0', color: '#e65100', padding: '8px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, marginBottom: 14, display: 'inline-block' },
  desc: { color: '#555', lineHeight: 1.7, fontSize: 15, marginBottom: 20 },
  meta: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 },
  metaItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#444' },
  priceRow: { marginBottom: 20 },
  price: { fontSize: 32, fontWeight: 800, color: '#2e7d32' },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 },
  qtyBtn: { width: 36, height: 36, borderRadius: 6, border: '1.5px solid #ddd', background: '#f5f5f5', cursor: 'pointer', fontSize: 20, fontWeight: 700 },
  qtyVal: { fontSize: 18, fontWeight: 700, minWidth: 30, textAlign: 'center' },
  addBtn: { width: '100%', padding: '14px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};
