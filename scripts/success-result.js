window.onload = () => {
    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.6 }
    });

    setInterval(() => {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.4 }
      });
    }, 1300);
  };


window.onload = () => {
  confetti({
    particleCount: 180,
    spread: 100,
    origin: { y: 0.6 }
  });

  setInterval(() => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.4 }
    });
  }, 1300);

  const score = localStorage.getItem("finalScore") || "0%";
  document.getElementById("score-percentage").textContent = `Your Score: ${score}`;
};

const storedUser = JSON.parse(localStorage.getItem('examUser'));

const userName = storedUser ? `${storedUser.firstName}` : "our Friend";

document.getElementById("result-heading").textContent = `🎉 Congratulations, ${userName}! `;



history.pushState(null, null, location.href);
window.onpopstate = function () {
history.go(1);
};
