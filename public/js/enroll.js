window.onload = function () {
  let h2Text = localStorage.getItem('h2Text');
  let pText = localStorage.getItem('pText');
  let location = localStorage.getItem('targetLoc');
  let time = localStorage.getItem('targetTime');
  let date = localStorage.getItem('targetDate');
  if (h2Text && pText && location && time && date) {
    document.getElementById('targetH1').innerText = h2Text;
    document.getElementById('targetP').innerText = pText;
    document.getElementById('targetDate').innerText = date;
    document.getElementById('targetTime').innerText = time;
    document.getElementById('targetLoc').innerText = location;
  }
};

function Ngo(title, description, date, time, location) {
  this.title = title;
  this.description = description;
  this.date = date;
  this.time = time;
  this.location = location;
}

const applyButton = document.querySelector('.apply');
applyButton.addEventListener('click', async () => {
  const newNgo = new Ngo(
    localStorage.getItem('h2Text'),
    localStorage.getItem('targetP'),
    localStorage.getItem('targetDate'),
    localStorage.getItem('targetTime'),
    localStorage.getItem('targetLoc')
  );

  const data = JSON.stringify(newNgo);
  await fetch(`/add-user-ngo/${data}`, {
    method: 'PUT',
  })
    .then(() => {
      location.href = '/finalPage';
    })
    .catch((error) => console.error(error));
});
