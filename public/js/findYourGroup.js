const field = document.querySelector('.filter')
const inputFields = field.querySelectorAll('.dropdownList input')
const submitButton = document.querySelector('.submit')
const groups = document.querySelector('.groups')
const participants = document.querySelector('.participants')
const backButton = document.querySelectorAll('.back-btn')
const applyButton = document.querySelector('.apply');
const header = document.querySelector('h1');
submitButton.addEventListener('click', () => {
  var empty = true
  inputFields.forEach((inputField) => {
    if (inputField.value.trim() == '') {
      inputField.style.border = '1px solid red'
      inputField.placeholder = 'Invalid input'
      empty = true
    } else {
      empty = false
    }
    inputField.value = ''
  })
  if (!empty) {
    field.classList.add('hidden')
    groups.classList.remove('hidden')
  }
})

let group=0;

const groupItems = groups.querySelectorAll('.group-list-item')
groupItems.forEach((groupItem) => {
  groupItem.addEventListener('click', () => {
    group = getGroupInfo(groupItem);
    groups.classList.add('hidden')
    participants.classList.remove('hidden');
    header.textContent=group.name;
  })
})

const getGroupInfo = (groupItem) => {
  return {
    name:groupItem.children[1].textContent,
    members:groupItem.children[2].textContent,
  }
}
const back = () => {
  header.textContent="Find Your Group!"
  if (
    !groups.classList.contains('hidden') &&
    participants.classList.contains('hidden')
  ) {
    groups.classList.add('hidden')
    field.classList.remove('hidden')
  } else if (
    !participants.classList.contains('hidden') &&
    groups.classList.contains('hidden')
  ) {
    participants.classList.add('hidden')
    groups.classList.remove('hidden')
  }
}
backButton.forEach((backButton) => backButton.addEventListener('click', back))


applyButton.addEventListener('click', ()=>{
    applyButton.textContent="You've applied!";
    applyButton.classList.add('applied');
    const user = JSON.parse(localStorage.getItem('user'));
    user.groups.push(group);
    localStorage.setItem('user', JSON.stringify(user));
})