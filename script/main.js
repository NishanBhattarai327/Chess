// Define the chessboard and piece objects
const board = [  
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [' ', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' '],
  [' ', '.', ' ', '.', ' ', '.', ' ', '.'],
  ['.', ' ', '.', ' ', '.', ' ', '.', ' '],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

const pieces = {
  'r': 'white_rook',
  'n': 'white_knight',
  'b': 'white_bishop',
  'q': 'white_queen',
  'k': 'white_king',
  'p': 'white_pawn',
  'R': 'black_rook',
  'N': 'black_knight',
  'B': 'black_bishop',
  'Q': 'black_queen',
  'K': 'black_king',
  'P': 'black_pawn'
};

// Create the chessboard squares and pieces using JavaScript
const chessboard = document.querySelector('.board');
let squareColor = "";
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const square = document.createElement('div');
    square.classList.add('square');
    if ((row + col) % 2 === 0) {
      square.classList.add('white');
      squareColor = 'white';
    } else {
      square.classList.add('black');
      squareColor = 'black';
    }
    const piece = document.createElement('img');
    const pieceType = pieces[board[row][col]];
    if (pieceType) {
      piece.classList.add('piece', board[row][col].toLowerCase());
      piece.setAttribute('src', `imgs/${pieceType}.png`);
      piece.setAttribute('alt', 'pieces');
    }
    square.appendChild(piece);
    chessboard.appendChild(square);
  }
}

