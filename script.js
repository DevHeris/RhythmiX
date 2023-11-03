const audioElement = document.querySelector(".audioElement");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const repeatBtn = document.getElementById("repeat");
const shuffleBtn = document.getElementById("shuffle");
const songList = document.querySelector(".songs-ul");

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

initSwiper(".swiper-1", 4000);
initSwiper(".swiper-2", 4500);

// Fetch Song from Local file
async function fetchSong() {
  const response = await fetch("./songdata.json");
  const song = await response.json();
  return song;
}

async function displaySongList() {
  const { songs } = await fetchSong();
  console.log(songs);
  songs.forEach((song) => {
    const li = document.createElement("li");
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
    songList.append(li);
  });
}

function initApp() {
  fetchSong();
  displaySongList();
}

initApp();
