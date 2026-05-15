import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaPills, FaFileMedical, FaUsers, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TABS = ['Overview', 'Products', 'Orders', 'Prescriptions'];
const CATEGORIES = ['Tablets', 'Syrups', 'Injections', 'Vitamins', 'Skincare', 'Equipment', 'Other'];

const emptyProduct = { name: '', description: '', price: '', category: 'Tablets', stock: '', requiresPrescription: false, manufacturer: '', image: '' };

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchAll();
  }, [user, navigate]);

  const fetchAll = async () => {
    try {
      const [p, o, rx] = await Promise.all([
        api.get('/products', { params: { limit: 100 } }),
        api.get('/orders'),
        api.get('/prescriptions'),
      ]);
      setProducts(p.data.products);
      setOrders(o.data);
      setPrescriptions(rx.data);
    } catch { toast.error('Failed to load data'); }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, form);
        toast.success('Product updated');
      } else {
        await api.post('/products', form);
        toast.success('Product added');
      }
      setShowForm(false);
      setEditProduct(null);
      setForm(emptyProduct);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchAll();
    } catch { toast.error('Delete failed'); }
  };

  const handleOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Order status updated');
      fetchAll();
    } catch { toast.error('Update failed'); }
  };

  const handlePrescriptionStatus = async (id, status) => {
    try {
      await api.put(`/prescriptions/${id}/status`, { status });
      toast.success('Prescription status updated');
      fetchAll();
    } catch { toast.error('Update failed'); }
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({ ...product, price: product.price.toString(), stock: product.stock.toString() });
    setShowForm(true);
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: <FaPills />, color: '#2e7d32' },
    { label: 'Total Orders', value: orders.length, icon: <FaBox />, color: '#1565c0' },
    { label: 'Pending Orders', value: orders.filter((o) => o.status === 'pending').length, icon: <FaBox />, color: '#f57c00' },
    { label: 'Prescriptions', value: prescriptions.length, icon: <FaFileMedical />, color: '#6a1b9a' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Admin Panel</h2>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...styles.sidebarBtn, ...(tab === t ? styles.sidebarBtnActive : {}) }}>
            {t === 'Overview' && <FaUsers />}
            {t === 'Products' && <FaPills />}
            {t === 'Orders' && <FaBox />}
            {t === 'Prescriptions' && <FaFileMedical />}
            <span style={{ marginLeft: 10 }}>{t}</span>
          </button>
        ))}
      </div>

      <div style={styles.main}>
        {/* Overview */}
        {tab === 'Overview' && (
          <div>
            <h2 style={styles.pageTitle}>Dashboard Overview</h2>
            <div style={styles.statsGrid}>
              {stats.map((s) => (
                <div key={s.label} style={{ ...styles.statCard, borderLeft: `4px solid ${s.color}` }}>
                  <div style={{ ...styles.statIcon, color: s.color }}>{s.icon}</div>
                  <div>
                    <p style={styles.statValue}>{s.value}</p>
                    <p style={styles.statLabel}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.recentSection}>
              <h3 style={styles.sectionTitle}>Recent Orders</h3>
              {orders.slice(0, 5).map((o) => (
                <div key={o._id} style={styles.recentRow}>
                  <span style={styles.recentId}>#{o._id.slice(-8).toUpperCase()}</span>
                  <span>{o.user?.name}</span>
                  <span>₹{o.totalAmount}</span>
                  <span style={{ ...styles.statusPill, background: o.status === 'delivered' ? '#e8f5e9' : '#fff3e0', color: o.status === 'delivered' ? '#2e7d32' : '#f57c00' }}>{o.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {tab === 'Products' && (
          <div>
            <div style={styles.tabHeader}>
              <h2 style={styles.pageTitle}>Products</h2>
              <button onClick={() => { setShowForm(true); setEditProduct(null); setForm(emptyProduct); }} style={styles.addBtn}>
                <FaPlus style={{ marginRight: 6 }} /> Add Product
              </button>
            </div>

            {showForm && (
              <div style={styles.formCard}>
                <h3 style={styles.sectionTitle}>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleProductSubmit} style={styles.productForm}>
                  {[
                    { name: 'name', label: 'Name', type: 'text' },
                    { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
                    { name: 'price', label: 'Price (₹)', type: 'number' },
                    { name: 'stock', label: 'Stock', type: 'number' },
                    { name: 'image', label: 'Image URL', type: 'text' },
                  ].map(({ name, label, type }) => (
                    <div key={name} style={styles.formField}>
                      <label style={styles.label}>{label}</label>
                      <input type={type} value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })} style={styles.input} required={['name', 'price', 'stock'].includes(name)} />
                    </div>
                  ))}
                  <div style={styles.formField}>
                    <label style={styles.label}>Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={styles.input}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ ...styles.formField, gridColumn: '1 / -1' }}>
                    <label style={styles.label}>Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...styles.input, height: 80, resize: 'vertical' }} required />
                  </div>
                  <div style={{ ...styles.formField, gridColumn: '1 / -1' }}>
                    <label style={styles.checkLabel}>
                      <input type="checkbox" checked={form.requiresPrescription} onChange={(e) => setForm({ ...form, requiresPrescription: e.target.checked })} />
                      Requires Prescription
                    </label>
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
                    <button type="submit" disabled={loading} style={styles.saveBtn}>{loading ? 'Saving...' : 'Save Product'}</button>
                    <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Rx</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} style={styles.tr}>
                      <td style={styles.td}>{p.name}</td>
                      <td style={styles.td}>{p.category}</td>
                      <td style={styles.td}>₹{p.price}</td>
                      <td style={{ ...styles.td, color: p.stock < 10 ? '#e53935' : '#2e7d32', fontWeight: 600 }}>{p.stock}</td>
                      <td style={styles.td}>{p.requiresPrescription ? '✅' : '—'}</td>
                      <td style={styles.td}>
                        <button onClick={() => openEdit(p)} style={styles.editBtn}><FaEdit /></button>
                        <button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}><FaTrash /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'Orders' && (
          <div>
            <h2 style={styles.pageTitle}>All Orders</h2>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Order ID</th>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} style={styles.tr}>
                      <td style={styles.td}>#{o._id.slice(-8).toUpperCase()}</td>
                      <td style={styles.td}>{o.user?.name}<br /><span style={{ fontSize: 12, color: '#888' }}>{o.user?.email}</span></td>
                      <td style={styles.td}>₹{o.totalAmount}</td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusPill, background: '#e8f5e9', color: '#2e7d32' }}>{o.status}</span>
                      </td>
                      <td style={styles.td}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <select
                          value={o.status}
                          onChange={(e) => handleOrderStatus(o._id, e.target.value)}
                          style={styles.selectSmall}
                        >
                          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Prescriptions */}
        {tab === 'Prescriptions' && (
          <div>
            <h2 style={styles.pageTitle}>Prescriptions</h2>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>Patient</th>
                    <th style={styles.th}>File</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((p) => (
                    <tr key={p._id} style={styles.tr}>
                      <td style={styles.td}>{p.user?.name}<br /><span style={{ fontSize: 12, color: '#888' }}>{p.user?.email}</span></td>
                      <td style={styles.td}>
                        <a href={`http://localhost:5000${p.fileUrl}`} target="_blank" rel="noreferrer" style={{ color: '#2e7d32', fontSize: 13 }}>
                          {p.fileName}
                        </a>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusPill, background: p.status === 'approved' ? '#e8f5e9' : p.status === 'rejected' ? '#ffebee' : '#fff3e0', color: p.status === 'approved' ? '#2e7d32' : p.status === 'rejected' ? '#c62828' : '#f57c00' }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={styles.td}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <button onClick={() => handlePrescriptionStatus(p._id, 'approved')} style={styles.approveBtn} title="Approve"><FaCheck /></button>
                        <button onClick={() => handlePrescriptionStatus(p._id, 'rejected')} style={styles.rejectBtn} title="Reject"><FaTimes /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#f5f7fa' },
  sidebar: { width: 220, background: '#1b5e20', padding: '28px 0', flexShrink: 0 },
  sidebarTitle: { color: '#fff', fontSize: 18, fontWeight: 800, padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 12 },
  sidebarBtn: { display: 'flex', alignItems: 'center', width: '100%', padding: '12px 20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', cursor: 'pointer', fontSize: 14, fontWeight: 500, textAlign: 'left' },
  sidebarBtnActive: { background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700 },
  main: { flex: 1, padding: '32px', overflowY: 'auto' },
  pageTitle: { fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 24 },
  tabHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20, marginBottom: 32 },
  statCard: { background: '#fff', borderRadius: 10, padding: '20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statIcon: { fontSize: 28 },
  statValue: { fontSize: 28, fontWeight: 800, color: '#1a1a1a', margin: 0 },
  statLabel: { fontSize: 13, color: '#888', margin: 0 },
  recentSection: { background: '#fff', borderRadius: 10, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 },
  recentRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14 },
  recentId: { fontWeight: 700, color: '#1a1a1a' },
  statusPill: { padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' },
  addBtn: { display: 'flex', alignItems: 'center', padding: '10px 20px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  formCard: { background: '#fff', borderRadius: 10, padding: '24px', marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  productForm: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  formField: {},
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 5 },
  checkLabel: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#444', cursor: 'pointer' },
  input: { width: '100%', padding: '9px 12px', border: '1.5px solid #ddd', borderRadius: 7, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  saveBtn: { padding: '10px 24px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  cancelBtn: { padding: '10px 24px', background: '#fff', color: '#666', border: '1.5px solid #ddd', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  tableWrap: { background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f5f7fa' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#555', borderBottom: '1px solid #eee' },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px 16px', fontSize: 14, color: '#333', verticalAlign: 'middle' },
  editBtn: { background: '#e3f2fd', color: '#1565c0', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', marginRight: 6 },
  deleteBtn: { background: '#ffebee', color: '#c62828', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' },
  approveBtn: { background: '#e8f5e9', color: '#2e7d32', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', marginRight: 6 },
  rejectBtn: { background: '#ffebee', color: '#c62828', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' },
  selectSmall: { padding: '5px 8px', border: '1.5px solid #ddd', borderRadius: 6, fontSize: 13, cursor: 'pointer' },
};
