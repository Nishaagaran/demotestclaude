const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const message = document.getElementById('message');

function validateEmail(value) {
  if (!value) return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
  return '';
}

function validatePassword(value) {
  if (!value) return 'Password is required.';
  if (value.length < 6) return 'Password must be at least 6 characters.';
  return '';
}

function showFieldError(input, errorEl, msg) {
  errorEl.textContent = msg;
  input.classList.toggle('invalid', !!msg);
}

emailInput.addEventListener('input', () => {
  showFieldError(emailInput, emailError, validateEmail(emailInput.value.trim()));
});

passwordInput.addEventListener('input', () => {
  showFieldError(passwordInput, passwordError, validatePassword(passwordInput.value));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const emailMsg = validateEmail(emailInput.value.trim());
  const passwordMsg = validatePassword(passwordInput.value);

  showFieldError(emailInput, emailError, emailMsg);
  showFieldError(passwordInput, passwordError, passwordMsg);

  if (emailMsg || passwordMsg) return;

  // Simulate a login request — replace with a real API call.
  message.className = 'message';
  message.textContent = 'Signing in…';

  setTimeout(() => {
    const credentials = { email: emailInput.value.trim(), password: passwordInput.value };

    // Demo: accept any well-formed input.
    console.log('Login attempt:', credentials.email);

    message.className = 'message success';
    message.textContent = `Welcome, ${credentials.email}! Redirecting…`;
    setTimeout(() => { window.location.href = 'openurl.html'; }, 600);
  }, 800);
});
