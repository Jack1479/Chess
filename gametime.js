const pieceimg = document.getElementsByTagName('img')
const allsqures = document.getElementsByClassName('square')

function setup(){
    for(let i=0;1<allsqures.length;i++ ){
    pieceimg[i].addEventListener('click' , allowclick)
    pieceimg[i].addEventListener('place' , allowplace)
    allsqures[i].addEventListener('click' , allowclick)
    allsqures[i].addEventListener('place' , allowplace)
}}

setup()

