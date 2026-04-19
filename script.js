let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#resetbtn");
let modeToggle = document.querySelector("#modeToggle");
let turnIndicator = document.querySelector("#turnIndicator");

let gameMode = "twoPlayer"; 
let aiSymbol = "O";
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
      return boxes[pattern[0]].innerText;
    }
  }
  return null;
};

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
  }
};

const resetGame = () => {
  count = 0;
  document.querySelector(".Complete").classList.add("hide");
  modeToggle.classList.remove("disabled");
  boxes.forEach((box) => {
    box.innerText = "";
    box.classList.remove("disabled");
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
  const winnerName = winner === AI ? "AI (O)" : "Player (X)";
  document.querySelector(".Complete").classList.remove("hide");
  document.querySelector(".title").innerText = "Game Completed";
  document.querySelector(".name").innerText = `Winner is ${winnerName}`;

  boxes.forEach((box) => box.classList.add("disabled"));
  modeToggle.classList.add("disabled");
};

const showDraw = () => {
  document.querySelector(".Complete").classList.remove("hide");
  document.querySelector(".title").innerText = "Game Draw";
  document.querySelector(".name").innerText = "No One is Winner";
};

const aiMove = () => {
  const bestMove = minimax(boardState(), AI, HUMAN , 0);
  setMark(boxes[bestMove.index], AI);
  updateTurnDisplay();
  let winner = checkWin();
  if (winner) {
    showWinner(winner);
    return;
  }
  if (isBoardFull()) {
    showDraw();
  }
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

    for (let i = 0; i < moves.length; i++) {
      const currentMove = moves[i];

      const isBetterForAI = player === AI && currentMove.score > bestScore;
      const isBetterForHuman = player !== AI && currentMove.score < bestScore;

      if (isBetterForAI || isBetterForHuman) {
        
        bestScore = currentMove.score;
        bestMoves = [currentMove]; 
      } else if (currentMove.score === bestScore) {
        
        bestMoves.push(currentMove);
      }
    }

    const randomIndex = Math.floor(Math.random() * bestMoves.length);
    return bestMoves[randomIndex];
  };

const boardState = () => {
  const state = [];
  boxes.forEach((box) => {
    state.push(box.innerText === "" ? "" : box.innerText);
  });
  return state;
};

const checkWinner = (board) => {
  const wins = patterns;
  for (let i = 0; i < wins.length; i++) {
    const [a, b, c] = wins[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const isTerminal = (board) => {
  return board.every((cell) => cell !== "") || checkWinner(board) !== null;
};

boxes.forEach((box, idx) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "" || box.classList.contains("disabled")) return;

    if (gameMode === "twoPlayer") {
      const nextSymbol = count % 2 === 0 ? HUMAN : AI;
      setMark(box, nextSymbol);
    } else {
      setMark(box, HUMAN);
    }
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

    if (gameMode === "ai") {
      setTimeout(aiMove, 0);
    }
  });
});

updateTurnDisplay();
