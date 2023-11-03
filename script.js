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
      <i class="fa-solid fa-heart"></i>
    </div>
  `;
  li.dataset.index = index; // Store the song's index in the dataset attribute
  return li; // Return the created list item
};

// Handle song selection and update the current song index
const selectSong = (event) => {
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

  if (index === currentSongIndex) {
    song.classList.add("active");
  } else {
    song.classList.remove("active");
  }
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
    if (!audioElement.classList.contains("play")) {
      playRandomSong();
    }
    const allSongs = document.querySelectorAll(".songs-ul li");
    allSongs.forEach((song) => {
      song.classList.remove("active");
    });
  } else {
    shuffleBtn.style.color = "rgba(255, 255, 255, 0.701)";
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
    }
  });
};

initApp(); // Initialize the application when the script is loaded
