/* ============================================================
PRELOADER
============================================================ */
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hidden');
    }, 1200);
});

/* ============================================================
AOS - Animaciones al scroll
============================================================ */
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 900,
        easing: 'ease-out-cubic',
        once: true,
        offset: 80,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
}

/* ============================================================
NAVBAR - scroll, menú móvil, link activo
============================================================ */
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
    
    const backToTop = document.getElementById('backToTop');
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
    
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (window.scrollY / scrollTotal) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    }
    
    let current = '';
    document.querySelectorAll('section[id], header[id]').forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
});

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/* ============================================================
BACK TO TOP
============================================================ */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================================
PARTÍCULAS HERO
============================================================ */
const particlesContainer = document.getElementById('particles');
if (particlesContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 12) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particlesContainer.appendChild(particle);
    }
}

/* ============================================================
CONTADOR DE ESTADÍSTICAS
============================================================ */
const statNumbers = document.querySelectorAll('.stat-numero');
const animateCounter = (el, target) => {
    let current = 0;
    const increment = target / 60;
    const update = () => {
        current += increment;
        if (current < target) {
            el.textContent = Math.floor(current).toLocaleString('es-EC');
            requestAnimationFrame(update);
        } else {
            el.textContent = target.toLocaleString('es-EC') + (target >= 1000 ? '+' : '');
        }
    };
    update();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            animateCounter(el, target);
            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => statsObserver.observe(num));

/* ============================================================
CUENTA REGRESIVA (29 DE NOVIEMBRE 2026)
============================================================ */
const targetDate = new Date('2026-11-29T08:00:00').getTime();
const updateCountdown = () => {
    const now = new Date().getTime();
    const diff = targetDate - now;
    
    if (diff < 0) return;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const pad = (n) => String(n).padStart(2, '0');
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = pad(val); };
    
    set('days', days);
    set('hours', hours);
    set('minutes', minutes);
    set('seconds', seconds);
};

updateCountdown();
setInterval(updateCountdown, 1000);

/* ============================================================
FILTRO DE PROPUESTAS
============================================================ */
const filtros = document.querySelectorAll('.filtro');
const propuestas = document.querySelectorAll('.propuesta');

filtros.forEach(filtro => {
    filtro.addEventListener('click', () => {
        filtros.forEach(f => f.classList.remove('active'));
        filtro.classList.add('active');
        
        const category = filtro.getAttribute('data-filter');
        propuestas.forEach(p => {
            const match = category === 'all' || p.getAttribute('data-category') === category;
            p.classList.toggle('hidden', !match);
            if (match) {
                p.style.animation = 'none';
                void p.offsetWidth;
                p.style.animation = 'fadeIn 0.5s ease';
            }
        });
    });
});

/* ============================================================
FILTRO DE EQUIPO (CONCEJALES)
============================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const teamCards = document.querySelectorAll('.team-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        teamCards.forEach(card => {
            const type = card.getAttribute('data-type');
            if (filter === 'all' || type === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'none';
                void card.offsetWidth;
                card.style.animation = 'fadeIn 0.4s ease';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* ============================================================
GALERÍA - LIGHTBOX
============================================================ */
const galeriaItems = document.querySelectorAll('.galeria-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

if (lightbox && lightboxImg) {
    galeriaItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
}

/* ============================================================
TESTIMONIOS - SLIDER
============================================================ */
const testimonios = document.querySelectorAll('.testimonio');
const dots = document.querySelectorAll('.dot');
let currentTestimonio = 0;
let testimonioInterval;

const showTestimonio = (index) => {
    testimonios.forEach((t, i) => t.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentTestimonio = index;
};

const nextTestimonio = () => showTestimonio((currentTestimonio + 1) % testimonios.length);

if (testimonios.length > 0) {
    testimonioInterval = setInterval(nextTestimonio, 6000);
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(testimonioInterval);
            showTestimonio(i);
            testimonioInterval = setInterval(nextTestimonio, 6000);
        });
    });
}

/* ============================================================
FORMULARIO DE CONTACTO
============================================================ */
const contactoForm = document.getElementById('contactoForm');
const formMessage = document.getElementById('formMessage');
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby_S_cCd_7PCDtr9HwU1kNbIF-Tdvce3IeW53IKjB-HDzUJLgBHrW6b0r7SXMPDOXF6/exec
';

if (contactoForm) {
    contactoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.className = 'form-message';
        formMessage.textContent = '⏳ Enviando mensaje...';
        
        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            interes: document.getElementById('interes').value,
            mensaje: document.getElementById('mensaje').value.trim()
        };
        
        if (!formData.nombre || !formData.email || !formData.interes || !formData.mensaje) {
            formMessage.className = 'form-message error';
            formMessage.textContent = '⚠️ Por favor completa todos los campos obligatorios.';
            return;
        }
        
        try {
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            formMessage.className = 'form-message success';
            formMessage.textContent = '✅ ¡Gracias! Tu mensaje ha sido enviado. Nos pondremos en contacto pronto.';
            contactoForm.reset();
            setTimeout(() => { formMessage.className = 'form-message'; formMessage.textContent = ''; }, 6000);
        } catch (error) {
            formMessage.className = 'form-message error';
            formMessage.textContent = '❌ Hubo un error. Intenta de nuevo o escríbenos por WhatsApp.';
        }
    });
}

/* ============================================================
SCROLL SUAVE CON OFFSET PARA NAVBAR
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId.length < 2) return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});
