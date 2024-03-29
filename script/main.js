let clicked_piece = {};
let availableSquare = [];
let check = false;
let turn = "white";

function clickHandler(img) {
    if (img.parentElement !== clicked_piece.div) {
        unselectPiece();
        hideAvailableSquare();
    }

    clicked_piece.name = img.alt;
    clicked_piece.div = img.parentElement;
    clicked_piece.row = parseInt(img.parentElement.dataset.row);
    clicked_piece.col = parseInt(img.parentElement.dataset.col);

    if (img.parentElement.classList.contains("clicked")) {
        unselectPiece();
        hideAvailableSquare();
    }
    else {
        clicked_piece.div.classList.add("clicked");
        findAvailableSquare(clicked_piece);
        checkForCastling(clicked_piece);
        filterCheckedSquareForKing(clicked_piece);
        showAvailableSquare();
    }

    // console.log(clicked_piece);
}

function checkForCastling(kingPiece) {
    if (!kingPiece.name.includes("king"))   // if kingPeice is not king, return
        return;
    
    if (!kingPiece.name.includes("unmoved"))  // if king is moved, return
        return;
    
    let kingColor = kingPiece.name.split(" ")[0];  // color is first word of name
    let col = kingPiece.col;
    // king side 
    let cKing = true;
    for (let i = col+1; i < 7; i++) {
        let sqr = document.querySelector(`[data-row='${kingPiece.row}'][data-col='${i}']`);
        if (sqr.hasChildNodes() || isSquareInCheck(sqr, kingColor)) {
            cKing = false;
            break;
        }
        cKing = true;
    }
    // if there is possiblity for king side castling
    if (cKing === true) {
        // check for rook movement
        let rRookDiv = document.querySelector(`[data-row='${kingPiece.row}'][data-col='${7}']`);
        if (rRookDiv.hasChildNodes()) {
            if (rRookDiv.firstChild.alt.includes("unmoved")) {
                let kSideDiv = document.querySelector(`[data-row='${kingPiece.row}'][data-col='${kingPiece.col + 2}']`)
                availableSquare.push(kSideDiv);
            }
        }
    }
    
    // Queen side
    let cQueen = true;
    for (let i = col-1; i > 0; i--) {
        let sqr = document.querySelector(`[data-row='${kingPiece.row}'][data-col='${i}']`);
        if (sqr.hasChildNodes() || isSquareInCheck(sqr, kingColor)) {
            cQueen = false;
            break;
        }
        cQueen = true;
    }

    // if there is the possibility for queen side castling
    if (cQueen === true) {
        // check for rook movement
        let lRookDiv = document.querySelector(`[data-row='${kingPiece.row}'][data-col='${0}']`);
        if (lRookDiv.hasChildNodes()) {
            if (lRookDiv.firstChild.alt.includes("unmoved")) {
                let qSideDiv = document.querySelector(`[data-row='${kingPiece.row}'][data-col='${clicked_piece.col - 2}']`)
                availableSquare.push(qSideDiv);
            }
        }
    }
}

function filterCheckedSquareForKing(kingPiece)
{
    if (!kingPiece.name.includes("king"))  // if kingPiece is not king, return
        return;

    let kingColor = kingPiece.name.split(" ")[0];
    availableSquare = availableSquare.filter(sqr => !isSquareInCheck(sqr, kingColor));
}

function showAvailableSquare() {
    availableSquare.forEach((div) => {
        div.classList.add("available");
        if (div.hasChildNodes()) {
            div.firstChild.removeAttribute("onclick");
        }
        div.setAttribute("onclick","moveToMe(this)");
    });
}

function findAvailableSquare(piece, flagForCheck = false) {
    if (piece === undefined)
        return;

    // if (piece.name.includes(turn)) {
        if (piece.name.includes("rook")) {
            availableSquare = [];
            findAvailableSquaresForRook(piece);
        }
        if (piece.name.includes("pawn")) {
            availableSquare = [];
            findAvailableSquaresForPawn(piece, flagForCheck);
        }
        if (piece.name.includes("bishop")) {
            availableSquare = [];
            findAvailableSquaresForBishop(piece);
        }
        if (piece.name.includes("queen")) {
            availableSquare = [];
            findAvailableSquaresForBishop(piece);
            findAvailableSquaresForRook(piece);
        }
        if (piece.name.includes("knight")) {
            availableSquare = [];
            findAvailableSquaresForKnight(piece);
        }
        if (piece.name.includes("king")) {
            availableSquare = [];
            findAvailableSquaresForKing(piece);
        }
    // }
}

