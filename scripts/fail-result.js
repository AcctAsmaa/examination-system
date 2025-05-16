const score = localStorage.getItem("finalScore") || "0%";
document.getElementById("score-percentage").textContent = `Your Score: ${score}`;

setTimeout(() => {
  document.getElementById('lionRoar').play();
  document.getElementById('gazelle').style.opacity = 0;
  document.querySelector('.retry-btn').style.display = 'inline-block';
}, 6000);

const storedUser = JSON.parse(localStorage.getItem('examUser'));

const userName = storedUser ? `${storedUser.firstName}` : "our Friend";

document.getElementById("result-heading").textContent = `Unfortunately,${userName}  the lion caught the gazelle! 😢`;


history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};