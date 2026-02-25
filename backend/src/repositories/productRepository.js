const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.query(
    'SELECT id, name, price, category, stock, created_at AS createdAt, updated_at AS updatedAt FROM products ORDER BY id DESC'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, price, category, stock, created_at AS createdAt, updated_at AS updatedAt FROM products WHERE id = ?',
    [id]
  );

  return rows[0] || null;
}

async function create(product) {
  const [result] = await pool.query(
    'INSERT INTO products (name, price, category, stock) VALUES (?, ?, ?, ?)',
    [product.name, product.price, product.category, product.stock]
  );

  return findById(result.insertId);
}

async function update(id, product) {
  const [result] = await pool.query(
    'UPDATE products SET name = ?, price = ?, category = ?, stock = ? WHERE id = ?',
    [product.name, product.price, product.category, product.stock, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
