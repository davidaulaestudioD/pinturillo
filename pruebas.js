$(document).ready(function () {
    var $canvas = $('#canvas');            
    var canvas = $canvas[0];                
    var ctx = canvas.getContext('2d');
    var drawing = false;
    var lastX = 0;
    var lastY = 0;
    var colorActual = "#000";               
    var anchoTrazo = 2;                   
  
    var tiempoRestante = 30;               
    var timerInterval;                    
    var chatInterval;                        
  
  
    var rondaActual = 1;
    var maxRondas = 5;
    var puntuacionTotalIA = 0;
    var puntuacionTotalJugador = 0;
  
    const categorias = [
      { categoria: "Automóviles", opciones: ["Coche", "Moto", "Camión", "Bicicleta", "Furgoneta", "Convertible", "SUV"] },
      { categoria: "Frutas", opciones: ["Manzana", "Banana", "Naranja", "Pera", "Melocotón", "Mango", "Uva"] },
      { categoria: "Animales", opciones: ["Perro", "Gato", "Elefante", "León", "Jirafa", "Tigre", "Mono"] }
    ];
  
    // RANDOM PALABRA DIBUJAR
    function seleccionarDibujo() {
      var indiceCat = Math.floor(Math.random() * categorias.length);
      var categoriaSeleccionada = categorias[indiceCat];
      var indiceOpcion = Math.floor(Math.random() * categoriaSeleccionada.opciones.length);
      var opcion = categoriaSeleccionada.opciones[indiceOpcion];
      return {
        categoria: categoriaSeleccionada.categoria,
        opcion: opcion,
        opciones: categoriaSeleccionada.opciones,
        text: opcion
      };  
    }
  
    //ACTUALIZA LA RONDA
    function actualizarRondas() {
      $('.container-ronda').text(rondaActual + "/" + maxRondas);
    }
  
    //ACTUALIZAR EL TOTAL DE LAS PUNTUACIONES, AL ACABAR MARCA EL GANADOR
    function actualizarPuntuacionesTotales() {
      var $total = $(".totalPuntuacion");
      $total.find("p").eq(0).html("IA: " + puntuacionTotalIA);
      $total.find("p").eq(1).html("Jugador: " + puntuacionTotalJugador);
      if (rondaActual === maxRondas) {
        var textoGanador = "";
        if (puntuacionTotalIA > puntuacionTotalJugador) {
          textoGanador = "IA gana";
        } else if (puntuacionTotalJugador > puntuacionTotalIA) {
          textoGanador = "Jugador gana";
        } else {
          textoGanador = "Empate tecnico";
        }
        $total.find("#ganador").html("Ganador: " + textoGanador);
      } else {
        $total.find("#ganador").html("Ganador: ");
      }
      $total.show();
    }
  
    //TERMINAR RONDA Y DAR PUNTOS, PARA LA IA 10P MAS EL TIEMPO RESTANTE EN PUNTOS, EL JUGADOR, 10P + 20P 
    function acabarRonda(ganador) {
      clearInterval(timerInterval);
      clearInterval(chatInterval);
      $canvas.off('mousedown mousemove mouseup mouseleave');
  
      var puntuacionRondaIA = 0;
      var puntuacionRondaJugador = 0;
      if (ganador === "ia") {
        puntuacionRondaIA = 10 + tiempoRestante;
      } else if (ganador === "player") {
        puntuacionRondaJugador = 10 + 20;
      }
  
      puntuacionTotalIA += puntuacionRondaIA;
      puntuacionTotalJugador += puntuacionRondaJugador;
  
      //AÑADE LA PUNTUACION DE CADA RONDA
      $(".puntuaciones").append(
        "<p>Ronda " + rondaActual + "/" + maxRondas + ": </br>IA: " + puntuacionRondaIA + " puntos,</br> Jugador: " + puntuacionRondaJugador + " puntos</p>"
      );
  
      actualizarPuntuacionesTotales();


      //SUMA UNA RONDA E INICIA LA NUEVA, SI ES LA ULTIMA, TERMINA EL JUEGO
      if (rondaActual < maxRondas) {
        rondaActual++;
        actualizarRondas(); 
        setTimeout(function() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          iniciarRonda();
        }, 2000);
      } else {
        $canvas.off('mousedown mousemove mouseup mouseleave');
      }
    }
  
    //INICIAR CONTADOR
    function iniciarContador() {
      $('#time').text(tiempoRestante);
      timerInterval = setInterval(function() {
        if (tiempoRestante <= 0) {
          acabarRonda("player");
        } else {
          tiempoRestante--;
          $('#time').text(tiempoRestante);
        }
      }, 1000);
    }
  
    // SIMULACIÓN DE CHAT
    function iniciarChat() {
      chatInterval = setInterval(function(){
        var randomIndex = Math.floor(Math.random() * dibujoActual.opciones.length);
        var dibujo = dibujoActual.opciones[randomIndex];
        
        $(".chat").append("<p>Dibujo: " + dibujo + "</p>");
        
        //SI LA IA ACIERTA SE FINALIZA LA RONDA
        if (dibujo === dibujoActual.opcion) {
          acabarRonda("ia");
        }
      }, 5000);
    }
  
    // PINTAR EN EL CANVAS
    function pintarCanvas() {
      $canvas.off('mousedown mousemove mouseup mouseleave');
      $canvas.on('mousedown', function(e) {
        if (tiempoRestante <= 0) return;
        drawing = true;
        var rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
      });
      $canvas.on('mousemove', function(e) {
        if (!drawing) return;
        var rect = canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = colorActual;
        ctx.lineWidth = anchoTrazo;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.closePath();
        lastX = mouseX;
        lastY = mouseY;
      });
      $canvas.on('mouseup mouseleave', function() {
        drawing = false;
      });
    }
  
    //INICIAR RONDA
    function iniciarRonda() {
      dibujoActual = seleccionarDibujo();
      $('#drawItem').text(dibujoActual.text);
      tiempoRestante = 30;
      $('#time').text(tiempoRestante);
      $(".chat").find("p").remove();
      pintarCanvas();
      iniciarContador();
      iniciarChat();
    }
  
    //INICIAR JUEGO
    function iniciarJuego() {
      rondaActual = 1;
      puntuacionTotalIA = 0;
      puntuacionTotalJugador = 0;
      $(".puntuaciones").empty();
      $(".totalPuntuacion").show();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      actualizarRondas();      
      actualizarPuntuacionesTotales();  
      iniciarRonda();
    }
  
    //BOTON RESET 
    $('#reset').on('click', function() {
      clearInterval(timerInterval);
      clearInterval(chatInterval);
      iniciarJuego();
    });
  
    //BOTON LIMPIAR
    $("#limpiar").on('click', function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  
    //SELECCIONAR COLOR
    $('#colorRojo, #colorAmarillo, #colorAzul, #colorNegro, #colorRosa, #colorVerde, #colorMarron, #colorMorado').on('click', function(){
      colorActual = $(this).data('color');
    });
  
    //SELECCIONAR ANCHO
    $('#lineWidth').on('input change', function() {
      anchoTrazo = $(this).val();
    });


    iniciarJuego();
});
