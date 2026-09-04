/**
 * Imperfect Servant Podcast - Interactive Script
 * Handles Hotspots, Clipboard Copy, Scripture Modals, Audio Simulation, and Ambient Particles
 */

document.addEventListener('DOMContentLoaded', () => {
  const EMAIL_ADDRESS = 'imperfectservantpodcast@gmail.com';
  let isAudioEnabled = true;
  let audioContext = null;
  let isPlaying = false;
  let playInterval = null;
  let currentSeconds = 0;
  const TOTAL_SECONDS = 74; // 1:14

  // Elements
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const modal = document.getElementById('modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalActionBtn = document.getElementById('modal-action-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalQuote = document.getElementById('modal-quote');
  const modalCommentary = document.getElementById('modal-commentary');
  const modalTag = document.getElementById('modal-tag');
  const currentYearSpan = document.getElementById('current-year');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundLabel = document.getElementById('sound-label');
  const shareBtn = document.getElementById('share-btn');
  const playBtn = document.getElementById('audio-play-btn');
  const playSvg = document.getElementById('play-svg');
  const pauseSvg = document.getElementById('pause-svg');
  const playerTimer = document.getElementById('player-timer');
  const waveBars = document.querySelectorAll('.wave-bar');

  // Set Copyright Year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================
  let toastTimeout = null;
  function showToast(message, duration = 3500) {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, duration);
  }

  // =========================================================================
  // EMAIL CLIPBOARD COPY
  // =========================================================================
  async function copyEmailToClipboard(e) {
    if (e) {
      e.preventDefault();
    }

    playTone(587.33, 0.08); // D5 chime

    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(EMAIL_ADDRESS);
        copied = true;
      }
    } catch (err) {
      // fallback
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = EMAIL_ADDRESS;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copied = true;
      } catch (err) {
        console.warn('Clipboard copy fallback error:', err);
      }
    }

    showToast(`✓ Copied ${EMAIL_ADDRESS} to clipboard!`);

    // Gracefully launch mail client
    setTimeout(() => {
      window.location.href = `mailto:${EMAIL_ADDRESS}`;
    }, 450);
  }

  // Attach to all email copy targets
  const emailTargets = document.querySelectorAll('[data-action="copy-email"]');
  emailTargets.forEach(target => {
    target.addEventListener('click', copyEmailToClipboard);
  });

  // =========================================================================
  // MODAL DATA & CONTROLLER
  // =========================================================================
  const modalContentMap = {
    romans: {
      tag: 'SCRIPTURE SPOTLIGHT',
      title: 'Romans 14:14',
      quote: '“I know and am convinced by the Lord Jesus that there is nothing unclean of itself; but to him who considers anything to be unclean, to him it is unclean.”',
      commentary: 'A reminder that personal walk, conscience, and genuine surrender to Christ transcend ritualism. Our choices in health, body, and spiritual discipline flow from an undivided heart honoring the Lord.'
    },
    leviticus: {
      tag: 'SCRIPTURE SPOTLIGHT',
      title: 'Leviticus 3:16',
      quote: '“The priest shall burn them on the altar as food, an offering made by fire, a sweet aroma; all the fat is the LORD’s.”',
      commentary: 'In ancient temple worship, the richest portion—the fat—was sacredly set apart for God alone. In the Imperfect Servant Podcast, this speaks to giving God our finest energy, honoring our physical bodies as holy temples.'
    },
    'motto-info': {
      tag: 'OUR CALLING',
      title: 'Not Perfect. Just Willing.',
      quote: '“Improving the health of God’s children.”',
      commentary: 'We aren’t looking for flawless leaders or polished facades. We are imperfect men and women walking out faith with sweat, honesty, and grace—pursuing physical strength, mental clarity, and deeper fellowship in Jesus Christ.'
    },
    health: {
      tag: 'SHOW PILLAR 01',
      title: 'Improving Health',
      quote: '“Do you not know that your bodies are temples of the Holy Spirit... therefore honor God with your bodies.” — 1 Cor 6:19-20',
      commentary: 'Actionable nutrition, physical discipline, longevity, and stewarding our vitality so we can show up fully for our families and communities.'
    },
    faith: {
      tag: 'SHOW PILLAR 02',
      title: 'Strengthening Faith',
      quote: '“Faith comes from hearing, and hearing through the word of Christ.” — Romans 10:17',
      commentary: 'Deepening our biblical literacy, consistent prayer habits, and spiritual discernment amid modern challenges and distractions.'
    },
    growth: {
      tag: 'SHOW PILLAR 03',
      title: 'Growth Through Christ',
      quote: '“My grace is sufficient for you, for my power is made perfect in weakness.” — 2 Cor 12:9',
      commentary: 'Overcoming setbacks, addictions, anxieties, and past mistakes. Discovering that Christ works most powerfully through honest brokenness.'
    },
    purpose: {
      tag: 'SHOW PILLAR 04',
      title: 'Finding Your Purpose',
      quote: '“For we are His workmanship, created in Christ Jesus for good works.” — Ephesians 2:10',
      commentary: 'Aligning our talents, vocations, and daily endeavors with eternal Kingdom impact.'
    }
  };

  function openModal(key) {
    const data = modalContentMap[key];
    if (!data) return;

    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalQuote.textContent = data.quote;
    modalCommentary.textContent = data.commentary;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    playTone(440, 0.07);
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalActionBtn) modalActionBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Hotspot click triggers for Scripture / Motto / Pillars
  const romansBtn = document.getElementById('hotspot-romans');
  if (romansBtn) romansBtn.addEventListener('click', () => openModal('romans'));

  const leviticusBtn = document.getElementById('hotspot-leviticus');
  if (leviticusBtn) leviticusBtn.addEventListener('click', () => openModal('leviticus'));

  const mottoBtn = document.getElementById('hotspot-badge');
  if (mottoBtn) mottoBtn.addEventListener('click', () => openModal('motto-info'));

  const pillarButtons = document.querySelectorAll('[data-pillar]');
  pillarButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pillar = btn.getAttribute('data-pillar');
      openModal(pillar);
    });
  });

  // =========================================================================
  // WEB AUDIO SYNTHESIZER & TEASER PLAYER
  // =========================================================================
  function getAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  }

  function playTone(freq, dur = 0.1, type = 'sine') {
    if (!isAudioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {
      // Audio context may be restricted by browser policy
    }
  }

  // =========================================================================
  // REAL AUDIO TRAILER PLAYER (The Staircase w-music - emotional ambient.mp3)
  // =========================================================================
  const teaserAudio = document.getElementById('teaser-audio');

  function formatTime(secs) {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updateTimer() {
    if (!teaserAudio || !playerTimer) return;
    const current = teaserAudio.currentTime || 0;
    const duration = teaserAudio.duration || 0;
    playerTimer.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  }

  if (teaserAudio) {
    teaserAudio.addEventListener('loadedmetadata', updateTimer);
    teaserAudio.addEventListener('durationchange', updateTimer);
    teaserAudio.addEventListener('timeupdate', updateTimer);
    teaserAudio.addEventListener('ended', () => {
      isPlaying = false;
      playSvg.classList.remove('hidden');
      pauseSvg.classList.add('hidden');
      waveBars.forEach(b => b.classList.remove('active'));
      teaserAudio.currentTime = 0;
      updateTimer();
    });
  }

  if (playBtn && teaserAudio) {
    playBtn.addEventListener('click', async () => {
      if (teaserAudio.paused) {
        try {
          await teaserAudio.play();
          isPlaying = true;
          playSvg.classList.add('hidden');
          pauseSvg.classList.remove('hidden');
          waveBars.forEach(b => b.classList.add('active'));
          showToast('Now Playing: Trailer Preview');
        } catch (err) {
          console.warn('Audio play error:', err);
        }
      } else {
        teaserAudio.pause();
        isPlaying = false;
        playSvg.classList.remove('hidden');
        pauseSvg.classList.add('hidden');
        waveBars.forEach(b => b.classList.remove('active'));
      }
    });
  }

  // Sound Toggle Button
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isAudioEnabled = !isAudioEnabled;
      if (soundLabel) {
        soundLabel.textContent = isAudioEnabled ? 'Audio On' : 'Muted';
      }
      if (teaserAudio) {
        teaserAudio.muted = !isAudioEnabled;
      }
      showToast(isAudioEnabled ? 'Sound enabled' : 'Sound muted', 2000);
    });
  }

  // =========================================================================
  // SHARE BUTTON
  // =========================================================================
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      playTone(523.25, 0.08); // C5
      const shareData = {
        title: 'Imperfect Servant Podcast',
        text: 'Improving Health, Strengthening Faith, Growth Through Christ. Not perfect. Just willing.',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // User cancelled
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast('Website link copied to clipboard!');
        } catch (err) {
          showToast('Share: ' + window.location.href);
        }
      }
    });
  }

  // Add subtle sound to interactive platform cards
  const interactiveCards = document.querySelectorAll('.platform-card');
  interactiveCards.forEach(card => {
    card.addEventListener('mouseenter', () => playTone(329.63, 0.04)); // E4 subtle tick
  });

  // =========================================================================
  // AMBIENT GOLD STARDUST PARTICLES CANVAS
  // =========================================================================
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const PARTICLE_COUNT = Math.min(45, Math.floor(window.innerWidth / 30));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.5,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.008
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.008;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 192, 55, ${Math.max(0.1, Math.min(0.85, p.alpha))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }
});
