

function User(username,password,location) {
    this.username=username;
    this.password=password;
    this.location=location;
}

const form=document.querySelector('.sign-up');

form.addEventListener('submit', (e)=>{
    const username=document.querySelector('.username-input');
    const password=document.querySelector('.password-input');
    const location=document.querySelector('.location-input');
    const user=new User(username.value,password.value,location.value);
    localStorage.setItem('user',JSON.stringify(user));
    console.log(JSON.parse(localStorage.getItem('user')));
    e.preventDefault();
    document.location.assign('../Dashboard/dashboard.html');

})

