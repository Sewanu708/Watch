
const sideBar = document.querySelector('.side-bar');
const hamburger = document.querySelector('.hamburger');
const closeBar = document.querySelector('.close-bar');
const navRightSide = document.querySelector('.right-side');
const sideBarLinks = document.querySelectorAll('.home-logo');
hamburger.addEventListener('click',()=>{
    
    hamburger.classList.toggle('fa-close');
    if (sideBar.classList.contains('active')) {
        sideBar.classList.remove('active');
        sideBar.style.animation = 'closebar 0.5s ease-out forwards';
        navRightSide.style.display='none';
    }else{
        sideBar.classList.add('active');
        sideBar.style.animation = 'sidebar 0.5s ease-out forwards';
    }
})

document.addEventListener('click',(event)=>{
    if(sideBar.classList.contains('active') && !(sideBar.contains(event.target)) && !(event.target===hamburger)) {
        hamburger.classList.toggle('fa-close');
        sideBar.classList.remove('active');
        sideBar.style.animation = 'closebar 0.5s ease-out forwards';
    }
})

const searchContainer = document.querySelector('.js-search-area');
const searchIcon = document.querySelector('.js-mag');
const searchDiv = document.querySelector('.js-mag-glass');

searchDiv.addEventListener('click',()=>{
        searchIcon.classList.toggle('fa-close');
        // searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')){
            searchContainer.style.animation='searchShrink 0.5s ease-out forwards';
            
            setTimeout(()=>{
                searchContainer.style.display='none'; 

            },400)
            searchContainer.classList.remove('active');
            
            
        }else{
            searchContainer.classList.add('active');
            searchContainer.style.display='flex'; 
            searchContainer.style.animation='searchExpand 0.5s ease-out forwards';
            setTimeout(()=>{
                searchContainer.querySelector('input').focus(); 

            },500)
            
        }
        // searchContainer.style.animation='search 0.5s ease-out forwards'
            
})




const navRightSideChildren= navRightSide.children;
let previousElement = sessionStorage.getItem('previousNavSelected') 
    ? sessionStorage.getItem('previousNavSelected')
    : '';


if (previousElement){
    document.getElementById(previousElement).classList.add('click')
}


for ( const element of navRightSideChildren){
    element.addEventListener('click',(event)=>{
        if (previousElement){
            document.getElementById(previousElement).classList.remove('click')
        }
        element.classList.toggle('click');
        previousElement=element.id;
        sessionStorage.setItem('previousNavSelected',element.id)
        
    })
}




let previousSideBarLinkElement  = sessionStorage.getItem('previousSideBarLinkElement')?sessionStorage.getItem('previousSideBarLinkElement'): '';
if (previousSideBarLinkElement){
    document.getElementById(previousSideBarLinkElement).classList.add('click')
}

sideBarLinks.forEach((element)=>{
    element.addEventListener('click',(event)=>{
        // event.preventDefault()
        if (previousSideBarLinkElement){
            document.getElementById(previousSideBarLinkElement).classList.remove('click')
        }
        
        element.classList.toggle('click');
        previousSideBarLinkElement=element.id;
        sessionStorage.setItem('previousSideBarLinkElement',element.id);
        
    })
})


let theme = localStorage.getItem('darkmode');


const loadLightMode = ()=>{
    document.body.classList.add('light-mode');
    localStorage.setItem('darkmode','active');
}

const loadDarkMode = ()=>{
    document.body.classList.remove('light-mode');
    localStorage.setItem('darkmode',null);
}

const themeButton = document.querySelector('.theme-mode');
themeButton.addEventListener('click',()=>{
    
     theme = localStorage.getItem('darkmode');
     console.log(theme)
     theme==='active'?loadDarkMode():loadLightMode();
    
})

if (theme==='active'){
    loadLightMode();
}else{
    loadDarkMode();
}