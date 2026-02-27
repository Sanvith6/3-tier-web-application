const errorHandler = require('../src/middleware/errorHandler');

// Mock req, res, next for the Express error middleware signature
const mockReq = {};
const mockNext = jest.fn();

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('errorHandler middleware', () => {
  test('uses err.status and err.message when provided', () => {
    const res = mockRes();
    const err = { status: 422, message: 'Unprocessable entity' };

    errorHandler(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unprocessable entity' });
  });

  test('falls back to 500 and generic message when err has no status or message', () => {
    const res = mockRes();
    const err = {}; // no status, no message — hits the || fallback branches

    errorHandler(err, mockReq, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
