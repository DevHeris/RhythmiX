const audioElement = document.querySelector(".audioElement");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const repeatBtn = document.getElementById("repeat");
const shuffleBtn = document.getElementById("shuffle");

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

async function fetchImageData() {
  const response = await fetch("./imagedata.json");
  const data = await response.json();
  console.log(data);
}

fetchImageData();
