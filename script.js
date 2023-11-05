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
const spinner = document.querySelector(".spinner");
const faveSection = document.querySelector(".favorite-songs");
const searchSection = document.querySelector(".search-wrapper");

// Store fetched song data and set the current song index
let songsData = [];
let currentSongIndex = 0; // Initialize the index of the currently playing song

// Fetch song data from a JSON file
const fetchSong = async () => {
  showSpinner();

  setTimeout(() => {
    hideSpinner();
  }, 500);

  try {
    const response = await fetch("./songdata.json");
    const song = await response.json();
    songsData = song.songs; // Store songs in the songsData array
  } catch (error) {
    console.error("Error fetching song data: ", error);
  }
};

const greetByTimeOfDay = () => {
  const greetingElement = document.querySelector(".greeting-msg");
  const date = new Date();
  const hour = date.getHours();

  switch (true) {
    case hour < 12:
      greetingElement.innerHTML = "Good Morning	&#127911;";
      break;
    case hour < 18:
      greetingElement.innerHTML = "Good Afternoon	&#127911;";
      break;
    default:
      greetingElement.innerHTML = "Good Evening	&#127911;";
      break;
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
  li.dataset.index = index;

  return li;
};

const getSongDataByName = (songName) => {
  const foundSong = songsData.find((song) => song.name === songName);
  return foundSong;
};

const displayFavouriteSongs = () => {
  const songNamesInStorage = getSongFromStorage();

  const existingFavoriteSongs = document.querySelector(
    ".favorite-songs .swiper-wrapper"
  );
  if (existingFavoriteSongs) {
    existingFavoriteSongs.innerHTML = ""; // Clear the existing favorite songs
  }

  let faveSongsArray = [];

  songNamesInStorage.forEach((name) => {
    const song = getSongDataByName(name);
    if (song) {
      faveSongsArray.push(song);
    } else {
      console.log(`Song with name '${name}' not found in songsData.`);
    }
  });

  faveSongsArray.forEach((song) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
      <div class="song">
        <div class="song-cover">
          <img src="${song.imageUrl}" alt="Song Cover">
          <div class="song-info">
            <span class="song-title">${song.name}</span>
            <span class="song-artist">${song.artist}</span>
            <div class="play" id="playFaveBtn">
              <i class="fa-solid fa-play playI"></i>
            </div>
          </div>
        </div>
      </div>
    `;
    document.querySelector(".favorite-songs .swiper-wrapper").prepend(div);
  });

  initSwiper();

  const playFaveBtns = document.querySelectorAll("#playFaveBtn");
  playFaveBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const songName =
        event.target.parentElement.parentElement.querySelector(
          ".song-title"
        ).textContent;
      const songData = getSongDataByName(songName);
      loadSong(songData);
    });
  });
};

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("fa-heart")) {
    const songTitleElement =
      event.target.parentElement.parentElement.querySelector(".song-title");
    const song = songTitleElement.textContent;

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

  if (criteria === "A to Z") {
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

  document.querySelector(".align-center span").textContent = "A to Z";
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
    const progressContainer = document.querySelector(".progress-container");
    const width = progressContainer.clientWidth;
    const clickX = event.offsetX;
    const duration = audioElement.duration;

    const newTime = (clickX / width) * duration;
    audioElement.currentTime = newTime;
  }
};

const toggleSection = (fromSection, toSection) => {
  fromSection.classList.remove("show");
  fromSection.classList.add("hide");
  toSection.classList.remove("hide");
  toSection.classList.add("show");
};

const toggleSections = (event) => {
  const isSearch = event.target.classList.contains("search");
  const isHome = event.target.classList.contains("home");

  if (isSearch) {
    event.preventDefault();
    if (faveSection && faveSection.classList.contains("show")) {
      toggleSection(faveSection, searchSection);
    }
  } else if (isHome) {
    event.preventDefault();
    if (searchSection && searchSection.classList.contains("show")) {
      toggleSection(searchSection, faveSection);
    }
  }
};

const secondsToMinutes = (seconds) => {
  const minutes = Math.floor(seconds / 60); // Calculate the number of whole minutes
  const remainingSeconds = seconds % 60; // Calculate the remaining seconds
  return `${minutes}:${remainingSeconds.toFixed(0).padStart(2, "0")} `;
};

const addFavoriteSongToStorage = (song) => {
  let songFromStorage = getSongFromStorage();

  songFromStorage.push(song);

  localStorage.setItem("songs", JSON.stringify(songFromStorage));

  displayFavouriteSongs();
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
  displayFavouriteSongs();
};

const checkIfSongExists = (song) => {
  const songFromStorage = getSongFromStorage();

  return songFromStorage.includes(song);
};

const showSpinner = () => {
  if (!spinner.classList.contains("show")) {
    spinner.classList.add("show");
  }
};

const hideSpinner = () => {
  if (spinner.classList.contains("show")) {
    spinner.classList.remove("show");
  }
};

const isSongInStorage = (songName) => {
  const songFromStorage = getSongFromStorage();
  return songFromStorage.includes(songName);
};

const setInitialFavoriteButtonColor = () => {
  setTimeout(() => {
    const favoriteButtons = document.querySelectorAll(".fa-heart");
    favoriteButtons.forEach((button) => {
      const songTitle =
        button.parentElement.parentElement.querySelector(
          ".song-title"
        ).textContent;
      if (isSongInStorage(songTitle)) {
        button.classList.add("fa-solid");
      }
    });
  }, 1000);
};

// Initialize the swiper
const initSwiper = () => {
  const swiper = new Swiper(".swiper-1", {
    slidesPerView: 4,
    spaceBetween: 20,
    freeMode: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
  });
};

document.addEventListener("DOMContentLoaded", setInitialFavoriteButtonColor);

// Initialize the application with necessary event listeners
const initApp = async () => {
  await fetchSong(); // Fetch song data

  // Event listeners for song list item clicks and navigation buttons
  songList.addEventListener("click", selectSong);
  nextBtn.addEventListener("click", nextSong);
  prevBtn.addEventListener("click", prevSong);
  repeatBtn.addEventListener("click", repeatCurrentSong);
  shuffleBtn.addEventListener("click", shuffleSongs);
  document.addEventListener("click", toggleSubmenu);
  audioElement.addEventListener("ended", playRandomSong);
  progressContainer.addEventListener("click", setProgress);
  audioElement.addEventListener("timeupdate", updateProgress);
  document.addEventListener("click", toggleSections);
  volumeSlider.addEventListener("input", () => {
    audioElement.volume = volumeSlider.value;
  });
  submenu.addEventListener("click", (event) => {
    if (event.target.textContent === "A to Z") {
      sortSongs("A to Z");
      event.target.style.color = "blue";
    }
  });
  playBtn.addEventListener("click", () => {
    const isPlaying = audioElement.classList.contains("play");
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  });
  initSwiper();
  displaySongList(); // Display the song list
  greetByTimeOfDay();
  displayFavouriteSongs();
};

initApp();
