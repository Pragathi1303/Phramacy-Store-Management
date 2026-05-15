import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaFileMedical, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const statusIcon = { approved: <FaCheckCircle color="#2e7d32" />, rejected: <FaTimesCircle color="#e53935" />, pending: <FaClock color="#f57c00" /> };
const statusColor = { approved: '#e8f5e9', rejected: '#ffebee', pending: '#fff3e0' };

export default function Prescriptions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchPrescriptions();
  }, [user, navigate]);

  const fetchPrescriptions = async () => {
    try {
      const { data } = await api.get('/prescriptions/my');
      setPrescriptions(data);
    } catch { toast.error('Failed to load prescriptions'); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a file'); return; }
    const formData = new FormData();
    formData.append('prescription', file);
    setUploading(true);
    try {
      await api.post('/prescriptions', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Prescription uploaded successfully!');
      setFile(null);
      fetchPrescriptions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}><FaFileMedical style={{ color: '#2e7d32', marginRight: 10 }} />My Prescriptions</h2>

      {/* Upload Section */}
      <div style={styles.uploadCard}>
        <h3 style={styles.sectionTitle}>Upload New Prescription</h3>
        <p style={styles.hint}>Accepted formats: JPG, PNG, PDF (max 5MB)</p>
        <form onSubmit={handleUpload}>
          <div
            style={{ ...styles.dropZone, ...(dragOver ? styles.dropZoneActive : {}) }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <FaUpload size={32} color={dragOver ? '#2e7d32' : '#aaa'} />
            {file ? (
              <p style={styles.fileName}>{file.name}</p>
            ) : (
              <p style={styles.dropText}>Drag & drop or <span style={{ color: '#2e7d32', fontWeight: 700 }}>click to browse</span></p>
            )}
            <input
              id="fileInput"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <button type="submit" disabled={uploading || !file} style={{ ...styles.uploadBtn, opacity: !file ? 0.6 : 1 }}>
            {uploading ? 'Uploading...' : 'Upload Prescription'}
          </button>
        </form>
      </div>

      {/* Prescriptions List */}
      <div style={styles.listSection}>
        <h3 style={styles.sectionTitle}>Uploaded Prescriptions</h3>
        {loading ? (
          <p style={styles.loadingText}>Loading...</p>
        ) : prescriptions.length === 0 ? (
          <div style={styles.empty}>
            <FaFileMedical size={48} color="#ccc" />
            <p>No prescriptions uploaded yet</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {prescriptions.map((p) => (
              <div key={p._id} style={{ ...styles.prescCard, background: statusColor[p.status] }}>
                <div style={styles.prescHeader}>
                  <div style={styles.prescIcon}>{statusIcon[p.status]}</div>
                  <div>
                    <p style={styles.prescName}>{p.fileName}</p>
                    <p style={styles.prescDate}>{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div style={styles.prescStatus}>
                  Status: <strong style={{ textTransform: 'capitalize' }}>{p.status}</strong>
                </div>
                {p.notes && <p style={styles.prescNotes}>Note: {p.notes}</p>}
                {p.fileType !== 'application/pdf' && (
                  <a href={`http://localhost:5000${p.fileUrl}`} target="_blank" rel="noreferrer" style={styles.viewLink}>
                    View File
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 900, margin: '0 auto', padding: '32px 24px' },
  title: { fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 28, display: 'flex', alignItems: 'center' },
  uploadCard: { background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 32 },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 },
  hint: { fontSize: 13, color: '#888', marginBottom: 16 },
  dropZone: { border: '2px dashed #ddd', borderRadius: 10, padding: '40px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', marginBottom: 16 },
  dropZoneActive: { borderColor: '#2e7d32', background: '#f1f8e9' },
  dropText: { color: '#888', fontSize: 15, margin: '12px 0 0' },
  fileName: { color: '#2e7d32', fontWeight: 600, fontSize: 15, margin: '12px 0 0' },
  uploadBtn: { padding: '12px 28px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  listSection: { background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  loadingText: { color: '#888', textAlign: 'center', padding: 24 },
  empty: { textAlign: 'center', padding: '40px 24px', color: '#aaa' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },
  prescCard: { borderRadius: 10, padding: '16px', border: '1px solid rgba(0,0,0,0.06)' },
  prescHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 },
  prescIcon: { fontSize: 22 },
  prescName: { fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: 0, wordBreak: 'break-all' },
  prescDate: { fontSize: 12, color: '#888', margin: '2px 0 0' },
  prescStatus: { fontSize: 13, color: '#444' },
  prescNotes: { fontSize: 12, color: '#666', marginTop: 6, fontStyle: 'italic' },
  viewLink: { display: 'inline-block', marginTop: 8, fontSize: 13, color: '#2e7d32', fontWeight: 600 },
};
