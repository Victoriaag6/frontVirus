    document.getElementById('adBanner').addEventListener('click', function() {
        var overlay = document.getElementById('virusOverlay');
        overlay.classList.add('active');
        
        setTimeout(function() {
          overlay.innerHTML = '<p>El virus se está propagando...</p><p>¡Cuidado!</p>';
        }, 5000);
      });