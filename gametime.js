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
let whiteturn = true;
var legalmoves = [];


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
    }
}

setuppieces();


function allowclick(e) {
    const piece = e.currentTarget;   /* sets variable piece to be the current target to be moved */
    const piececolour = piece.getAttribute('colour');
    if ((whiteturn && piececolour == 'white')||(!whiteturn && piececolour == 'black')){
        e.stopPropagation();        /* makes ure you cant trigger the allowclick and allowplace functions at the same time as thye both take a click to activate*/ 
        if (selected === piece) {   /* if you click the piece twice then it unselects it */
            unhighlight();        /* function to unselect */
            selected = null;      /* reset to nothing selected */
            legalmoves = [];
            return;
        }
        unhighlight();
        selected = piece;
        const startingsquareid = piece.parentNode.id;
        legalmoves = getpossiblemoves(piece, startingsquareid, piececolour);
        console.log(legalmoves)
        highlight();        /* function to highlight selected piece */
    }
}

function allowplace(e, startingsquareid, piece) {
    const square = e.currentTarget;   /* sets the square you will place on to be the target */
    if (!selected) return;         /* makes sure a piece is selected */
    if(startingsquareid === square) return;     /*so you cant capture yourself*/
    const targetpiece = square.querySelector('.piece');  /* makes the constant targetpiece  whatever is current on that square e.g. if empty targetpiece = null*/
    if (targetpiece && targetpiece !== selected ) {         /* makes sure you cant put the piece you are moving ontop of itsself */
        targetpiece.remove();                           /* removes the current piece on that square */
    }

    if (legalmoves.includes(square.id)){
        square.appendChild(selected);     /* appends your clicked piece onto the clicked square */
        unhighlight();                  /* unhighlights once piece is moved */
        selected = null     /* resets once piece is moved */
        whiteturn =! whiteturn; /* turns white turn to false (black turn) or white turn back to true (white turn) */
        rotate();
    }
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


function getpossiblemoves(piece, startingsquareid, piececolour){
    if (piece.classList.contains('pawn')){
        let legalmoves = pawnmoves(piececolour, startingsquareid);
        return legalmoves;
    }

}

function onsquare(square){
     if (square.querySelector('.piece') == null){ /* checks if anything is on the target square*/
        return 'empty';         /*if there is nothing there then returns that the square is empty*/
    } else{
        const pcolour = (square.querySelector('.piece')).getAttribute('colour');    /* if there is something on the square then it gets the colour of it and returns it*/
        return pcolour;
    }
}
  
function checkdiagonal(piececolour, startingsquareid){
    let legalmoves = [];
    const file = startingsquareid.charAt(0);    /*gets the file of the current square the piece is on */
    const rank = startingsquareid.charAt(1);
    const ranknumber = parseInt(rank);    /*gets the rank of the current square the piece is on */
    let currentfile = file;
    let currentrank = ranknumber;
    let currentsquareid = currentfile + currentrank; /* makes square id e.g. A1 */
    let currentsquare = document.getElementById(currentsquareid)
    let squarecontains = onsquare(currentsquare);  /* runs onsquare function to see if theres anything on the target square */
    /* checks left diagonal for white*/
    if ((piececolour == 'white') && (currentrank !== 'a')){
        currentrank+=1;
        currentfile = currentfile.charCodeAt(0);
        currentfile-=1;
        currentfile = String.fromCharCode(currentfile);
        checksquareid = currentfile + currentrank;
        currentsquare = document.getElementById(checksquareid);
        squarecontains = onsquare(currentsquare);
        if ((squarecontains !== 'empty') && (piececolour !== 'white')){
            legalmoves.push(checksquareid);
        }else{
            
        }
    }
        

    /*checks right diagonal for white*/   
    if ((piececolour == 'white')&& (currentrank !== 'h')){
        currentrank+=1;
        currentfile = currentfile.charCodeAt(0);
        currentfile+=1;
        currentfile = String.fromCharCode(currentfile);
        checksquareid = currentfile + currentrank;
        currentsquare = document.getElementById(checksquareid);
        squarecontains = onsquare(currentsquare);
        if ((squarecontains !== 'empty') && (piececolour !== 'white')){
            legalmoves.push(checksquareid);
        }else{
            
        }         
    }
        

        /*checks left diaganal for black */
    if ((piececolour == 'black') && (currentrank !== 'h')){
        currentrank+=1;
        currentfile = currentfile.charCodeAt(0);
        currentfile-=1;
        currentfile = String.fromCharCode(currentfile);
        checksquareid = currentfile + currentrank;
        currentsquare = document.getElementById(checksquareid);
        squarecontains = onsquare(currentsquare);
        if ((squarecontains !== 'empty') && (piececolour !== 'black')){
            legalmoves.push(checksquareid);
        }else{
            
        }
    }
   
    
    /*checks right diagonal for black */
    if ((piececolour == 'black') && (currentrank !== 'a')){
        currentrank+=1;
        currentfile = currentfile.charCodeAt(0);
        currentfile+=1;
        currentfile = String.fromCharCode(currentfile);
        checksquareid = currentfile + currentrank;
        currentsquare = document.getElementById(checksquareid);
        squarecontains = onsquare(currentsquare);
        if ((squarecontains !== 'empty') && (piececolour !== 'black')){
            legalmoves.push(checksquareid);
        }else{
            
        }
    }
    return legalmoves;
}

function pawnmoves(piececolour, startingsquareid){ /* A function which checks the square infront of the pawn. If occupied then no legal moves, if not then there is legal move forward 1 place. if on the 2nd or 7th rank then checks the next square.*/
    let legalmoves = checkdiagonal(piececolour, startingsquareid);
    const file = startingsquareid.charAt(0);    /*gets the file of the current square the piece is on */
    const rank = startingsquareid.charAt(1);
    const ranknumber = parseInt(rank);    /*gets the rank of the current square the piece is on */
    let currentfile = file;
    let currentrank = ranknumber;
    let currentsquareid = currentfile + currentrank; /* makes square id e.g. A1 */
    let currentsquare = document.getElementById(currentsquareid)
    let squarecontains = onsquare(currentsquare);  /* runs onsquare function to see if theres anything on the target square */
    let movedirection = piececolour == 'white' ? 1:-1;  /* sets move direction to 1 or -1 depending on if the piececolour is white*/
    currentrank+=movedirection;             /* adds the move direction to get new currentrank*/
    currentsquareid = currentfile + currentrank;  /* uses new current rank to make the currentsquareid of the square infront*/
    currentsquare = document.getElementById(currentsquareid);
    squarecontains = onsquare(currentsquare);
    if (squarecontains !== 'empty'){  /* if the square infront is occupied then theres no legal moves*/
        
    }else{
        legalmoves.push(currentsquareid) /* square infront isnt occupied so can be moves and therefore added to legal moves*/
        if((currentrank !== 2) && (currentrank !==7)){
            
        }else{
        currentrank+=movedirection;             /* adds the move direction to get new currentrank*/
        currentsquareid = currentfile + currentrank;  /* uses new current rank to make the currentsquareid of the square infront*/
        currentsquare = document.getElementById(currentsquareid);
        squarecontains = onsquare(currentsquare);
        if (squarecontains !== 'empty'){  /* if the square infront is occupied then theres no legal moves*/
            
        }else{
            legalmoves.push(currentsquareid) /* square infront isnt occupied so can be moves and therefore added to legal moves*/
            }
    }
    }
    return legalmoves;
   
}