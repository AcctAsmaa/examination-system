const signupForm = document.getElementById('signupForm');

const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const passwordInput = document.getElementById('password');
const verifyPasswordInput = document.getElementById('verifyPassword');

const firstNameError = document.getElementById('firstNameError');
const lastNameError = document.getElementById('lastNameError');
const passwordError = document.getElementById('passwordError');
const verifyPasswordError = document.getElementById('verifyPasswordError');

signupForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const password = passwordInput.value;
  const verifyPassword = verifyPasswordInput.value;

  firstNameError.textContent = '';
  lastNameError.textContent = '';
  passwordError.textContent = '';
  verifyPasswordError.textContent = '';

  let valid = true;

  const nameRegex = /^[A-Za-z]{3,10}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;

  if (!nameRegex.test(firstName)) {
    firstNameError.textContent = 'First name must be at least 3 letters.';
    firstNameInput.value = '';
    valid = false;
  }

  if (!nameRegex.test(lastName)) {
    lastNameError.textContent = 'Last name must be at least 3 letters.';
    lastNameInput.value = '';
    valid = false;
  }

  if (!passwordRegex.test(password)) {
    passwordError.textContent = 'Password must be at least 6 characters with letters and numbers.';
    passwordInput.value = '';
    valid = false;
  }

  if (password !== verifyPassword) {
    verifyPasswordError.textContent = 'Passwords do not match.';
    verifyPasswordInput.value = '';
    valid = false;
  }

  if (valid) {
    const userData = {
      firstName,
      lastName,
      password
    };

    localStorage.setItem('examUser', JSON.stringify(userData));
window.location.href = '/exam-system/pages/login.html';
  }
});

[firstNameInput, lastNameInput, passwordInput, verifyPasswordInput].forEach(input => {
  input.addEventListener('input', function () {
    document.getElementById(this.id + 'Error').textContent = '';
  });
});

function togglePassword(fieldId, icon) {
  const field = document.getElementById(fieldId);
  if (field.type === 'password') {
    field.type = 'text';
    icon.textContent = '🙈';
  } else {
    field.type = 'password';
    icon.textContent = '👁️';
  }
}

function setupPasswordToggle(fieldId) {
  const input = document.getElementById(fieldId);
  const toggle = input.parentElement.querySelector('.toggle-password');

  input.addEventListener('input', function () {
    if (input.value.length > 0) {
      toggle.classList.remove('hidden');
    } else {
      toggle.classList.add('hidden');
      input.type = 'password';
      toggle.textContent = '👁️';
    }
  });
}

setupPasswordToggle('password');
setupPasswordToggle('verifyPassword');

