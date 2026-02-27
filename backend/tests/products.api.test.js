const request = require('supertest');

jest.mock('../src/repositories/productRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
}));

const productRepository = require('../src/repositories/productRepository');
const app = require('../src/app');

describe('products API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/products returns products', async () => {
    const products = [
      { id: 1, name: 'Mouse', price: 19.99, category: 'Accessories', stock: 10 }
    ];
    productRepository.findAll.mockResolvedValue(products);

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(products);
  });

  test('GET /api/products/:id returns 400 for invalid id', async () => {
    const response = await request(app).get('/api/products/abc');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid id' });
  });

  test('GET /api/products/:id returns 404 when missing', async () => {
    productRepository.findById.mockResolvedValue(null);

    const response = await request(app).get('/api/products/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Product not found' });
  });

  test('POST /api/products validates input', async () => {
    const response = await request(app).post('/api/products').send({
      name: '',
      price: -10,
      category: '',
      stock: -1
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('name is required');
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  test('POST /api/products creates product', async () => {
    const created = {
      id: 2,
      name: 'Monitor',
      price: 299.99,
      category: 'Electronics',
      stock: 5
    };
    productRepository.create.mockResolvedValue(created);

    const response = await request(app).post('/api/products').send({
      name: 'Monitor',
      price: 299.99,
      category: 'Electronics',
      stock: 5
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(created);
  });

  test('DELETE /api/products/:id returns 404 when missing', async () => {
    productRepository.remove.mockResolvedValue(false);

    const response = await request(app).delete('/api/products/100');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Product not found' });
  });
});
