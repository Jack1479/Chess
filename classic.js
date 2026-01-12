const openset = document.getElementById('opensettings');
const menusett = document.getElementById('settingsmenu');
const close = document.getElementById('close_button');

openset.addEventListener('click' , () => {
    menusett.style.display = 'block'
    close.style.display = 'block'
});

close.addEventListener('click', () => { /* adds event listener to close button*/
    close.style.display = 'none'; /* sets display to none to hide*/
    menusett.style.display = 'none';
}); 

var url = location.href
var urldata = location.href.split('?')[1].split('&')


const pieceimg = document.getElementsByTagName('img')
const allsquares = document.getElementsByClassName('square')
const pieces = document.getElementsByClassName('piece')
const rows = document.getElementById('row')
const columns = document.getElementById('column')
const board = document.querySelector('.Chessboard')


let selected = null;
let whiteturn = true;
var legalmoves = [];

const colourpicker = document.getElementById('colourpick');
colourpicker.addEventListener('input', (e) => {
  const chosenColour = e.target.value; 
  document.documentElement.style.setProperty('--pulse-colour', chosenColour);
});

const colourpickerL = document.getElementById('colourpickL');
colourpickerL.addEventListener('input', (e) => {
  const chosenColour = e.target.value; 
  document.documentElement.style.setProperty('--pulse-colourL', chosenColour);
});

const colourpickerD = document.getElementById('colourpickD');
colourpickerD.addEventListener('input', (e) => {
  const chosenColour = e.target.value; 
  document.documentElement.style.setProperty('--pulse-colourD', chosenColour);
});

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
    const startingsquareid = piece.parentNode.id;
    if ((whiteturn && piececolour == 'white') || (!whiteturn && piececolour == 'black')) {
        e.stopPropagation();        /* makes ure you cant trigger the allowclick and allowplace functions at the same time as thye both take a click to activate*/
        if (selected === piece) {   /* if you click the piece twice then it unselects it */
            unhighlight();        /* function to unselect */
            unhighlightlegal();
            selected = null;      /* reset to nothing selected */
            legalmoves = [];
            return;
        }
        unhighlight()
        selected = piece;
        legalmoves = getpossiblemoves(piece, startingsquareid, piececolour);
        console.log(legalmoves)
        highlight(startingsquareid);        /* function to highlight selected piece */
        if(urldata.includes('showmovescheck=on'))
            highlightlegal();
    }
}

function allowplace(e) {
    const square = e.currentTarget;   /* sets the square you will place on to be the target */
    if (!selected) return;         /* makes sure a piece is selected */
    if (legalmoves.includes(square.id)) {
        const targetpiece = square.querySelector('.piece');  /* makes the constant targetpiece  whatever is current on that square e.g. if empty targetpiece = null*/
        if (targetpiece && targetpiece !== selected) {         /* makes sure you cant put the piece you are moving ontop of itsself */
            targetpiece.remove();                           /* removes the current piece on that square */
        }
        square.appendChild(selected);     /* appends your clicked piece onto the clicked square */
        const pawncoord = promotion();
        if(pawncoord !== undefined)
            pawnpromote(pawncoord, square);
        unhighlight();                  /* unhighlights once piece is moved */
        unhighlightlegal();
        if(urldata.includes('rotatecheck=on')){
            rotate();
    };
        selected = null     /* resets once piece is moved */
    }
        whiteturn = !whiteturn; /* turns white turn to false (black turn) or white turn back to true (white turn) */
        let allvalidwhite = getallwhitemoves();
        let allvalidblack = getallblackmoves();
        let tempallsquares = Array.from(document.getElementsByClassName('square'));
        for(let i=1;i<tempallsquares.length + 1;i++){
            let row = 8 - Math.floor((i - 1) / 8);
            let column = (i - 1) % 8;
            let columnLetter = String.fromCharCode(97 + column);
            let coord = columnLetter + row;
            let currentcoord = document.getElementById(coord);
            unhighlightcheck(currentcoord);
            let whichpiece = whatpiece(currentcoord);
            let col = onsquare(currentcoord);
            if(whichpiece == 'king' && col == 'white'){
                let kinglocation = coord
                if (whiteturn == true){
                    if(allvalidblack.includes(kinglocation)){
                        highlightcheck(currentcoord);
                        }}}
            if(whichpiece == 'king' && col == 'black'){
                let kinglocation = coord;
                if(whiteturn !== true){
                    if(allvalidwhite.includes(kinglocation)){
                        highlightcheck(currentcoord);
                }}}
            
}}


