import { useState, useEffect, useCallback } from 'react'
import { categoriesService } from '../services/categoriesService'
import { transactionService } from '../services/transactionService'
import Toast from '../components/Toast'

function Kas() {
  const [kasList, setKasList] = useState([])
  const [categories, setCategories] = useState([])
  const [editingKas, setEditingKas] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    categoriesId: '',
    description: '',
    income: '',
    expend: '',
    transactionDate: new Date().toISOString().split('T')[0]
  })
  const [amountInput, setAmountInput] = useState('')
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ isVisible: true, message, type })
  }, [])

  const closeToast = useCallback(() => {
    setToast({ ...toast, isVisible: false })
  }, [toast])

  const totalPages = Math.ceil(kasList.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentKasList = kasList.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value)
    setPageSize(newSize)
    setCurrentPage(1)
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const categoriesData = await categoriesService.getCategories(0, 100, '')
      const categoriesList = categoriesData.data?.listData || []
      
      if (categoriesList.length === 0) {
        // Gunakan dummy categories jika tidak ada data
        setCategories([
          { id: 1, categoriesName: 'Gaji', type: 'INCOME' },
          { id: 2, categoriesName: 'Bonus', type: 'INCOME' },
          { id: 3, categoriesName: 'Hasil Usaha', type: 'INCOME' },
          { id: 4, categoriesName: 'Sewaan', type: 'INCOME' },
          { id: 5, categoriesName: 'Makan', type: 'EXPENSE' },
          { id: 6, categoriesName: 'Transportasi', type: 'EXPENSE' },
          { id: 7, categoriesName: 'Belanja', type: 'EXPENSE' },
          { id: 8, categoriesName: 'Hiburan', type: 'EXPENSE' },
          { id: 9, categoriesName: 'Pendidikan', type: 'EXPENSE' },
          { id: 10, categoriesName: 'Kesehatan', type: 'EXPENSE' },
        ])
      } else {
        setCategories(categoriesList)
      }
      
      const transactionData = await transactionService.getTransactions()
      const transactionsList = transactionData.data || []
      
      if (transactionsList.length === 0) {
        // Gunakan dummy transactions jika tidak ada data
        setKasList([
          { id: 1, transactionDate: '2024-06-25', categoriesId: 1, categoriesName: 'Gaji', description: 'Gaji bulanan', income: 5000000, expend: 0 },
          { id: 2, transactionDate: '2024-06-26', categoriesId: 5, categoriesName: 'Makan', description: 'Makan siang', income: 0, expend: 25000 },
          { id: 3, transactionDate: '2024-06-27', categoriesId: 6, categoriesName: 'Transportasi', description: 'Bensin', income: 0, expend: 50000 },
        ])
      } else {
        setKasList(transactionsList)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      // Jika API error, gunakan dummy data
      setCategories([
        { id: 1, categoriesName: 'Gaji', type: 'INCOME' },
        { id: 2, categoriesName: 'Bonus', type: 'INCOME' },
        { id: 3, categoriesName: 'Hasil Usaha', type: 'INCOME' },
        { id: 4, categoriesName: 'Sewaan', type: 'INCOME' },
        { id: 5, categoriesName: 'Makan', type: 'EXPENSE' },
        { id: 6, categoriesName: 'Transportasi', type: 'EXPENSE' },
        { id: 7, categoriesName: 'Belanja', type: 'EXPENSE' },
        { id: 8, categoriesName: 'Hiburan', type: 'EXPENSE' },
        { id: 9, categoriesName: 'Pendidikan', type: 'EXPENSE' },
        { id: 10, categoriesName: 'Kesehatan', type: 'EXPENSE' },
      ])
      setKasList([
        { id: 1, transactionDate: '2024-06-25', categoriesId: 1, categoriesName: 'Gaji', description: 'Gaji bulanan', income: 5000000, expend: 0 },
        { id: 2, transactionDate: '2024-06-26', categoriesId: 5, categoriesName: 'Makan', description: 'Makan siang', income: 0, expend: 25000 },
        { id: 3, transactionDate: '2024-06-27', categoriesId: 6, categoriesName: 'Transportasi', description: 'Bensin', income: 0, expend: 50000 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingKas(null)
    setAmountInput('')
    setFormData({
      categoriesId: '',
      description: '',
      income: '',
      expend: '',
      transactionDate: new Date().toISOString().split('T')[0]
    })
    setShowModal(true)
  }

  const handleEdit = (kas) => {
    setEditingKas(kas)
    const amount = kas.income > 0 ? kas.income : kas.expend
    setAmountInput(amount > 0 ? amount.toString() : '')
    setFormData({
      categoriesId: kas.categoriesId,
      description: kas.description,
      income: kas.income > 0 ? kas.income.toString() : '',
      expend: kas.expend > 0 ? kas.expend.toString() : '',
      transactionDate: kas.transactionDate?.split('T')[0] || new Date().toISOString().split('T')[0]
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Konversi ke number sebelum kirim ke API
      const submitData = {
        ...formData,
        income: formData.income === '' ? 0 : parseInt(formData.income) || 0,
        expend: formData.expend === '' ? 0 : parseInt(formData.expend) || 0
      }
      let response
      if (editingKas) {
        response = await transactionService.updateTransaction(editingKas.id, submitData)
      } else {
        response = await transactionService.createTransaction(submitData)
      }
      setShowModal(false)
      loadData()
      setCurrentPage(1)
      showToast(response.message || (editingKas ? 'Berhasil mengupdate data kas' : 'Berhasil menambah data kas'))
    } catch (error) {
      console.error('Error submitting form:', error)
      showToast(error.message || 'Gagal menyimpan data kas', 'error')
    }
  }

  const handleDelete = async (kas) => {
    if (confirm(`Yakin ingin menghapus data kas ${kas.description}?`)) {
      try {
        const response = await transactionService.deleteTransaction(kas.id)
        loadData()
        showToast(response.message || 'Berhasil menghapus data kas')
      } catch (error) {
        console.error('Error deleting kas:', error)
        showToast(error.message || 'Gagal menghapus data kas', 'error')
      }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
  }

  const totalIncome = kasList.filter(k => k.income > 0).reduce((sum, k) => sum + (parseInt(k.income) || 0), 0)
  const totalExpense = kasList.filter(k => k.expend > 0).reduce((sum, k) => sum + (parseInt(k.expend) || 0), 0)
  const netBalance = totalIncome - totalExpense

  return (
    <div>
      <div className="section-header" style={{ marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Kas</h1>
        <button className="btn-primary" style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem', width: 'auto', flex: '0 0 auto' }} onClick={handleAdd}>
          <span>+</span>
          <span>Tambah</span>
        </button>
      </div>

      <div className="cards-grid">
        <div className="category-card" style={{ borderTop: '4px solid #10b981' }}>
          <div className="card-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            +
          </div>
          <div className="card-content">
            <h3>Pemasukan</h3>
            <p>{formatCurrency(totalIncome)}</p>
          </div>
        </div>
        <div className="category-card" style={{ borderTop: '4px solid #ef4444' }}>
          <div className="card-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            -
          </div>
          <div className="card-content">
            <h3>Pengeluaran</h3>
            <p>{formatCurrency(totalExpense)}</p>
          </div>
        </div>
        <div className="category-card" style={{ borderTop: '4px solid #3b82f6' }}>
          <div className="card-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            =
          </div>
          <div className="card-content">
            <h3>Saldo</h3>
            <p>{formatCurrency(netBalance)}</p>
          </div>
        </div>
      </div>

      <div className="categories-section">
        <div className="section-header">
          <h2>Daftar Kas</h2>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : kasList.length === 0 ? (
          <div className="empty-state">
            <p>Tidak ada data kas</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="categories-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Kategori</th>
                    <th>Keterangan</th>
                    <th>Jenis</th>
                    <th>Jumlah</th>
                    <th style={{ width: '120px' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentKasList.map((kas) => {
                    const isIncome = kas.income > 0
                    return (
                      <tr key={kas.id}>
                        <td>{kas.transactionDate?.split('T')[0] || '-'}</td>
                        <td>{kas.categoriesName || categories.find(c => c.id === kas.categoriesId)?.categoriesName || '-'}</td>
                        <td style={{ fontWeight: 500 }}>{kas.description}</td>
                        <td>
                          <span className={`type-badge type-${isIncome ? 'income' : 'expense'}`}>
                            {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 600, color: isIncome ? '#059669' : '#dc2626' }}>
                          {formatCurrency(isIncome ? kas.income : kas.expend)}
                        </td>
                        <td>
                          <button className="btn-icon edit" onClick={() => handleEdit(kas)} title="Edit">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="btn-icon delete" onClick={() => handleDelete(kas)} title="Hapus">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Menampilkan {startIndex + 1} - {Math.min(endIndex, kasList.length)} dari {kasList.length} data
                </div>
                <div className="pagination-controls">
                  <div className="page-size-selector">
                    <label>Tampilkan:</label>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  <div className="pagination-buttons">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
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
              <h2>{editingKas ? 'Edit Kas' : 'Tambah Kas'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="transactionDate">Tanggal</label>
                <input
                  type="date"
                  id="transactionDate"
                  name="transactionDate"
                  value={formData.transactionDate}
                  onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="categoriesId">Kategori</label>
                <select
                  id="categoriesId"
                  name="categoriesId"
                  value={formData.categoriesId}
                  onChange={(e) => {
                    const selectedCategory = categories.find(c => c.id === parseInt(e.target.value))
                    // Reset income/expend based on category type
                    setFormData(prev => {
                      let newFormData = { ...prev, categoriesId: e.target.value }
                      if (selectedCategory?.type === 'INCOME') {
                        newFormData.expend = ''
                        newFormData.income = amountInput
                      } else if (selectedCategory?.type === 'EXPENSE') {
                        newFormData.income = ''
                        newFormData.expend = amountInput
                      }
                      return newFormData
                    })
                  }}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoriesName} ({category.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Keterangan</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Masukkan keterangan"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Jumlah</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={amountInput}
                  onChange={(e) => {
                    const newValue = e.target.value
                    setAmountInput(newValue)
                    const selectedCategory = categories.find(c => c.id === parseInt(formData.categoriesId))
                    if (selectedCategory?.type === 'INCOME') {
                      setFormData(prev => ({ ...prev, income: newValue, expend: '' }))
                    } else if (selectedCategory?.type === 'EXPENSE') {
                      setFormData(prev => ({ ...prev, expend: newValue, income: '' }))
                    }
                  }}
                  placeholder="Masukkan jumlah"
                  min="0"
                  required={!!formData.categoriesId}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  {editingKas ? 'Update' : 'Simpan'}
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

export default Kas
