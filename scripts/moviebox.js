console.log('lpf')
import {Loadfrombackend,saveFavMovies,removeItem,likedMovie} from './loadHomePage.js'

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

   
    async moviesFetch(){
        let allMoviesTrue=true
        let allMovies=1;
        for (let i=0;i<allMovies;i++){
        
            try{
                const movies = await fetch(`https://api.themoviedb.org/3/tv/popular?language=en-US&page=${1}`, this.options)
            
                const moviesJson = await movies.json()
                
                    if(allMoviesTrue){
                        allMoviesTrue=false
                        allMovies=moviesJson.total_pages;
                        allMovies = 1;
                    }
                    this.trending.push(moviesJson.results);
            }catch (error){
                console.log(error)
            }
        }
        console.log(`Successfully loaded ${this.trending.flat().length} trending movies from backend`)
        return this.trending.flat()
        
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
        console.log(movie)
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
let trendingMovies=[];
load.moviesFetch().then((response)=>{
    
    for (const movie of response){
        if (!movie.adult===true){
            trendingMovies.push(movie)
        }
         console.log(movie)
    }
    
    load.displayBackdrop(trendingMovies[0])

    
    load.renderImage(trendingMovies);
    console.log(`Successfully rendered ${trendingMovies.length} trending movies to DOM`);
    
    
    likedMovie('trend',trendingMovies);
    mainPageFav();
})


function mainPageFav(){
    
        
        const likedMovie=document.querySelector('.js-favourite');
        likedMovie.addEventListener('click',()=>{
            
        let favouriteMovies = JSON.parse(localStorage.getItem('favourites'))? JSON.parse(localStorage.getItem('favourites')) : [];

        console.log(favouriteMovies)
        const movieId=document.querySelector('.js-description').dataset.movieId;

      

        if (likedMovie.classList.contains('fa-solid')){
            likedMovie.classList.remove('fa-solid');
            likedMovie.classList.add('fa-regular');
            favouriteMovies=removeItem(favouriteMovies,movieId);
            console.log(favouriteMovies)
        }else{
            likedMovie.classList.add('fa-solid');
            likedMovie.classList.remove('fa-regular')
            favouriteMovies=saveFavMovies(favouriteMovies,movieId)
            console.log(favouriteMovies)
        }  

        localStorage.setItem('favourites',JSON.stringify(favouriteMovies))
        })
    
   
}



