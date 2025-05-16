const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const btn3 = document.getElementById("btn3");
btn1.addEventListener('click', () => {
  location.replace('../pages/exam.html');

});

btn2.addEventListener('click', () => {
  location.replace('../pages/intermediate.html');


});

btn3.addEventListener('click', () => {
  location.replace('../pages/advanced.html');

});

const switchTheme = document.getElementById("switch");
const themeIcon = document.getElementById("themeIcon");

const currentTheme = localStorage.getItem("theme");
if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (currentTheme === "dark") {
    switchTheme.checked = true;
    themeIcon.textContent = "🌙";
  }
}

switchTheme.addEventListener("change", function () {
  if (this.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeIcon.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    themeIcon.textContent = "☀️";
  }
});
