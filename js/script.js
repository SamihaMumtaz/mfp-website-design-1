// ============ LOADER ============
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hide'), 1200);
});

// ============ AOS ============
AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic' });

// ============ CUSTOM CURSOR ============
const dot = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');
let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .tilt, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('grow'));
    el.addEventListener('mouseleave', () => outline.classList.remove('grow'));
});

// ============ SCROLL PROGRESS / NAV / BACKTOP ============
const progressBar = document.querySelector('.scroll-progress');
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight) * 100 + '%';
    navbar.classList.toggle('scrolled', scrollTop > 40);
    backTop.classList.toggle('show', scrollTop > 500);
});

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ============ MOBILE MENU (LEFT SIDE) ============
const menuBtn = document.getElementById('menuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

function openMobileMenu() {
    mobileMenu.classList.remove('-translate-x-full');
    mobileMenuOverlay.classList.remove('opacity-0', 'pointer-events-none');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // lock scroll
}

function closeMobileMenu() {
    mobileMenu.classList.add('-translate-x-full');
    mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // unlock scroll
}

menuBtn?.addEventListener('click', openMobileMenu);
closeMenuBtn?.addEventListener('click', closeMobileMenu);
mobileMenuOverlay?.addEventListener('click', closeMobileMenu);

// Close on link click
document.querySelectorAll('.mobile-link, #mobileMenu a[href^="#"]').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});

// Close menu when resizing to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeMobileMenu();
});

// ============ HERO SLIDER ============
const slides = document.querySelectorAll('.hero-bg .slide');
const dots = document.querySelectorAll('.dot');
let current = 0;

function goTo(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = i;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
}
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
setInterval(() => goTo((current + 1) % slides.length), 5500);

// ============ PARTICLES CANVAS (Theme-Aware) ============
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r},${g},${b}`;
}

class Particle {
    constructor() { this.reset(); this.y = Math.random() * canvas.height; }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.vy = Math.random() * 0.5 + 0.3;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2.5 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
        this.x += this.vx; this.y -= this.vy;
        if (this.y < -10) this.reset();
    }
    draw() {
        const glow = getComputedStyle(document.documentElement).getPropertyValue('--brand-glow').trim();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(glow)}, ${this.alpha})`;
        ctx.fill();
    }
}
for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ============ COUNTERS ============
const counters = document.querySelectorAll('.counter');
const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = +el.dataset.target;
            let count = 0;
            const step = target / 60;
            const tick = () => {
                count += step;
                if (count < target) { el.innerText = Math.ceil(count); requestAnimationFrame(tick); }
                else el.innerText = target;
            };
            tick();
            counterObs.unobserve(el);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

// ============ CIRCULAR PROGRESS ============
const circles = document.querySelectorAll('.progress-circle');
const circleObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const wrap = entry.target;
            const percent = +wrap.dataset.percent;
            const circle = wrap.querySelector('.fg-ring');
            const r = 60;
            const circumference = 2 * Math.PI * r;
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference;
            setTimeout(() => {
                circle.style.strokeDashoffset = circumference - (percent / 100) * circumference;
            }, 300);
            circleObs.unobserve(wrap);
        }
    });
}, { threshold: 0.5 });
circles.forEach(c => circleObs.observe(c));

// ============ MAGNETIC BUTTONS ============
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
});

// ============ 3D TILT ============
document.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rx = ((y - rect.height / 2) / rect.height) * -10;
        const ry = ((x - rect.width / 2) / rect.width) * 10;
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ============ SPOTLIGHT ============
document.querySelectorAll('.spotlight').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    });
});

// ============ PROCESS LINE FILL ============
const processLine = document.querySelector('.process-line-fill');
if (processLine) {
    const lineObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                processLine.style.height = '100%';
                lineObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    lineObs.observe(document.querySelector('.process-timeline'));
}

// ============ FORM SUBMIT ============
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent Successfully!';
        btn.style.background = 'var(--brand-dark)';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            e.target.reset();
        }, 2500);
    });
}