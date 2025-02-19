$(document).ready(function () {
  $(document).ready(function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
  
    // Inicia el dibujo al presionar el botón del mouse
    $('#canvas').on('mousedown', function(e) {
      drawing = true;
      // Se utiliza getBoundingClientRect para obtener el offset correcto del canvas
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;

    });
  
    // Dibuja mientras se mueve el mouse
    $('#canvas').on('mousemove', function(e) {
      if (!drawing) return;
  
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
  
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(mouseX, mouseY);
      ctx.strokeStyle = "#000"; // Color del trazo
      ctx.lineWidth = 2;         // Grosor del trazo
      ctx.stroke();
      ctx.closePath();
  
      lastX = mouseX;
      lastY = mouseY;
    });
  
    // Finaliza el dibujo al soltar el botón o salir del canvas
    $('#canvas').on('mouseup mouseleave', function() {
      drawing = false;
    });
  });
  
  

});
  