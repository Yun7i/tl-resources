import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as authController from './authController';
import * as authService from '../services/authService';

vi.mock('../services/authService');

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  return res;
};

describe('authController.register', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 400 when missing fields', async () => {
    const req: any = { body: { email: '' } };
    const res = mockRes();
    await authController.register(req, res, (() => {}) as any);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('calls service and returns 201', async () => {
    const req: any = { body: { email: 'a@b.com', password: 'p' } };
    const res = mockRes();
    (authService.registerUser as any).mockResolvedValue({ id: 1, email: 'a@b.com' });
    await authController.register(req, res, (() => {}) as any);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, email: 'a@b.com' });
  });
});
