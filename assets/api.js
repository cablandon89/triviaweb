//Variables necesarias
const btnform = document.getElementById('btn-form');
const container = document.getElementById('container');
const frminit = document.getElementById('frminit');
const botoncontinue = document.getElementById('continue');
let intpre = 0;
let btnsresp = null
let obj = null;
let url = '';
let presion = false;
let tiempo = 10;
let terminado = false;
let score = 0; 

//Contador de cada pregunta
function cambio(){
  document.getElementById('contador').innerHTML = tiempo;
  if(tiempo == 0 ){
    if(!presion){
      resolver();
    }
    botoncontinue.style.display="block";
  }else{
    tiempo-=1;
    setTimeout("cambio()",1000);
  }
}

//Capturar el formulario y construir la URL
function iniciar(e){
  e.preventDefault();
  let dificultad = document.getElementById("dificultad").value;
  let cantidad = document.getElementById("cantidad").value;
  let tipo = document.getElementById("tipo").value;
  url = `https://opentdb.com/api.php?amount=${cantidad}&difficulty=${dificultad}&type=${tipo}`;
  fetchTrivia();  
  // setTimeout("transicion()",2000);
}

//Llamar la API de trivia 
async function fetchTrivia(){
  const resp = await fetch(url);
  const result = await resp.json();
  obj = result.results;
  container.classList.add('transicion');
  frminit.innerHTML = "";
  pintarpregunta();
}

//Construir las preguntas y enviarlas al dom
async function pintarpregunta(){
  if(intpre < obj.length){
    obj[intpre].incorrect_answers.push(obj[intpre].correct_answer);
    let pintar = `<div id="pregunta">
      <h2>Pregunta ${intpre + 1}: </h2>
      <h2>${obj[intpre].question}</h2>
      <div id="contcontador"><div id="contador"></div></div> 
      <div id="contresp">`;
      shuffleArray(obj[intpre].incorrect_answers);
      obj[intpre].incorrect_answers.map(function(x){
        pintar += `<div class="respuesta"">${x}</div>`;
      });
      pintar += 
      `</div>`
    //transicion();
    // await setTimeout("transicion()",2000);
    frminit.innerHTML = pintar;
    btnsresp = document.querySelectorAll('.respuesta');
    for (var i=0; i< btnsresp.length; i++) {
      btnsresp[i].addEventListener("click",function() {
        tiempo = 0;
        presion = true;
        resolver(this); 
      });
    } 
    cambio();
  }else{
    frminit.innerHTML = `<h2>Juego terminado, su puntaje es ${score} </h2>`;
    botoncontinue.style.display="none";
  }
  transicion();
}

//Desordenar el Array de preguntas
function shuffleArray(inputArray){
  inputArray.sort(()=> Math.random() - 0.5);
}

//Desactivar la pantalla blanca
function transicion(){
  container.classList.remove('transicion');
}

//Función para resolver la pregunta
function resolver(btn = null){
  if(!terminado){
    terminado = true;
    if(btn == null){
      console.log('Se acabo el tiempo')

    }else{
      if(btn.innerText == obj[intpre].correct_answer){
        btn.classList.add('respuesta_buena');
        score ++;
      }else{
        btn.classList.add('respuesta_mala');
      }
    }
  }
  
  
}
//Eventos
btnform.onclick = iniciar;
botoncontinue.onclick = (function(){
  intpre ++;
  btnsresp = null;
  presion = false;
  tiempo = 10;
  terminado = false;
  container.classList.add('transicion');
  frminit.innerHTML = "";
  pintarpregunta();
})
