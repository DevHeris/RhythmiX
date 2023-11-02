const initSwiper = (swiper) => {
  const swiper = new Swiper(swiper, {
    slidesPerView: 4,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
  });
};

initSwiper(".swiper");
initSwiper(".swiper-1");
