

function User(username,password,location,ngos,groups) {
    this.username=username;
    this.password=password;
    this.location=location;
    this.ngos=ngos;
    this.groups=groups
}

const form=document.querySelector('.sign-up');

form.addEventListener('submit', (e)=>{
    const username=document.querySelector('.username-input');
    const password=document.querySelector('.password-input');
    const location=document.querySelector('.location-input');
    const user=new User(username.value,password.value,location.value,[],[]);
    localStorage.setItem('user',JSON.stringify(user));
    e.preventDefault();
    document.location.assign('/dashboard');

})

