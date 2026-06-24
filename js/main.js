document.addEventListener('DOMContentLoaded', () => {

  // Fade-in animations
  const targets = document.querySelectorAll(
    '.stack-card, .icon-timeline-step, .canal-step, .comp-step, .mes-step, .honestidade-step, ' +
    '.depoimento-card, .depoimento-destaque, .caixa-destaque, .garantia-box, ' +
    '.faq-item, .comparativo-col, .preco-box, .sobre-body p, .canal-texto p, ' +
    '.conector, .destaque-lateral, .lista-fragmentada, .sobre-fechamento, .ancora-destaque, ' +
    '.para-quem-col, .trust-badges, .social-proof, .vagas-counter, .oferta-sticky-bar'
  );

  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));

  // Animação sequencial dos 12 círculos
  const circulos = document.querySelectorAll('.circulo');
  let circulosAnimated = false;

  const circuloObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !circulosAnimated) {
        circulosAnimated = true;
        circulos.forEach((c, i) => {
          setTimeout(() => {
            c.classList.add('aceso');
          }, i * 150);
        });
        circuloObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const circulosGrid = document.querySelector('.circulos-grid');
  if (circulosGrid) {
    circuloObserver.observe(circulosGrid);
  }

  // Scroll tracking (25%, 50%, 75%, 90%)
  const scrollThresholds = [25, 50, 75, 90];
  const firedThresholds = new Set();

  function getScrollPercent() {
    const h = document.documentElement;
    const b = document.body;
    const scrollTop = h.scrollTop || b.scrollTop;
    const scrollHeight = (h.scrollHeight || b.scrollHeight) - h.clientHeight;
    return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
  }

  const ctaFixo = document.getElementById('ctaFixo');
  const parallaxFoto = document.querySelector('.parallax-foto');

  // Track CTA clicks
  document.querySelectorAll('[data-track]').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.getAttribute('data-track');
      if (typeof gtag === 'function') {
        gtag('event', 'cta_click', { cta_label: label });
      }
    });
  });

  // Unified scroll handler (performance: single listener instead of multiple)
  const progressBar = document.getElementById('progressBar');
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const pct = getScrollPercent();

        // Progress bar
        if (progressBar) progressBar.style.width = pct + '%';

        // CTA fixo mobile
        if (ctaFixo) {
          if (pct >= 25 && !ctaFixo.classList.contains('visible')) {
            ctaFixo.classList.add('visible');
          } else if (pct < 25 && ctaFixo.classList.contains('visible')) {
            ctaFixo.classList.remove('visible');
          }
        }

        // Scroll tracking
        scrollThresholds.forEach(threshold => {
          if (pct >= threshold && !firedThresholds.has(threshold)) {
            firedThresholds.add(threshold);
            if (typeof gtag === 'function') {
              gtag('event', 'scroll_depth', { percent_scrolled: threshold });
            }
            if (typeof fbq === 'function' && threshold === 90) {
              fbq('track', 'ViewContent');
            }
          }
        });

        // Parallax
        if (parallaxFoto) {
          const rect = parallaxFoto.getBoundingClientRect();
          parallaxFoto.style.transform = 'translateY(' + -(rect.top * 0.15) + 'px)';
        }

        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Count-up animation
  const countEls = document.querySelectorAll('.count-up');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 20);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current;
        }, 80);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  countEls.forEach(el => countObserver.observe(el));

  // Sticky offer bar visibility
  const ofertaSection = document.getElementById('oferta');
  const stickyBar = document.getElementById('ofertaStickyBar');
  if (ofertaSection && stickyBar) {
    const stickyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        stickyBar.classList.toggle('visible', entry.isIntersecting);
      });
    }, { threshold: 0.05 });
    stickyObserver.observe(ofertaSection);
  }

  // Strikethrough animation
  const precoDeSpan = document.querySelector('.preco-de span');
  if (precoDeSpan) {
    const strikeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('strike-animated');
          strikeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    strikeObserver.observe(precoDeSpan);
  }

  // FAQ smooth toggle
  document.querySelectorAll('.faq-item').forEach(item => {
    const content = item.querySelector('p');
    if (content) {
      content.style.maxHeight = '0';
      content.style.overflow = 'hidden';
      content.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
      content.style.padding = '0 24px';

      item.querySelector('summary').addEventListener('click', (e) => {
        e.preventDefault();
        if (item.open) {
          content.style.maxHeight = '0';
          content.style.padding = '0 24px';
          setTimeout(() => { item.open = false; }, 300);
        } else {
          item.open = true;
          requestAnimationFrame(() => {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.padding = '0 24px 20px';
          });
        }
      });
    }
  });

  // SVG draw-in animation on scroll
  const timelineIcons = document.querySelectorAll('.icon-timeline-icon svg, .canal-step-icon svg, .honestidade-icon-circle svg, .mes-icon svg, .comp-icon svg');
  timelineIcons.forEach(svg => {
    const paths = svg.querySelectorAll('path, line, polyline, rect, circle, polygon');
    paths.forEach(p => {
      const len = p.getTotalLength ? p.getTotalLength() : 60;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      p.style.transition = 'stroke-dashoffset 0.8s ease-out';
    });
  });
  const iconDrawObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const paths = entry.target.querySelectorAll('path, line, polyline, rect, circle, polygon');
        paths.forEach(p => { p.style.strokeDashoffset = '0'; });
        iconDrawObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  timelineIcons.forEach(svg => iconDrawObserver.observe(svg));

});
