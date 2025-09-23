const pieceimg = document.getElementsByTagName('img')
const allsqures = document.getElementsByClassName('square')
const pieces = document.getElementsByClassName('piece')
const rows = document.getElementById('row')
const columns = document.getElementById('column')

setup();
setuppieces();

function setup(){
    for(let i=0;1<allsqures.length;i++ ){
    allsqures[i].addEventListener('place' , allowplace)
    let row=8-math.floor(i/8)       /*adding row coordinates 1-8*/
    let column=String.fromCharCode(97+(i%8));     /*adding column coordinates a-h*/
    let square=allsquares[i];
    square.id=column+row;
}}


function setuppieces(){
    for(let i=0;1<pieces.length;i++ ){
    pieces[i].addEventListener('click' , allowclick)
    pieces[i].setAttribute('moveable', true)
    pieces[i].id=pieces[i].classname.split(' ')[1];  /* giving each piece it name through taking the second part of its class name e.g.brook. for black rook*/
}
    for(let i=0;1<pieceimg.length;i++ ){
        pieceimg.setAttribute('moveable', false)  /*making sure the pieces themselves are moving and not just the images*/
    }}

function allowtake(ev){    /* this function lets a piece be dropped on another piece, as by default it wont let you*/
    ev.preventdefault()
}

function click(ev){
    let selected = null;
}