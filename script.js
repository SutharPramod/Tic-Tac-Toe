let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#resetbtn");
let modeToggle = document.querySelector("#modeToggle");
let turnIndicator = document.querySelector("#turnIndicator");

let gameMode = "twoPlayer"; 
let count = 0;

const HUMAN = "X";
const AI = "O";

let patterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const setMark = (ele, symbol) => {
  ele.classList.add("disabled");
  ele.classList.add(symbol.toLowerCase());
  ele.innerText = symbol;
  count++;
};

const checkWin = () => {
  for (let pattern of patterns) {
    if (
      boxes[pattern[0]].innerText !== "" &&
      boxes[pattern[0]].innerText === boxes[pattern[1]].innerText &&
      boxes[pattern[1]].innerText === boxes[pattern[2]].innerText
    ) {
      pattern.forEach(idx => boxes[idx].classList.add('winner'));
      return boxes[pattern[0]].innerText;
    }
  }
  return null;
};

const disableAllBoxes = () => boxes.forEach(box => box.classList.add('disabled'));
const enableBoxes = () => boxes.forEach(box => {
  if (box.innerText === "") box.classList.remove('disabled');
});

const isBoardFull = () => count === 9;

const updateTurnDisplay = () => {
  if (document.querySelector(".Complete").classList.contains("hide")) {
    let currentPlayer;
    if (gameMode === "twoPlayer") {
      currentPlayer = count % 2 === 0 ? "X" : "O";
      turnIndicator.innerText = `Player ${currentPlayer}'s Turn`;
    } else {
      currentPlayer = count % 2 === 0 ? "X (You)" : "O (AI)";
      turnIndicator.innerText = `${currentPlayer}'s Turn`;
    }
    turnIndicator.style.animation = 'none';
    turnIndicator.offsetHeight;
    turnIndicator.style.animation = 'slideIn 0.4s ease-out';
  }
};

const resetGame = () => {
  count = 0;
  document.querySelector(".Complete").classList.add("hide");
  modeToggle.classList.remove("disabled");
  boxes.forEach((box) => {
    box.innerText = "";
    box.classList.remove("disabled", "x", "o", "winner");
  });
  updateTurnDisplay();
};

resetbtn.addEventListener("click", resetGame);

modeToggle.addEventListener("click", () => {
  gameMode = gameMode === "twoPlayer" ? "ai" : "twoPlayer";
  modeToggle.textContent = gameMode === "ai" ? "2 Player Mode" : "AI Mode";
  resetGame();
});

updateTurnDisplay();

const showWinner = (winner) => {
  let winnerName;
  if (gameMode === "ai") {
    winnerName = winner === AI ? "AI (O)" : "You (X)";
  } else {
    winnerName = `Player ${winner}`;
  }
  document.querySelector(".Complete").classList.remove("hide");
  document.querySelector(".title").innerText = "Game Completed";
  document.querySelector(".name").innerText = `Winner : ${winnerName}`;

  disableAllBoxes();
  modeToggle.classList.add("disabled");
};

const showDraw = () => {
  document.querySelector(".Complete").classList.remove("hide");
  document.querySelector(".title").innerText = "Game Draw";
  document.querySelector(".name").innerText = "Tie Game!";

  disableAllBoxes();
  modeToggle.classList.add("disabled");
};

const aiMove = () => {
  disableAllBoxes(); 
  const bestMove = minimax(boardState(), AI, HUMAN, 0);
  setTimeout(() => {
    setMark(boxes[bestMove.index], AI);
    updateTurnDisplay();
    let winner = checkWin();
    if (winner) {
      showWinner(winner);
    } else if (isBoardFull()) {
      showDraw();
    } else {
      enableBoxes(); 
    }
  }, 500);
};

const minimax = (board, player, opponent, depth) => {
  let winner = checkWinner(board);
  if (winner === opponent) return { score: -10 + depth };
  if (winner === player) return { score: 10 - depth };
  if (isTerminal(board)) return { score: 0 };

  const moves = [];
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      const move = { index: i };
      board[i] = player;
      const result = minimax(board, opponent, player, depth + 1);
      move.score = result.score;
      board[i] = "";
      moves.push(move);
    }
  }

  let bestScore = player === AI ? -Infinity : Infinity;
  let bestMoves = [];
  for (let currentMove of moves) {
    if (player === AI ? currentMove.score > bestScore : currentMove.score < bestScore) {
      bestScore = currentMove.score;
      bestMoves = [currentMove];
    } else if (currentMove.score === bestScore) {
      bestMoves.push(currentMove);
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
};

const boardState = () => Array.from(boxes).map(box => box.innerText || '');

const checkWinner = (board) => {
  for (let pattern of patterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
};

const isTerminal = (board) => board.every(cell => cell !== "") || !!checkWinner(board);

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.classList.contains("disabled") || box.innerText !== "") return;

    const nextSymbol = gameMode === "twoPlayer" ? (count % 2 === 0 ? HUMAN : AI) : HUMAN;
    setMark(box, nextSymbol);
    updateTurnDisplay();

    let winner = checkWin();
    if (winner) {
      showWinner(winner);
      return;
    }
    if (isBoardFull()) {
      showDraw();
      return;
    }

    if (gameMode === "ai" && nextSymbol === HUMAN) {
      aiMove();
    }
  });
});
