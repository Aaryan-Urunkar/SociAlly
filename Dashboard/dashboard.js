const navbar = (function(){
    const create = () => {
        const options = Array.from(document.getElementsByClassName('option'));
        addSelectListener(options);
    }
   
    const addSelectListener = (options) => {
        options.forEach(option => {
            option.addEventListener('click', ()=>{
                panel.change(option.classList[0]);
                removeSelected();
                option.classList.add('selected');
            })
        });
    }
    
    const removeSelected = () => {
        const options = Array.from(document.getElementsByClassName('option'));
        options.forEach(option => {
            option.classList.remove('selected');
        });
    }

    return {create}
})();


const panel = (function(){
    const create = () => {
        const panel = document.createElement('div');
        panel.classList.add('panel');
        document.body.appendChild(panel)
    }
    const remove = () => {
        const panel = document.querySelector('.panel');
        panel.remove();
    }

    const clear = () => {
        remove();
        create();
    }

    const change = (panelName) => {
        clear();
        if(panelName=="stats") {
            stats.create();
            console.log("stats");
        }
        else if(panelName=="groups") {
            groups.create();
            console.log("groups");
        }
        else if(panelName=="ngo") {
            ngos.create();
            console.log("ngos");
        }
    }
    return {change}
})();

const stats = (function(){
    const create = () => {
        const panel = document.querySelector('.panel');
        const statsPanel = document.createElement('div');
        statsPanel.classList.add('stats-panel');
        level(statsPanel);
        contribution(statsPanel);
        skillBadges(statsPanel);
        socials(statsPanel);
        panel.appendChild(statsPanel);
    }
    const level = (statsPanel) => {
        const levelFrame = document.createElement('div');
        const levelCard = document.createElement('div');
        const levelIndicator = document.createElement('i');
        const levelText = document.createElement('div');
        const xpBar = document.createElement('hr');
        const xp = document.createElement('div')
        
        //adding classes
        levelFrame.classList.add('level-frame');
        levelCard.classList.add('level-card');
        levelIndicator.classList.add('level-indicator');
        levelIndicator.classList.add('fa-solid');
        levelIndicator.classList.add('fa-seedling');
        levelText.classList.add('level-text');
        xpBar.classList.add('xp-bar');
        xp.classList.add('xp');

        levelFrame.textContent="Your level"
        levelText.textContent="Newbie";
        xp.textContent="0/100 XP";
        
        levelCard.append(levelIndicator,levelText,xpBar,xp);
        levelFrame.appendChild(levelCard);
        statsPanel.append(levelFrame);
        //<i class="fa-solid fa-seedling"></i>
    }
    const contribution = (statsPanel) => {
        const contributionFrame = document.createElement('div');
        const contributionCard = document.createElement('div');

        //adding classes
        contributionFrame.classList.add('contribution-frame');
        contributionCard.classList.add('contribution-card');

        //text content
        contributionFrame.textContent="Recent contributions";
        contributionCard.textContent="Your contributions will show up here...";

        //append
        contributionFrame.appendChild(contributionCard);
        statsPanel.appendChild(contributionFrame);
    }
    const skillBadges = (statsPanel) => {
        const skillFrame = document.createElement('div');
        const skillCard = document.createElement('div');

        //adding classes
        skillFrame.classList.add('skill-frame');
        skillCard.classList.add('skill-card');

        //text content
        skillFrame.textContent="Your badges";
        skillCard.textContent="Your badges will show up here...";

        //append
        skillFrame.appendChild(skillCard);
        statsPanel.appendChild(skillFrame);
    }
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
        socialFrame.textContent="Your social connections";

        //append
        socialCard.append(socialInsta,socialTwitter,socialGitHub)
        socialFrame.appendChild(socialCard);
        statsPanel.appendChild(socialFrame);
    }

    const remove = () => {
        const panel = document.querySelector('.panel');
        const statsPanel = document.querySelector('.stats-panel');
        panel.remove(statsPanel);
    }
    return {create, remove}
})();


const groups = (function(){

    const create = () => {
        const panel = document.querySelector('.panel');
        const groupsPanel = document.createElement('div');
        groupsPanel.classList.add('groups-panel');
        //addGroups(groupsPanel);
        newGroupIcon(groupsPanel);
        panel.appendChild(groupsPanel);
    }

    const remove = () => {
        const panel = document.querySelector('.panel');
        const groupsPanel = document.querySelector('.groups-panel');
        panel.remove(groupsPanel);
    }

    const newGroupIcon = (groupsPanel) => {
        const newCard = document.createElement('div');
        const icon = document.createElement('div');

        //adding classes
        newCard.classList.add('new-card');
        icon.classList.add('icon');

        //+ icon
        //newCard.addEventListener('click', ()=>{window.open('../NGOsearchPage/nearbystuff.html')})
        icon.textContent="+";


        //appending elements
        newCard.appendChild(icon);
        groupsPanel.appendChild(newCard);
    }

    return {create,remove}
})();

const ngos = (function(){

    const create = () => {
        const panel = document.querySelector('.panel');
        const ngosPanel = document.createElement('div');
        ngosPanel.classList.add('ngos-panel');
        //addGroups(groupsPanel);
        newNgoIcon(ngosPanel);
        panel.appendChild(ngosPanel);
    }

    const remove = () => {
        const panel = document.querySelector('.panel');
        const ngosPanel = document.querySelector('.ngos-panel');
        panel.remove(ngosPanel);
    }

    const newNgoIcon = (ngosPanel) => {
        const newCard = document.createElement('div');
        const icon = document.createElement('div');

        //adding classes
        newCard.classList.add('new-card');
        icon.classList.add('icon');

        //+ icon
        newCard.addEventListener('click', ()=>{window.open('../NGOsearchPage/nearbystuff.html')})
        icon.textContent="+";


        //appending elements
        newCard.appendChild(icon);
        ngosPanel.appendChild(newCard);
    }

    return {create,remove}
})();


navbar.create();
stats.create();