function unhighlightlegal(){
    document.querySelectorAll('.legalsquares').forEach((move) =>{
        move.classList.remove('legalsquares');
    });
}

function highlightlegal(){
    unhighlightlegal();
    legalmoves.forEach((squareid) => {
        const tempsquare = document.getElementById(squareid);
        if (tempsquare){
            tempsquare.classList.add('legalsquares')
        }
    });
}

function unhighlight() {
    if (selected){
        selected.classList.remove('highlight');
        }
    }

function highlight() {
    if (selected){
        selected.classList.add('highlight');
        }
    }


function rotate() {
    board.classList.toggle('flip')  /*toggles the flip css package  which rotates the board 180 degrees*/
}

function highlightcheck(currentcoord){
    currentcoord.classList.add('checkhighlight')
    
}
function unhighlightcheck(allsquares){
    allsquares.classList.remove('checkhighlight')
    
}

function getallwhitemoves(){
    let allmoves = [];
    let tempallsquares = Array.from(document.getElementsByClassName('square'));
        for(let i=1;i<tempallsquares.length + 1;i++){
            let row = 8 - Math.floor((i - 1) / 8);
            let column = (i - 1) % 8;
            let columnLetter = String.fromCharCode(97 + column);
            let coord = columnLetter + row;
            let currentcoord = document.getElementById(coord);
            let whichpiece = whatpiece(currentcoord);
            if (whichpiece != 'empty'){
                let col = onsquare(currentcoord);
                if(whichpiece == 'pawn' && col == 'white'){
                    let allpmoves = pawnmoves(col,coord)
                    allmoves.push(allpmoves);
                }else if(whichpiece == 'rook' && col == 'white'){
                    let allrmoves = rookmoves(col,coord)
                    allmoves.push(allrmoves);     
                }else if(whichpiece == 'bishop' && col == 'white'){
                    let allbmoves = bishopmoves(col,coord) 
                    allmoves.push(allbmoves);  
                }else if(whichpiece == 'knight' && col == 'white'){
                    let allkmoves = knightmoves(col,coord)
                    allmoves.push(allkmoves);
                }else if(whichpiece == 'queen' && col == 'white'){
                    let allqmoves = queenmoves(col,coord)
                    allmoves.push(allqmoves);
            }
        }
        }
        return allmoves.flat();
}

function getallblackmoves(){
    let allmoves = [];
    let tempallsquares = Array.from(document.getElementsByClassName('square'));
        for(let i=1;i<tempallsquares.length + 1;i++){
            let row = 8 - Math.floor((i - 1) / 8);
            let column = (i - 1) % 8;
            let columnLetter = String.fromCharCode(97 + column);
            let coord = columnLetter + row;
            let currentcoord = document.getElementById(coord);
            let whichpiece = whatpiece(currentcoord);
            if (whichpiece != 'empty'){
                let col = onsquare(currentcoord);
                if(whichpiece == 'pawn' && col == 'black'){
                    let allpmoves = pawnmoves(col,coord)
                    allmoves.push(allpmoves)
                }else if(whichpiece == 'rook' && col == 'black'){
                    let allrmoves = rookmoves(col,coord)
                    allmoves.push(allrmoves);     
                }else if(whichpiece == 'bishop' && col == 'black'){
                    let allbmoves = bishopmoves(col,coord) 
                    allmoves.push(allbmoves);  
                }else if(whichpiece == 'knight' && col == 'black'){
                    let allkmoves = knightmoves(col,coord)
                    allmoves.push(allkmoves);
                }else if(whichpiece == 'queen' && col == 'black'){
                    let allqmoves = queenmoves(col,coord)
                    allmoves.push(allqmoves);
                }
            }
        }
        return allmoves.flat();     
}



function getpossiblemoves(piece, startingsquareid, piececolour) {
    if (piece.classList.contains('pawn')) {
        return pawnmoves(piececolour, startingsquareid); 
    }
    if (piece.classList.contains('knight')) {
        return knightmoves(piececolour, startingsquareid);
    }
    if (piece.classList.contains('bishop')) {
        return bishopmoves(piececolour, startingsquareid);
    }
    if (piece.classList.contains('rook')) {
        return rookmoves(piececolour, startingsquareid);
    }
    if (piece.classList.contains('queen')) {
        return queenmoves(piececolour, startingsquareid);
    }
    if (piece.classList.contains('king')) {
        return kingmoves(piececolour, startingsquareid);
    }
}

