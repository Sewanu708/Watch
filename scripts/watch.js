import {Loadfrombackend,saveFavMovies,removeItem,likedMovie,displaySelectedMovie} from './loadHomePage.js'

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMzNlOWI4MWEyMWU4NDhkNTE4NGQ0ZjQ2ZTk3YTNkNSIsIm5iZiI6MTcyODkwMzcyMS4zOTMzNjIsInN1YiI6IjY3MGNmODU5MWNhNGMzOWZkZWViOTU5NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DTE2v4paAARib0Ft-AlsMLANEuLczVu-92mCi3pFiTM'
    }
}

const load = new Loadfrombackend(options);
let trendingMovies=[];
let currentPage = 1;

loadMovies(currentPage);

function loadMovies(currentPage){
    load.moviesFetch(currentPage).then((response) => {
        return loadAndDisplay(load,response)
    }).then((response)=>{ 
        observers(response)
    });
}
function mainPageFav(movieList){
        const likedMovie=document.querySelector('.js-favourite');
        let favouriteMovies = JSON.parse(localStorage.getItem('favourites'))? JSON.parse(localStorage.getItem('favourites')) : [];

        // console.log(favouriteMovies)
        const movieId=document.querySelector('.js-description').dataset.movieId;
        const movieDetailObject=movieList.find(movie=> movie.id == movieId)
        
        const ids = favouriteMovies.reduce((accumulator,currentValue)=>{
            accumulator.push(currentValue.id)
            return accumulator
        },[])
        if (ids.includes(movieDetailObject.id)){
            likedMovie.classList.add('fa-solid');
            likedMovie.classList.remove('fa-regular');
        }


        likedMovie.addEventListener('click',()=>{
   
        if (likedMovie.classList.contains('fa-solid')){
            likedMovie.classList.remove('fa-solid');
            likedMovie.classList.add('fa-regular');
            favouriteMovies=removeItem(favouriteMovies,movieDetailObject);
            // console.log(favouriteMovies)
        }else{
            likedMovie.classList.add('fa-solid');
            likedMovie.classList.remove('fa-regular')
            favouriteMovies=saveFavMovies(favouriteMovies,movieDetailObject)
            // console.log(favouriteMovies)
        }  
        localStorage.setItem('favourites',JSON.stringify(favouriteMovies))
    })
}

function loadAndDisplay(classInstance,response){
    const moviesFetched = response[0];
        for (const movie of moviesFetched) {
            if (!movie.adult) {
                trendingMovies.push(movie);
            }
        }
        classInstance.displayBackdrop(moviesFetched[Math.floor(Math.random() * moviesFetched.length)]);
        classInstance.renderImage(trendingMovies);
        console.log(`Successfully rendered ${trendingMovies.length} trending movies to DOM`);
        likedMovie('trend', trendingMovies);
        mainPageFav(trendingMovies);
        displaySelectedMovie(trendingMovies, classInstance);
        return response[1];
}

function observers(response){
    // console.log(response)
        const lastMovieObserver = new IntersectionObserver(entries=>{
        console.log(response)
        const lastElementObserver = entries[0];
        if (!lastElementObserver.isIntersecting) return;
        currentPage++
        if (currentPage<=response){
            lastMovieObserver.unobserve(lastElementObserver.target);
            loadMovies(currentPage)
            };
        },{rootMargin:'1000px'})
        lastMovieObserver.observe(document.querySelector('.trend:last-child'));
       
}

document.addEventListener('click',(event)=>{
    const movies = document.querySelectorAll('.trending-movie');
    if (!document.querySelector('.trends').contains(event.target)){
        for (const film of movies){
            film.classList.remove('add-opacity')
        }
    }
})