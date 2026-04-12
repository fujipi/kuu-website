// Twinkling stars
(function () {
  var count = 120;
  for (var i = 0; i < count; i++) {
    var star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.setProperty('--duration', (2 + Math.random() * 4) + 's');
    star.style.setProperty('--delay', (Math.random() * 5) + 's');
    document.body.appendChild(star);
  }
})();

// Intersection Observer for fade-in
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });

  // Staggered items
  var staggerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var items = entry.target.querySelectorAll('.fade-in-item');
        items.forEach(function (item, index) {
          setTimeout(function () {
            item.classList.add('visible');
          }, index * 150);
        });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-stagger').forEach(function (el) {
    staggerObserver.observe(el);
  });
})();

// Mobile menu toggle
function toggleMenu() {
  var nav = document.getElementById('nav');
  var btn = document.querySelector('.menu-toggle');
  nav.classList.toggle('active');
  var expanded = nav.classList.contains('active');
  btn.setAttribute('aria-expanded', expanded);
  btn.setAttribute('aria-label', expanded ? 'メニューを閉じる' : 'メニューを開く');
}
