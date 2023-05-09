///////////////// Board /////////////////////////////////////
//////////////////////////////////////////////////////////// 

class Board {
    board = [  
        ['r1', 'n1', 'b1', 'q', 'k', 'b2', 'n2', 'r2'],
        ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'],
        [' ', '.', ' ', '.', ' ', '.', ' ', '.'],
        ['.', ' ', '.', ' ', '.', ' ', '.', ' '],
        [' ', '.', ' ', '.', ' ', '.', ' ', '.'],
        ['.', ' ', '.', ' ', '.', ' ', '.', ' '],
        ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'],
        ['R1', 'N1', 'B1', 'Q', 'K', 'B2', 'N2', 'R2']
    ];

    constructor() {
        console.log("Game created");
    }

    availableSquare(peice) {
        let squares = [];
        
        for(let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] == ' ' || this.board[row][col] == '.') {
                    squares.push([row, col]);
                }
            }
        }
        return squares;
    }

    movePiece(piece, row, col) {
        if (this._checkIfAvailable(piece, row, col)) {
            let p = piece;
            this.removePiece(piece);
            this.addPiece(piece, row, col);
            return true;
        }
        return false;
    }

    getPiecePosition(piece) {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] == piece) {
                    return [row, col];
                }
            }
        }
        return [];
    }
    
    getPieceFromPosition(row, col) {
        return this.board[row][col];
    }

    getBoard() {
        return this.board;
    }


    removePiece(piece) {
        console.log(piece);
        let position = this.getPiecePosition(piece);
        if (position.length > 0){
            this.board[position[0]][position[1]] = ' ';
            return true;
        }
        return false;
    }

    addPiece(piece, row, col) {
        if (piece == undefined) 
            this.board[row][col] = ' ';
        else 
            this.board[row][col] = piece;

        console.log(piece, row, col);
    }

    //private method
    _checkIfAvailable(piece, row, col){
        let availableSquares = this.availableSquare(piece);
        for (let i = 0; i < availableSquares.length; i++) {
            if (availableSquares[i][0] == row && availableSquares[i][1] == col)
                return true;
        }
        return false;
    }
}


////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


////////////////////////////// UI ////////////////////////////////
/////////////////////////////////////////////////////////////////
class UI {
    constructor() {
        this.chessboard = document.querySelector('.board');
        this.pieces = {
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
            'P': 'black_pawn',
        };
        
        console.log("Ui created");
    }

    render(board) {

        this._clearChessBoard();

        // render the board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.dataset.row = row;
                square.dataset.col = col;

                if ((row + col) % 2 === 0) {
                    square.classList.add('white');
                } else {
                    square.classList.add('black');
                }

                const pieceType = this.pieces[board.getBoard()[row][col].charAt(0)];
                
                if (pieceType) {
                    this._insertPieceOntoSquare(row, col, pieceType, square, board);
                }
                this.chessboard.appendChild(square);
            }
        }

    }

    _clearChessBoard() {
         // clear the board
         while(this.chessboard.firstChild) {
            this.chessboard.removeChild(this.chessboard.lastChild);
        }
    }

    _insertPieceOntoSquare(row, col, pieceType, square, board) {
        const piece = document.createElement('img');
        piece.dataset.piece = board.getBoard()[row][col];
        piece.dataset.row = row;
        piece.dataset.col = col;
      
        piece.classList.add('piece', board.getBoard()[row][col]);
        piece.setAttribute('src', `imgs/${pieceType}.png`);
        piece.setAttribute('alt', 'pieces');
        
        piece.addEventListener('click', (event) => {this._clickHandler(event, board)}, true);
        square.appendChild(piece);
    }

    _clickHandler(event, board) {
        let pieceUi = event.target;
        pieceUi.classList.add('clicked');
      
        let row = parseInt(pieceUi.dataset.row);
        let col = parseInt(pieceUi.dataset.col);

        console.log("ui: ", row, col);

        board.addPiece(pieceUi.dataset.piece, row+2, col);
        if (!board.removePiece(pieceUi.dataset.piece)) console.log("piece removing failed");
        
        this.render(board);
    }
}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


////////////////////////////// Main //////////////////////////////
//////////////////////////////////////////////////////////////////

let board = new Board();
let ui = new UI();

ui.render(board);