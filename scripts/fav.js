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
           
            if (!this.genre) await this.loadGenre()
            if (!this.seriesGenre) await this.loadGenre()
            
            
            this.renderFavs(this.favList)
        }catch(error){
            console.log(error)
        }
    }
    renderFavs(list){
        
        const movies = document.querySelector('.favs');
        let moviesCode='';
        for (const movie of list){

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

renderFavMovies(favList)

function likedMovieFunction(movieList,classInstance){
    // Load all favourites in the dom to movies
    const movies = document.querySelectorAll('.favourite-movies');
    let favouriteMovies = localStorage.getItem('favourites')? JSON.parse(localStorage.getItem('favourites')) : [];
    

    movies.forEach((movie)=>{
        const movieId=movie.dataset.movieid;
        const movieDetailObject=movieList.find(movie=> movie.id == movieId);
        const likedMovie=movie.querySelector('.js-fav');
        favouriteMovies.forEach(fav=>{
            likeRemove(likedMovie)
        })

        likedMovie.addEventListener('click',()=>{
            likeRemove(likedMovie)
            favouriteMovies=removeItem(favouriteMovies,movieDetailObject);
            localStorage.setItem('favourites',JSON.stringify(favouriteMovies));
            classInstance.renderFavs(favouriteMovies)
            likedMovieFunction(movieList,classInstance)
            
        })
    })
}
        
function likeRemove(element){
    element.classList.add('fa-solid');
    element.classList.remove('fa-regular')
}

function renderFavMovies(movieList){

    const load = new Favfetch(options,movieList);
    load.renderImage().then((response)=> {
        likedMovieFunction(movieList,load);
        displaySelectedMovie(movieList,load)      
    })
}


function displaySelectedMovie(list,classInstance){
    const movies = document.querySelectorAll('.favourite-movies');

    movies.forEach((movie)=>{
        
        movie.addEventListener('click',(e)=>{
            
            if (e.target.classList.contains('js-fav')) return;

            for (const film of movies){
                film.classList.remove('add-opacity')
                if (!(movie===film)){
                    film.classList.add('add-opacity');
                }
            }
            const movieId= movie.dataset.movieid;
            const response = classInstance.renderMovieDetails(movieId,list)
            if (document.querySelector('.selected-movie-overall-container')) document.querySelector('.selected-movie-overall-container').remove()

            const overallContainer = document.createElement('div')
            overallContainer.classList.add('selected-movie-overall-container')

            overallContainer.innerHTML=`<i class= "fa-solid fa-close close"></i>`

            overallContainer.append(response)
            
            document.body.append(overallContainer)
            closeSelectedMovie();
            classInstance.watch()
        })
        
    })
    
}



function closeSelectedMovie(){
    document.querySelector('.close').addEventListener('click',()=>{
        document.querySelector('.selected-movie-overall-container').remove();
        const movies = document.querySelectorAll('.favourite-movies');
        for (const film of movies){
            film.classList.remove('add-opacity');
        }
    });
}

