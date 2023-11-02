function displayRecents() {
  const swiper = new Swiper(".swiper-1", {
    slidesPerView: 4,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
  });
}

function displayFaves() {
  const swiper = new Swiper(".swiper-2", {
    slidesPerView: 4,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
    },
  });
}

displayRecents();
displayFaves();
