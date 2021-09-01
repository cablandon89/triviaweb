//Variables y constantes necesarias
const btnform = document.getElementById('btn-form');
const container = document.getElementById('container');
const frminit = document.getElementById('frminit');
const botoncontinue = document.getElementById('continue');
const resultresp = document.getElementById('resultresp');
let scores = null;
let intpre = 0;
let btnsresp = null
let obj = null;
let url = '';
let presion = false;
let tiempo = 10;
let terminado = false;
let score = 0; 
let obj2 = [];


//Traer el puntaje máximo de local storage
window.onload = setScore

function setScore(){
  const hscore = document.getElementById('hscore');
  scores = localStorage.getItem('scores');
  hscore.innerText = scores;
}

//Contador de cada pregunta
function cambio(){
  document.getElementById('contador').innerHTML = tiempo;
  if(tiempo == 0 ){
    if(!presion){
      resolver();
    }
  }else{
    tiempo-=1;
    setTimeout("cambio()",1000);
  }
}

//Capturar el formulario y construir la URL
async function iniciar(e){
  e.preventDefault();
  let dificultad = document.getElementById("dificultad").value;
  let cantidad = document.getElementById("cantidad").value;
  let tipo = document.getElementById("tipo").value;
  url = `https://opentdb.com/api.php?amount=${cantidad}&difficulty=${dificultad}&type=${tipo}`;
  await fetchTrivia(); 
  pintarpregunta();
}

//Llamar la API de trivia 
async function fetchTrivia(){
  const resp = await fetch(url);
  const result = await resp.json();
  obj = await result.results;
  await obj.map( async function(q,i){
    q.incorrect_answers.push(q.correct_answer);
  });
 
}

//Construir las preguntas y enviarlas al dom
function pintarpregunta(){
  let pintar = '';
  if(intpre < obj.length){
    pintar = `<div id="pregunta">
      <h2>Pregunta ${intpre + 1}: </h2>
      <h2>${obj[intpre].question}</h2>
      <div id="contcontador"><div id="contador"></div></div> 
      <div id="contresp">`;
      shuffleArray(obj[intpre].incorrect_answers);
      obj[intpre].incorrect_answers.map(function(x){
        pintar += `<div class="respuesta"" onclick="resolver(this)">${x}</div>`;
      });
    pintar += `</div>`
    
  }else{
    pintar = `<h2>Juego terminado, su puntaje es ${score} </h2>`;
    //guardar puntaje máximo en localstorage
    if(score > scores){
      pintar += `<h2>Nuevo puntaje máximo <i class="fas fa-smile-wink"></i></h2>`;
      localStorage.setItem('scores', score);
      setScore();
    }
    pintar += `<table><tr><th colspan="2">Question</th><th>Your answer</th><th>Correct answer</th><th></th></tr>`;
    obj.map(function(q,i){
      pintar += `<tr><td>${i+1}</td><td>${q.question}</td><td>${q.resp}</td><td>${q.correct_answer}</td>`;
      if(q.correct_answer == q.resp){
        pintar += `<td><i class="fas fa-check"></i></td>`;
      }else{
        pintar += `<td><i class="fas fa-times"></i></td>`;
      }
      pintar += `</tr>`;
    });
    pintar += `</table>`;
    pintar += `<a href="index.html" class="btn volver" >Play again</a>`;
    botoncontinue.style.display="none";
  }
  transicion(pintar);
}

//Desordenar el Array de preguntas
function shuffleArray(inputArray){
  inputArray.sort(()=> Math.random() - 0.5);
}

//Desactivar la pantalla blanca
function transicion(texto){
  container.classList.add('transicion');
  frminit.innerHTML = "";
  setTimeout( function(){
    container.classList.remove('transicion')
    frminit.innerHTML = texto;
    if(intpre < obj.length){
      cambio();
    }
  },1000)

}

//Función para resolver la pregunta
function resolver(btn = null){
  tiempo = 0;
  presion = true;
  botoncontinue.style.display="block";
  if(!terminado){
    terminado = true;
    if(btn == null){
      console.log('Se acabo el tiempo');

    }else{
      if(btn.innerText == obj[intpre].correct_answer){
        btn.classList.add('respuesta_buena');
        resultresp.classList.add('respuesta_buena');
        resultresp.innerText = "Correct answer";
        score ++;
      }else{

        btn.classList.add('respuesta_mala');
        resultresp.classList.add('respuesta_mala');
        resultresp.innerText = "Wrong answer, the answer is: "+ obj[intpre].correct_answer;
      }
      obj[intpre]['resp'] = btn.innerText;
    }
  }
  
  
}
//Eventos
btnform.onclick = iniciar;
botoncontinue.onclick = (function(){
  botoncontinue.style.display="none";
  intpre ++;
  btnsresp = null;
  presion = false;
  tiempo = 10;
  terminado = false;
  resultresp.innerText = "";
  resultresp.className = '';
  pintarpregunta();
})
