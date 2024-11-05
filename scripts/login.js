const form = document.getElementById("form");
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const email = document.getElementById('email');
const eyes = document.querySelectorAll('.js-eye');
let anyError=false;
let re_anyError=false;


if (firstName===''|| firstName===null){
    // Login Page
    textVisiblity()
    form.addEventListener('submit',(event)=>{
        event.preventDefault()
        location.href='./index.html'
        sessionStorage.removeItem('previousSideBarLinkElement');
        sessionStorage.removeItem('previousNavSelected');
    })
}else{
    // SignUp Page
    password.addEventListener('input',()=>renderPasswordError(password.value)
    )
    confirmPassword.addEventListener('input',()=>renderConfirmPasswordError(confirmPassword.value))
    password.addEventListener('blur',()=>{
        password.parentElement.parentElement.classList.remove('correct');
    })
    confirmPassword.addEventListener('blur',()=>{
        confirmPassword.parentElement.parentElement.classList.remove('correct');
    })
    textVisiblity()
    form.addEventListener('submit',(event)=>{
        event.preventDefault()
        console.log(anyError)
        console.log(re_anyError)
        if ((!anyError) && (!re_anyError)){
            form.submit();
            sessionStorage.removeItem('previousSideBarLinkElement');
            sessionStorage.removeItem('previousNavSelected');
            location.href='./index.html'
        }
    })
}

function passwordChecker(password){
    const conditions = [
        {test:/[a-z]/,message:'Password must contain atleast one lowercase character'},
        {test:/[A-Z]/,message:'Password must contain atleast one uppercase character'},
        {test:/^(?=.*\d)/,message:'Password must contain atleast one Numeric character'},
        {test:/^(?=.*).{8,}$/,message:'Password must be atleast 8 character'}
    ];
    
    validPassword=conditions.find((condition)=>{
        return !condition.test.test(password)
    })
   
    return validPassword;
}
function renderPasswordError(value){
    const passwordError= passwordChecker(value);
    if (passwordError){
        password.parentElement.parentElement.classList.add('incorrect');
        document.querySelector('.password-error-message').textContent=passwordError.message;
        document.querySelector('.password-error-message').style.display='block';
        anyError=true;
     
    }else{
        password.parentElement.parentElement.classList.remove('incorrect');
        password.parentElement.parentElement.classList.add('correct');
        document.querySelector('.password-error-message').style.display='none'
        document.querySelector('.password-error-message').textContent='';
        anyError=false;
    }
}

function renderConfirmPasswordError(value){
    if(value===password.value){
        confirmPassword.parentElement.parentElement.classList.add('correct');
        confirmPassword.parentElement.parentElement.classList.remove('incorrect');
        document.querySelector('.re-password-error-message').style.display='none';
        re_anyError=false;
    }else{
        document.querySelector('.re-password-error-message').style.display='block';
        confirmPassword.parentElement.parentElement.classList.add('incorrect');
        confirmPassword.parentElement.parentElement.classList.remove('correct');
        re_anyError=true;
    }
}

function textVisiblity(){
    eyes.forEach(eye=>{
        
        eye.addEventListener('click',()=>{
            console.log('ll')
            eye.classList.toggle('fa-eye-slash');
            eye.classList.toggle('fa-eye');
            const parentContainer = eye.parentElement;
            const password=parentContainer.querySelector('input');
            if (eye.classList.contains('fa-eye-slash')){
                password.setAttribute('type','text')
            }else{
                password.setAttribute('type','password')
            }
        })
    })
    
}