// Get required DOM elements
const audioElement = document.querySelector(".audioElement");
const songList = document.querySelector(".songs-ul");
const currentSong = document.querySelector(".currently-playing-song");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const sortOption = document.querySelector(".sort-option");
const submenu = document.querySelector(".sort-submenu");
const progress = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress-container");
const volumeSlider = document.querySelector(".volume-slider");

// Store fetched song data and set the current song index
let songsData = [];
let currentSongIndex = 0; // Initialize the index of the currently playing song

// Fetch song data from a JSON file
const fetchSong = async () => {
  try {
    const response = await fetch("./songdata.json");
    const song = await response.json();
    songsData = song.songs; // Store songs in the songsData array
  } catch (error) {
    console.error("Error fetching song data: ", error);
  }
};

// Display the song list on the webpage
const displaySongList = () => {
  songsData.forEach((song, index) => {
    const li = createSongElement(song, index);
    songList.append(li); // Append each song element to the song list container
  });
};

// Create HTML elements for a song
const createSongElement = (song, index) => {
  const li = document.createElement("li"); // Create a list item
  li.innerHTML = `
    <img src="${song.imageUrl}" alt="${song.name}">
    <div class="song-info">
      <span class="song-title">${song.name}</span>
      <span class="song-artist">${song.artist}</span>
    </div>
    <div class="favourite-icon">
      <i class="fa-regular fa-heart"></i>
    </div>
  `;
  li.dataset.index = index; // Store the song's index in the dataset attribute

  return li; // Return the created list item
};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("fa-heart")) {
    const song =
      event.target.parentElement.parentElement.firstElementChild
        .nextElementSibling.firstElementChild.textContent;
    if (event.target.classList.contains("fa-regular")) {
      event.target.classList.remove("fa-regular");
      event.target.classList.add("fa-solid");
      if (!checkIfSongExists(song)) {
        addFavoriteSongToStorage(song);
      }
    } else {
      event.target.classList.add("fa-regular");
      event.target.classList.remove("fa-solid");

      removeSongFromStorage(song);
    }
  }
});
// Handle song selection and update the current song index
const selectSong = (event) => {
  if (!event.target.classList.contains("fa-heart")) {
    const listItem = event.target.closest("li");
    if (listItem) {
      const index = parseInt(listItem.dataset.index, 10); // Parse index to an integer
      const selectedSong = songsData[index];
      loadSong(selectedSong);
      currentSongIndex = index;

      const allSongs = document.querySelectorAll(".songs-ul li");
      allSongs.forEach((song, idx) => {
        if (idx === index) {
          song.classList.add("active");
        } else {
          song.classList.remove("active");
        }
      });
    }
  }
};

// Load the selected song into the currently playing section
const loadSong = (song) => {
  // Display the song information in the UI
  currentSong.innerHTML = `
    <img src="${song.imageUrl}" alt="${song.name}" class="current-song">
    <div class="song-info">
      <span class="song-title">${song.name}</span>
      <span class="song-artist">${song.artist}</span>
    </div>
    <div class="favourite-icon" title="Add to favorites">
      <i class="fa-regular fa-heart"></i>
    </div>
  `;
  // Set the audio source and play the song
  audioElement.setAttribute("src", song.songUrl);
  playSong();
  const allSongs = document.querySelectorAll(".songs-ul li");
  allSongs.forEach((song, index) => {
    if (index === currentSongIndex) {
      song.classList.add("active");
    } else {
      song.classList.remove("active");
    }
  });
};

// Play the currently loaded song
const playSong = () => {
  audioElement.classList.add("play");
  playBtn.querySelector("i").classList.remove("fa-play");
  playBtn.querySelector("i").classList.add("fa-pause");
  audioElement.play();
};

// Pause the currently playing song
const pauseSong = () => {
  audioElement.classList.remove("play");
  playBtn.querySelector("i").classList.add("fa-play");
  playBtn.querySelector("i").classList.remove("fa-pause");
  audioElement.pause();
};

// Play the next song in the song list
const nextSong = () => {
  currentSongIndex++;
  if (currentSongIndex > songsData.length - 1) {
    currentSongIndex = 0;
  }
  loadSong(songsData[currentSongIndex]);
};

// Play the previous song in the song list
const prevSong = () => {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songsData.length - 1;
  }
  loadSong(songsData[currentSongIndex]);
};

const playRandomSong = () => {
  const randomIndex = Math.floor(Math.random() * songsData.length);
  loadSong(songsData[randomIndex]);
};

const repeatCurrentSong = () => {
  if (repeatBtn.style.color !== "blue") {
    repeatBtn.style.color = "blue";
    audioElement.loop = true; // Enabling song repeat
  } else {
    repeatBtn.style.color = "rgba(255, 255, 255, 0.701)";
    audioElement.loop = false; // Disabling song repeat
  }
};

