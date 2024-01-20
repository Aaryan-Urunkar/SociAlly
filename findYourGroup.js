const field = document.querySelector('.filter')
const inputFields = field.querySelectorAll('.dropdownList input')
const submitButton = document.querySelector('.submit')
const groups = document.querySelector('.groups')
const participants = document.querySelector('.participants')
const backButton = document.querySelectorAll('.back-btn')
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
const groupItems = groups.querySelectorAll('.group-list-item')
groupItems.forEach((groupItems) => {
  groupItems.addEventListener('click', () => {
    groups.classList.add('hidden')
    participants.classList.remove('hidden')
  })
})
const back = () => {
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
    console.log('testing')
    participants.classList.add('hidden')
    groups.classList.remove('hidden')
  }
}
backButton.forEach((backButton) => backButton.addEventListener('click', back))
