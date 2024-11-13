const img_path = sessionStorage.getItem('movie').split(',');
// console.log((img_path)[0])

document.querySelector('title').innerText=img_path[1].replace(/^"|"$/g, '');
const clean_img_path = img_path[0].replace(/^"|"$/g, '');
// console.log(clean_img_path)

const backdrop_path = `https://image.tmdb.org/t/p/original${clean_img_path}`
document.querySelector('.movie-backdrop').src=backdrop_path
