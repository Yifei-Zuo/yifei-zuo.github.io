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
  });
})();
