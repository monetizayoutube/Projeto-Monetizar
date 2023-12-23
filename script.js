// Função para extrair o ID do vídeo do URL
function getVideoId(url) {
  let videoId = '';
  if (url.includes('youtube.com')) {
    videoId = url.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition);
    }
  } else if (url.includes('youtu.be')) {
    videoId = url.split('/').pop();
  }
  return videoId;
}

// Função para carregar o vídeo
function loadVideo() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoUrl = urlParams.get('video');
  const videoId = getVideoId(videoUrl);

  if (videoId) {
    const player = document.getElementById('player');
    player.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    const countdown = document.getElementById('countdown');
    
    let timeLeft = 10 * 60; // Defina a duração do vídeo em segundos (exemplo: 10 minutos)
    const timer = setInterval(() => {
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;

      countdown.textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      if (timeLeft === 0) {
        clearInterval(timer);
        alert('Você assistiu o vídeo completo!');
      } else {
        timeLeft--;
      }
    }, 1000);

    // Verifica se o vídeo foi assistido completamente
    player.addEventListener('onStateChange', (event) => {
      if (event.data === YT.PlayerState.ENDED) {
        clearInterval(timer);
        alert('Você assistiu o vídeo completo!');
      }
    });

    // Verifica se o vídeo foi avançado
    player.addEventListener('onStateChange', (event) => {
      if (event.data === YT.PlayerState.PLAYING) {
        const checkVideoProgress = setInterval(() => {
          const currentTime = player.getCurrentTime();
          if (currentTime > 0) {
            clearInterval(checkVideoProgress);
            window.location.reload();
          }
        }, 1000);
      }
    });
  } else {
    console.error('URL do vídeo inválida.');
  }
}

// Inicializa a função quando a página carregar
window.onload = loadVideo;
