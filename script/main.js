let clicked_piece = {};
let availableSquare = [];

function clickHandler(img) {
    if (img.parentElement !== clicked_piece.div) {
        unselectPiece(clicked_piece.div);
        hideAvailableSquare();
    }

    clicked_piece.name = img.alt;
    clicked_piece.div = img.parentElement;
    clicked_piece.row = parseInt(img.parentElement.dataset.row);
    clicked_piece.col = parseInt(img.parentElement.dataset.col);

    if (img.parentElement.classList.contains("clicked")) {
        unselectPiece(clicked_piece.div);
        hideAvailableSquare();
    }
    else {
        clicked_piece.div.classList.add("clicked");
        showAvailableSquare(clicked_piece);
    }

    console.log(clicked_piece);
}

function unselectPiece(pieceDiv) {
    if (pieceDiv === undefined)
        return;
    pieceDiv.classList.remove("clicked");
}

function showAvailableSquare(clicked_piece) {
    if (clicked_piece === undefined)
        return;

    if (clicked_piece.name.includes("rook")) {
        availableSquare = [];
        findAvailableSquaresForRook(clicked_piece);
    }
    if (clicked_piece.name.includes("pawn")) {
        availableSquare = [];
        findAvailableSquaresForPawn(clicked_piece);
    }
    if (clicked_piece.name.includes("bishop")) {
        availableSquare = [];
        findAvailableSquaresForBishop(clicked_piece);
    }
    if (clicked_piece.name.includes("queen")) {
        availableSquare = [];
        findAvailableSquaresForBishop(clicked_piece);
        findAvailableSquaresForRook(clicked_piece);
    }

    availableSquare.forEach((div) => {
        div.classList.add("available");
        div.setAttribute("onclick","moveToMe(this, clicked_piece)");
    });
}

function findAvailableSquaresForRook(clicked_piece) {
    let rowDiv = document.querySelectorAll(`[data-row='${clicked_piece.row}']`);
    let colDiv = document.querySelectorAll(`[data-col='${clicked_piece.col}']`);

    // console.log(rowDiv);
    // console.log(colDiv);
    console.log(clicked_piece.row, clicked_piece.col);

    for (let i = clicked_piece.col-1; i >= 0; i--) {
        // console.log("left: ", i);
        if (rowDiv[i].hasChildNodes())
            break;
        availableSquare.push(rowDiv[i]);
    }
    for (let i = clicked_piece.col+1; i <= 7; i++) {
        // console.log("right: ", i);
        if (rowDiv[i].hasChildNodes())
            break;
        availableSquare.push(rowDiv[i]);
    }
    for (let j = clicked_piece.row-1; j >= 0; j--) {
        // console.log("up: ", j, colDiv[j]);
        if (colDiv[j].hasChildNodes())
            break;
        availableSquare.push(colDiv[j]);
    }
    for (let j = clicked_piece.row+1; j <= 7; j++) {
        // console.log("down: ", j, colDiv[j]);
        if (colDiv[j].hasChildNodes())
            break;
        availableSquare.push(colDiv[j]);
    }

    console.log(availableSquare);
}

function findAvailableSquaresForPawn(clicked_piece) {
    if (clicked_piece.name.includes("white")) {
        let downDiv = document.querySelector(`[data-row='${clicked_piece.row+1}'][data-col='${clicked_piece.col}']`);
        if (!downDiv.hasChildNodes()) {
            availableSquare.push(downDiv);
            if (clicked_piece.row == 1) {   // if its pawn first move
                let down2Div = document.querySelector(`[data-row='${clicked_piece.row+2}'][data-col='${clicked_piece.col}']`);
                if (!down2Div.hasChildNodes()) {
                    availableSquare.push(down2Div);
                }
            }
        } else {  // pawn is block by piece
            
        }
    }
    if (clicked_piece.name.includes("black")) {
        let upDiv = document.querySelector(`[data-row='${clicked_piece.row-1}'][data-col='${clicked_piece.col}']`);
        if (!upDiv.hasChildNodes()) {
            availableSquare.push(upDiv);
            if (clicked_piece.row == 6) {   // if its pawn first move
                let up2Div = document.querySelector(`[data-row='${clicked_piece.row-2}'][data-col='${clicked_piece.col}']`);
                if (!up2Div.hasChildNodes()) {
                    availableSquare.push(up2Div);
                }
            }
        }
    }
    console.log(availableSquare);
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
                lCol = -1;
            }
        }

        if (rCol !== -1 && rCol <= 7) {
            let upRightDiv = document.querySelector(`[data-row='${i}'][data-col='${rCol}']`);
            if (!upRightDiv.hasChildNodes()) {  // right upper diagonal
                availableSquare.push(upRightDiv);
                rCol++;
            } else {
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
                lCol = -1;
            }
        }
        
        if (rCol !== -1 && rCol <= 7) {
            let downRightDiv = document.querySelector(`[data-row='${i}'][data-col='${rCol}']`);
            if (!downRightDiv.hasChildNodes()) {  // right upper diagonal
                availableSquare.push(downRightDiv);
                rCol++;
            } else {
                rCol = -1;
            }
        }
    }
    console.log(availableSquare);
}

function moveToMe(targetDiv, clicked_piece) {
    targetDiv.appendChild(clicked_piece.div.firstChild);
    unselectPiece(clicked_piece.div);
    hideAvailableSquare();
}

function hideAvailableSquare() {
    availableSquare.forEach(div => {
        div.classList.remove("available");
        div.removeAttribute("onclick");
    });
}