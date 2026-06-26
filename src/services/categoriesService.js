const API_BASE_URL = 'http://localhost:8084'

export const categoriesService = {
  async createCategory(categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })
      return await response.json()
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  },

  async updateCategory(id, categoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })
      return await response.json()
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  async deleteCategory(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
      })
      return await response.json()
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  },
}