function findAvailableSquaresForRook(clicked_piece) {
    let rowDiv = document.querySelectorAll(`[data-row='${clicked_piece.row}']`);
    let colDiv = document.querySelectorAll(`[data-col='${clicked_piece.col}']`);

    // console.log(clicked_piece.row, clicked_piece.col);

    for (let i = clicked_piece.col-1; i >= 0; i--) {  // left
        if (rowDiv[i].hasChildNodes()) {
            if (isOpponentPiece(rowDiv[i].firstChild.alt, clicked_piece.name)) {
                availableSquare.push(rowDiv[i]);
            }
            break;
        }
        availableSquare.push(rowDiv[i]);
    }
    for (let i = clicked_piece.col+1; i <= 7; i++) {   // right
        if (rowDiv[i].hasChildNodes()) {
            if (isOpponentPiece(rowDiv[i].firstChild.alt, clicked_piece.name)) {
                availableSquare.push(rowDiv[i]);
            }
            break;
        }
        availableSquare.push(rowDiv[i]);
    }
    for (let j = clicked_piece.row-1; j >= 0; j--) {   // up
        if (colDiv[j].hasChildNodes()) {
            if (isOpponentPiece(colDiv[j].firstChild.alt, clicked_piece.name)) {
                availableSquare.push(colDiv[j]);
            }
            break;
        }
        availableSquare.push(colDiv[j]);
    }
    for (let j = clicked_piece.row+1; j <= 7; j++) {   // down
        if (colDiv[j].hasChildNodes()) {
            if (isOpponentPiece(colDiv[j].firstChild.alt, clicked_piece.name)) {
                availableSquare.push(colDiv[j]);
            }
            break;
        }
        availableSquare.push(colDiv[j]);
    }

    // console.log(availableSquare);
}

function findAvailableSquaresForPawn(clicked_piece, flagForCheck = false) {
    if (clicked_piece.name.includes("white")) {
        let downDiv = document.querySelector(`[data-row='${clicked_piece.row+1}'][data-col='${clicked_piece.col}']`);
        if (!downDiv.hasChildNodes() && !flagForCheck) {
            availableSquare.push(downDiv);
            if (clicked_piece.row == 1) {   // if its pawn first move
                let down2Div = document.querySelector(`[data-row='${clicked_piece.row+2}'][data-col='${clicked_piece.col}']`);
                if (!down2Div.hasChildNodes()) {
                    availableSquare.push(down2Div);
                }
            }
        }
        // look for opponent piece to eat
        let nextRow = clicked_piece.row + 1;
        let nextLCol = clicked_piece.col - 1;
        let nextRCol = clicked_piece.col + 1;
        if (nextLCol >= 0) {
            let div = document.querySelector(`[data-row='${nextRow}'][data-col='${nextLCol}']`);
            if (div.hasChildNodes()) {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            } else if (flagForCheck) {
                availableSquare.push(div);
            }
        }
        if (nextRCol <= 7) {
            let div = document.querySelector(`[data-row='${nextRow}'][data-col='${nextRCol}']`);
            if (div.hasChildNodes()) {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            } else if (flagForCheck) {
                availableSquare.push(div);
            }
        }
    }
    if (clicked_piece.name.includes("black")) {
        let upDiv = document.querySelector(`[data-row='${clicked_piece.row-1}'][data-col='${clicked_piece.col}']`);
        if (!upDiv.hasChildNodes() && !flagForCheck) {
            availableSquare.push(upDiv);
            if (clicked_piece.row == 6) {   // if its pawn first move
                let up2Div = document.querySelector(`[data-row='${clicked_piece.row-2}'][data-col='${clicked_piece.col}']`);
                if (!up2Div.hasChildNodes()) {
                    availableSquare.push(up2Div);
                }
            }
        } 
        // look for opponent piece to eat
        let nextRow = clicked_piece.row - 1;
        let nextLCol = clicked_piece.col - 1;
        let nextRCol = clicked_piece.col + 1;
        if (nextLCol >= 0) {
            let div = document.querySelector(`[data-row='${nextRow}'][data-col='${nextLCol}']`);
            if (div.hasChildNodes()) {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            } else if (flagForCheck) {
                availableSquare.push(div);
            }
        }
        if (nextRCol <= 7) {
            let div = document.querySelector(`[data-row='${nextRow}'][data-col='${nextRCol}']`);
            if (div.hasChildNodes()) {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            } else if (flagForCheck) {
                availableSquare.push(div);
            }
        }
    }
    // console.log(availableSquare);
}