function onsquare(square){
    if (square.querySelector('.piece') !== null) {               /* checks if anything is on the target square*/
        const pcolour = (square.querySelector('.piece')).getAttribute('colour');     /* if there is something on the square then it gets the colour of it and returns it*/
        return pcolour;
    } else {
        return 'empty';
    }
}

function whatpiece(squared){
    if (squared.querySelector('.piece') !== null) {               
        const x = (squared.querySelector('.piece')).getAttribute('type');     
        return x ;
    } else {
        return 'empty';
    }
} 



function pawnmoves(piececolour, startingsquareid) { /* A function which checks the square infront of the pawn. If occupied then no legal moves, if not then there is legal move forward 1 place. if on the 2nd or 7th rank then checks the next square.*/
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
    if ((piececolour == 'white') && (currentfile !== 'a')) {
        let tempcurrentrank = currentrank + 1;
        let tempcurrentfile = currentfile.charCodeAt(0);
        tempcurrentfile -= 1;
        tempcurrentfile = String.fromCharCode(tempcurrentfile);
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);
        let tempsquarecontains = onsquare(tempcurrentsquare);
        if (tempsquarecontains !== 'black') {
        } else {
            legalmoves.push(tempcurrentsquareid);
        }
    }


    /*checks right diagonal for white*/
    if ((piececolour == 'white') && (currentfile !== 'h')) {
        let tempcurrentrank = currentrank + 1;
        let tempcurrentfile = currentfile.charCodeAt(0);
        tempcurrentfile += 1;
        tempcurrentfile = String.fromCharCode(tempcurrentfile);
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);
        let tempsquarecontains = onsquare(tempcurrentsquare);
        if (tempsquarecontains !== 'black') {
        } else {
            legalmoves.push(tempcurrentsquareid);
        }
    }


    /*checks left diaganal for black */
    if ((piececolour == 'black') && (currentfile !== 'h')) {
        let tempcurrentrank = currentrank - 1;
        let tempcurrentfile = currentfile.charCodeAt(0);
        tempcurrentfile += 1;
        tempcurrentfile = String.fromCharCode(tempcurrentfile);
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);
        let tempsquarecontains = onsquare(tempcurrentsquare);
        if (tempsquarecontains !== 'white') {
        } else {
            legalmoves.push(tempcurrentsquareid);

        }
    }


    /*checks right diagonal for black */
    if ((piececolour == 'black') && (currentfile !== 'a')) {
        let tempcurrentrank = currentrank - 1;
        let tempcurrentfile = currentfile.charCodeAt(0);
        tempcurrentfile -= 1;
        tempcurrentfile = String.fromCharCode(tempcurrentfile);
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);
        let tempsquarecontains = onsquare(tempcurrentsquare);
        if (tempsquarecontains !== 'white') {
        } else {
            legalmoves.push(tempcurrentsquareid);

        }
    }

    currentfile = file;
    currentrank = ranknumber;
    currentsquareid = currentfile + currentrank; /* makes square id e.g. A1 */
    currentsquare = document.getElementById(currentsquareid)
    squarecontains = onsquare(currentsquare);  /* runs onsquare function to see if theres anything on the target square */
    const movedirection = piececolour == 'white' ? 1 : -1;  /* sets move direction to 1 or -1 depending on if the piececolour is white*/
    currentrank += movedirection;             /* adds the move direction to get new currentrank*/
    currentsquareid = currentfile + currentrank;  /* uses new current rank to make the currentsquareid of the square infront*/
    currentsquare = document.getElementById(currentsquareid);
    squarecontains = onsquare(currentsquare);
    if (squarecontains !== 'empty') {  /* if the square infront is occupied then theres no legal moves*/
        return legalmoves;
    } else {
        legalmoves.push(currentsquareid) /* square infront isnt occupied so can be moves and therefore added to legal moves*/
        if ((ranknumber !== 2) && (ranknumber !== 7)) {
        } else {
            currentrank += movedirection;             /* adds the move direction to get new currentrank*/
            currentsquareid = currentfile + currentrank;  /* uses new current rank to make the currentsquareid of the square infront*/
            currentsquare = document.getElementById(currentsquareid);
            squarecontains = onsquare(currentsquare);
            if (squarecontains !== 'empty') {  /* if the square infront is occupied then theres no legal moves*/
            } else {
                legalmoves.push(currentsquareid) /* square infront isnt occupied so can be moves and therefore added to legal moves*/
            }
        }

        return legalmoves;
    }
}

