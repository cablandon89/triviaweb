//window.onload = cambio;

let tiempo = 10;

function cambio(){
  document.getElementById('contador').innerHTML = tiempo;
  if(tiempo==0){
    console.log('Terminó');
  }else{
    tiempo-=1;
    setTimeout("cambio()",1000);
  }
}