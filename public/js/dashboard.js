const user = (function () {
  const getUsername = () => '<%= user.displayName %>';

  const getLocation = () => '<%= user.location %>';

  return { getUsername, getLocation };
})();

const setInfo = () => {
  const greetingName = document.querySelector('.greeting-name');
  const location = document.querySelector('.location');
  const pfp = document.querySelector('.pfp img');

  const username = greetingName.textContent.trim();
  const locationInfo = location.textContent.trim();
  const pictureUrl = pfp.getAttribute('src');

  greetingName.textContent = `Good day, ${username}`;


  location.innerHTML = `<i class="fa-regular fa-envelope"></i> ${locationInfo}`;


  pfp.setAttribute('src', pictureUrl);
};

const navbar = (function () {
  const create = () => {
    const options = Array.from(document.getElementsByClassName('option'));
    addSelectListener(options);
  };

  const addSelectListener = (options) => {
    options.forEach((option) => {
      option.addEventListener('click', () => {
        panel.change(option.classList[0]);
        removeSelected();
        option.classList.add('selected');
      });
    });
  };

  const removeSelected = () => {
    const options = Array.from(document.getElementsByClassName('option'));
    options.forEach((option) => {
      option.classList.remove('selected');
    });
  };

  return { create };
})();
const logoutBtn = document.querySelector('.logout-btn');
logoutBtn.addEventListener('click', () => {
  window.location.href = '/logout';
});

const panel = (function () {
  const create = () => {
    const panel = document.createElement('div');
    panel.classList.add('panel');
    document.body.appendChild(panel);
  };
  const remove = () => {
    const panel = document.querySelector('.panel');
    panel.remove();
  };

  const clear = () => {
    remove();
    create();
  };

  const change = (panelName) => {
    clear();
    if (panelName == 'stats') {
      stats.create();
    } else if (panelName == 'groups') {
      groups.create();
    } else if (panelName == 'ngo') {
      ngos.create();
    }
  };
  return { change };
})();

const stats = (function () {
  const create = () => {
    const panel = document.querySelector('.panel');
    const statsPanel = document.createElement('div');
    statsPanel.classList.add('stats-panel');
    level(statsPanel);
    contribution(statsPanel);
    skillBadges(statsPanel);
    socials(statsPanel);
    panel.appendChild(statsPanel);
  };
  const level = (statsPanel) => {
    const levelFrame = document.createElement('div');
    const levelCard = document.createElement('div');
    const levelIndicator = document.createElement('i');
    const levelText = document.createElement('div');
    const xpBar = document.createElement('hr');
    const xp = document.createElement('div');

    //adding classes
    levelFrame.classList.add('level-frame');
    levelCard.classList.add('level-card');
    levelIndicator.classList.add('level-indicator');
    levelIndicator.classList.add('fa-solid');
    levelIndicator.classList.add('fa-seedling');
    levelText.classList.add('level-text');
    xpBar.classList.add('xp-bar');
    xp.classList.add('xp');

    levelFrame.textContent = 'Your level';
    levelText.textContent = 'Newbie';
    xp.textContent = '0/100 XP';

    levelCard.append(levelIndicator, levelText, xpBar, xp);
    levelFrame.appendChild(levelCard);
    statsPanel.append(levelFrame);
  };
  const contribution = (statsPanel) => {
    const contributionFrame = document.createElement('div');
    const contributionCard = document.createElement('div');

    //adding classes
    contributionFrame.classList.add('contribution-frame');
    contributionCard.classList.add('contribution-card');

    //text content
    contributionFrame.textContent = 'Recent contributions';
    contributionCard.textContent = 'Your contributions will show up here...';

    //append
    contributionFrame.appendChild(contributionCard);
    statsPanel.appendChild(contributionFrame);
  };
  const skillBadges = (statsPanel) => {
    const skillFrame = document.createElement('div');
    const skillCard = document.createElement('div');

    //adding classes
    skillFrame.classList.add('skill-frame');
    skillCard.classList.add('skill-card');

    //text content
    skillFrame.textContent = 'Your badges';
    skillCard.textContent = 'Your badges will show up here...';

    //append
    skillFrame.appendChild(skillCard);
    statsPanel.appendChild(skillFrame);
  };
  const socials = (statsPanel) => {
    const socialFrame = document.createElement('div');
    const socialCard = document.createElement('div');
    const socialInsta = document.createElement('i');
    const socialTwitter = document.createElement('i');
    const socialGitHub = document.createElement('i');

    //adding classes
    socialFrame.classList.add('social-frame');
    socialCard.classList.add('social-card');
    socialInsta.classList.add('fa-brands');
    socialTwitter.classList.add('fa-brands');
    socialGitHub.classList.add('fa-brands');

    socialInsta.classList.add('fa-instagram');
    socialTwitter.classList.add('fa-twitter');
    socialGitHub.classList.add('fa-github');

    //text content
    socialFrame.textContent = 'Your social connections';

    //append
    socialCard.append(socialInsta, socialTwitter, socialGitHub);
    socialFrame.appendChild(socialCard);
    statsPanel.appendChild(socialFrame);
  };

  const remove = () => {
    const panel = document.querySelector('.panel');
    const statsPanel = document.querySelector('.stats-panel');
    panel.remove(statsPanel);
  };
  return { create, remove };
})();

