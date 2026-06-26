import { useState, useEffect } from 'react'
import { categoriesService } from '../services/categoriesService'

function Categories() {
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    categoriesName: '',
    type: 'INCOME'
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoriesService.getCategories()
      setCategories(data.data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingCategory(null)
    setFormData({ categoriesName: '', type: 'INCOME' })
    setShowModal(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      categoriesName: category.categoriesName,
      type: category.type
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await categoriesService.updateCategory(editingCategory.id, formData)
      } else {
        await categoriesService.createCategory(formData)
      }
      setShowModal(false)
      loadCategories()
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Gagal menyimpan kategori')
    }
  }

  const handleDelete = async (category) => {
    if (confirm(`Yakin ingin menghapus kategori ${category.categoriesName}?`)) {
      try {
        await categoriesService.deleteCategory(category.id)
        loadCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Gagal menghapus kategori')
      }
    }
  }

  const incomeCount = categories.filter(c => c.type === 'INCOME').length
  const expenseCount = categories.filter(c => c.type === 'EXPENSE').length

  return (
    <div>
      <h1 className="page-title">Categories</h1>

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
            <p>{incomeCount} files</p>
          </div>
        </div>
        <div className="category-card" style={{ borderTop: '4px solid #ec4899' }}>
          <div className="card-icon" style={{ background: '#fce7f3', color: '#db2777' }}>
            📽️
          </div>
          <div className="card-content">
            <h3>Videos</h3>
            <p>{expenseCount} files</p>
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
          <h2>List Categories</h2>
          <button className="btn-primary" onClick={handleAdd}>
            <span>+</span>
            <span>Tambah Kategori</span>
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <p>Tidak ada kategori</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Nama Kategori</th>
                  <th>Tipe</th>
                  <th style={{ width: '120px' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td style={{ fontWeight: 500 }}>{category.categoriesName}</td>
                    <td>
                      <span className={`type-badge type-${category.type.toLowerCase()}`}>
                        {category.type}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon edit" onClick={() => handleEdit(category)} title="Edit">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(category)} title="Hapus">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="categoriesName">Nama Kategori</label>
                <input
                  type="text"
                  id="categoriesName"
                  name="categoriesName"
                  value={formData.categoriesName}
                  onChange={(e) => setFormData({ ...formData, categoriesName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Tipe</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="INCOME">INCOME</option>
                  <option value="EXPENSE">EXPENSE</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
