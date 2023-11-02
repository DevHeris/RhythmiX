const initSwiper = (appendPoint) => {
  const swiper = new Swiper(appendPoint, {
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
