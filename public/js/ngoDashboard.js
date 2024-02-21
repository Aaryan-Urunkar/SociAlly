const user = (function () {
  const getUsername = () => '<%= user.displayName %>';

  const getLocation = () => '<%= user.location %>';

  return { getUsername, getLocation };
})();

const setInfo = () => {
  const greetingName = document.querySelector('.greeting-name');
  const location = document.querySelector('.location');

  const username = greetingName.textContent.trim();
  const locationInfo = location.textContent.trim();

  greetingName.textContent = `Good day, ${username}`;
  location.innerHTML = `<i class="fa-regular fa-envelope"></i> ${locationInfo}`;
};
setInfo();
const logoutBtn = document.querySelector('.logout-btn');
logoutBtn.addEventListener('click', () => {
  window.location.href = '/logout';
});

const events = (function () {
  const create = async () => {
    const panel = document.querySelector('.panel');
    const eventsPanel = document.createElement('div');
    eventsPanel.classList.add('events-panel');
    await addEvents(eventsPanel);
    newEventIcon(eventsPanel);
    panel.appendChild(eventsPanel);
  };

  const remove = () => {
    const panel = document.querySelector('.panel');
    const eventsPanel = document.querySelector('.events-panel');
    panel.remove(eventsPanel);
  };

  const addEvents = async (eventsPanel) => {
    let events = [];
    await fetch('/get-ngo-events', { method: 'GET' })
      .then((res) => res.json())
      .then((data) => data.map((event) => events.push(event)))
      .catch((err) => console.error(err));
    events.forEach((event) => {
      const card = document.createElement('div');
      const title = document.createElement('div');
      const info = document.createElement('div');
      const location = document.createElement('div');
      const date = document.createElement('div');
      const time = document.createElement('div');

      //adding classes
      card.classList.add('card');
      info.classList.add('info');
      title.classList.add('title');
      location.classList.add('location');
      date.classList.add('date');
      time.classList.add('time');

      //adding content
      title.textContent = event.title;
      location.innerHTML = `<i class="fa-solid fa-map-location-dot"> </i> ${event.location}`;
      date.innerHTML = `<i class="fa-solid fa-calendar-days"> </i> ${event.date}`;
      time.innerHTML = `<i class="fa-solid fa-clock"> </i> ${event.time}`;

      //appending content
      info.append(date, time, location);
      card.append(title, info);
      eventsPanel.appendChild(card);
    });
  };

  const newEventIcon = (eventsPanel) => {
    const newCard = document.createElement('div');
    const icon = document.createElement('div');

    //adding classes
    newCard.classList.add('new-card');
    icon.classList.add('icon');

    //+ icon
    newCard.addEventListener('click', () => {
      console.log('works');
    });
    icon.textContent = '+';

    //appending elements
    newCard.appendChild(icon);
    eventsPanel.appendChild(newCard);
  };

  return { create, remove };
})();

events.create();
