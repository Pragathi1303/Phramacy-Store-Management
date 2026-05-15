import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div style={styles.card}>
      <div style={styles.imgWrap}>
        <img src={product.image || 'https://placehold.co/300x200/e8f5e9/2e7d32?text=Medicine'} alt={product.name} style={styles.img} />
        {product.requiresPrescription && (
          <span style={styles.rxBadge}>Rx Required</span>
        )}
      </div>
      <div style={styles.body}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.desc}>{product.description.slice(0, 70)}...</p>
        <div style={styles.footer}>
          <span style={styles.price}>₹{product.price}</span>
          <div style={styles.actions}>
            <Link to={`/product/${product._id}`} style={styles.viewBtn}><FaEye /></Link>
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              style={{ ...styles.cartBtn, opacity: product.stock === 0 ? 0.5 : 1 }}
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
        {product.stock === 0 && <p style={styles.outOfStock}>Out of Stock</p>}
        {product.stock > 0 && product.stock <= 10 && (
          <p style={styles.lowStock}>Only {product.stock} left!</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' },
  imgWrap: { position: 'relative' },
  img: { width: '100%', height: 180, objectFit: 'cover' },
  rxBadge: { position: 'absolute', top: 10, left: 10, background: '#e53935', color: '#fff', fontSize: 11, padding: '3px 8px', borderRadius: 4, fontWeight: 600 },
  body: { padding: '14px 16px' },
  category: { fontSize: 11, color: '#2e7d32', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 },
  name: { margin: '6px 0 4px', fontSize: 15, fontWeight: 700, color: '#1a1a1a' },
  desc: { fontSize: 13, color: '#666', margin: '0 0 12px' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: 700, color: '#2e7d32' },
  actions: { display: 'flex', gap: 8 },
  viewBtn: { background: '#e8f5e9', color: '#2e7d32', border: 'none', borderRadius: 6, padding: '8px 10px', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center' },
  cartBtn: { background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  outOfStock: { color: '#e53935', fontSize: 12, margin: '6px 0 0', fontWeight: 600 },
  lowStock: { color: '#f57c00', fontSize: 12, margin: '6px 0 0', fontWeight: 600 },
};
