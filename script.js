const initSwiper = (swiperDiv, delayTime) => {
  const swiper = new Swiper(swiperDiv, {
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
