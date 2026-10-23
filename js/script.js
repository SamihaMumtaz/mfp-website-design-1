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
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.add('-translate-x-full');
    mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

menuBtn?.addEventListener('click', openMobileMenu);
closeMenuBtn?.addEventListener('click', closeMobileMenu);
mobileMenuOverlay?.addEventListener('click', closeMobileMenu);

document.querySelectorAll('.mobile-link, #mobileMenu a[href^="#"]').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeMobileMenu();
});

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

// ============ HERO SLIDER & DYNAMIC TEXT ============
const heroSlides = document.querySelectorAll('.hero-bg .slide');
const dynamicHeroTitle = document.getElementById('dynamicHeroTitle');
const dynamicHeroDesc = document.getElementById('dynamicHeroDesc');
const dynamicHeroBtn = document.getElementById('dynamicHeroBtn');
const dynamicHeroBtnText = document.getElementById('dynamicHeroBtnText');
let currentHeroSlide = 0;
let heroInterval;

const heroServicesData = [
    {
        title: "Plastic Packaging",
        desc: "Plastic packaging is a versatile, durable, and cost-effective solution for preserving and protecting products. Customizable in design and size, plastic packaging enhances brand visibility.",
        btnText: "Get Plastic Packaging",
        link: "#plastic-packaging"
    },
    {
        title: "Tissue Conversion",
        desc: "Tissue conversion transforms raw tissue paper into finished products like napkins, facial tissues, and paper towels.",
        btnText: "Get Tissue Conversion",
        link: "#tissue-conversion"
    },
    {
        title: "Flexible Printing",
        desc: "Flexible printing offers versatile, efficient solutions for packaging and custom designs. It adapts to different materials and shapes, ensuring high-quality, durable prints that enhance product appeal and branding.",
        btnText: "Get Flexible Printing",
        link: "#flexible-printing"
    },
    {
        title: "Roll to Roll Label Printing",
        desc: "Roll-to-roll label printing is an efficient, high-speed solution for producing custom labels in bulk. Ideal for industries.",
        btnText: "Get Roll to Roll Labels",
        link: "#roll-to-roll"
    },
    {
        title: "Laminated Tubes",
        desc: "Laminated tubes are durable, lightweight packaging solutions ideal for cosmetics, pharmaceuticals, and food products.",
        btnText: "Get Laminated Tubes",
        link: "#laminated-tubes"
    },
    {
        title: "Offset Printing",
        desc: "Offset printing is a high-quality, cost-effective method ideal for large volumes. It ensures vibrant colors, sharp images, and professional results on various materials.",
        btnText: "Get Offset Printing",
        link: "#offset-printing"
    }
];

function changeHeroSlide(index) {
    // 1. Background change
    heroSlides.forEach(slide => slide.classList.remove('active'));
    heroSlides[index].classList.add('active');

    // 2. Fade out animation
    dynamicHeroTitle.style.opacity = '0';
    dynamicHeroDesc.style.opacity = '0';
    dynamicHeroTitle.style.transform = 'translateY(10px)';
    dynamicHeroDesc.style.transform = 'translateY(10px)';

    // 3. Change text after fade out
    setTimeout(() => {
        const data = heroServicesData[index];
        
        // Update Title & Desc
        dynamicHeroTitle.innerText = data.title;
        dynamicHeroDesc.innerText = data.desc;
        
        // Update Button Text & Link
        if (dynamicHeroBtnText) dynamicHeroBtnText.innerText = data.btnText;
        if (dynamicHeroBtn) dynamicHeroBtn.href = data.link;
        
        // Fade in animation
        dynamicHeroTitle.style.opacity = '1';
        dynamicHeroDesc.style.opacity = '1';
        dynamicHeroTitle.style.transform = 'translateY(0)';
        dynamicHeroDesc.style.transform = 'translateY(0)';
    }, 300);
}

// Start Slider
if (heroSlides.length > 0) {
    // Initial load
    changeHeroSlide(0);

    // Auto change every 5 seconds
    heroInterval = setInterval(() => {
        currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
        changeHeroSlide(currentHeroSlide);
    }, 5000);
}

// ============ NEW CIRCULAR PROGRESS RINGS (Quality Section) ============
const progressRings = document.querySelectorAll('.progress-ring-fg');

const ringObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const circle = entry.target;
            const percent = +circle.getAttribute('data-percent');
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;

            // Set initial state (0% fill)
            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference;
            circle.style.transition = 'stroke-dashoffset 2s ease-in-out';

            // Animate to target percentage after a tiny delay
            setTimeout(() => {
                const offset = circumference - (percent / 100) * circumference;
                circle.style.strokeDashoffset = offset;
            }, 200);

            // Stop observing once animated
            ringObserver.unobserve(circle);
        }
    });
}, { threshold: 0.5 });

progressRings.forEach(ring => ringObserver.observe(ring));