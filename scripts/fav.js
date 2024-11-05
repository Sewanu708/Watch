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

    async moviesFetch(){
        try{
            let favDetailArray=[];
            console.log(this.favList)
            for (let i=0;i<this.favList.length;i++){
                // console.log(this.favList[i])
                const movies = await fetch(`https://api.themoviedb.org/3/movie/${this.favList[i]}?language=en-US`, this.options);
                const movieJson = await movies.json();
                // console.log(movieJson)
                favDetailArray.push(movieJson);
             
            }
            return favDetailArray
        }catch (error){
          console.log(error)
        }
    
    }
    
   seriesCode(movie,seriesGenre){
    
    const movieGenres = movie.genre_ids.reduce((accumulator,currentValue)=>{
        let genre = seriesGenre.find(genre=>genre.id == currentValue)
        accumulator.push(genre.name)
        return accumulator
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
            const movies = document.querySelector('.favs');
            let moviesCode='';
            let counter=0;
            if (!this.genre) await this.loadGenre()
            if (!this.seriesGenre) await this.loadGenre()
            
            // for (const movie of this.favList){
                
            //     const movieGenres = movie.genre_ids.reduce((accumulator,currentValue)=>{
            //         let genre = this.genre.find(genre=>genre.id == currentValue)
            //         // if (!genre) {
            //         //      genre = this.seriesGenre.find(genre=>genre.id == currentValue);
            //         // }
            //         accumulator.push(genre.name)
            //         return accumulator
            //     },[]);
                
            //     const movieGenreName = movieGenres.join(' | ')

            //     console.log(movie)
            //      moviesCode+=`
                

            // <div class="favourite-movies" data-movieId=${movie.id}>
            //     <div class="favourite-movie">
            //         <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
            //     </div>
            //     <div class="fav-details">
            //         <div class="movie-title">${movie.title}</div>
            //         <div class="movie-description">
            //             <span>${this.getDate(movie.release_date)} |</span> <span> ${movieGenreName}</span> 
            //         </div>

            //     </div>

            //     <div class="favourite">
            //         <i class="fa-regular fa-heart js-fav"></i>
            //     </div>
            // </div>

            //      `;
            
            //      counter++
            // }
            for (const movie of this.favList){
                if (movie.media_type) {
                    moviesCode+=this.movieCode(movie,this.genre);
                }else{
                    moviesCode+=this.seriesCode(movie,this.seriesGenre);
                }
            }
            
            movies.innerHTML=moviesCode;
        }catch(error){
            console.log(error)
        }
    }
}



const favList = JSON.parse(localStorage.getItem('favourites'));
renderFavMovies(favList)
function likedMovie(){
    const movies = document.querySelectorAll('.favourite-movies');
    let favouriteMovies = localStorage.getItem('favourites')? JSON.parse(localStorage.getItem('favourites')) : [];
    // console.log(favouriteMovies)
    movies.forEach((movie)=>{
        const movieId=movie.dataset.movieid;
        // console.log(movieId)
        const likedMovie=movie.querySelector('.js-fav');
        // console.log(likedMovie)
        if (favouriteMovies.includes(movieId)){
            likedMovie.classList.add('fa-solid');
            likedMovie.classList.remove('fa-regular')
        }
            likedMovie.addEventListener('click',()=>{
                // console.log(likedMovie)
                likedMovie.classList.remove('fa-solid');
                likedMovie.classList.add('fa-regular');
                favouriteMovies=removeItem(favouriteMovies,movieId);
                // console.log(favouriteMovies)
                try{
                    renderFavMovies(favouriteMovies)
                }catch(error){
                    console.log(error)
                }
                localStorage.setItem('favourites',JSON.stringify(favouriteMovies));
                console.log(favouriteMovies);
            })
            })
}
        

function renderFavMovies(movieList){
    console.log(movieList)
    const load = new Favfetch(options,movieList);
    load.renderImage().then((response)=> likedMovie())
}

