const pieceimg = document.getElementsByTagName('img')
const allsqures = document.getElementsByClassName('square')
const rows = document.getElementById('row')
const columns = document.getElementById('column')

function setup(){
    for(let i=0;1<allsqures.length;i++ ){
    pieceimg[i].addEventListener('click' , allowclick)
    pieceimg[i].addEventListener('place' , allowplace)
    allsqures[i].addEventListener('click' , allowclick)
    allsqures[i].addEventListener('place' , allowplace)
    let row=8-math.floor(i/8)       /*adding row coordinates 1-8*/
    let column=String.fromCharCode(97+(i%8));     /*adding column coordinates a-h*/
    let square=allsquares[i];
    square.id=column+row;
}}

setup();


