$(document).ready(function () {
  var $canvas = $('#canvas');            // Obtenemos el canvas como objeto jQuery
  var canvas = $canvas[0];                 // Obtenemos el elemento DOM
  var ctx = canvas.getContext('2d');
  var drawing = false;
  var lastX = 0;
  var lastY = 0;
  var colorActual = "#000";               // Color inicial: negro
  var anchoTrazo = 2;                // Ancho inicial del trazo

  var timeLeft = 45;                     // Tiempo inicial
  var timerInterval;                     // Variable para el intervalo
  var chatInterval; 

  //nuevas variables
  var currentRound = 1;
  var maxRounds = 5;
  var totalScoreIA = 0;
  var totalScorePlayer = 0;


  const categorias = [
    { categoria: "Automóviles", opciones: ["Coche", "Moto", "Camión", "Bicicleta", "Furgoneta", "Convertible", "SUV"] },
    { categoria: "Frutas", opciones: ["Manzana", "Banana", "Naranja", "Pera", "Melocotón", "Mango", "Uva"] },
    { categoria: "Animales", opciones: ["Perro", "Gato", "Elefante", "León", "Jirafa", "Tigre", "Mono"] }
  ];

  //RANDOM PALABRA DIBUJAR
  function seleccionarDibujo() {
    var indiceCat = Math.floor(Math.random() * categorias.length);
    var categoriaSeleccionada = categorias[indiceCat];
    var indiceOpcion = Math.floor(Math.random() * categoriaSeleccionada.opciones.length);
    var opcion = categoriaSeleccionada.opciones[indiceOpcion];
    return {
      categoria: categoriaSeleccionada.categoria,
      opcion: opcion,
      opciones: categoriaSeleccionada.opciones, // Lista de opciones para la simulación del chat
      text:  opcion
    };  
  }

  //INICIAR CONTADOR
  function iniciarContador() {
    $('#time').text(timeLeft);
    timerInterval = setInterval(function() {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        clearInterval(chatInterval);
        
        $canvas.off('mousedown mousemove mouseup mouseleave');
      } else {
        timeLeft--;
        $('#time').text(timeLeft);
      }
    }, 1000);
  }

  //SIMULACION DE CHAT
  function startChatSimulation() {
    chatInterval = setInterval(function(){
      // Selecciona aleatoriamente una opción de currentDraw.opciones
      var randomIndex = Math.floor(Math.random() * currentDraw.opciones.length);
      var guess = currentDraw.opciones[randomIndex];
      
      // Agrega la opción al chat
      $(".chat").append("<p>Dibujo: " + guess + "</p>");
      
      // Si la opción coincide con la asignada, se notifica y se detienen timer y dibujo
      if (guess === currentDraw.opcion) {
        //alert("¡Acierto! Has adivinado que era: " + currentDraw.opcion);
        clearInterval(chatInterval);
        clearInterval(timerInterval);
        $canvas.off('mousedown mousemove mouseup mouseleave');
      }
    }, 5000);
  }

  //PINTAR EN EL CANVA
  function attachCanvasEvents() {
    //EVITAR DUPLICADOS
    $canvas.off('mousedown mousemove mouseup mouseleave');

    $canvas.on('mousedown', function(e) {
      if (timeLeft <= 0) return; // Evita iniciar el dibujo si se acabó el tiempo
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

  var currentDraw; // Objeto que guarda la categoría y opción a dibujar
  function startGame() {
    // Selecciona el dibujo a realizar y lo muestra
    currentDraw = seleccionarDibujo();
    $('#drawItem').text(currentDraw.text);
    
    // Reinicia el timer
    timeLeft = 45;
    $('#time').text(timeLeft);
    
    // Limpia mensajes anteriores en el chat (dejando el encabezado)
    $(".container-chat").find("p").remove();
    
    // Reactiva eventos de dibujo y reinicia timer y chat
    attachCanvasEvents();
    iniciarContador();
    startChatSimulation();
  }

  // Inicia el juego al cargar la página
  startGame();

  //BOTON DE RESET
  $('#reset').on('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearInterval(timerInterval);
    clearInterval(chatInterval);
    startGame();
  });

  //BOTON LIMPIAR
  $("#limpiar").on('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  //SELECCIONAR COLOR
  $('#colorRojo, #colorAmarillo, #colorAzul, #colorNegro, #colorRosa, #colorVerde, #colorMarron, #colorMorado').on('click', function(){
    colorActual = $(this).data('color');
  });

  //SELECCIONAR ANCHO DEL TRAZO
  $('#lineWidth').on('input change', function() {
    anchoTrazo = $(this).val();
  });
});