function findAvailableSquaresForBishop(clicked_piece) {
    let lCol = clicked_piece.col-1;
    let rCol = clicked_piece.col+1;
    for (let i = clicked_piece.row-1; i >= 0; i--) {   // Upper Diagonal
        if (lCol !== -1 && lCol >= 0) {
            let upLeftDiv = document.querySelector(`[data-row='${i}'][data-col='${lCol}']`);
            if (!upLeftDiv.hasChildNodes()) {  // left upper diagonal
                availableSquare.push(upLeftDiv);
                lCol--;
            } else {
                if (isOpponentPiece(upLeftDiv.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(upLeftDiv);
                }
                lCol = -1;
            }
        }

        if (rCol !== -1 && rCol <= 7) {
            let upRightDiv = document.querySelector(`[data-row='${i}'][data-col='${rCol}']`);
            if (!upRightDiv.hasChildNodes()) {  // right upper diagonal
                availableSquare.push(upRightDiv);
                rCol++;
            } else {
                if (isOpponentPiece(upRightDiv.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(upRightDiv);
                }
                rCol = -1;
            }
        }
    }
    
    lCol = clicked_piece.col-1;
    rCol = clicked_piece.col+1;
    for (let i = clicked_piece.row+1; i <= 7; i++) {   // Lower Diagonal
        if (lCol !== -1 && lCol >= 0) {
            let downLeftDiv = document.querySelector(`[data-row='${i}'][data-col='${lCol}']`);
            if (!downLeftDiv.hasChildNodes()) {  // left upper diagonal
                availableSquare.push(downLeftDiv);
                lCol--;
            } else {
                if (isOpponentPiece(downLeftDiv.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(downLeftDiv);
                }
                lCol = -1;
            }
        }
        
        if (rCol !== -1 && rCol <= 7) {
            let downRightDiv = document.querySelector(`[data-row='${i}'][data-col='${rCol}']`);
            if (!downRightDiv.hasChildNodes()) {  // right upper diagonal
                availableSquare.push(downRightDiv);
                rCol++;
            } else {
                if (isOpponentPiece(downRightDiv.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(downRightDiv);
                }
                rCol = -1;
            }
        }
    }
    // console.log(availableSquare);
}

function findAvailableSquaresForKnight(clicked_piece) {
    let div;
    // up
    let upRow = clicked_piece.row - 2;
    if (upRow >= 0) {
        let lCol = clicked_piece.col-1;
        if (lCol >= 0) {
            div = document.querySelector(`[data-row='${upRow}'][data-col='${lCol}']`);
            if (!div.hasChildNodes()) {
                availableSquare.push(div);
            } else {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            }
        }
        let rCol = clicked_piece.col+1;
        if (rCol <= 7) {
            div = document.querySelector(`[data-row='${upRow}'][data-col='${rCol}']`);
            if (!div.hasChildNodes()) {
                availableSquare.push(div);
            } else {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            }
        }
    }

    // down
    let downRow = clicked_piece.row + 2;
    if (downRow <= 7) {
        let lCol = clicked_piece.col-1;
        if (lCol >= 0) {
            div = document.querySelector(`[data-row='${downRow}'][data-col='${lCol}']`);
            if (!div.hasChildNodes()) {
                availableSquare.push(div);
            } else {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            }
        }
        let rCol = clicked_piece.col+1;
        if (rCol <= 7) {
            div = document.querySelector(`[data-row='${downRow}'][data-col='${rCol}']`);
            if (!div.hasChildNodes()) {
                availableSquare.push(div);
            } else {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            }
        }
    }

    // left
    let leftCol = clicked_piece.col - 2;
    if (leftCol >= 0) {
        let uRow = clicked_piece.row-1;
        if (uRow >= 0) {
            div = document.querySelector(`[data-row='${uRow}'][data-col='${leftCol}']`);
            if (!div.hasChildNodes()) {
                availableSquare.push(div);
            } else {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            }
        }
        let dRow = clicked_piece.row+1;
        if (dRow <= 7) {
            div = document.querySelector(`[data-row='${dRow}'][data-col='${leftCol}']`);
            if (!div.hasChildNodes()) {
                availableSquare.push(div);
            } else {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            }
        }
    }


    // right
    let rightCol = clicked_piece.col + 2;
    if (rightCol <= 7) {
        let uRow = clicked_piece.row-1;
        if (uRow >= 0) {
            div = document.querySelector(`[data-row='${uRow}'][data-col='${rightCol}']`);
            if (!div.hasChildNodes()) {
                availableSquare.push(div);
            } else {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            }
        }
        let dRow = clicked_piece.row+1;
        if (dRow <= 7) {
            div = document.querySelector(`[data-row='${dRow}'][data-col='${rightCol}']`);
            if (!div.hasChildNodes()) {
                availableSquare.push(div);
            } else {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            }
        }
    }

    // console.log(availableSquare);
}

function findAvailableSquaresForKing(clicked_piece) {
    let div;

    // up
    let upRow = clicked_piece.row - 1;
    if (upRow >= 0) {
        div = document.querySelector(`[data-row='${upRow}'][data-col='${clicked_piece.col}']`);
        if (!div.hasChildNodes()) {
            availableSquare.push(div);
        } else {
            if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                availableSquare.push(div);
            }
        }
        // up-left
        let lCol = clicked_piece.col-1;
        if (lCol >= 0) {
            div = document.querySelector(`[data-row='${upRow}'][data-col='${lCol}']`);
            if (!div.hasChildNodes()) {
                availableSquare.push(div);
            } else {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            }
        }
        // up-right
        let rCol = clicked_piece.col+1;
        if (rCol <= 7) {
            div = document.querySelector(`[data-row='${upRow}'][data-col='${rCol}']`);
            if (!div.hasChildNodes()) {
                availableSquare.push(div);
            } else {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            }
        }
    }

    // down
    let downRow = clicked_piece.row + 1;
    if (downRow <= 7) {
        div = document.querySelector(`[data-row='${downRow}'][data-col='${clicked_piece.col}']`);
        if (!div.hasChildNodes()) {
            availableSquare.push(div);
        } else {
            if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                availableSquare.push(div);
            }
        }
        // down-left
        let lCol = clicked_piece.col-1;
        if (lCol >= 0) {
            div = document.querySelector(`[data-row='${downRow}'][data-col='${lCol}']`);
            if (!div.hasChildNodes()) {
                availableSquare.push(div);
            } else {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            }
        }
        // down-right
        let rCol = clicked_piece.col+1;
        if (rCol <= 7) {
            div = document.querySelector(`[data-row='${downRow}'][data-col='${rCol}']`);
            if (!div.hasChildNodes()) {
                availableSquare.push(div);
            } else {
                if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                    availableSquare.push(div);
                }
            }
        }
    }

    // left
    let leftCol = clicked_piece.col - 1;
    if (leftCol >= 0) {
        div = document.querySelector(`[data-row='${clicked_piece.row}'][data-col='${leftCol}']`);
        if (!div.hasChildNodes()) {
            availableSquare.push(div);
        } else {
            if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                availableSquare.push(div);
            }
        }
    }
    // right
    let rightCol = clicked_piece.col + 1;
    if (rightCol <= 7) {
        div = document.querySelector(`[data-row='${clicked_piece.row}'][data-col='${rightCol}']`);
        if (!div.hasChildNodes()) {
            availableSquare.push(div);
        } else {
            if (isOpponentPiece(div.firstChild.alt, clicked_piece.name)) {
                availableSquare.push(div);
            }
        }
    }

    // console.log(availableSquare);
}

