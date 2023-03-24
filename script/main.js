console.log("Chess");

// Define the initial state of the chessboard
var chessboard = [  
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " "],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["r", "n", "b", "q", "k", "b", "n", "r"]
];

// Define a function to render the chessboard
function renderChessboard() {
  var board = document.getElementById("chessboard");
  for (var i = 0; i < 8; i++) {
    var row = board.rows[i];
    for (var j = 0; j < 8; j++) {
      var cell = row.cells[j];
      // Add the appropriate CSS class to style the square
      if ((i + j) % 2 === 0) {
        cell.classList.add("white");
      } else {
        cell.classList.add("black");
      }
      // Add the appropriate CSS class to style the chess piece
      var piece = chessboard[i][j];
      if (piece !== " ") {
        var pieceElement = document.createElement("div");
        pieceElement.innerHTML = piece;
        pieceElement.classList.add("piece");
        if (piece === piece.toUpperCase()) {
          pieceElement.classList.add("white-piece");
        } else {
          pieceElement.classList.add("black-piece");
        }
        cell.appendChild(pieceElement);
      }
    }
  }
}

// Call the renderChessboard function to initialize the chessboard
renderChessboard();
