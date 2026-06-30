const API_BASE_URL = 'http://localhost:8084'

export const transactionService = {
  async createTransaction(transactionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating transaction:', error)
      throw error
    }
  },

  async updateTransaction(id, transactionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/transaction/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      })
      return await response.json()
    } catch (error) {
      console.error('Error updating transaction:', error)
      throw error
    }
  },


  async deleteTransaction(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/transaction/${id}`, {
        method: 'DELETE',
      })
      return await response.json()
    } catch (error) {
      console.error('Error deleting transaction:', error)
      throw error
    }
  },

  async getTransactions() {
    try {
      const response = await fetch(`${API_BASE_URL}/transaction`)
      const data = await response.json()
      console.log('getTransactions response:', data)
      return data
    } catch (error) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  },
}
