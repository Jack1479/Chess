const open = document.getElementById('openbutton');
const close = document.getElementById('close_button')
const tut = document.getElementById('tutorial_page');
open.addEventListener('click', () => {
    tut.style.display = 'block'
    close.style.display = 'block';
});

close.addEventListener('click', () => {
    tut.style.display = 'none';
    close.style.display = 'none';
});

const pieceimg = document.getElementsByTagName('img')
const allsquares = document.getElementsByClassName('square')
const pieces = document.getElementsByClassName('piece')
const rows = document.getElementById('row')
const columns = document.getElementById('column')
const board = document.querySelector('.Chessboard')

let selected = null;
let from = null;
let whiteturn = true;


function setupboard() {
    for (let i = 0; i < allsquares.length; i++) {    /* loops through all squares on the board and adds an event listener to each one*/
        allsquares[i].addEventListener('click', allowplace); /* loops through all squares on the board and adds an event listener to each one*/
        let row = 8 - Math.floor(i / 8);       /*adding row coordinates 1-8*/
        let column = String.fromCharCode(97 + (i % 8));     /*adding column coordinates a-h*/
        let square = allsquares[i];
        square.id = column + row;
    }
}

setupboard();

function setuppieces() {
    for (let i = 0; i < pieces.length; i++) {      /* loops through all pieces on the board and adds an event listener to each one*/
        pieces[i].addEventListener('click', allowclick);     /* loops through all pieces on the board and adds an event listener to each one. when clicked will trigger allowclick function*/
        pieces[i].id = pieces[i].className.split(' ')[1];  /* giving each piece it name through taking the second part of its class name e.g.brook. for black rook*/
    }
}

setuppieces();


function allowclick(e) {
    const piece = e.currentTarget;   /* sets variable piece to be the current target to be moved */
    const piececolour = piece.getAttribute('colour')
    if ((whiteturn && piececolour == 'white')||(!whiteturn && piececolour == 'black')){
        e.stopPropagation();        /* makes ure you cant trigger the allowclick and allowplace functions at the same time as thye both take a click to activate*/ 
        if (selected === piece) {   /* if you click the piece twice then it unselects it */
            unhighlight();        /* function to unselect */
            selected = null;      /* reset to nothing selected */
            from = null;          /* reset to nothing selected */
            return;
        }
        unhighlight();
        selected = piece;
        from = piece.parentElement;   /* this variable holds the position that piece came from which will be useful for validation */
        highlight();        /* function to highlight selected piece */
    }
}

function allowplace(e) {
    const square = e.currentTarget;   /* sets the square you will place on to be the target */
    if (!selected) return;         /* makes sure a piece is selected */
    if(from === square) return;     /*so you cant capture yourself*/
    const targetpiece = square.querySelector('.piece');  /* makes the constant targetpiece  whatever is current on that square e.g. if empty targetpiece = null*/
    if (targetpiece && targetpiece !== selected ) {         /* makes sure you cant put the piece you are moving ontop of itsself */
        targetpiece.remove();                           /* removes the current piece on that square */
    }
    square.appendChild(selected);     /* appends your clicked piece onto the clicked square */
    unhighlight();                  /* unhighlights once piece is moved */
    selected = null     /* resets once piece is moved */
    from = null          /* resets once piece is moved */
    whiteturn =! whiteturn; /* turns white turn to false (black turn) or white turn back to true (white turn) */
    rotate();
}


function unhighlight() {
    if (selected) selected.classList.remove('highlight')         /* function to remove highlight when function is called */
}

function highlight() {
    if (selected) selected.classList.add('highlight')       /* function to add highlight when function is called */
}

function rotate(){
    board.classList.toggle('flip')  /*toggles the flip css package  which rotates the board 180 degrees*/
}


