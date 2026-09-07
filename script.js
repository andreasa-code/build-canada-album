(() => {
  const data = window.ALBUM_DATA;
  if (!data) return;

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const availablePlatforms = data.platforms.filter((platform) => platform.url);

  const platformIcon = (name) => {
    const key = name.toLowerCase();

    if (key.includes('spotify')) {
      return `
        <svg class="platform-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="9.25" fill="none" stroke="currentColor" stroke-width="1.8"/>
          <path d="M7.1 9.4c3.7-1.05 7.55-.66 10.3.82" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M7.65 12.35c3.15-.78 6.35-.45 8.78.75" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round"/>
          <path d="M8.25 15.15c2.55-.55 5.04-.28 7 .67" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>`;
    }

    if (key.includes('apple')) {
      return `
        <svg class="platform-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="4.6" fill="none" stroke="currentColor" stroke-width="1.6"/>
          <path d="M16.8 6.45v7.9c0 1.55-1.18 2.72-2.75 2.72-1.2 0-2.14-.7-2.14-1.62 0-1.08 1.06-1.88 2.5-1.88.34 0 .66.05.94.14V9.02l-5.12 1.04v5.17c0 1.55-1.18 2.72-2.75 2.72-1.2 0-2.14-.7-2.14-1.62 0-1.08 1.06-1.88 2.5-1.88.34 0 .66.05.94.14V7.98l8.02-1.53Z" fill="currentColor"/>
        </svg>`;
    }

    return `
      <svg class="platform-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="2.2" y="5.1" width="19.6" height="13.8" rx="4.2" fill="none" stroke="currentColor" stroke-width="1.7"/>
        <path d="m10 9 5 3-5 3V9Z" fill="currentColor"/>
      </svg>`;
  };

  function createPlatformLink(platform, { compact = false } = {}) {
    const link = document.createElement('a');
    link.href = platform.url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.setAttribute('aria-label', `Open Build Canada: The Album on ${platform.name}`);
    link.title = platform.name;

    if (compact) {
      link.className = 'icon-link platform-icon-link';
      link.innerHTML = platformIcon(platform.name);
      return link;
    }

    link.className = 'button button-primary platform-button';
    link.innerHTML = `
      ${platformIcon(platform.name)}
      <span class="platform-name">Listen on ${platform.name}</span>
      <span class="external-arrow" aria-hidden="true">↗</span>`;
    return link;
  }

  function renderPlatformLinks(container, options = {}) {
    if (!container) return;
    availablePlatforms.forEach((platform) => {
      container.append(createPlatformLink(platform, options));
    });
  }

  renderPlatformLinks($('#header-platform-links'), { compact: true });
  renderPlatformLinks($('#hero-platform-links'));
  renderPlatformLinks($('#player-platform-links'));
  renderPlatformLinks($('#lyrics-platform-links'), { compact: true });
  renderPlatformLinks($('#platform-links'));

  const embed = $('#spotify-embed');
  if (embed) embed.src = data.spotifyEmbed;

  const tracklist = $('#tracklist');
  data.tracks.forEach((track, index) => {
    const row = document.createElement('div');
    row.className = 'track-row reveal';
    row.innerHTML = `
      <span class="track-number">${track.number}</span>
      <button class="track-title-button" type="button" data-track-index="${index}" aria-label="Read lyrics for ${track.title}">${track.title}</button>
      <span class="track-topic">${track.topic}</span>
      <span class="track-actions" aria-label="Album links"></span>`;

    const actions = $('.track-actions', row);
    availablePlatforms.forEach((platform) => {
      actions.append(createPlatformLink(platform, { compact: true }));
    });

    const memoLink = document.createElement('a');
    memoLink.className = 'icon-link memo-icon-link';
    memoLink.href = track.memoUrl;
    memoLink.target = '_blank';
    memoLink.rel = 'noreferrer';
    memoLink.setAttribute('aria-label', `Read the memo behind ${track.title}`);
    memoLink.title = 'Read memo';
    memoLink.textContent = 'M';
    actions.append(memoLink);

    tracklist.append(row);
  });

  const lyricsNav = $('#lyrics-nav');
  data.tracks.forEach((track, index) => {
    const tab = document.createElement('button');
    tab.className = 'lyric-tab';
    tab.type = 'button';
    tab.role = 'tab';
    tab.dataset.trackIndex = index;
    tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tab.innerHTML = `<span>${track.number}</span><span>${track.title}</span>`;
    lyricsNav.append(tab);
  });

  function renderLyrics(index, shouldScroll = false) {
    const track = data.tracks[index];
    if (!track) return;

    $('#lyrics-number').textContent = track.number;
    $('#lyrics-title').textContent = track.title;
    $('#lyrics-topic').textContent = `Inspired by ${track.memoAuthor}’s memo on ${track.topic.toLowerCase()}.`;
    $('#lyrics-memo').href = track.memoUrl;

    $$('.lyric-tab').forEach((tab, tabIndex) => {
      tab.setAttribute('aria-selected', tabIndex === index ? 'true' : 'false');
    });

    const target = $('#lyrics-text');
    target.innerHTML = '';
    const sectionPattern = /^(\[?(verse( \d+)?|pre-chorus|chorus|bridge|final chorus|outro)\]?)$/i;
    track.lyrics.split('\n').forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line) {
        const spacer = document.createElement('div');
        spacer.className = 'stanza-break';
        target.append(spacer);
      } else if (sectionPattern.test(line)) {
        const heading = document.createElement('h4');
        heading.textContent = line.replace(/[\[\]]/g, '');
        target.append(heading);
      } else {
        const p = document.createElement('p');
        p.textContent = line;
        target.append(p);
      }
    });

    const buildItHereLicense = '“Build it Here” by Ajay Agrawal, 2026. Lyrics by Ajay Agrawal and original creative contributions by Chris Hadfield, Noel Webb, Dan Debow, Mike Serbinis, Sonia Sennik, and Ajay Agrawal; recording created with assistance from Suno AI. Licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). You may copy, share, remix, adapt and use this work commercially, provided you give appropriate attribution.';
    const standardLicense = `“${track.title}” by Ajay Agrawal 2026. Lyrics and original creative contributions by Ajay Agrawal; recording created with assistance from Suno AI. Licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). You may copy, share, remix, adapt and use this work commercially, provided you give appropriate attribution.`;
    $('#lyrics-license').textContent = track.title === 'Build It Here' ? buildItHereLicense : standardLicense;

    history.replaceState(null, '', `#lyrics-${track.number}`);
    if (shouldScroll) $('#lyrics').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  lyricsNav.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-track-index]');
    if (!tab) return;
    renderLyrics(Number(tab.dataset.trackIndex));
  });

  tracklist.addEventListener('click', (event) => {
    const button = event.target.closest('.track-title-button');
    if (!button) return;
    renderLyrics(Number(button.dataset.trackIndex), true);
  });

  const memoGrid = $('#memo-grid');
  data.tracks.forEach((track) => {
    const card = document.createElement('a');
    card.className = 'memo-card reveal';
    card.href = track.memoUrl;
    card.target = '_blank';
    card.rel = 'noreferrer';
    card.innerHTML = `
      <div class="memo-top"><span>${track.number}</span><span>${track.topic}</span></div>
      <h3>${track.memoTitle}</h3>
      <div class="memo-bottom"><span>Memo by ${track.memoAuthor}</span><span aria-hidden="true">↗</span></div>`;
    memoGrid.append(card);
  });

  const gallery = $('#gallery');
  data.gallery.forEach((image, index) => {
    const figure = document.createElement('figure');
    figure.className = 'reveal';
    figure.innerHTML = `
      <img src="${image.src}" alt="${image.alt}" loading="lazy" />
      <figcaption><span>0${index + 1}</span><span>${image.caption}</span></figcaption>`;
    gallery.append(figure);
  });

  const requestedTrack = location.hash.match(/^#lyrics-(\d{2})$/);
  const initialIndex = requestedTrack
    ? Math.max(0, data.tracks.findIndex((track) => track.number === requestedTrack[1]))
    : 0;
  renderLyrics(initialIndex);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

  $$('.reveal').forEach((element) => observer.observe(element));
})();