function moveToMe(targetDiv) {
    // toggleTurn();   // change the turn

    let prevBoard = document.querySelector(".board").innerHTML;
    let lastWasCheck = check;

    if (targetDiv.hasChildNodes()) {  // if target square have opponent piece
        targetDiv.firstChild.remove();
    }
    targetDiv.appendChild(clicked_piece.div.firstChild);

    // check if the king move is castling, if so also move the rook accordingly
    if (clicked_piece.name.includes("king")) {
        let side = isCastlingMove(clicked_piece, targetDiv);
        if (side !== 0) {
            let rookCol = clicked_piece.col + side;
            let rookRow = clicked_piece.row;
            let rookPiece;
            if (side === 1) {
                let div = document.querySelector(`[data-row='${rookRow}'][data-col='${7}']`);
                rookPiece = div.firstChild;
                div.firstChild.remove();
            }
            if (side === -1) {
                let div = document.querySelector(`[data-row='${rookRow}'][data-col='${0}']`);
                rookPiece = div.firstChild;
                div.firstChild.remove();
            }
            let rookDiv = document.querySelector(`[data-row='${rookRow}'][data-col='${rookCol}']`);
            rookDiv.appendChild(rookPiece);
        }
    }

    // check for pawn promotion
    if (clicked_piece.name.includes("pawn")) {
        if (targetDiv.dataset.row === '0') {
            targetDiv.innerHTML = `<img onclick="clickHandler(this)" src="./imgs/black_queen.png" alt="black queen">`;
        }
        if (targetDiv.dataset.row === '7') {
            targetDiv.innerHTML = `<img onclick="clickHandler(this)" src="./imgs/white_queen.png" alt="white queen">`;
        } 
    }

    // if rook or king is moved, change their unmoved status to changed
    if (clicked_piece.name.includes("king") || clicked_piece.name.includes("rook")) {
        targetDiv.firstChild.alt = targetDiv.firstChild.alt.replace("unmoved", "");
    }     
    
    checkForCheck();

    let kingColor = clicked_piece.name.includes("white") ? "black" : "white";
    if (check) {
        document.querySelector(`img[alt='${kingColor} king']`).parentElement.classList.add("check");
    }
    // if we move the piece in checked state and still there is check undo the move
    console.log("previously checked: ", lastWasCheck, "   Current-checked: ", check);
    if (lastWasCheck && check ) {  
        document.querySelector(".board").innerHTML = prevBoard;
    }
    else if (lastWasCheck && !check) {
        document.querySelector(".check").classList.remove("check");
    }
    unselectPiece();
    hideAvailableSquare();
}