function knightmoves(piececolour, startingsquareid) {
    let legalmoves = [];
    const file = startingsquareid.charAt(0);    /*gets the file of the current square the piece is on */
    const rank = startingsquareid.charAt(1);
    const ranknumber = parseInt(rank);    /*gets the rank of the current square the piece is on */
    let currentfile = file;
    let currentrank = ranknumber;
    let currentsquareid = currentfile + currentrank; /* makes square id e.g. A1 */
    let currentsquare = document.getElementById(currentsquareid)
    let squarecontains = onsquare(currentsquare);  /* runs onsquare function to see if theres anything on the target square */
    const movedirection = [
        [2, -1], [2, 1], [-2, -1], [-2, 1], [-1, 2], [1, 2], [1, -2], [-1, -2]
    ];

    movedirection.forEach((move) => {
        let tempcurrentrank = currentrank + move[1];
        let tempcurrentfile = currentfile.charCodeAt(0);
        tempcurrentfile = tempcurrentfile + move[0];
        tempcurrentfile = String.fromCharCode(tempcurrentfile);
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);
        if (tempcurrentsquare !== null) {
            let tempsquarecontains = onsquare(tempcurrentsquare);
            if (tempsquarecontains == 'empty') {
                legalmoves.push(tempcurrentsquareid);
            } else {
                if (piececolour == tempsquarecontains) {

                } else {
                    legalmoves.push(tempcurrentsquareid);
                }

            }
        }else{

        }
    });

    return legalmoves;
}

