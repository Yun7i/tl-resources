import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithProviders, actAsync } from '../../utils/testUtils';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import * as userService from '../../services/userService';
const mockCreate = vi.fn();

import RegisterForm from './RegisterForm';
import { ApiError } from '../../utils/ApiErrors';

describe('RegisterForm', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockCreate.mockReset();
    vi.spyOn(userService, 'createUser').mockImplementation((...args: any[]) => mockCreate(...args));
  });

  it('submits and navigates to login on success', async () => {
    mockCreate.mockResolvedValue({ id: 'u1' });

    const { container } = renderWithProviders(<RegisterForm />);

    const first = screen.getByLabelText('First Name') as HTMLInputElement;
    const last = screen.getByLabelText('Last Name') as HTMLInputElement;
    const email = screen.getByLabelText('Email') as HTMLInputElement;
    const pass = screen.getByLabelText('Password') as HTMLInputElement;

    await actAsync(async () => {
      fireEvent.change(first, { target: { value: 'Jane' } });
      fireEvent.change(last, { target: { value: 'Doe' } });
      fireEvent.change(email, { target: { value: 'jane@doe.com' } });
      fireEvent.change(pass, { target: { value: 'secret123' } });
      const form = container.querySelector('form')!;
      fireEvent.submit(form);
    });

    expect(mockCreate).toHaveBeenCalled();
    expect((mockCreate as any).mock.calls[0][0]).toEqual({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.com',
      password: 'secret123',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('maps ApiError.details to field helper text', async () => {
    const apiErr = new ApiError('Invalid input', 'INVALID_INPUT', { email: 'Bad email' }, 422);
    mockCreate.mockRejectedValue(apiErr);

    const { container } = renderWithProviders(<RegisterForm />);

    const first = screen.getByLabelText('First Name') as HTMLInputElement;
    const last = screen.getByLabelText('Last Name') as HTMLInputElement;
    const email = screen.getByLabelText('Email') as HTMLInputElement;
    const pass = screen.getByLabelText('Password') as HTMLInputElement;

    await actAsync(async () => {
      fireEvent.change(first, { target: { value: 'Jane' } });
      fireEvent.change(last, { target: { value: 'Doe' } });
      fireEvent.change(email, { target: { value: 'jane@doe.com' } });
      fireEvent.change(pass, { target: { value: 'secret123' } });
      const form = container.querySelector('form')!;
      fireEvent.submit(form);
    });

    expect(screen.getByText('Bad email')).toBeInTheDocument();
  });
});
