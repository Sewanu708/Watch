
export class Loadfrombackend{
    trending=[];
    options;
    genre;
    seriesGenre;
    constructor(options){
        this.options=options;
        this.loadGenre()
    }

    async loadGenre(){
        this.genre = await this.fetchGenre();
        this.seriesGenre = await this.fetchSeriesGenre();
    };
    
    async fetchGenre(){
     
        try{
            const genres = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', this.options);
            // if (!genres.ok) throw new Error(genres.status)
            const genresJson = await genres.json();
            console.log(genresJson)
            const genreList = genresJson.genres;
            return genreList;
        }catch (error){
            console.log(error)
        }
      
    }
    async fetchSeriesGenre(){
        try{
            const genres = await fetch('https://api.themoviedb.org/3/genre/tv/list?language=en', this.options);
            if (!genres.ok) throw new Error(genres.status)
            const genresJson = await genres.json();
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
                    <img loading="lazy" src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
                </div>
                <div class="trend-details">
                    <div>${movie.title}</div>
                    <div>
                        <span>${this.getDate(movie.release_date)} |</span> <span> ${movieGenreName}</span> 
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
    async moviesFetch(pageNumber){
        let pages;
        try{
            this.trending=this.trending?[]:this.trending
            const movies = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${pageNumber}`, this.options);
            const moviesJson = await movies.json();
            pages=moviesJson.total_pages;
            this.trending.push(moviesJson.results);
        }catch (error){
            console.log(error);
        }
        console.log(`Successfully loaded ${this.trending.flat().length}---${pageNumber} trending movies from backend`)
      
        return [this.trending.flat(),pages]
    };
    searchGenre(genres, genreId){
        for (const genre of genres){
            if(genre.id===genreId){
                return genre
            }
        }
    }
    concatGenres(genreList){
        let genres=''; 
        
        genreList.forEach((genre)=>{
          
            genres+=`${genre.name} `
        })
    
        return genres;
    }
    getDate(fullDate){
        const date = new Date(fullDate)
        return date.getFullYear()
    } 
    displayBackdrop(movie){
        let backdropDisplayed=0;
        if (backdropDisplayed===1) return;
        document.querySelector('.main-page').style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;
        let movieGenres=[];
        for (const genreId of movie.genre_ids){
            movieGenres.push(this.searchGenre(this.genre,genreId));
        }
        document.querySelector('.js-description').innerHTML=`
        <span>${this.getDate(movie.release_date)} |</span> <span> ${this.concatGenres(movieGenres)} | </span>
        `
        document.querySelector('.js-title').innerHTML=`${movie.title}`
        document.querySelector('.js-description').dataset.movieId = `${movie.id}`
        backdropDisplayed=1;
    }
    movieDetails(movieId,movieList){
        try{
            const movie = movieList.find(element=> element.id == (movieId));
            
            // console.log(movieId)
            // console.log(movie)
            // const moviePromise = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,this.options);
            
            return movie
        }
        catch(error){
            return error
        }
    }

     renderMovieDetails(movieId,list){
       try{
        const details = this.movieDetails(movieId,list);
        console.log(this.seriesGenre)
        console.log(this.genre)
        const movieGenres = details.genre_ids.reduce((accumulator,currentValue)=>{
            const genre = this.genre.find(genre=>genre.id === currentValue)
            accumulator.push(genre.name)
            return accumulator
        },[])      
        const movieGenreName = movieGenres.join(' | ')
        
        const selectedMovieContainer = document.createElement("div");
        // closeIcon.classList.add('fa-solid');
        // closeIcon.classList.add('fa-close');
        selectedMovieContainer.classList.add('selected-movie');
       
        selectedMovieContainer.innerHTML=`
      
                <div class="selected-image">
                <img loading="lazy" src="https://image.tmdb.org/t/p/original${details.poster_path}" alt="${details.title}">
                
            </div>
            <div class="selected-movie-description">
                <div class="selected-movie-title-rating">
                    <div class="selected-movie-title">
                    ${details.original_title}
                    </div>
    
                    <div class="selected-movie-rating">
                        <i class="fa-solid fa-star"></i>
                        <p>${(details.vote_average).toFixed(1)}/10</p>
                    </div>
                </div>
                <div class="year-genre">
                    <div class="year">${this.getDate(details.release_date)}<span class="genre">
                        ${movieGenreName}
                      
                    </span></div>
                   
                </div>
                <div class="overview">
                    ${details.overview}
                </div>
                <div class="action">
                    <button class="watch-now">
                        Watch now
                    </button>
    
                    <button class="fav" >
                        <i class="fa-regular fa-heart js-favourite"></i>
                    </button>
                </div>
            </div>
      
        `
        
        return selectedMovieContainer
       }catch(error){
        console.log(error)
       }
    }
}
export function saveFavMovies(arr,value){
    const found = arr.findIndex((movie)=>{
        return movie===value
    });

    if (found<0){
        arr.push(value);
    }

    return arr
}

export function removeItem(arr,value){
    const index = arr.findIndex(element=>  {return element===value});
    arr.splice(index,1);
    return arr
}
export function likedMovie(container,movieList){
    
    const movies = document.querySelectorAll(`.${container}`);
    let favouriteMovies = JSON.parse(localStorage.getItem('favourites'))? JSON.parse(localStorage.getItem('favourites')) : [];
    favouriteMovies=favouriteMovies;
    movies.forEach((movie)=>{
        const movieId=movie.dataset.movieid;
        const movieDetailObject=movieList.find(movie=> movie.id == movieId)

        const likedMovie=movie.querySelector('.js-fav');
        if (favouriteMovies.includes(movieId)){
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

            // console.log(favouriteMovies)
            localStorage.setItem('favourites',JSON.stringify(favouriteMovies))
            // console.log(localStorage.getItem('favourites'))
            })
    })
        
    

}
// const options = {
//     method: 'GET',
//     headers: {
//       accept: 'application/json',
//       Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMzNlOWI4MWEyMWU4NDhkNTE4NGQ0ZjQ2ZTk3YTNkNSIsIm5iZiI6MTcyODkwMzcyMS4zOTMzNjIsInN1YiI6IjY3MGNmODU5MWNhNGMzOWZkZWViOTU5NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DTE2v4paAARib0Ft-AlsMLANEuLczVu-92mCi3pFiTM'
//     }
// }
// async function seriesGenre(){
//     try{
//         const genres = await fetch('https://api.themoviedb.org/3/genre/tv/list?language=en', options);
//         const genresJson = await genres.json();
//         const genreList = genresJson.genres;
//         return genreList;
//     }catch (error){
//         console.log(error)
//     }
  
// }
// console.log(seriesGenre())
// async function moviesFetch(){
//     let allMoviesTrue=true
//     let allMovies=1;
//     for (let i=0;i<allMovies;i++){
    
//         try{
            
//             const movies = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${i+1}`, this.options)
        
//             const moviesJson = await movies.json()
//             // return (moviesJson)
//                 if(allMoviesTrue){
//                     allMoviesTrue=false
//                     allMovies=moviesJson.total_pages;
//                     allMovies = Math.min(allMovies,20)
                    
//                 }
            
//                 this.trending.push(moviesJson.results);
//         }catch (error){
//             console.log(error)
//         }
        
//     }
//     console.log(`Successfully loaded ${this.trending.flat().length} trending movies from backend`)
//     return this.trending.flat(),allMovies
    
// };

// get the pages
// observe the first page last element
// reload on getting to the last element