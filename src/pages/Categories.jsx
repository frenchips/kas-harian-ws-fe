import { useState, useEffect, useCallback } from 'react'
import { categoriesService } from '../services/categoriesService'
import Toast from '../components/Toast'

function Categories() {
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    categoriesName: '',
    type: 'INCOME'
  })
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  })
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const showToast = useCallback((message, type = 'success') => {
    setToast({ isVisible: true, message, type })
  }, [])

  const closeToast = useCallback(() => {
    setToast({ ...toast, isVisible: false })
  }, [toast])

  const startIndex = currentPage * pageSize
  const endIndex = startIndex + categories.length

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value)
    setPageSize(newSize)
    setCurrentPage(0)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setCurrentPage(0)
  }

  useEffect(() => {
    loadCategories()
  }, [currentPage, pageSize, searchQuery])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoriesService.getCategories(currentPage, pageSize, searchQuery)
      console.log('Full API Response:', data)
      
      // Handle both possible response structures
      let categoriesData = []
      let paginationData = {}
      
      if (data && data.data && data.data.listData) {
        categoriesData = data.data.listData
        paginationData = data.data
      } else if (data && data.listData) {
        categoriesData = data.listData
        paginationData = data
      } else if (Array.isArray(data)) {
        categoriesData = data
      } else if (Array.isArray(data.data)) {
        categoriesData = data.data
      }
      
      console.log('Categories data:', categoriesData)
      console.log('Pagination data:', paginationData)
      console.log('Is array:', Array.isArray(categoriesData))
      console.log('Length:', categoriesData.length)
      
      setCategories(categoriesData)
      setTotalPages(paginationData.totalPages || 0)
      setTotalElements(paginationData.totalElements || 0)
    } catch (error) {
      console.error('Error loading categories:', error)
      setCategories([])
      setTotalPages(0)
      setTotalElements(0)
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
      let response
      if (editingCategory) {
        response = await categoriesService.updateCategory(editingCategory.id, formData)
      } else {
        response = await categoriesService.createCategory(formData)
      }
      setShowModal(false)
      setCurrentPage(0)
      loadCategories()
      showToast(response.message || 'Berhasil menyimpan kategori')
    } catch (error) {
      console.error('Error submitting form:', error)
      showToast(error.message || 'Gagal menyimpan kategori', 'error')
    }
  }

  const handleDelete = async (category) => {
    if (confirm(`Yakin ingin menghapus kategori ${category.categoriesName}?`)) {
      try {
        const response = await categoriesService.deleteCategory(category.id)
        setCurrentPage(0)
        loadCategories()
        showToast(response.message || 'Berhasil menghapus kategori')
      } catch (error) {
        console.error('Error deleting category:', error)
        showToast(error.message || 'Gagal menghapus kategori', 'error')
      }
    }
  }

  return (
    <div>
      <h1 className="page-title" style={{ marginBottom: '1rem' }}>Categories</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '400px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ width: '100%' }}
            />
          </div>
        </form>
        <button className="btn-primary" style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', width: 'auto', flex: '0 0 auto', whiteSpace: 'nowrap' }} onClick={handleAdd}>
          <span>+</span>
          <span>Tambah</span>
        </button>
      </div>

      <div className="categories-section">
      

        {loading ? (
          <div className="loading">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <p>Tidak ada kategori</p>
          </div>
        ) : (
          <>
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
            
            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Menampilkan {startIndex + 1} - {Math.min(endIndex, totalElements)} dari {totalElements} data
                </div>
                <div className="pagination-controls">
                  <div className="page-size-selector">
                    <label>Tampilkan:</label>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                  <div className="pagination-buttons">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                      <button
                        key={page}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page + 1}
                      </button>
                    ))}
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
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

      <Toast 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={closeToast}
        type={toast.type}
      />
    </div>
  )
}

export default Categories
