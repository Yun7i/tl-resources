import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/authService', () => ({ loginService: vi.fn() }));
vi.mock('../utils/http', () => ({ sendSuccess: vi.fn(), sendFailure: vi.fn() }));

import { login } from './authController';
import * as authService from '../services/authService';
import * as httpUtils from '../utils/http';
import { HttpError } from '../errors/HttpError';
import { ErrorCode, ErrorMessage, HttpStatus } from '../../../shared/src/types/api';

describe('authController.login', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls loginService and sendSuccess on success', async () => {
    const result = { token: 't', id: 'u1' };
    (authService.loginService as any).mockResolvedValue(result);

    const req: any = { body: { email: 'a@b.com', password: 'p' } };
    const res: any = {};

    await login(req, res);

    expect(authService.loginService).toHaveBeenCalledWith({ email: 'a@b.com', password: 'p' });
    expect(httpUtils.sendSuccess).toHaveBeenCalled();
    const callArgs = (httpUtils.sendSuccess as any).mock.calls[0];
    expect(callArgs[0]).toBe(res);
    // second arg contains data and status
    expect(callArgs[1].data).toEqual(result);
    expect(callArgs[1].status).toBe(HttpStatus.OK);
  });

  it('calls sendFailure with HttpError details when service throws HttpError', async () => {
    const err = new HttpError(HttpStatus.BAD_REQUEST, 'Bad', ErrorCode.INVALID_INPUT, {
      field: 'email',
    });
    (authService.loginService as any).mockRejectedValue(err);

    const req: any = { body: { email: '', password: '' } };
    const res: any = {};

    await login(req, res);

    expect(httpUtils.sendFailure).toHaveBeenCalled();
    const callArgs = (httpUtils.sendFailure as any).mock.calls[0];
    const opts = callArgs[1];
    expect(opts.status).toBe(err.status);
    expect(opts.code).toBe(err.code);
    expect(opts.message).toBe(err.message);
    expect(opts.details).toEqual(err.details);
  });

  it('calls sendFailure with INTERNAL_ERROR on generic exceptions', async () => {
    (authService.loginService as any).mockRejectedValue(new Error('boom'));

    const req: any = { body: { email: 'a', password: 'b' } };
    const res: any = {};

    await login(req, res);

    expect(httpUtils.sendFailure).toHaveBeenCalled();
    const callArgs = (httpUtils.sendFailure as any).mock.calls[0];
    const opts = callArgs[1];
    expect(opts.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(opts.code).toBe(ErrorCode.INTERNAL_ERROR);
    expect(opts.message).toBe(ErrorMessage.INTERNAL_SERVER_ERROR);
  });
});