function bishopmoves(piececolour, startingsquareid){
    let legalmoves = [];
    const file = startingsquareid.charAt(0);    /*gets the file of the current square the piece is on */
    const rank = startingsquareid.charAt(1);
    const ranknumber = parseInt(rank);    /*gets the rank of the current square the piece is on */
    let currentfile = file;
    let currentrank = ranknumber;
    let currentsquareid = currentfile + currentrank; /* makes square id e.g. A1 */
    let currentsquare = document.getElementById(currentsquareid)
    let squarecontains = onsquare(currentsquare);  /* runs onsquare function to see if theres anything on the target square */      /*||*/
    const movedirectionNE = [1,1];
    const movedirectionSE = [-1,1];
    const movedirectionSW = [-1,-1];
    const movedirectionNW = [1,-1];    

    let tempallsquares = Array.from(document.getElementsByClassName('square'));
    for(let i=0;i<tempallsquares.length;i++){
        tempallsquares[i] = tempallsquares[i].id
    }

    function northeast(){
        let legal = [];
        let cont = true;
        let tempcurrentrank = currentrank + movedirectionNE[0];
        let tempcurrentfile = currentfile.charCodeAt(0);
        tempcurrentfile = tempcurrentfile + movedirectionNE[1];
        tempcurrentfile = String.fromCharCode(tempcurrentfile);
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);
        while (cont = true){
            if (tempallsquares.includes(tempcurrentsquareid)) {
                let tempsquarecontains = onsquare(tempcurrentsquare);
                if (tempsquarecontains == 'empty') {
                    legal.push(tempcurrentsquareid);
                    tempcurrentrank = tempcurrentrank + movedirectionNE[0];
                    tempcurrentfile = tempcurrentfile.charCodeAt(0);
                    tempcurrentfile = tempcurrentfile + movedirectionNE[1];
                    tempcurrentfile = String.fromCharCode(tempcurrentfile);
                    tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
                    tempcurrentsquare = document.getElementById(tempcurrentsquareid);
                }else if (piececolour !== tempsquarecontains) {
                    legal.push(tempcurrentsquareid);
                    return legal;
                    } else{
                        return legal;
                    } 
                }else{
                    return legal;
        }}}
            

    
    function southeast(){
        let legal = [];
        let cont = true;
        let tempcurrentrank = currentrank + movedirectionSE[0];
        let tempcurrentfile = currentfile.charCodeAt(0);
        tempcurrentfile = tempcurrentfile + movedirectionSE[1];
        tempcurrentfile = String.fromCharCode(tempcurrentfile);
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);
        while (cont = true){
            if (tempallsquares.includes(tempcurrentsquareid)) {
                let tempsquarecontains = onsquare(tempcurrentsquare);
                if (tempsquarecontains == 'empty') {
                    legal.push(tempcurrentsquareid);
                    tempcurrentrank = tempcurrentrank + movedirectionSE[0];
                    tempcurrentfile = tempcurrentfile.charCodeAt(0);
                    tempcurrentfile = tempcurrentfile + movedirectionSE[1];
                    tempcurrentfile = String.fromCharCode(tempcurrentfile);
                    tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
                    tempcurrentsquare = document.getElementById(tempcurrentsquareid);
                }else if (piececolour !== tempsquarecontains) {
                    legal.push(tempcurrentsquareid);
                    return legal;
                    }else{
                        return legal;
                    } 
                }else{
                    return legal;
        }}}
         

    function southwest(){
        let legal = [];
        let cont = true;
        let tempcurrentrank = currentrank + movedirectionSW[0];
        let tempcurrentfile = currentfile.charCodeAt(0);
        tempcurrentfile = tempcurrentfile + movedirectionSW[1];
        tempcurrentfile = String.fromCharCode(tempcurrentfile);
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);
        while (cont = true){
            if (tempallsquares.includes(tempcurrentsquareid)) {
                let tempsquarecontains = onsquare(tempcurrentsquare);
                if (tempsquarecontains == 'empty') {
                    legal.push(tempcurrentsquareid);
                    tempcurrentrank = tempcurrentrank + movedirectionSW[0];
                    tempcurrentfile = tempcurrentfile.charCodeAt(0);
                    tempcurrentfile = tempcurrentfile + movedirectionSW[1];
                    tempcurrentfile = String.fromCharCode(tempcurrentfile);
                    tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
                    tempcurrentsquare = document.getElementById(tempcurrentsquareid);
                }else if (piececolour !== tempsquarecontains) {
                    legal.push(tempcurrentsquareid);
                    return legal;
                    }else{
                        return legal;
                    }  
                }else{
                    return legal;
        }}}
        
        
    function northwest(){
        let legal = [];
        let cont = true;
        let tempcurrentrank = currentrank + movedirectionNW[0];
        let tempcurrentfile = currentfile.charCodeAt(0);
        tempcurrentfile = tempcurrentfile + movedirectionNW[1];
        tempcurrentfile = String.fromCharCode(tempcurrentfile);
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);
        while (cont = true){
            if (tempallsquares.includes(tempcurrentsquareid)) {
                let tempsquarecontains = onsquare(tempcurrentsquare);
                if (tempsquarecontains == 'empty') {
                    legal.push(tempcurrentsquareid);
                    tempcurrentrank = tempcurrentrank + movedirectionNW[0];
                    tempcurrentfile = tempcurrentfile.charCodeAt(0);
                    tempcurrentfile = tempcurrentfile + movedirectionNW[1];
                    tempcurrentfile = String.fromCharCode(tempcurrentfile);
                    tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
                    tempcurrentsquare = document.getElementById(tempcurrentsquareid);
                }else if (piececolour !== tempsquarecontains) {
                    legal.push(tempcurrentsquareid);
                    return legal;
                    } else{
                        return legal;
                    } 
                }else{
                    return legal;
        }}}
    
    let legalNEmoves = northeast();
    legalNEmoves.forEach((move) => {
        legalmoves.push(move)
    });

    let legalSEmoves = southeast();
    legalSEmoves.forEach((move) => {
        legalmoves.push(move)
    });

    let legalNWmoves = northwest();
    legalNWmoves.forEach((move) => {
        legalmoves.push(move)
    });

    let legalSWmoves = southwest();
    legalSWmoves.forEach((move) => {
        legalmoves.push(move)
    });
        
    return legalmoves;

}

