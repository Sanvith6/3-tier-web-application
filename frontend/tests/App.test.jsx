import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from '../src/App';

// Use vi.spyOn for axios methods, more compatible with Vitest 3.x
// than vi.mock('axios') for named method mocking
const getMock = vi.spyOn(axios, 'get');
const postMock = vi.spyOn(axios, 'post');
const putMock = vi.spyOn(axios, 'put');
const deleteMock = vi.spyOn(axios, 'delete');
const apiProductsPathPattern = /\/api\/products$/;

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('loads and displays products', async () => {
    getMock.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'Mouse',
          category: 'Accessories',
          price: 19.99,
          stock: 10
        }
      ]
    });

    render(<App />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('Mouse')).toBeInTheDocument();
    expect(getMock).toHaveBeenCalledWith(
      expect.stringMatching(apiProductsPathPattern)
    );
  });

  test('submits create product flow', async () => {
    const user = userEvent.setup();
    getMock.mockResolvedValue({ data: [] });
    postMock.mockResolvedValueOnce({
      data: {
        id: 2,
        name: 'Keyboard',
        category: 'Accessories',
        price: 49.99,
        stock: 5
      }
    });

    render(<App />);

    await screen.findByText('No products found.');
    await user.type(screen.getByPlaceholderText('Name'), 'Keyboard');
    await user.type(screen.getByPlaceholderText('Price'), '49.99');
    await user.type(screen.getByPlaceholderText('Category'), 'Accessories');
    await user.type(screen.getByPlaceholderText('Stock'), '5');
    await user.click(screen.getByRole('button', { name: 'Add Product' }));

    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith(
        expect.stringMatching(apiProductsPathPattern),
        {
          name: 'Keyboard',
          price: 49.99,
          category: 'Accessories',
          stock: 5
        }
      );
    });
  });

  test('shows API error from load failure', async () => {
    getMock.mockRejectedValueOnce({
      response: {
        data: {
          message: 'API unavailable'
        }
      }
    });

    render(<App />);

    expect(await screen.findByText('API unavailable')).toBeInTheDocument();
  });

  test('allows editing and canceling edit mode', async () => {
    const user = userEvent.setup();
    getMock.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          name: 'Mouse',
          category: 'Accessories',
          price: 19.99,
          stock: 10
        }
      ]
    });

    render(<App />);

    expect(await screen.findByText('Mouse')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(
      screen.getByRole('button', { name: 'Update Product' })
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mouse')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(
      screen.getByRole('button', { name: 'Add Product' })
    ).toBeInTheDocument();
  });

  test('submits update flow and delete flow', async () => {
    const user = userEvent.setup();

    getMock
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            name: 'Mouse',
            category: 'Accessories',
            price: 19.99,
            stock: 10
          }
        ]
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            name: 'Mouse Pro',
            category: 'Accessories',
            price: 19.99,
            stock: 10
          }
        ]
      })
      .mockResolvedValue({ data: [] });
    putMock.mockResolvedValueOnce({ data: {} });
    deleteMock.mockResolvedValueOnce({ data: {} });

    render(<App />);

    expect(await screen.findByText('Mouse')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    const nameInput = screen.getByPlaceholderText('Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Mouse Pro');
    await user.click(screen.getByRole('button', { name: 'Update Product' }));

    await waitFor(() => {
      expect(putMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/products\/1$/),
        {
          name: 'Mouse Pro',
          price: 19.99,
          category: 'Accessories',
          stock: 10
        }
      );
    });

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/products\/1$/)
      );
    });
  });
});
