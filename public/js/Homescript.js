const animatable = document.querySelectorAll('.animatable');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('animateLeftDisabled')) {
        entry.target.classList.add('animateLeft', 'show');
      } else {
        entry.target.classList.add('animateRight', 'show');
      }
    } else {
      if (entry.target.classList.contains('animateLeftDisabled')) {
        entry.target.classList.remove('animateLeft', 'show');
      } else {
        entry.target.classList.remove('animateRight', 'show');
      }
    }
  });
});
animatable.forEach((animatables) => {
  observer.observe(animatables);
});
