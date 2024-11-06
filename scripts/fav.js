import {Loadfrombackend,removeItem} from './loadHomePage.js'

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMzNlOWI4MWEyMWU4NDhkNTE4NGQ0ZjQ2ZTk3YTNkNSIsIm5iZiI6MTczMDY4NjgxNS43NDI2OTEsInN1YiI6IjY3MGNmODU5MWNhNGMzOWZkZWViOTU5NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kRk0zrWkaNzap-v7QrIGARux45D935zn-0VkVSmylLg'
    }
  };
  


class Favfetch extends Loadfrombackend{
    favList;
    favDetails=[];
    genre=[];
    constructor(options,favList){
        super(options);
        this.favList=favList;
    }
   
   seriesCode(movie,seriesGenre){
    console.log(movie)
    const movieGenres = movie.genre_ids.reduce((accumulator,currentValue)=>{
        let genre = seriesGenre.find(genre=>genre.id == currentValue);
        accumulator.push(genre.name);
        return accumulator;
    },[]) 

    const movieGenreName = movieGenres.join(' | ');

    return `
    <div class="favourite-movies" data-movieId=${movie.id}>
        <div class="favourite-movie">
            <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.original_name}">
        </div>
        <div class="fav-details">
            <div class="movie-title">${movie.original_name}</div>
            <div class="movie-description">
                <span>${this.getDate(movie.first_air_date)} |</span> <span> ${movieGenreName}</span> 
            </div>

        </div>

        <div class="favourite">
            <i class="fa-regular fa-heart js-fav"></i>
        </div>
    </div>

    `;

   
    }   
    movieCode(movie,movieGenre){
    
    const movieGenres = movie.genre_ids.reduce((accumulator,currentValue)=>{
        let genre = movieGenre.find(genre=>genre.id == currentValue)
        accumulator.push(genre.name)
        return accumulator
    },[]) 

    const movieGenreName = movieGenres.join(' | ');

    return `
                

            <div class="favourite-movies" data-movieId=${movie.id}>
                <div class="favourite-movie">
                    <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
                </div>
                <div class="fav-details">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-description">
                        <span>${this.getDate(movie.release_date)} |</span> <span> ${movieGenreName}</span> 
                    </div>

                </div>

                <div class="favourite">
                    <i class="fa-regular fa-heart js-fav"></i>
                </div>
            </div>

    `;

   
    }

    async renderImage(){
        try{
            
            
            let counter=0;
            console.log(this.genre)
            if (!this.genre) await this.loadGenre()
            if (!this.seriesGenre) await this.loadGenre()
            
            
            this.renderFavs(this.favList)
        }catch(error){
            console.log(error)
        }
    }
    renderFavs(list){
        console.log('Life is good!')
        const movies = document.querySelector('.favs');
        let moviesCode='';
        for (const movie of list){
            console.log(movie)
            if (movie.media_type) {
                moviesCode+=this.movieCode(movie,this.genre);
            }else{
                moviesCode+=this.seriesCode(movie,this.seriesGenre);
            }
        }
        movies.innerHTML=moviesCode;
    }
}



const favList = JSON.parse(localStorage.getItem('favourites'));
console.log(favList)
renderFavMovies(favList)

function likedMovieFunction(movieList,load){
    const movies = document.querySelectorAll('.favourite-movies');
    let favouriteMovies = localStorage.getItem('favourites')? JSON.parse(localStorage.getItem('favourites')) : [];

    movies.forEach((movie)=>{
        const movieId=movie.dataset.movieid;
        const movieDetailObject=movieList.find(movie=> movie.id == movieId);
        const likedMovie=movie.querySelector('.js-fav');
        
        for (const fav of favouriteMovies){
            console.log(fav)
            console.log(fav.id===movieDetailObject.id)
            if (fav.id===movieDetailObject.id){
                likedMovie.classList.add('fa-solid');
                likedMovie.classList.remove('fa-regular')
            }
        }
            likedMovie.addEventListener('click',()=>{
             
                likedMovie.classList.remove('fa-solid');
                likedMovie.classList.add('fa-regular');
                favouriteMovies=removeItem(favouriteMovies,movieDetailObject);
                
                localStorage.setItem('favourites',JSON.stringify(favouriteMovies));
                console.log(favouriteMovies);
                try{
                    // load.renderFavs(favouriteMovies)
                    likedMovieFunction(favouriteMovies,load)
                    
                }catch(error){
                    console.log(error)
                }
            })
            })
}
        

function renderFavMovies(movieList){
    // console.log(movieList)
    const load = new Favfetch(options,movieList);
    load.renderImage().then((response)=> likedMovieFunction(movieList,load))
}

