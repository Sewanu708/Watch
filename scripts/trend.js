import {Loadfrombackend,likedMovie,displaySelectedMovie} from './loadHomePage.js'

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
                

            <div class="trending-movie trend" data-movieId=${movie.id}>
                <div class="trends movie-poster">
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
        return loadAndDisplay(load,response)
    }).then((response)=>{
             observers(response)
    }).catch((error)=>{
        console.log(error)
    })
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
function loadAndDisplay(classInstance,response){
    const moviesFetched=response[0]
        for (const movie of moviesFetched){
            if (!movie.adult===true){
                trendingMovies.push(movie)
            }
        }
        
        classInstance.renderImage(trendingMovies);
        console.log(`Successfully rendered ${trendingMovies.length} trending movies to DOM`);
        likedMovie('trending-movie',trendingMovies);
        displaySelectedMovie(trendingMovies,classInstance);
        defaultSelectedMovieRender(classInstance,trendingMovies)
        return response[1]
}

// function displaySelectedMovie(list,classInstance){
//     const movies = document.querySelectorAll('.trending-movie');
//     movies.forEach((movie)=>{
        
//         movie.addEventListener('click',()=>{
//             for (const film of movies){
//                 film.classList.remove('add-opacity')
//                 if (!(movie===film)){
//                     film.classList.add('add-opacity');
//                 }
//             }
//             const movieId= movie.dataset.movieid;
//             const response = classInstance.renderMovieDetails(movieId,list);
//             if (document.querySelector('.selected-movie')) document.querySelector('.selected-movie').remove()
//             document.body.append(response);
//             classInstance.watch();
//         })
//     })
// }

function defaultSelectedMovieRender(classInstance,list){
    const movie=document.querySelector('.trend:first-child');
    const movieId= movie.dataset.movieid;
    const response = classInstance.renderMovieDetails(movieId,list);
    document.body.append(response);
    load.watch();
}
// function loadNextPage(page_number,total_pages){
//     if (page_number>total_pages) return;
//     // console.log(page_number)
//     loadMovies(page_number)
// }

document.addEventListener('click',(event)=>{
    const movies = document.querySelectorAll('.trending-movie');
    if (!document.querySelector('.trends').contains(event.target)){
        for (const film of movies){
            film.classList.remove('add-opacity')
        }
    }
})

