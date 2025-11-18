let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let scores = { X: 0, O: 0, tie: 0 };

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();
}

function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.disabled = true;
}

function checkResult() {
    let roundWon = false;
    let winningCombination = null;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCombination = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `<span class="winner">Player ${currentPlayer} Wins! 🎉</span>`;
        gameActive = false;
        scores[currentPlayer]++;
        updateScores();
        highlightWinningCells(winningCombination);
        return;
    }

    const roundDraw = !board.includes('');
    if (roundDraw) {
        statusDisplay.innerHTML = `<span class="winner">It's a Tie! 🤝</span>`;
        gameActive = false;
        scores.tie++;
        updateScores();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.innerHTML = `<span class="current-player">Player ${currentPlayer}'s Turn</span>`;
}

function highlightWinningCells(combination) {
    combination.forEach(index => {
        cells[index].classList.add('winning');
    });
}

function updateScores() {
    document.getElementById('scoreX').textContent = scores.X;
    document.getElementById('scoreO').textContent = scores.O;
    document.getElementById('scoreTie').textContent = scores.tie;
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.innerHTML = `<span class="current-player">Player X's Turn</span>`;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.disabled = false;
        cell.classList.remove('x', 'o', 'winning');
    });
}