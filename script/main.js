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

    availableSquares() {
        let squares = [];
        
        for(let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] == ' ' || this.board[row][col] == '.') {
                    this.board[row][col] = 'a';
                    squares.push([row, col]);
                }
            }
        }
        return squares;
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

    getSelectedPiecePosition() {
        let piece;
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                piece = this.board[i][j];
                if (piece[0] == 'c') {
                    return [i, j];
                }
            }
        }

        return [];
    }
    getSelectedPiece() {
        let position = this.getSelectedPiecePosition();
        if (position.length > 0) {
            return this.board[position[0]][position[1]];
        }
        return '';
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
        if (row < 8 && row >= 0 && col < 8 && col >= 0) {
            if (piece == undefined) 
                return false;
            
            this.board[row][col] = piece;
            return true;
        }
        return false;
    }

    movePiece(piece, row, col) {
        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
            this.removePiece(piece);
            this.addPiece(piece, row, col);
            return true;
        }
        return false;
    }

    selectPiece(piece) {
        let position = this.getPiecePosition(piece);
        this.board[position[0]][position[1]] = 'c'+piece;
    }

    unselectPieces() {
        let piece;
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                piece = this.board[i][j];
                if (piece[0] == 'c') {
                    this.board[i][j] = piece[1] + piece[2];
                }
            }
        }
    }
}

////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


////////////////////////////// UI ////////////////////////////////
/////////////////////////////////////////////////////////////////
class UI {
    constructor() {
        this.chessboard = document.querySelector('.board');
        this.piecesName = {
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

                const pieceSymbol = board.getBoard()[row][col].charAt(0);
                let pieceImgName;
                
                if (pieceSymbol == 'a') {
                    square.classList.add('available');
                    square.addEventListener('click', (event) => {
                        this._clickHandler(event, board, false)
                    });
                }
                else if (pieceSymbol == 'c') {
                    square.classList.add('clicked');
                    pieceImgName = this.piecesName[board.getBoard()[row][col].charAt(1)];
                }
                else {
                    pieceImgName = this.piecesName[pieceSymbol];
                }
                
                if (pieceImgName) {
                    this._insertPieceOntoSquare(row, col, pieceImgName, square, board);
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

    _insertPieceOntoSquare(row, col, pieceImgName, square, board) {
        const piece = document.createElement('img');
        piece.dataset.piece = board.getBoard()[row][col];
        piece.dataset.row = row;
        piece.dataset.col = col;
      
        piece.classList.add('piece', board.getBoard()[row][col]);
        piece.setAttribute('src', `imgs/${pieceImgName}.png`);
        piece.setAttribute('alt', 'pieces');
        
        piece.addEventListener('click', (event) => {
            this._clickHandler(event, board, true)
        });
        square.appendChild(piece);
    }

    _clickHandler(event, board, firstTime) {
        let pieceUi = event.target;
        
        let row = parseInt(pieceUi.dataset.row);
        let col = parseInt(pieceUi.dataset.col);
        
        
        // first time means show the available square
        if (firstTime) {
            board.unselectPieces();
            this.render(board);
            
            
            console.log("ui: ", row, col);
            
            let piece = pieceUi.dataset.piece;
            
            board.availableSquares(piece);
            board.selectPiece(piece);

            console.log("board: ", board.getBoard());
            console.log(board.getSelectedPiece());

            this.render(board);

        }
        // if not first time then move the piece to the clicked position
        else {
            let selectedPiece = board.getSelectedPiece();

            if (board.movePiece(selectedPiece, row, col)) {
               board.unselectPieces();
            }
            else {
                console.log("Piece moving unsuccessful");
            }

            this.render(board);
            console.log(board.getBoard());
        }
    }
}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


////////////////////////////// Main //////////////////////////////
//////////////////////////////////////////////////////////////////

let board = new Board();
let ui = new UI();

ui.render(board);