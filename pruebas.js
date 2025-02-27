$(document).ready(function () {
    var $canvas = $('#canvas');            // Obtenemos el canvas como objeto jQuery
    var canvas = $canvas[0];                 // Obtenemos el elemento DOM
    var ctx = canvas.getContext('2d');
    var drawing = false;
    var lastX = 0;
    var lastY = 0;
    var colorActual = "#000";                // Color inicial: negro
    var anchoTrazo = 2;                      // Ancho inicial del trazo
  
    var timeLeft = 45;                       // Tiempo inicial por ronda
    var timerInterval;                       // Intervalo del contador
    var chatInterval;                        // Intervalo de la simulación del chat
  
    // Variables para rondas y puntuaciones
    var currentRound = 1;
    var maxRounds = 5;
    var totalScoreIA = 0;
    var totalScorePlayer = 0;
  
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
        opciones: categoriaSeleccionada.opciones, // Lista de opciones para la simulación del chat
        text: opcion
      };  
    }
  
    // Actualiza el indicador de la ronda en la sección de dibujo
    function updateRoundDisplay() {
      $('.container-ronda').text(currentRound + "/" + maxRounds);
    }
  
    // Actualiza la sección de total puntuación en tiempo real
    function updateTotalScoreDisplay() {
      var $total = $(".totalPuntuacion");
      $total.find("p").eq(0).html("IA: " + totalScoreIA);
      $total.find("p").eq(1).html("Jugador: " + totalScorePlayer);
      if (currentRound === maxRounds) {
        var winnerText = "";
        if (totalScoreIA > totalScorePlayer) {
          winnerText = "La IA gana";
        } else if (totalScorePlayer > totalScoreIA) {
          winnerText = "El Jugador gana";
        } else {
          winnerText = "Empate";
        }
        $total.find("#ganador").html("Ganador: " + winnerText);
      } else {
        $total.find("#ganador").html("Ganador: ");
      }
      $total.show();
    }
  
    // Función para terminar la ronda y asignar puntos
    function endRound(winner) {
      clearInterval(timerInterval);
      clearInterval(chatInterval);
      $canvas.off('mousedown mousemove mouseup mouseleave');
  
      var roundScoreIA = 0;
      var roundScorePlayer = 0;
      if (winner === "ia") {
        // Si la IA acierta, obtiene 10 + los segundos restantes
        roundScoreIA = 10 + timeLeft;
      } else if (winner === "player") {
        // Si se acaba el tiempo y la IA falla, el jugador obtiene 10 + 30
        roundScorePlayer = 10 + 30;
      }
  
      totalScoreIA += roundScoreIA;
      totalScorePlayer += roundScorePlayer;
  
      // Se añade un resumen de la ronda en el div de puntuaciones
      $(".puntuaciones").append(
        "<p>Ronda " + currentRound + "/" + maxRounds + ": IA: " + roundScoreIA + " puntos, Jugador: " + roundScorePlayer + " puntos</p>"
      );
  
      updateTotalScoreDisplay();
  
      if (currentRound < maxRounds) {
        currentRound++;
        updateRoundDisplay(); // Actualiza la visualización de la ronda
        setTimeout(function() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          startRound();
        }, 2000);
      } else {
        // Última ronda finalizada: desactivamos los eventos de dibujo
        $canvas.off('mousedown mousemove mouseup mouseleave');
      }
    }
  
    // INICIAR CONTADOR
    function iniciarContador() {
      $('#time').text(timeLeft);
      timerInterval = setInterval(function() {
        if (timeLeft <= 0) {
          // Si se acaba el tiempo, el jugador gana la ronda
          endRound("player");
        } else {
          timeLeft--;
          $('#time').text(timeLeft);
        }
      }, 1000);
    }
  
    // SIMULACIÓN DE CHAT
    function startChatSimulation() {
      chatInterval = setInterval(function(){
        // Selecciona aleatoriamente una opción de currentDraw.opciones
        var randomIndex = Math.floor(Math.random() * currentDraw.opciones.length);
        var guess = currentDraw.opciones[randomIndex];
        
        // Agrega la opción al chat
        $(".chat").append("<p>Dibujo: " + guess + "</p>");
        
        // Si la opción coincide con la asignada, la IA acierta
        if (guess === currentDraw.opcion) {
          endRound("ia");
        }
      }, 5000);
    }
  
    // PINTAR EN EL CANVAS
    function attachCanvasEvents() {
      $canvas.off('mousedown mousemove mouseup mouseleave');
      $canvas.on('mousedown', function(e) {
        if (timeLeft <= 0) return;
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
  
    // Función que inicia una ronda (reinicia timer, chat, canvas, etc.)
    function startRound() {
      currentDraw = seleccionarDibujo();
      $('#drawItem').text(currentDraw.text);
      timeLeft = 45;
      $('#time').text(timeLeft);
      $(".chat").find("p").remove();
      attachCanvasEvents();
      iniciarContador();
      startChatSimulation();
    }
  
    // Función para iniciar el juego (reinicia rondas y puntuaciones)
    function startGame() {
      currentRound = 1;
      totalScoreIA = 0;
      totalScorePlayer = 0;
      $(".puntuaciones").empty();
      $(".totalPuntuacion").show();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateRoundDisplay();       // Muestra "1/maxRounds" al iniciar
      updateTotalScoreDisplay();  // Actualiza la puntuación (inicialmente en 0)
      startRound();
    }
  
    // Inicia el juego al cargar la página
    startGame();
  
    // BOTÓN DE RESET (reinicia la partida y muestra ronda 1)
    $('#reset').on('click', function() {
      clearInterval(timerInterval);
      clearInterval(chatInterval);
      startGame();
    });
  
    // BOTÓN LIMPIAR
    $("#limpiar").on('click', function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  
    // SELECCIONAR COLOR
    $('#colorRojo, #colorAmarillo, #colorAzul, #colorNegro, #colorRosa, #colorVerde, #colorMarron, #colorMorado').on('click', function(){
      colorActual = $(this).data('color');
    });
  
    // SELECCIONAR ANCHO DEL TRAZO
    $('#lineWidth').on('input change', function() {
      anchoTrazo = $(this).val();
    });
});
