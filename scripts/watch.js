import {Loadfrombackend,saveFavMovies,removeItem,likedMovie} from './loadHomePage.js'

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


function loadMovies(currentPage){
    load.moviesFetch(currentPage).then((response)=>{
        // console.log(response)
        const moviesFetched=response[0]
        
        for (const movie of moviesFetched){
            if (!movie.adult===true){
                trendingMovies.push(movie)
            }
        }
        load.displayBackdrop(moviesFetched[Math.round(Math.random()*10)])
    
        
        load.renderImage(trendingMovies);
        // console.log(trendingMovies)
        console.log(`Successfully rendered ${trendingMovies.length} trending movies to DOM`);
        
        
        likedMovie('trend',trendingMovies);
        mainPageFav();
        displaySelectedMovie(trendingMovies);
        return response[1]
    }).then((response)=>{
        // console.log('Hello, World!');
        const lastMovieObserver = new IntersectionObserver(entries=>{
            // console.log(entries)
            const lastElementObserver = entries[0];
            if (!lastElementObserver.isIntersecting) return;
            currentPage++
            // console.log(currentPage)
            loadNextPage(currentPage,response)
            lastMovieObserver.unobserve(lastElementObserver.target);
            lastMovieObserver.observe(document.querySelector('.trend:last-child'));
        })
        
        lastMovieObserver.observe(document.querySelector('.trend:last-child'));

    })
    
}
loadMovies(currentPage)
function mainPageFav(){
        const likedMovie=document.querySelector('.js-favourite');
        likedMovie.addEventListener('click',()=>{
            
        let favouriteMovies = JSON.parse(localStorage.getItem('favourites'))? JSON.parse(localStorage.getItem('favourites')) : [];

        // console.log(favouriteMovies)
        const movieId=document.querySelector('.js-description').dataset.movieId;

        if (likedMovie.classList.contains('fa-solid')){
            likedMovie.classList.remove('fa-solid');
            likedMovie.classList.add('fa-regular');
            favouriteMovies=removeItem(favouriteMovies,movieId);
            // console.log(favouriteMovies)
        }else{
            likedMovie.classList.add('fa-solid');
            likedMovie.classList.remove('fa-regular')
            favouriteMovies=saveFavMovies(favouriteMovies,movieId)
            // console.log(favouriteMovies)
        }  
        localStorage.setItem('favourites',JSON.stringify(favouriteMovies))
    })
}

function displaySelectedMovie(list){
    const movies = document.querySelectorAll('.trend');
    // console.log(movies)
    movies.forEach((movie)=>{
        
        movie.addEventListener('click',()=>{
            // console.log(movie.dataset)
            
            const movieId= movie.dataset.movieid;
            
            const response = load.renderMovieDetails(movieId,list)
            if (document.querySelector('.selected-movie')) document.querySelector('.selected-movie').remove()
            document.body.append(response)
            
        })
    })
}


// get the pages
// observe the first page last element
// reload on getting to the last element


function loadNextPage(page_number,total_pages){
    if (page_number>total_pages) return;
    // console.log(page_number)
    loadMovies(page_number)

}