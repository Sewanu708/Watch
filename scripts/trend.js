import {Loadfrombackend,likedMovie} from './loadHomePage.js'

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMzNlOWI4MWEyMWU4NDhkNTE4NGQ0ZjQ2ZTk3YTNkNSIsIm5iZiI6MTcyODkwMzcyMS4zOTMzNjIsInN1YiI6IjY3MGNmODU5MWNhNGMzOWZkZWViOTU5NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DTE2v4paAARib0Ft-AlsMLANEuLczVu-92mCi3pFiTM'
    }
}
class Trend extends Loadfrombackend{
    async moviesFetch(pageNumber){
        let pages;
        try{
            this.trending=this.trending?[]:this.trending;
            const movies = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${pageNumber}`, this.options);
            const moviesJson = await movies.json();
            pages=moviesJson.total_pages;
            this.trending.push(moviesJson.results);
        }catch (error){
            console.log(error)
        }
        console.log(`Successfully loaded ${this.trending.flat().length} trending movies from backend`)
        return [this.trending.flat(),pages];
        
    };

    renderImage(movieList) {
        try{
            
            const movies = document.querySelector('.trending-movies');
            let moviesCode='';
            let counter=0;
            
            for (const movie of movieList){
                let movieGenres=[];
                for (const genreId of movie.genre_ids){
                    movieGenres.push(this.searchGenre(this.genre,genreId));
                }
                
            const movieGenreName=this.concatGenres(movieGenres)
            
            moviesCode+=`
                

            <div class="trending-movie" data-movieId=${movie.id}>
                <div class="trends">
                    <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}">
                </div>
                <div class="trend-details">
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
            
            counter++
            }
            movies.innerHTML=moviesCode;
        }catch(error){
            console.log(error)
        }
    
    }
}

const load = new Trend(options);
let trendingMovies=[];
let currentPage = 1;

loadMovies(currentPage);

function loadMovies(currentPage){
    load.moviesFetch(currentPage).then((response)=>{
        const moviesFetched=response[0]
        for (const movie of moviesFetched){
            if (!movie.adult===true){
                trendingMovies.push(movie)
                console.log(movie)
            }
       
        }
        
        load.renderImage(trendingMovies);
        console.log(`Successfully rendered ${trendingMovies.length} trending movies to DOM`);
        likedMovie('trending-movie',trendingMovies);
        displaySelectedMovie(trendingMovies,load);
        return response[1]
    }).then((response)=>{
        const lastMovieObserver = new IntersectionObserver((entries=>{
            const lastElementObserver = entries[0];
            if (!lastElementObserver.isIntersecting) return;
            currentPage++;
            loadNextPage(currentPage,response);
            lastElementObserver.unobserve(lastElementObserver.target)
            lastMovieObserver.observe(document.querySelector('.trending-movie:last-child'));
        }),{rootMargin:'-100px'})
        lastMovieObserver.observe(document.querySelector('.trending-movie:last-child'));
    })
}


function displaySelectedMovie(list,load){
    const movies = document.querySelectorAll('.trending-movie');
    movies.forEach((movie)=>{
        movie.addEventListener('click',()=>{
            const movieId= movie.dataset.movieid;
            const response = load.renderMovieDetails(movieId,list)
            const code = createSelectedMovieContainer(response);
            document.body.append(code);
            load.watch();
            closeSelectedMovieBar();
        })
    })
}

function createSelectedMovieContainer(code){
    const selectedMovie = document.createElement('section');selectedMovie.classList.add('selected-movie-overall-container');
    const close = document.createElement('i');
    close.classList.add('fa-solid', 'fa-close','close')
    selectedMovie.appendChild(close)
    selectedMovie.append(code)
    return selectedMovie
}

function closeSelectedMovieBar(){
    const closeIcon = document.querySelector('.close');
    closeIcon.addEventListener('click',()=>{
        document.body.querySelector('.selected-movie-overall-container').remove()
    })
}
function loadNextPage(page_number,total_pages){
    if (page_number>total_pages) return;
    // console.log(page_number)
    loadMovies(page_number)
}
