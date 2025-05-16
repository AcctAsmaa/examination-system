const loginForm = document.getElementById('loginForm');
const firstNameInput = document.getElementById('firstName');
const passwordInput = document.getElementById('password');
const firstNameError = document.getElementById('firstNameError');
const passwordError = document.getElementById('passwordError');

function shakeInput(inputElement) {
  inputElement.classList.add('shake');
  setTimeout(() => inputElement.classList.remove('shake'), 300);
}

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  firstNameError.textContent = '';
  passwordError.textContent = '';

  const firstName = firstNameInput.value.trim();
  const password = passwordInput.value;
  const storedUser = JSON.parse(localStorage.getItem('examUser'));

  if (!storedUser) {
    firstNameError.textContent = 'No registered user found.';
    firstNameInput.value = '';
    shakeInput(firstNameInput);
    return;
  }

  let hasError = false;

  if (firstName !== storedUser.firstName) {
    firstNameError.textContent = 'Incorrect First Name.';
    firstNameInput.value = '';
    shakeInput(firstNameInput);
    hasError = true;
  }

  if (password !== storedUser.password) {
    passwordError.textContent = 'Incorrect Password.';
    passwordInput.value = '';
    shakeInput(passwordInput);
    hasError = true;
  }

  if (!hasError) {
    localStorage.setItem('isLoggedIn', 'true');
    location.replace('../pages/home.html');
  }
});


firstNameInput.addEventListener('input', () => {
  firstNameError.textContent = '';
});

passwordInput.addEventListener('input', () => {
  passwordError.textContent = '';
});


function togglePassword() {
  const passwordInput = document.getElementById("password");
  const icon = document.querySelector(".toggle-password");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.textContent = "🙈";
  } else {
    passwordInput.type = "password";
    icon.textContent = "👁️";
  }
}
