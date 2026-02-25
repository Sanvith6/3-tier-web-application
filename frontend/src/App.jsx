import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const initialForm = {
  name: '',
  price: '',
  category: '',
  stock: ''
};

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  async function fetchProducts() {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setFormData(initialForm);
    setEditingId(null);
  }

  function startEditing(product) {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock)
    });
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    };

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/products/${editingId}`, payload);
      } else {
        await axios.post(`${API_URL}/products`, payload);
      }

      resetForm();
      fetchProducts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to save product');
    }
  }

  async function handleDelete(id) {
    setError('');

    try {
      await axios.delete(`${API_URL}/products/${id}`);
      if (editingId === id) {
        resetForm();
      }
      fetchProducts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to delete product');
    }
  }

  return (
    <main className="container">
      <section className="panel">
        <h1>Product Inventory</h1>
        <p>React + Express + MySQL CRUD application</p>

        <form className="form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleInputChange}
            required
          />

          <div className="actions">
            <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
            {isEditing && (
              <button type="button" className="ghost" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && <p className="error">{error}</p>}
      </section>

      <section className="panel table-panel">
        <h2>Products</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6">No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button type="button" onClick={() => startEditing(product)}>
                        Edit
                      </button>
                      <button type="button" className="danger" onClick={() => handleDelete(product.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default App;
