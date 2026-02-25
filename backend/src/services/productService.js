const productRepository = require('../repositories/productRepository');

function validateProductInput(payload) {
  const errors = [];

  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    errors.push('name is required');
  }

  if (payload.price === undefined || payload.price === null || Number(payload.price) < 0) {
    errors.push('price must be a non-negative number');
  }

  if (!payload.category || typeof payload.category !== 'string' || payload.category.trim().length === 0) {
    errors.push('category is required');
  }

  if (payload.stock === undefined || payload.stock === null || Number(payload.stock) < 0) {
    errors.push('stock must be a non-negative integer');
  }

  return errors;
}

function normalizeProduct(payload) {
  return {
    name: payload.name.trim(),
    price: Number(payload.price),
    category: payload.category.trim(),
    stock: Number(payload.stock)
  };
}

async function getAllProducts() {
  return productRepository.findAll();
}

async function getProductById(id) {
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('Invalid id');
    error.status = 400;
    throw error;
  }

  return productRepository.findById(id);
}

async function createProduct(payload) {
  const errors = validateProductInput(payload);

  if (errors.length > 0) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }

  return productRepository.create(normalizeProduct(payload));
}

async function updateProduct(id, payload) {
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('Invalid id');
    error.status = 400;
    throw error;
  }

  const errors = validateProductInput(payload);

  if (errors.length > 0) {
    const error = new Error(errors.join(', '));
    error.status = 400;
    throw error;
  }

  return productRepository.update(id, normalizeProduct(payload));
}

async function deleteProduct(id) {
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('Invalid id');
    error.status = 400;
    throw error;
  }

  return productRepository.remove(id);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