function rookmoves(piececolour, startingsquareid){
    let legalmoves = [];
    const file = startingsquareid.charAt(0);    /*gets the file of the current square the piece is on */
    const rank = startingsquareid.charAt(1);
    const ranknumber = parseInt(rank);    /*gets the rank of the current square the piece is on */
    let currentfile = file;
    let currentrank = ranknumber;
    let currentsquareid = currentfile + currentrank; /* makes square id e.g. A1 */
    let currentsquare = document.getElementById(currentsquareid)
    let squarecontains = onsquare(currentsquare);  /* runs onsquare function to see if theres anything on the target square */      /*||*/    

    let tempallsquares = Array.from(document.getElementsByClassName('square'));
    for(let i=0;i<tempallsquares.length;i++){
        tempallsquares[i] = tempallsquares[i].id
    }

    function north(){
        let legal = [];
        let cont = true;
        let tempcurrentrank = currentrank +1;
        let tempcurrentfile = currentfile;
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);
        while (cont = true){
            if (tempallsquares.includes(tempcurrentsquareid)) {
                let tempsquarecontains = onsquare(tempcurrentsquare);
                if (tempsquarecontains == 'empty') {
                    legal.push(tempcurrentsquareid);
                    tempcurrentrank = tempcurrentrank +1;
                    tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
                    tempcurrentsquare = document.getElementById(tempcurrentsquareid);
                }else if (piececolour !== tempsquarecontains) {
                    legal.push(tempcurrentsquareid);
                    return legal;
                    }else{
                        return legal;
                    }  
                }else{
                    return legal;
        }}}


    function east(){
        let legal = [];
        let cont = true;
        let tempcurrentrank = currentrank;
        let tempcurrentfile = currentfile.charCodeAt(0);
        tempcurrentfile +=1;
        tempcurrentfile = String.fromCharCode(tempcurrentfile);
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);
        while (cont = true){
            if (tempallsquares.includes(tempcurrentsquareid)) {
                let tempsquarecontains = onsquare(tempcurrentsquare);
                if (tempsquarecontains == 'empty') {
                    legal.push(tempcurrentsquareid);
                    tempcurrentfile = tempcurrentfile.charCodeAt(0);
                    tempcurrentfile +=1;
                    tempcurrentfile = String.fromCharCode(tempcurrentfile);
                    tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
                    tempcurrentsquare = document.getElementById(tempcurrentsquareid);
                }else if (piececolour !== tempsquarecontains) {
                    legal.push(tempcurrentsquareid);
                    return legal;
                    }else{
                        return legal;
                    }  
                }else{
                    return legal;
        }}}


    function south(){
        let legal = [];
        let cont = true;
        let tempcurrentrank = currentrank -1;
        let tempcurrentfile = currentfile;
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);     
        while (cont = true){
            if (tempallsquares.includes(tempcurrentsquareid)) {
                let tempsquarecontains = onsquare(tempcurrentsquare);
                if (tempsquarecontains == 'empty') {
                    legal.push(tempcurrentsquareid);
                    tempcurrentrank = tempcurrentrank-1;
                    tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
                    tempcurrentsquare = document.getElementById(tempcurrentsquareid);
                }else if (piececolour !== tempsquarecontains) {
                    legal.push(tempcurrentsquareid);
                    return legal;
                    }else{
                        return legal;
                    }  
                }else{
                    return legal;
        }}}


    function west(){
        let legal = [];
        let cont = true;
        let tempcurrentrank = currentrank;
        let tempcurrentfile = currentfile.charCodeAt(0);
        tempcurrentfile -=1;
        tempcurrentfile = String.fromCharCode(tempcurrentfile);
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid);
        while (cont = true){
            if (tempallsquares.includes(tempcurrentsquareid)) {
                let tempsquarecontains = onsquare(tempcurrentsquare);
                if (tempsquarecontains == 'empty') {
                    legal.push(tempcurrentsquareid);
                    tempcurrentfile = tempcurrentfile.charCodeAt(0);
                    tempcurrentfile -=1;
                    tempcurrentfile = String.fromCharCode(tempcurrentfile);
                    tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
                    tempcurrentsquare = document.getElementById(tempcurrentsquareid);
                }else if (piececolour !== tempsquarecontains) {
                    legal.push(tempcurrentsquareid);
                    return legal;
                    }else{
                        return legal;
                    }  
                }else{
                    return legal;
        }}}



    let northmoves = north();
    northmoves.forEach((move) => {
        legalmoves.push(move)
    });

    let eastmoves = east();
    eastmoves.forEach((move) => {
        legalmoves.push(move)
    });

    let southmoves = south();
    southmoves.forEach((move) => {
        legalmoves.push(move)
    });

    let westmoves = west();
    westmoves.forEach((move) => {
        legalmoves.push(move)
    });
        
    return legalmoves;

    }


