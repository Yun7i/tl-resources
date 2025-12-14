import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, actAsync } from '../../utils/testUtils';
import AuthProvider from '../../providers/AuthProvider';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// We'll use the real AuthProvider so that `useAuth` works as expected.

import * as authService from '../../services/authService';
const mockLogin = vi.fn();

import LoginForm from './LoginForm';
import { ApiError } from '../../utils/ApiErrors';

describe('LoginForm', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockReset();
    vi.spyOn(authService, 'login').mockImplementation((...args: any[]) => mockLogin(...args));
  });

  it('submits credentials and authenticates on success', async () => {
    mockLogin.mockResolvedValue({ token: 'tok123', id: 'u1' });

    const { container } = renderWithProviders(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>,
    );

    const email = screen.getByLabelText('Email') as HTMLInputElement;
    const pass = screen.getByLabelText('Password') as HTMLInputElement;

    await actAsync(async () => {
      fireEvent.change(email, { target: { value: 'a@b.com' } });
      fireEvent.change(pass, { target: { value: 'secret' } });
      // ensure inputs updated
      expect(email.value).toBe('a@b.com');
      expect(pass.value).toBe('secret');
      const form = container.querySelector('form')!;
      fireEvent.submit(form);
    });

    expect(mockLogin).toHaveBeenCalled();
    expect((mockLogin as any).mock.calls[0][0]).toEqual({ email: 'a@b.com', password: 'secret' });
    // AuthProvider should store token in localStorage and navigate
    expect(localStorage.getItem('token')).toBe('tok123');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('maps ApiError.details to field errors', async () => {
    const apiErr = new ApiError('Invalid input', 'INVALID_INPUT', { email: 'Email missing' }, 422);
    mockLogin.mockRejectedValue(apiErr);

    const { container } = renderWithProviders(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>,
    );

    const email = screen.getByLabelText('Email') as HTMLInputElement;
    const pass = screen.getByLabelText('Password') as HTMLInputElement;
    const btn = screen.getByText('Login');

    await actAsync(async () => {
      // provide valid client-side values so server error mapping runs
      fireEvent.change(email, { target: { value: 'a@b.com' } });
      fireEvent.change(pass, { target: { value: 'secret' } });
      const form = container.querySelector('form')!;
      fireEvent.submit(form);
    });

    // helper text should show field error from ApiError.details
    expect(screen.getByText('Email missing')).toBeInTheDocument();
  });
});
