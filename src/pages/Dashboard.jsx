function Dashboard() {
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      <div className="cards-grid">
        <div className="category-card" style={{ borderTop: '4px solid #f59e0b' }}>
          <div className="card-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            📂
          </div>
          <div className="card-content">
            <h3>Pictures</h3>
            <p>180 files</p>
          </div>
        </div>
        <div className="category-card" style={{ borderTop: '4px solid #10b981' }}>
          <div className="card-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            📄
          </div>
          <div className="card-content">
            <h3>Documents</h3>
            <p>0 files</p>
          </div>
        </div>
        <div className="category-card" style={{ borderTop: '4px solid #ec4899' }}>
          <div className="card-icon" style={{ background: '#fce7f3', color: '#db2777' }}>
            📽️
          </div>
          <div className="card-content">
            <h3>Videos</h3>
            <p>0 files</p>
          </div>
        </div>
        <div className="category-card" style={{ borderTop: '4px solid #3b82f6' }}>
          <div className="card-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            🔊
          </div>
          <div className="card-content">
            <h3>Audio</h3>
            <p>20 files</p>
          </div>
        </div>
      </div>

      <div className="categories-section">
        <div className="section-header">
          <h2>Welcome to Kas Harian</h2>
        </div>
        <div className="empty-state">
          <p>Silakan pilih menu Categories untuk mengelola kategori.</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
