// code credit: chatgpt

document.addEventListener('DOMContentLoaded', function() {
  function randomPosition() {
    const container = document.getElementById('game-container');
    const h = document.getElementById('h');
    const containerRect = container.getBoundingClientRect();
    const maxX = containerRect.width - h.offsetWidth;
    const maxY = containerRect.height - h.offsetHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    h.style.left = randomX + 'px';
    h.style.top = randomY + 'px';
  }

  function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = parseInt(scoreElement.textContent) + 1;
  }

  function updateHighScore(score) {
    const highScoreElement = document.getElementById('high-score');
    let highScore = parseInt(localStorage.getItem('highScore')) || 0;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
    highScoreElement.textContent = highScore;
  }

  function resetScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = '0';
  }

  function startGame() {
    resetScore();
    updateHighScore(0);
    randomPosition();
  }

  document.getElementById('h').addEventListener('click', function() {
    updateScore();
    randomPosition();
    updateHighScore(parseInt(document.getElementById('score').textContent));
  });

  startGame();
});
