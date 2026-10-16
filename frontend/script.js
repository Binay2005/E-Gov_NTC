const phoneInput = document.getElementById('phone');
const togglePasswordButton = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');
const loginForm = document.querySelector('.login-form');
const loginButton = document.querySelector('.submit-button');
const formMessage = document.querySelector('.form-message');

togglePasswordButton.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  togglePasswordButton.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  togglePasswordButton.title = isHidden ? 'Hide password' : 'Show password';
  togglePasswordButton.innerHTML = isHidden ? '<span class="eye-icon">◌</span>' : '<span class="eye-icon">◉</span>';
});

const showMessage = (message, isSuccess = false) => {
  formMessage.textContent = message;
  formMessage.classList.toggle('success', isSuccess);
  formMessage.hidden = false;
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const password = passwordInput.value;
  const digits = phoneInput.value.replace(/\D/g, '');
  const nationalNumber = digits.startsWith('977') ? digits.slice(3) : digits;

  if (!/^9\d{9}$/.test(nationalNumber)) {
    showMessage('Enter a valid 10-digit Nepal mobile number.');
    phoneInput.focus();
    return;
  }

  const credentials = { phone: `+977${nationalNumber}`, password };

  if (!password) {
    showMessage('Enter your password.');
    passwordInput.focus();
    return;
  }

  formMessage.hidden = true;
  loginButton.disabled = true;
  loginButton.textContent = 'Signing in...';

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(credentials),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Unable to log in. Please try again.');
    }

    showMessage(`Welcome back${result.user?.fullname ? `, ${result.user.fullname}` : ''}. You are now logged in.`, true);
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'Unable to connect. Please try again.');
  } finally {
    loginButton.disabled = false;
    loginButton.innerHTML = 'Log in securely <span>→</span>';
  }
});
