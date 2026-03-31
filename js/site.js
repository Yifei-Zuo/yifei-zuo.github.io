(function () {
  var site = {
    name: 'Yifei Zuo',
    email: 'yifeizuo2029@u.northwestern.edu',
    scholarUrl: 'https://scholar.google.com/citations?user=fWUxfTEAAAAJ&hl=en&oi=ao'
  };

  var navItems = [
    { href: '/', label: 'About', key: 'about' },
    { href: '/projects/', label: 'Projects', key: 'projects' },
    { href: site.scholarUrl, label: 'Scholar', key: 'scholar', external: true },
    { href: 'https://github.com/Yifei-Zuo', label: 'GitHub', key: 'github', external: true }
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderHeader(pageKey) {
    var links = navItems.map(function (item) {
      var classes = ['custom-link'];
      if (item.key === pageKey) {
        classes.push('is-active');
      }
      var attrs = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<a href="' + item.href + '" class="' + classes.join(' ') + '"' + attrs + '>' + item.label + '</a>';
    }).join(' ');

    return [
      '<div class="site-header">',
      '  <div class="site-header__brand">' + escapeHtml(site.name) + '</div>',
      '  <nav class="site-header__nav" aria-label="Primary">' + links + '</nav>',
      '</div>'
    ].join('');
  }

  function renderFooter() {
    return [
      '<hr/>',
      '© <span class="site-footer__email">[' + escapeHtml(site.email) + ']</span>'
    ].join('');
  }

  function appendSharedScripts() {
    if (document.querySelector('script[data-site-script="math-code"]')) {
      return;
    }

    [
      { src: '//yihui.org/js/math-code.js', key: 'math-code' },
      { src: '//mathjax.rstudio.com/latest/MathJax.js?config=TeX-MML-AM_CHTML', key: 'mathjax' },
      { src: '//yihui.org/js/center-img.js', key: 'center-img' }
    ].forEach(function (scriptInfo) {
      var script = document.createElement('script');
      script.defer = true;
      script.src = scriptInfo.src;
      script.dataset.siteScript = scriptInfo.key;
      document.body.appendChild(script);
    });
  }

  function bindInteractiveLinkStates() {
    var selector = '.custom-link, .northwestern-link, .arxiv-link';
    var highlight = document.createElement('span');
    var activeLink = null;
    var highlightedLink = null;
    var hideTimer = 0;
    var frameId = 0;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var state = {
      current: { x: 0, y: 0, width: 0, height: 0, r: 0, g: 0, b: 0, opacity: 0 },
      target: { x: 0, y: 0, width: 0, height: 0, r: 0, g: 0, b: 0, opacity: 0 },
      velocity: { x: 0, y: 0, width: 0, height: 0 }
    };

    function parseColor(value) {
      var trimmed = value ? value.trim() : '';

      if (!trimmed) {
        return { r: 0, g: 0, b: 0 };
      }

      if (trimmed.charAt(0) === '#') {
        var hex = trimmed.slice(1);

        if (hex.length === 3) {
          hex = hex.split('').map(function (part) {
            return part + part;
          }).join('');
        }

        if (hex.length === 6) {
          return {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16)
          };
        }
      }

      var match = value && value.match(/\d+/g);
      if (!match || match.length < 3) {
        return { r: 0, g: 0, b: 0 };
      }

      return {
        r: Number(match[0]),
        g: Number(match[1]),
        b: Number(match[2])
      };
    }

    function readTarget(link) {
      var rect = link.getBoundingClientRect();
      var styles = window.getComputedStyle(link);
      var color = parseColor(styles.getPropertyValue('--link-highlight') || styles.color);
      var horizontalInset = 5;
      var verticalInset = 2;

      return {
        x: rect.left - horizontalInset,
        y: rect.top - verticalInset,
        width: rect.width + horizontalInset * 2,
        height: rect.height + verticalInset * 2,
        r: color.r,
        g: color.g,
        b: color.b,
        opacity: 1
      };
    }

    function applyHighlightStyles() {
      highlight.style.transform = 'translate3d(' + state.current.x.toFixed(2) + 'px, ' + state.current.y.toFixed(2) + 'px, 0)';
      highlight.style.width = state.current.width.toFixed(2) + 'px';
      highlight.style.height = state.current.height.toFixed(2) + 'px';
      highlight.style.backgroundColor = 'rgb(' +
        Math.round(state.current.r) + ', ' +
        Math.round(state.current.g) + ', ' +
        Math.round(state.current.b) + ')';
      highlight.style.opacity = state.current.opacity.toFixed(3);
    }

    function syncToTarget() {
      state.current.x = state.target.x;
      state.current.y = state.target.y;
      state.current.width = state.target.width;
      state.current.height = state.target.height;
      state.current.r = state.target.r;
      state.current.g = state.target.g;
      state.current.b = state.target.b;
      state.current.opacity = state.target.opacity;
      state.velocity.x = 0;
      state.velocity.y = 0;
      state.velocity.width = 0;
      state.velocity.height = 0;
      applyHighlightStyles();
    }

    function animateHighlight() {
      var spring = 0.2;
      var damping = 0.72;
      var colorEase = 0.18;
      var opacityEase = 0.2;

      frameId = 0;

      ['x', 'y', 'width', 'height'].forEach(function (key) {
        var delta = state.target[key] - state.current[key];
        state.velocity[key] = (state.velocity[key] + delta * spring) * damping;
        state.current[key] += state.velocity[key];
      });

      ['r', 'g', 'b'].forEach(function (key) {
        state.current[key] += (state.target[key] - state.current[key]) * colorEase;
      });

      state.current.opacity += (state.target.opacity - state.current.opacity) * opacityEase;
      applyHighlightStyles();

      var hasMotion =
        Math.abs(state.target.x - state.current.x) > 0.2 ||
        Math.abs(state.target.y - state.current.y) > 0.2 ||
        Math.abs(state.target.width - state.current.width) > 0.2 ||
        Math.abs(state.target.height - state.current.height) > 0.2 ||
        Math.abs(state.target.r - state.current.r) > 0.5 ||
        Math.abs(state.target.g - state.current.g) > 0.5 ||
        Math.abs(state.target.b - state.current.b) > 0.5 ||
        Math.abs(state.target.opacity - state.current.opacity) > 0.02;

      if (hasMotion) {
        frameId = window.requestAnimationFrame(animateHighlight);
      }
    }

    function ensureAnimation() {
      if (prefersReducedMotion) {
        syncToTarget();
        return;
      }

      if (!frameId) {
        frameId = window.requestAnimationFrame(animateHighlight);
      }
    }

    function setHighlightTarget(link) {
      if (!link) {
        return;
      }

      window.clearTimeout(hideTimer);
      if (highlightedLink && highlightedLink !== link) {
        highlightedLink.classList.remove('is-highlighted');
      }

      highlightedLink = link;
      highlightedLink.classList.add('is-highlighted');
      activeLink = link;
      state.target = readTarget(link);
      highlight.classList.add('is-visible');
      ensureAnimation();
    }

    function clearHighlightTarget() {
      if (highlightedLink) {
        highlightedLink.classList.remove('is-highlighted');
        highlightedLink = null;
      }

      activeLink = null;
      state.target.opacity = 0;
      ensureAnimation();
    }

    function updateActiveLinkPosition() {
      if (!activeLink) {
        return;
      }

      state.target = readTarget(activeLink);
      ensureAnimation();
    }

    document.body.classList.add('has-link-highlight');
    highlight.className = 'link-highlight';
    document.body.appendChild(highlight);

    document.addEventListener('pointerover', function (event) {
      var link = event.target.closest(selector);
      if (!link) {
        return;
      }
      link.classList.add('is-hovered');
      setHighlightTarget(link);
    });

    document.addEventListener('pointerout', function (event) {
      var link = event.target.closest(selector);
      if (!link) {
        return;
      }

      var relatedTarget = event.relatedTarget;
      if (relatedTarget && link.contains(relatedTarget)) {
        return;
      }

      link.classList.remove('is-hovered');
      if (relatedTarget) {
        var nextLink = relatedTarget.closest && relatedTarget.closest(selector);
        if (nextLink) {
          return;
        }
      }

      hideTimer = window.setTimeout(clearHighlightTarget, 70);
    });

    document.addEventListener('focusin', function (event) {
      var link = event.target.closest(selector);
      if (!link) {
        return;
      }
      link.classList.add('is-hovered');
      setHighlightTarget(link);
    });

    document.addEventListener('focusout', function (event) {
      var link = event.target.closest(selector);
      if (!link) {
        return;
      }
      link.classList.remove('is-hovered');
      hideTimer = window.setTimeout(clearHighlightTarget, 70);
    });

    window.addEventListener('resize', updateActiveLinkPosition);
    window.addEventListener('scroll', updateActiveLinkPosition, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var pageKey = document.body.dataset.page || '';
    var header = document.getElementById('site-header');
    var footer = document.getElementById('site-footer');

    if (header) {
      header.innerHTML = renderHeader(pageKey);
    }

    if (footer) {
      footer.innerHTML = renderFooter();
    }

    appendSharedScripts();
    bindInteractiveLinkStates();
  });
})();
