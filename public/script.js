async function getsSongs() {
  let a = await fetch("/songs/");
  let b = await a.text();
  let div = document.createElement("div");
  div.innerHTML = b;
  let as = div.getElementsByTagName("a");
  let songArr = [];
  for (let i = 0; i < as.length; i++) {
    const ele = as[i];
    if (ele.href.endsWith(".m4a")) {
      songArr.push(ele.href.split("/songs/")[1]);
    }
  }
  return songArr;
}

async function main() {
  let songs = await getsSongs();
  let currentSongIndex = 0;
  let isPlaying = false;
  const audio = new Audio();

  // Update the song list in the sidebar
  let songul = document
    .getElementById("songList")
    .getElementsByTagName("ul")[0];
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    songul.innerHTML += `<li data-index="${i}">
            <div class="music-play">
              <img src="resources/icons/play.svg" alt="" class="icon">
              <img src="https://i.scdn.co/image/ab67616d00004851d6676fda303d26d42d8ca391" alt="">
              <div class="music-info">
                <p class="song-name">${song.replaceAll("%20", " ")}</p>
                <p>artist- unknown</p>
              </div>
              <p>play now</p>
            </div>
          </li>`;
  }

  // Function to play a specific song
  function playSong(index) {
    if (index >= 0 && index < songs.length) {
      currentSongIndex = index;
      audio.src = `/songs/${songs[currentSongIndex]}`;
      audio.play();
      isPlaying = true;
      updatePlayPauseIcon();
      updateNowPlayingInfo();
    }
  }

  // Function to handle play/pause toggle
  function togglePlayPause() {
    if (audio.src) {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
      } else {
        audio.play();
        isPlaying = true;
      }
      updatePlayPauseIcon();
    } else if (songs.length > 0) {
      playSong(0);
    }
  }

  // Function to play next song
  function playNext() {
    playSong((currentSongIndex + 1) % songs.length);
  }

  // Function to play previous song
  function playPrevious() {
    playSong((currentSongIndex - 1 + songs.length) % songs.length);
  }

  // Update the play/pause button icon
  function updatePlayPauseIcon() {
    const playPauseBtn = document.querySelector(".playBar .play-pause");
    if (playPauseBtn) {
      if (isPlaying) {
        // Use the pause icon instead of playmusic.svg
        playPauseBtn.src = "resources/icons/playmusic.svg";
        // Make sure the icon is white
        playPauseBtn.classList.add("white");
      } else {
        playPauseBtn.src = "resources/icons/playPuse.svg";
        playPauseBtn.classList.add("white");
      }
    }
  }

  // Update currently playing song info - modified to call updateActiveSong
  function updateNowPlayingInfo() {
    const nowPlayingElement = document.getElementById("nowPlaying");
    if (nowPlayingElement) {
      nowPlayingElement.textContent = songs[currentSongIndex].replaceAll(
        "%20",
        " "
      );
    }

    // Highlight active song
    updateActiveSong();
  }

  // Format time in minutes:seconds
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  // Update progress bar
  function updateProgressBar() {
    const progressBar = document.querySelector(".progress-bar");
    const currentTimeElement = document.querySelector(".current-time");
    const totalTimeElement = document.querySelector(".total-time");

    if (progressBar && audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progress}%`;

      // Update time displays
      currentTimeElement.textContent = formatTime(audio.currentTime);
      totalTimeElement.textContent = formatTime(audio.duration);
    }
  }

  // Handle click on progress bar
  document
    .querySelector(".progress-bar-container")
    .addEventListener("click", function (e) {
      const progressBarContainer = this.getBoundingClientRect();
      const clickPosition = e.clientX - progressBarContainer.left;
      const percentageClicked = clickPosition / progressBarContainer.width;

      if (audio.duration) {
        audio.currentTime = percentageClicked * audio.duration;
      }
    });

  // Handle volume control
  const volumeSlider = document.querySelector(".volume-slider");
  volumeSlider.addEventListener("input", function () {
    audio.volume = this.value / 100;
  });

  // Add click event to song list items
  const songItems = document.querySelectorAll("#songList li");
  songItems.forEach((item) => {
    item.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      playSong(index);
    });
  });

  // Add click events to playback controls
  document
    .querySelector(".playBar .play-pause")
    .addEventListener("click", togglePlayPause);
  document.querySelector(".playBar .next").addEventListener("click", playNext);
  document
    .querySelector(".playBar .previous")
    .addEventListener("click", playPrevious);

  // Update progress bar as audio plays
  audio.addEventListener("timeupdate", updateProgressBar);

  // Set initial volume
  audio.volume = volumeSlider.value / 100;

  // Handle audio ended event (auto play next)
  audio.addEventListener("ended", playNext);

  // Handle audio metadata loaded
  audio.addEventListener("loadedmetadata", function () {
    document.querySelector(".total-time").textContent = formatTime(
      audio.duration
    );
  });

  // Mobile view setup - simplified since we're always showing song list
  function setupMobileView() {
    const isMobile = window.innerWidth <= 480;

    if (isMobile) {
      // Move songList to right section for mobile view if needed
      const songListContainer = document.getElementById("songList");
      const rightContainer = document.getElementById("right");

      // If songList is not in the right container and still in the library
      if (songListContainer.parentElement.id === "library") {
        // Move the list to the right container for mobile
        rightContainer.insertBefore(
          songListContainer,
          document.querySelector(".playBar")
        );
      }

      // Highlight the currently playing song
      updateActiveSong();
    } else {
      // Desktop view - restore original structure if needed
      const songListContainer = document.getElementById("songList");
      const libraryDiv = document.getElementById("library");

      // If songList is in the right container and needs to go back to library
      if (songListContainer.parentElement.id === "right") {
        libraryDiv.insertBefore(
          songListContainer,
          document.getElementById("footer")
        );
      }
    }
  }

  // Highlight currently playing song
  function updateActiveSong() {
    document.querySelectorAll("#songList li .music-play").forEach((el, i) => {
      if (i === currentSongIndex) {
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
  }

  // Run setup on load and resize
  setupMobileView();
  window.addEventListener("resize", setupMobileView);
}

main();