const shuffleSongs = () => {
  if (shuffleBtn.style.color !== "blue") {
    shuffleBtn.style.color = "blue";
    playRandomSong();
  } else {
    shuffleBtn.style.color = "rgba(255, 255, 255, 0.701)";
    playRandomSong();
  }
};

const toggleSubmenu = (event) => {
  const submenu = document.querySelector(".sort-submenu");
  if (submenu.style.display === "block" && !submenu.contains(event.target)) {
    submenu.style.display = "none"; // Hide the submenu if it's visible and the click is outside
  } else if (event.target.parentElement.className === "align-center") {
    submenu.style.display = "block"; // Show the submenu if it's hidden
  }
};

const sortSongs = (criteria) => {
  const songsList = document.querySelector(".songs-ul");
  const songs = Array.from(songsList.getElementsByTagName("li"));

  if (criteria === "Alphabetical") {
    songs.sort((a, b) => {
      const nameA = a.textContent.toLowerCase();
      const nameB = b.textContent.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  // Clear the current list
  while (songsList.firstChild) {
    songsList.removeChild(songsList.firstChild);
  }

  document.querySelector(".align-center span").textContent = "Alphabetical";
  submenu.style.display = "none";

  // Append the sorted songs back to the list
  songs.forEach((song) => {
    songsList.appendChild(song);
  });
};

const updateProgress = (event) => {
  const { duration, currentTime } = event.srcElement;
  const progressPercentage = (currentTime / duration) * 100;
  progress.style.width = `${progressPercentage}%`;

  if (progressPercentage === 100) {
    nextSong();
  }

  document.querySelector(".current-time").textContent =
    secondsToMinutes(currentTime);
  document.querySelector(".duration").textContent = secondsToMinutes(duration);
};

const setProgress = (event) => {
  if (event.target.className === "progress-container") {
  }

  const progressContainer = document.querySelector(".progress-container");
  const width = progressContainer.clientWidth;
  const clickX = event.offsetX;
  const duration = audioElement.duration;

  const newTime = (clickX / width) * duration;
  audioElement.currentTime = newTime;
};

const secondsToMinutes = (seconds) => {
  const minutes = Math.floor(seconds / 60); // Calculate the number of whole minutes
  const remainingSeconds = seconds % 60; // Calculate the remaining seconds
  return `${minutes}:${remainingSeconds.toFixed(0)} `;
};

const addFavoriteSongToStorage = (song) => {
  let songFromStorage = getSongFromStorage();

  songFromStorage.push(song);

  localStorage.setItem("songs", JSON.stringify(songFromStorage));
};

const getSongFromStorage = () => {
  let songFromStorage;

  if (localStorage.getItem("songs") === null) {
    songFromStorage = [];
  } else {
    songFromStorage = JSON.parse(localStorage.getItem("songs"));
  }

  return songFromStorage;
};

const removeSong = (song) => {
  song.remove();

  removeSongFromStorage(song.textContent);
};

const removeSongFromStorage = (song) => {
  let songFromStorage = getSongFromStorage();
  songFromStorage = songFromStorage.filter((i) => i !== song);

  localStorage.setItem("songs", JSON.stringify(songFromStorage));
};

const checkIfSongExists = (song) => {
  const songFromStorage = getSongFromStorage();

  return songFromStorage.includes(song);
};

// Event listener for play button click
playBtn.addEventListener("click", () => {
  const isPlaying = audioElement.classList.contains("play");
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Initialize the swiper
const initSwiper = (target, delayTime) => {
  const swiper = new Swiper(target, {
    slidesPerView: 4,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: delayTime,
      disableOnInteraction: false,
    },
  });
};

// Initialize the application with necessary event listeners
const initApp = async () => {
  await fetchSong(); // Fetch song data
  displaySongList(); // Display the song list
  initSwiper(".swiper-1", 4000);
  initSwiper(".swiper-2", 4500);

  // Event listeners for song list item clicks and navigation buttons
  songList.addEventListener("click", selectSong);
  nextBtn.addEventListener("click", nextSong);
  prevBtn.addEventListener("click", prevSong);
  repeatBtn.addEventListener("click", repeatCurrentSong);
  shuffleBtn.addEventListener("click", shuffleSongs);
  document.addEventListener("click", toggleSubmenu);
  audioElement.addEventListener("ended", playRandomSong);
  submenu.addEventListener("click", (event) => {
    if (event.target.textContent === "Alphabetical") {
      sortSongs("Alphabetical");
      event.target.style.color = "blue";
    }
  });
  progressContainer.addEventListener("click", setProgress);
  audioElement.addEventListener("timeupdate", updateProgress);
  volumeSlider.addEventListener("input", () => {
    audioElement.volume = volumeSlider.value;
  });
};

initApp(); // Initialize the application when the script is loaded
