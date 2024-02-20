const field = document.querySelector('.filter');
const inputFields = field.querySelectorAll('.dropdownList input');
const submitButton = document.querySelector('.submit');
const groups = document.querySelector('.groups');
const participants = document.querySelector('.participants');
const backButton = document.querySelectorAll('.back-btn');
const applyButton = document.querySelector('.apply');
const header = document.querySelector('h1');
submitButton.addEventListener('click', () => {
  var empty = true;
  inputFields.forEach((inputField) => {
    if (inputField.value.trim() == '') {
      inputField.style.border = '1px solid red';
      inputField.placeholder = 'Invalid input';
      empty = true;
    } else {
      empty = false;
    }
    inputField.value = '';
  });
  if (!empty) {
    field.classList.add('hidden');
    groups.classList.remove('hidden');
  }
});

let group = 0;

const groupItems = groups.querySelectorAll('.group-list-item');
groupItems.forEach((groupItem) => {
  groupItem.addEventListener('click', () => {
    group = getGroupInfo(groupItem);
    groups.classList.add('hidden');
    participants.classList.remove('hidden');
    header.textContent = group.name;
  });
});

const getGroupInfo = (groupItem) => {
  return {
    name: groupItem.children[1].textContent,
    members: parseInt(groupItem.children[2].textContent.slice(8, 11)),
    id: 0,
  };
};
const back = () => {
  header.textContent = 'Find Your Group!';
  if (
    !groups.classList.contains('hidden') &&
    participants.classList.contains('hidden')
  ) {
    groups.classList.add('hidden');
    field.classList.remove('hidden');
  } else if (
    !participants.classList.contains('hidden') &&
    groups.classList.contains('hidden')
  ) {
    participants.classList.add('hidden');
    groups.classList.remove('hidden');
  }
};
backButton.forEach((backButton) => backButton.addEventListener('click', back));

applyButton.addEventListener('click', async () => {
  applyButton.textContent = "You've applied!";
  applyButton.classList.add('applied');
  const data = JSON.stringify(group);
  console.log(data);
  await fetch(`/add-user-group/${data}`, {
    method: 'PUT',
  }).catch((error) => console.error(error));
});
