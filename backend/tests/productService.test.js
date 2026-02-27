const productService = require('../src/services/productService');
const productRepository = require('../src/repositories/productRepository');

jest.mock('../src/repositories/productRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
}));

describe('productService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('throws 400 when id is invalid', async () => {
    await expect(productService.getProductById(0)).rejects.toMatchObject({
      status: 400,
      message: 'Invalid id'
    });
  });

  test('validates product payload for create', async () => {
    await expect(productService.createProduct({})).rejects.toMatchObject({
      status: 400
    });
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  test('normalizes payload before create', async () => {
    const created = {
      id: 1,
      name: 'Keyboard',
      price: 129.99,
      category: 'Accessories',
      stock: 7
    };
    productRepository.create.mockResolvedValue(created);

    const result = await productService.createProduct({
      name: ' Keyboard ',
      price: '129.99',
      category: ' Accessories ',
      stock: '7'
    });

    expect(productRepository.create).toHaveBeenCalledWith({
      name: 'Keyboard',
      price: 129.99,
      category: 'Accessories',
      stock: 7
    });
    expect(result).toEqual(created);
  });

  test('returns false when deleting missing id', async () => {
    productRepository.remove.mockResolvedValue(false);
    const deleted = await productService.deleteProduct(123);
    expect(deleted).toBe(false);
  });
});