function queenmoves(piececolour, startingsquareid){
    let legalmoves = [];

    let diaganalmoves = bishopmoves(piececolour, startingsquareid);
    diaganalmoves.forEach((move) => {
        legalmoves.push(move)
    });
    let straightmoves = rookmoves(piececolour, startingsquareid);
    straightmoves.forEach((move) => {
        legalmoves.push(move)
    });

    return legalmoves;
}

function kingmoves(piececolour, startingsquareid){
    let blackmoves = getallblackmoves();
    let whitemoves = getallwhitemoves();
    let legalmoves = [];
    const file = startingsquareid.charAt(0);    /*gets the file of the current square the piece is on */
    const rank = startingsquareid.charAt(1);
    const ranknumber = parseInt(rank);    /*gets the rank of the current square the piece is on */
    let currentfile = file;
    let currentrank = ranknumber;
    let currentsquareid = currentfile + currentrank; /* makes square id e.g. A1 */
    let currentsquare = document.getElementById(currentsquareid)
    let squarecontains = onsquare(currentsquare);  /* runs onsquare function to see if theres anything on the target square */     
    const movedirection = [
        [1,0], [-1,0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]
    ]; 

    let tempallsquares = Array.from(document.getElementsByClassName('square'));
    for(let i=0;i<tempallsquares.length;i++){
        tempallsquares[i] = tempallsquares[i].id
    }

    movedirection.forEach((move) =>{
        let tempcurrentfile = currentfile.charCodeAt(0);
        tempcurrentfile = tempcurrentfile + move[1];
        tempcurrentfile = String.fromCharCode(tempcurrentfile);
        let tempcurrentrank = currentrank;
        tempcurrentrank = tempcurrentrank + move[0];
        let tempcurrentsquareid = tempcurrentfile + tempcurrentrank;
        let tempcurrentsquare = document.getElementById(tempcurrentsquareid)
        if (tempallsquares.includes(tempcurrentsquareid)) {
            let tempsquarecontains = onsquare(tempcurrentsquare);
            if ((tempsquarecontains == 'empty')&&(whiteturn === true)){
                if(!blackmoves.includes(tempcurrentsquareid)){
                    legalmoves.push(tempcurrentsquareid);
                }
            }else if ((tempsquarecontains == 'empty')&&(whiteturn !== true)){
                if(!whitemoves.includes(tempcurrentsquareid)){
                    legalmoves.push(tempcurrentsquareid);
                }
            }else if(piececolour !== tempsquarecontains){
                legalmoves.push(tempcurrentsquareid)
            }
    }});
    
        return legalmoves;
}

function promotion(){
    let allsquare = Array.from(document.getElementsByClassName('square'));
        for(let i=1;i<allsquare.length + 1;i++){
            let row = 8 - Math.floor((i - 1) / 8);
            let column = (i - 1) % 8;
            let columnLetter = String.fromCharCode(97 + column);
            let coord = columnLetter + row;
            let currentcoord = document.getElementById(coord);
            let whichpiece = whatpiece(currentcoord);
            let pcol = onsquare(currentcoord);
            if(whichpiece == 'pawn' && row == '8' && pcol == 'white'){
                return currentcoord
            }
            if(whichpiece == 'pawn' && row == '1' && pcol == 'black'){
                return currentcoord
            }
}};

/*function promotepawn(pawncoord, square){
    const removepawn = square.querySelector('.piece');
    let pcol = onsquare(pawncoord)
    removepawn.remove()
    const newqueen = document.createElement('div')
    newqueen.classList.add('piece', 'queen', 'new')
    const newqueencolour = document.createAttribute('colour')
    if(pcol == 'white'){
        newqueencolour.classList.add('white')
    }else{
        newqueencolour.classList.add('black')
    }
    debugger
    square.appendChild(newqueen)
    newqueen.addEventListener('click', allowclick);
    const addqueen = document.createElement('img');
    if(whiteturn == true){
        addqueen.src = 'images/w_queen.png'
        square.appendChild(addqueen)
    }else{
        addqueen.src = 'images/b_queen.png'
        square.appendChild(addqueen)
    }
}
*/

function pawnpromote(pawncoord, square){
    const changepawn = square.querySelector('.piece');
    debugger
    changepawn.classList.remove('pawn')
    changepawn.classList.add('queen')
}