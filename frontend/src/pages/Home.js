import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const CATEGORIES = ['All', 'Tablets', 'Syrups', 'Injections', 'Vitamins', 'Skincare', 'Equipment', 'Other'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div style={styles.container}>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Your Trusted Online Pharmacy</h1>
        <p style={styles.heroSub}>Quality medicines delivered to your doorstep</p>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search medicines, vitamins, equipment..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}><FaSearch /> Search</button>
        </form>
      </div>

      {/* Category Filter */}
      <div style={styles.filterRow}>
        <FaFilter style={{ color: '#2e7d32', marginRight: 8 }} />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            style={{ ...styles.catBtn, ...(category === cat ? styles.catBtnActive : {}) }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={styles.loading}>
          {[...Array(8)].map((_, i) => <div key={i} style={styles.skeleton} />)}
        </div>
      ) : products.length === 0 ? (
        <div style={styles.empty}>
          <p>No medicines found. Try a different search.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{ ...styles.pageBtn, ...(page === i + 1 ? styles.pageBtnActive : {}) }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f5f7fa' },
  hero: { background: 'linear-gradient(135deg, #1b5e20 0%, #43a047 100%)', color: '#fff', padding: '60px 32px', textAlign: 'center' },
  heroTitle: { fontSize: 36, fontWeight: 800, margin: '0 0 10px' },
  heroSub: { fontSize: 18, opacity: 0.9, margin: '0 0 28px' },
  searchForm: { display: 'flex', maxWidth: 560, margin: '0 auto', gap: 0 },
  searchInput: { flex: 1, padding: '14px 20px', fontSize: 15, border: 'none', borderRadius: '8px 0 0 8px', outline: 'none' },
  searchBtn: { padding: '14px 24px', background: '#ff6f00', color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 },
  filterRow: { display: 'flex', flexWrap: 'wrap', gap: 10, padding: '24px 32px', alignItems: 'center', background: '#fff', borderBottom: '1px solid #eee' },
  catBtn: { padding: '7px 16px', borderRadius: 20, border: '1.5px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#555', transition: 'all 0.2s' },
  catBtnActive: { background: '#2e7d32', color: '#fff', borderColor: '#2e7d32' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24, padding: '32px' },
  loading: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24, padding: '32px' },
  skeleton: { height: 320, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', borderRadius: 12, animation: 'pulse 1.5s infinite' },
  empty: { textAlign: 'center', padding: '80px 32px', color: '#888', fontSize: 18 },
  pagination: { display: 'flex', justifyContent: 'center', gap: 8, padding: '24px 32px 40px' },
  pageBtn: { width: 38, height: 38, borderRadius: 6, border: '1.5px solid #ddd', background: '#fff', cursor: 'pointer', fontWeight: 600 },
  pageBtnActive: { background: '#2e7d32', color: '#fff', borderColor: '#2e7d32' },
};
