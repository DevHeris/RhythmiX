const audioElement = document.querySelector(".audioElement");
console.log(audioElement);

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
