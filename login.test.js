/**
 * Unit tests for login.js
 * Run with: npm test
 */

// Provide a minimal DOM before login.js is required
document.body.innerHTML = `
  <form id="loginForm">
    <input id="email" type="email" />
    <span id="emailError"></span>
    <input id="password" type="password" />
    <span id="passwordError"></span>
    <button type="submit">Sign In</button>
    <p id="message"></p>
  </form>
`;

const { validateEmail, validatePassword, showFieldError } = require('./login');

// ─── validateEmail ────────────────────────────────────────────────────────────

describe('validateEmail', () => {
  test('returns error for empty string', () => {
    expect(validateEmail('')).toBe('Email is required.');
  });

  test('returns error for missing @ symbol', () => {
    expect(validateEmail('userexample.com')).toBe('Enter a valid email address.');
  });

  test('returns error for missing domain', () => {
    expect(validateEmail('user@')).toBe('Enter a valid email address.');
  });

  test('returns error for missing TLD', () => {
    expect(validateEmail('user@example')).toBe('Enter a valid email address.');
  });

  test('returns error for whitespace-only string', () => {
    expect(validateEmail('   ')).toBe('Enter a valid email address.');
  });

  test('returns empty string for valid email', () => {
    expect(validateEmail('user@example.com')).toBe('');
  });

  test('returns empty string for email with subdomain', () => {
    expect(validateEmail('user@mail.example.co.uk')).toBe('');
  });
});

// ─── validatePassword ─────────────────────────────────────────────────────────

describe('validatePassword', () => {
  test('returns error for empty string', () => {
    expect(validatePassword('')).toBe('Password is required.');
  });

  test('returns error for password shorter than 6 characters', () => {
    expect(validatePassword('abc')).toBe('Password must be at least 6 characters.');
  });

  test('returns error for exactly 5 characters', () => {
    expect(validatePassword('abcde')).toBe('Password must be at least 6 characters.');
  });

  test('returns empty string for exactly 6 characters', () => {
    expect(validatePassword('abcdef')).toBe('');
  });

  test('returns empty string for a long password', () => {
    expect(validatePassword('supersecurepassword123!')).toBe('');
  });
});

// ─── showFieldError ───────────────────────────────────────────────────────────

describe('showFieldError', () => {
  let input;
  let errorEl;

  beforeEach(() => {
    input = document.getElementById('email');
    errorEl = document.getElementById('emailError');
    input.className = '';
    errorEl.textContent = '';
  });

  test('sets error text on the error element', () => {
    showFieldError(input, errorEl, 'Email is required.');
    expect(errorEl.textContent).toBe('Email is required.');
  });

  test('adds "invalid" class to input when message is non-empty', () => {
    showFieldError(input, errorEl, 'Email is required.');
    expect(input.classList.contains('invalid')).toBe(true);
  });

  test('removes "invalid" class when message is empty', () => {
    input.classList.add('invalid');
    showFieldError(input, errorEl, '');
    expect(input.classList.contains('invalid')).toBe(false);
  });

  test('clears error text when message is empty', () => {
    errorEl.textContent = 'Previous error';
    showFieldError(input, errorEl, '');
    expect(errorEl.textContent).toBe('');
  });
});

// ─── DOM integration ──────────────────────────────────────────────────────────

describe('login form DOM integration', () => {
  let emailInput, passwordInput, emailError, passwordError, form;

  beforeEach(() => {
    emailInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    emailError = document.getElementById('emailError');
    passwordError = document.getElementById('passwordError');
    form = document.getElementById('loginForm');

    emailInput.value = '';
    passwordInput.value = '';
    emailInput.className = '';
    passwordInput.className = '';
    emailError.textContent = '';
    passwordError.textContent = '';
  });

  test('email input event shows error for invalid value', () => {
    emailInput.value = 'notanemail';
    emailInput.dispatchEvent(new Event('input'));
    expect(emailError.textContent).toBe('Enter a valid email address.');
    expect(emailInput.classList.contains('invalid')).toBe(true);
  });

  test('email input event clears error for valid value', () => {
    emailInput.value = 'user@example.com';
    emailInput.dispatchEvent(new Event('input'));
    expect(emailError.textContent).toBe('');
    expect(emailInput.classList.contains('invalid')).toBe(false);
  });

  test('password input event shows error for short password', () => {
    passwordInput.value = 'abc';
    passwordInput.dispatchEvent(new Event('input'));
    expect(passwordError.textContent).toBe('Password must be at least 6 characters.');
  });

  test('password input event clears error for valid password', () => {
    passwordInput.value = 'securepass';
    passwordInput.dispatchEvent(new Event('input'));
    expect(passwordError.textContent).toBe('');
  });

  test('form submit shows email error when email is empty', () => {
    passwordInput.value = 'securepass';
    form.dispatchEvent(new Event('submit'));
    expect(emailError.textContent).toBe('Email is required.');
  });

  test('form submit shows password error when password is empty', () => {
    emailInput.value = 'user@example.com';
    form.dispatchEvent(new Event('submit'));
    expect(passwordError.textContent).toBe('Password is required.');
  });

  test('form submit shows both errors when both fields are empty', () => {
    form.dispatchEvent(new Event('submit'));
    expect(emailError.textContent).toBe('Email is required.');
    expect(passwordError.textContent).toBe('Password is required.');
  });
});