const groups = (function () {
  const create = async () => {
    const panel = document.querySelector('.panel');
    const groupsPanel = document.createElement('div');
    groupsPanel.classList.add('groups-panel');
    await addGroups(groupsPanel);
    newGroupIcon(groupsPanel);
    panel.appendChild(groupsPanel);
  };

  const remove = () => {
    const panel = document.querySelector('.panel');
    const groupsPanel = document.querySelector('.groups-panel');
    panel.remove(groupsPanel);
  };

  const addGroups = async (groupsPanel) => {
    let groups = [];
    await fetch('/get-user-groups', { method: 'GET' })
      .then((res) => res.json())
      .then((data) => data.map((group) => groups.push(group)))
      .catch((err) => console.error(err));
    groups.forEach((group) => {
      const card = document.createElement('div');
      const title = document.createElement('div');
      const info = document.createElement('div');
      const members = document.createElement('div');
      const notifications = document.createElement('div');
      const openChat = document.createElement('div');

      //adding classes
      card.classList.add('card');
      info.classList.add('info');
      title.classList.add('title');
      members.classList.add('members');
      notifications.classList.add('notifications');
      openChat.classList.add('open-chat');

      //adding content
      title.textContent = group.name;
      members.innerHTML = `<i class="fa-solid fa-users"> </i> ${group.members}`;
      notifications.innerHTML = `<i class="fa-solid fa-bell"> </i> No new notifications`;
      openChat.innerHTML = `<i class="fa-solid fa-message"> </i>`;

      //appending content
      info.append(notifications, members, openChat);
      card.append(title, info);
      groupsPanel.appendChild(card);
    });
  };

  const newGroupIcon = (groupsPanel) => {
    const newCard = document.createElement('div');
    const icon = document.createElement('div');

    //adding classes
    newCard.classList.add('new-card');
    icon.classList.add('icon');

    //+ icon
    newCard.addEventListener('click', () => {
      document.location.assign('/findyourgroup');
    });
    icon.textContent = '+';

    //appending elements
    newCard.appendChild(icon);
    groupsPanel.appendChild(newCard);
  };

  return { create, remove };
})();

const ngos = (function () {
  const create = async () => {
    const panel = document.querySelector('.panel');
    const ngosPanel = document.createElement('div');
    ngosPanel.classList.add('ngos-panel');
    await addNgos(ngosPanel);
    newNgoIcon(ngosPanel);
    panel.appendChild(ngosPanel);
  };

  const remove = () => {
    const panel = document.querySelector('.panel');
    const ngosPanel = document.querySelector('.ngos-panel');
    panel.remove(ngosPanel);
  };

  const addNgos = async (ngosPanel) => {
    let ngos = [];
    await fetch('/get-user-ngos', { method: 'GET' })
      .then((res) => res.json())
      .then((data) => data.map((ngo) => ngos.push(ngo)))
      .catch((err) => console.error(err));
    ngos.forEach((ngo) => {
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
      title.textContent = ngo.title;
      location.innerHTML = `<i class="fa-solid fa-map-location-dot"> </i> ${ngo.location}`;
      date.innerHTML = `<i class="fa-solid fa-calendar-days"> </i> ${ngo.date}`;
      time.innerHTML = `<i class="fa-solid fa-clock"> </i> ${ngo.time}`;

      //appending content
      info.append(date, time, location);
      card.append(title, info);
      ngosPanel.appendChild(card);
    });
  };

  const newNgoIcon = (ngosPanel) => {
    const newCard = document.createElement('div');
    const icon = document.createElement('div');

    //adding classes
    newCard.classList.add('new-card');
    icon.classList.add('icon');

    //+ icon
    newCard.addEventListener('click', () => {
      document.location.assign('/nearbyactivity');
    });
    icon.textContent = '+';

    //appending elements
    newCard.appendChild(icon);
    ngosPanel.appendChild(newCard);
  };

  return { create, remove };
})();

setInfo();
navbar.create();
stats.create();
