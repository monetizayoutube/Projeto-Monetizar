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
    const player = new YT.Player('player', {
      height: '360',
      width: '640',
      videoId: videoId,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });

    let countdownInterval;

    function onPlayerReady(event) {
      event.target.playVideo();
    }

    function onPlayerStateChange(event) {
      if (event.data === YT.PlayerState.PLAYING) {
        const duration = player.getDuration();
        let timeLeft = duration;

        countdownInterval = setInterval(() => {
          const hours = Math.floor(timeLeft / 3600);
          const minutes = Math.floor((timeLeft % 3600) / 60);
          const seconds = Math.floor(timeLeft % 60);

          document.getElementById('countdown').textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            alert('Você assistiu o vídeo completo!');
          } else {
            timeLeft--;
          }
        }, 1000);
      } else {
        clearInterval(countdownInterval);
      }
    }
  } else {
    console.error('URL do vídeo inválida.');
  }
}

// Inicializa a função quando a página carregar
window.onload = loadVideo;
