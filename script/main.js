let clicked_piece = {};

function clickHandler(img) {
    clicked_piece.name = img.alt;
    clicked_piece.row = img.parentElement.dataset.row;
    clicked_piece.col = img.parentElement.dataset.col;
    console.log(clicked_piece);
}