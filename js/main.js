/* Theme toggle with localStorage */
(function() {
  var storageKey = 'theme-preference';
  var getStored = function() {
    try { return localStorage.getItem(storageKey); } catch (e) { return null; }
  };
  var setStored = function(value) {
    try { localStorage.setItem(storageKey, value); } catch (e) {}
  };
  var current = getStored();
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = current || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  var btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.addEventListener('click', function() {
      var now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', now);
      setStored(now);
      var icon = btn.querySelector('.theme-icon');
      if (icon) icon.textContent = now === 'dark' ? '🌙' : '🌞';
    });
  }
})();
/* Mobile nav toggle */
(function() {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', function() {
    var expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });
  // Close menu when clicking a link (better mobile UX)
  menu.addEventListener('click', function(e) {
    var t = e.target;
    if (t && t.tagName === 'A') {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
/* Set current year */
(function() {
  var y = document.getElementById('year');
  if (y) { y.textContent = String(new Date().getFullYear()); }
})();
/* Simple intersection-based reveal animations */
(function() {
  if (!('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function(entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.setAttribute('data-animate', 'fade-up');
        observer.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.08 });
  var sections = document.querySelectorAll('.section');
  for (var j = 0; j < sections.length; j++) observer.observe(sections[j]);
})();

/* Scrollspy: highlight active nav link and add header shadow on scroll */
(function() {
  var header = document.querySelector('.site-header');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-menu a[href^="#"]'));
  var idToLink = {};
  for (var i = 0; i < links.length; i++) {
    var id = links[i].getAttribute('href').slice(1);
    idToLink[id] = links[i];
  }
  var onScroll = function() {
    if (header) {
      if (window.scrollY > 4) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var id = entry.target.id;
        var link = idToLink[id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function(l) { l.classList.remove('active'); l.removeAttribute('aria-current'); });
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    var targets = ['about','skills','experience','projects','contact'];
    targets.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }
})();

