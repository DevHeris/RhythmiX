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

const client_id = "22a4c87ecf6b453dada8e588978d033d";
const redirect_uri = "http://localhost:5500/index.html";
const scope = "user-read-private user-read-email";

let url = "https://accounts.spotify.com/authorize";
url += "?response_type=token";
url += "&client_id=" + encodeURIComponent(client_id);
url += "&scope=" + encodeURIComponent(scope);
url += "&redirect_uri=" + encodeURIComponent(redirect_uri);

console.log(url);
const access_token = window.location.search;
console.log(access_token);
// async function fetchData() {
//   const result = await fetch(`https://api.spotify.com/v1/tracks/${client_id}`, {
//     method: "Get",
//     headers: {
//       "Content-Type": "application.json",
//       authorization: "",
//     },
//   });

//   console.log(result);
// }

// fetchData();
