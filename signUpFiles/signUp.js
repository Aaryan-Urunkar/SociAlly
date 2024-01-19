const userList = []

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
    userList.push(user);
    localStorage.setItem('userList',JSON.stringify(userList));
    window.location='./test.html';
    e.preventDefault();
})