/* this function checks for castling move and return number indicating the side
 * if return 1 (king side castling)
 * if return -1 (queen side castling)
 * if return 0 (no castling)
*/
function isCastlingMove(kingPiece, targetDiv) {
    let prevCol = kingPiece.col;
    let currCol = parseInt(targetDiv.dataset.col);
    let movedSquares = currCol - prevCol;
    if (movedSquares === 2)
        return 1;
    if (movedSquares === -2)
        return -1;
    return 0;
}

function isSquareInCheck(square, kingColor) {
    let prevAvailableSquare = availableSquare;
    let oppPcs = document.querySelectorAll(`.square>img:not([alt*="${kingColor}"])`);
    let flag = false;

    oppPcs.forEach(elem => {
        if (flag)
            return;
        let piece = getPieceFromImg(elem);
        if (!piece.name.includes("king"))
            findAvailableSquare(piece, true);

        if (availableSquare.some(squareDiv => squareDiv === square)) {
            flag = true;
            return;
        }
    });
    availableSquare = [...prevAvailableSquare];
    return flag;
}

function getPieceFromImg(img) {
    let piece = {};
    piece.name = img.alt;
    piece.div = img.parentElement;
    piece.row = parseInt(img.parentElement.dataset.row);
    piece.col = parseInt(img.parentElement.dataset.col);
    return piece;
}

function checkForCheck() {
    // let prevClicked_piece = { ...clicked_piece };
    // let prevAvailableSquare = [...availableSquare];

    // check = false;    // lets start by assuming there is no check
    // let squaresDiv = document.querySelectorAll(`.square`);
    // squaresDiv.forEach(div => {
    //     if (div.hasChildNodes()) {
    //         // simulate the click and check for available move if it has king or not
    //         clickHandler(div.firstChild);
    //         availableSquare.forEach(div => {
    //             if (div.hasChildNodes()) {
    //                 if (div.firstChild.alt.includes("king")) {
    //                     check = true;
    //                     return;
    //                 }
    //             }
    //         });
    //         unselectPiece();
    //         hideAvailableSquare(); 
    //     }
    // });
    // availableSquare = prevAvailableSquare;
    // clicked_piece = Object.assign({}, prevClicked_piece);
}

function unselectPiece() {
    let selectedDiv = document.querySelector(".clicked");
    if (selectedDiv)
        selectedDiv.classList.remove("clicked");
}

function hideAvailableSquare() {
    let availableDiv = document.querySelectorAll(".available");
    availableDiv.forEach(div => {
        div.classList.remove("available");
        div.removeAttribute("onclick");
        if (div.hasChildNodes()) {
            div.firstChild.setAttribute("onclick", "clickHandler(this)");
            if (div.firstChild.alt.includes("king")) {
                if (!check) 
                    div.classList.remove("check");
            }
        }
    });
}

function isOpponentPiece(selectedPiece, stopingPiece) {
    if (selectedPiece.includes("white") && stopingPiece.includes("white"))
        return false;
    if (selectedPiece.includes("black") && stopingPiece.includes("black"))
        return false;
    return true;
}

function toggleTurn() {
    if (turn === "white")
        turn = "black";
    else
        turn = "white";
}