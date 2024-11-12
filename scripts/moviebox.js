import {Loadfrombackend,saveFavMovies,removeItem,likedMovie,displaySelectedMovie} from './loadHomePage.js'
console.log('lkoi')
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMzNlOWI4MWEyMWU4NDhkNTE4NGQ0ZjQ2ZTk3YTNkNSIsIm5iZiI6MTcyODkwMzcyMS4zOTMzNjIsInN1YiI6IjY3MGNmODU5MWNhNGMzOWZkZWViOTU5NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DTE2v4paAARib0Ft-AlsMLANEuLczVu-92mCi3pFiTM'
    }
}
class Series extends Loadfrombackend{

    constructor(options){
       super(options)
       
    }

   
    async moviesFetch(pageNumber){
        let pages;
        try{
            this.trending=this.trending?[]:this.trending;
            const movies = await fetch(`https://api.themoviedb.org/3/tv/popular?language=en-US&page=${pageNumber}`, this.options);
            const moviesJson = await movies.json();
            pages=moviesJson.total_pages;
            this.trending.push(moviesJson.results);
        }catch (error){
            console.log(error);
        }
        console.log(`Successfully loaded ${this.trending.flat().length}---${pageNumber} trending movies from backend`)
      
        return [this.trending.flat(),pages]
        
    };

    async fetchGenre(){
     
        try{
         
            const genres = await fetch('https://api.themoviedb.org/3/genre/tv/list?language=en', this.options)
            
            const genresJson = await genres.json()
            const genreList = genresJson.genres;
            
            return genreList;
            
            
    
        }catch (error){
            console.log(error)
        }
      
    }
    renderImage(movieList) {
        try{
            
            const movies = document.querySelector('.trends');
            let moviesCode='';
            let counter=0;
            
            for (const movie of movieList){
                let movieGenres=[];
                for (const genreId of movie.genre_ids){
                    movieGenres.push(this.searchGenre(this.genre,genreId));
                }
            const movieGenreName=this.concatGenres(movieGenres)
            
            moviesCode+=`
                

             <div class="trend" data-movieId=${movie.id}>
                <div class="movie-poster">
                    <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.original_name}">
                </div>
                <div class="trend-details">
                    <div>${movie.original_name}</div>
                    <div>
                       <span> ${movieGenreName}</span> 
                    </div>

                </div>

                <div class="favourite">
                    <i class="fa-regular fa-heart js-fav"></i>
                </div>
            </div>

           `;
            
            counter++
            }
            movies.innerHTML=moviesCode;
        }catch(error){
            console.log(error)
        }
    
    }
    displayBackdrop(movie){
 
        document.querySelector('.main-page').style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;
        let movieGenres=[];
        for (const genreId of movie.genre_ids){
            movieGenres.push(this.searchGenre(this.genre,genreId));
        }
        document.querySelector('.js-description').innerHTML=`
        <span> ${this.concatGenres(movieGenres)} | </span>
        `
        document.querySelector('.js-title').innerHTML=`${movie.original_name}`
        document.querySelector('.js-description').dataset.movieId = `${movie.id}`
    }
}
const load = new Series(options);
console.log('k')
let trendingMovies=[];
let currentPage = 1;
loadMovies(currentPage);
function loadMovies(currentPage){
    load.moviesFetch(currentPage).then((response) => {
        console.log(response)
        return loadAndDisplay(load,response)
    }).then((response)=>{ 
        observers(response)
    });
}
function loadAndDisplay(classInstance,response){
    const moviesFetched = response[0];
        for (const movie of moviesFetched) {
            if (!movie.adult) {
                trendingMovies.push(movie);
            }
        }
        classInstance.displayBackdrop(trendingMovies[0])

        classInstance.renderImage(trendingMovies);
        console.log(`Successfully rendered ${trendingMovies.length} trending movies to DOM`);
        likedMovie('trend', trendingMovies);
        mainPageFav(trendingMovies);
        displaySelectedMovie(trendingMovies, classInstance);
        return response[1];
}
// load.moviesFetch().then((response)=>{
//     const moviesFetched = response[0];
//     for (const movie of moviesFetched){
//         if (!movie.adult===true){
//             trendingMovies.push(movie)
//         }
//     }
    
//     load.displayBackdrop(trendingMovies[0])

    
//     load.renderImage(trendingMovies);
//     console.log(`Successfully rendered ${trendingMovies.length} trending movies to DOM`);
    
    
//     likedMovie('trend',trendingMovies);
//     mainPageFav(trendingMovies);
    
//     return response[1];
// })
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


function mainPageFav(movieList){

        const likedMovie=document.querySelector('.js-favourite');
        let favouriteMovies = JSON.parse(localStorage.getItem('favourites'))? JSON.parse(localStorage.getItem('favourites')) : [];

        const movieId=document.querySelector('.js-description').dataset.movieId;
        const movieDetailObject=movieList.find(movie=> movie.id == movieId);

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

        }else{
            likedMovie.classList.add('fa-solid');
            likedMovie.classList.remove('fa-regular')
            favouriteMovies=saveFavMovies(favouriteMovies,movieDetailObject)
        }  

        localStorage.setItem('favourites',JSON.stringify(favouriteMovies))
    })
}




document.addEventListener('click',(event)=>{
    const movies = document.querySelectorAll('.trend');
    if (!document.querySelector('.trends').contains(event.target)){
        for (const film of movies){
            film.classList.remove('add-opacity')
        }
    }
})