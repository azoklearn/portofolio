// ==========================================
// VARIABLES GLOBALES ET ÉTAT
// ==========================================

let particlesSystem = null;
let skillsRadar = null;
let typewriterInstance = null;
let scrollAnimations = [];
let isPreloaderComplete = false;
let mousePosition = { x: 0, y: 0 };
let isScrolling = false;
let radarAnimationId = null;

// Configuration
const CONFIG = {
    particles: {
        count: 150,
        speed: 0.5,
        colors: ['#00F5FF', '#8B5FBF', '#4ECDC4', '#FF6B6B'],
        sizes: [1, 2, 3],
        connections: true,
        connectionDistance: 100
    },
    skills: {
        frontend: [
            { name: 'React/Next.js', value: 95 },
            { name: 'JavaScript/TypeScript', value: 90 },
            { name: 'CSS/Tailwind', value: 92 },
            { name: 'Vue.js', value: 88 }
        ],
        backend: [
            { name: 'Node.js', value: 85 },
            { name: 'Express/FastAPI', value: 80 },
            { name: 'MongoDB/PostgreSQL', value: 75 },
            { name: 'Python', value: 70 }
        ],
        tools: [
            { name: 'Git/GitHub', value: 95 },
            { name: 'Docker', value: 75 },
            { name: 'AWS/Vercel', value: 80 },
            { name: 'Figma/Design', value: 85 }
        ]
    },
    typewriter: {
        words: [
            'Freelance Developer',
            'Creative Coder',
            'Problem Solver',
            'Digital Artist',
            'Innovation Driven'
        ],
        speed: 100,
        deleteSpeed: 50,
        pauseTime: 2000
    }
};

// ==========================================
// INITIALISATION PRINCIPALE
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio Noan - Initialisation...');
    
    initializePreloader();
    
    // Délai pour permettre au preloader de s'afficher
    setTimeout(() => {
        initializeCore();
    }, 500);
});

function initializeCore() {
    try {
        // Systèmes principaux
        initializeParticles();
        initializeCustomCursor();
        initializeNavigation();
        initializeScrollAnimations();
        initializeTypewriter();
        initializeSkillsRadar();
        initializeFormHandling();
        initializeScrollIndicator();
        initializeStats();
        initializeProjectCards();
        
        // Événements
        setupEventListeners();
        
        console.log('✅ Portfolio initialisé avec succès!');
        
        // Finaliser le preloader après initialisation
        setTimeout(completePreloader, 1500);
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        // Forcer la completion du preloader même en cas d'erreur
        completePreloader();
    }
}

// ==========================================
// PRELOADER FUTURISTE
// ==========================================

function initializePreloader() {
    const codeLines = [
        '> Initializing portfolio system...',
        '> Loading creative modules...',
        '> Connecting to the matrix...',
        '> Compiling awesome code...',
        '> Rendering digital magic...',
        '> Portfolio ready to impress!'
    ];
    
    let currentLine = 0;
    const typingElement = document.querySelector('.typing-effect');
    const progressBar = document.querySelector('.progress');
    
    if (!typingElement || !progressBar) {
        completePreloader();
        return;
    }
    
    function typeLine() {
        if (currentLine >= codeLines.length) {
            return;
        }
        
        const line = codeLines[currentLine];
        let charIndex = 0;
        
        typingElement.innerHTML = '<span class="cursor">|</span>';
        
        function typeChar() {
            if (charIndex < line.length) {
                typingElement.innerHTML = line.substring(0, charIndex + 1) + '<span class="cursor">|</span>';
                charIndex++;
                setTimeout(typeChar, 30 + Math.random() * 50);
            } else {
                currentLine++;
                const progress = (currentLine / codeLines.length) * 100;
                progressBar.style.width = progress + '%';
                
                setTimeout(() => {
                    if (currentLine < codeLines.length) {
                        typeLine();
                    }
                }, 300);
            }
        }
        
        typeChar();
    }
    
    typeLine();
}

function completePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            isPreloaderComplete = true;
            
            // Déclencher les animations d'entrée
            document.body.classList.add('loaded');
            triggerEntranceAnimations();
            
        }, 800);
    } else {
        isPreloaderComplete = true;
        triggerEntranceAnimations();
    }
}

function triggerEntranceAnimations() {
    // Animer les éléments de la hero section avec délais
    const heroElements = [
        '.greeting',
        '.hero-name',
        '.hero-title',
        '.hero-description',
        '.hero-cta'
    ];
    
    heroElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200 + 300);
        }
    });
}

// ==========================================
// SYSTÈME DE PARTICULES AVANCÉ
// ==========================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        canvas.addEventListener('mousemove', (e) => this.updateMouse(e));
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < CONFIG.particles.count; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }
    
    updateMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Mettre à jour et dessiner les particules
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        
        // Dessiner les connections
        if (CONFIG.particles.connections) {
            this.drawConnections();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawConnections() {
        this.particles.forEach((particleA, indexA) => {
            this.particles.slice(indexA + 1).forEach(particleB => {
                const distance = Math.hypot(
                    particleA.x - particleB.x,
                    particleA.y - particleB.y
                );
                
                if (distance < CONFIG.particles.connectionDistance) {
                    const opacity = (1 - distance / CONFIG.particles.connectionDistance) * 0.3;
                    this.ctx.strokeStyle = `rgba(0, 245, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(particleA.x, particleA.y);
                    this.ctx.lineTo(particleB.x, particleB.y);
                    this.ctx.stroke();
                }
            });
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.vx = (Math.random() - 0.5) * CONFIG.particles.speed;
        this.vy = (Math.random() - 0.5) * CONFIG.particles.speed;
        this.size = CONFIG.particles.sizes[Math.floor(Math.random() * CONFIG.particles.sizes.length)];
        this.color = CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)];
        this.originalSize = this.size;
    }
    
    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
    }
    
    update(mouse) {
        // Mouvement de base
        this.x += this.vx;
        this.y += this.vy;
        
        // Rebond sur les bords
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
        
        // Interaction avec la souris
        const distanceToMouse = Math.hypot(this.x - mouse.x, this.y - mouse.y);
        if (distanceToMouse < 100) {
            const force = (100 - distanceToMouse) / 100;
            this.size = this.originalSize * (1 + force * 2);
            
            // Répulsion douce
            const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
            this.vx += Math.cos(angle) * force * 0.1;
            this.vy += Math.sin(angle) * force * 0.1;
        } else {
            this.size = this.originalSize;
        }
        
        // Limiter la vitesse
        const maxSpeed = CONFIG.particles.speed * 2;
        const speed = Math.hypot(this.vx, this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Effet de glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.size * 2;
        ctx.fill();
        
        ctx.restore();
    }
}

function initializeParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        particlesSystem = new ParticleSystem(canvas);
    }
}

// ==========================================
// CURSEUR PERSONNALISÉ
// ==========================================

function initializeCustomCursor() {
    if (window.innerWidth <= 1024) return; // Pas sur mobile
    
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    if (!cursor || !cursorDot || !cursorRing) return;
    
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        mousePosition = { x: e.clientX, y: e.clientY };
    });
    
    // Animation fluide du curseur
    function updateCursor() {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        
        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // Effets hover sur les éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .contact-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorRing.style.transform = 'translate(-50%, -50%) scale(2)';
            cursorRing.style.borderColor = '#FF6B6B';
            cursorDot.style.backgroundColor = '#FF6B6B';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorRing.style.borderColor = '#00F5FF';
            cursorDot.style.backgroundColor = '#00F5FF';
        });
    });
}

// ==========================================
// NAVIGATION ET SCROLL
// ==========================================

function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Effet scroll sur navbar
    let lastScrollTop = 0;
    
    function handleScroll() {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
        
        // Mettre à jour la navigation active
        updateActiveNavigation();
    }
    
    window.addEventListener('scroll', throttle(handleScroll, 16));
    
    // Navigation mobile
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scroll et fermeture menu mobile
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Fermer menu mobile
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;
    
    isScrolling = true;
    
    const targetPosition = targetSection.offsetTop - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(Math.abs(distance) * 0.5, 1000);
    
    let startTime = null;
    
    function animateScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const easeInOutCubic = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic);
        
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        } else {
            isScrolling = false;
        }
    }
    
    requestAnimationFrame(animateScroll);
}

// ==========================================
// MACHINE À ÉCRIRE POUR LE TITRE
// ==========================================

class Typewriter {
    constructor(element, words, options = {}) {
        this.element = element;
        this.words = words;
        this.speed = options.speed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.currentWordIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.isActive = true;
        
        this.type();
    }
    
    type() {
        if (!this.isActive) return;
        
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            this.currentText = currentWord.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = currentWord.substring(0, this.currentText.length + 1);
        }
        
        this.element.textContent = this.currentText;
        
        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;
        
        if (!this.isDeleting && this.currentText === currentWord) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
    
    destroy() {
        this.isActive = false;
    }
}

function initializeTypewriter() {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        typewriterInstance = new Typewriter(typingElement, CONFIG.typewriter.words, {
            speed: CONFIG.typewriter.speed,
            deleteSpeed: CONFIG.typewriter.deleteSpeed,
            pauseTime: CONFIG.typewriter.pauseTime
        });
    }
}

// ==========================================
// RADAR DE COMPÉTENCES
// ==========================================

class SkillsRadar {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.center = { x: canvas.width / 2, y: canvas.height / 2 };
        this.radius = Math.min(canvas.width, canvas.height) / 2 - 40;
        this.skills = this.prepareSkillsData();
        this.animationProgress = 0;
        this.animationId = null;
        
        this.animate();
    }
    
    prepareSkillsData() {
        const allSkills = [
            ...CONFIG.skills.frontend.map(skill => ({ ...skill, category: 'frontend', color: '#00F5FF' })),
            ...CONFIG.skills.backend.map(skill => ({ ...skill, category: 'backend', color: '#FF6B6B' })),
            ...CONFIG.skills.tools.map(skill => ({ ...skill, category: 'tools', color: '#4ECDC4' }))
        ];
        
        return allSkills.map((skill, index) => ({
            ...skill,
            angle: (index / allSkills.length) * Math.PI * 2,
            currentValue: 0
        }));
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Animer le progrès
        if (this.animationProgress < 1) {
            this.animationProgress += 0.01;
        }
        
        this.drawRadarGrid();
        this.drawSkills();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    drawRadarGrid() {
        const { ctx, center, radius } = this;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        // Cercles concentriques
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(center.x, center.y, (radius / 5) * i, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Lignes radiales
        this.skills.forEach(skill => {
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            const x = center.x + Math.cos(skill.angle - Math.PI / 2) * radius;
            const y = center.y + Math.sin(skill.angle - Math.PI / 2) * radius;
            ctx.lineTo(x, y);
            ctx.stroke();
        });
    }
    
    drawSkills() {
        const { ctx, center, radius } = this;
        
        // Mettre à jour les valeurs animées
        this.skills.forEach(skill => {
            skill.currentValue = skill.value * this.animationProgress;
        });
        
        // Dessiner les zones de compétences
        ctx.fillStyle = 'rgba(0, 245, 255, 0.2)';
        ctx.strokeStyle = '#00F5FF';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        this.skills.forEach((skill, index) => {
            const value = skill.currentValue / 100;
            const x = center.x + Math.cos(skill.angle - Math.PI / 2) * radius * value;
            const y = center.y + Math.sin(skill.angle - Math.PI / 2) * radius * value;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Dessiner les points de compétences
        this.skills.forEach(skill => {
            const value = skill.currentValue / 100;
            const x = center.x + Math.cos(skill.angle - Math.PI / 2) * radius * value;
            const y = center.y + Math.sin(skill.angle - Math.PI / 2) * radius * value;
            
            ctx.fillStyle = skill.color;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow effect
            ctx.shadowColor = skill.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Labels
            if (this.animationProgress > 0.8) {
                const labelX = center.x + Math.cos(skill.angle - Math.PI / 2) * (radius + 20);
                const labelY = center.y + Math.sin(skill.angle - Math.PI / 2) * (radius + 20);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '10px JetBrains Mono';
                ctx.textAlign = 'center';
                ctx.fillText(skill.name, labelX, labelY);
            }
        });
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

function initializeSkillsRadar() {
    const canvas = document.getElementById('skillsRadar');
    if (canvas) {
        skillsRadar = new SkillsRadar(canvas);
    }
}

// ==========================================
// ANIMATIONS AU SCROLL
// ==========================================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Animations spéciales
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBar(entry.target);
                }
                
                if (entry.target.classList.contains('stat-card')) {
                    animateStatNumber(entry.target);
                }
                
                if (entry.target.classList.contains('project-card')) {
                    entry.target.classList.add('animate-project');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animés
    const elementsToAnimate = document.querySelectorAll(
        '.timeline-item, .skill-item, .stat-card, .project-card, .contact-card, .section-header'
    );
    
    elementsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

function animateSkillBar(skillElement) {
    const progressBar = skillElement.querySelector('.skill-progress');
    const targetWidth = progressBar.getAttribute('data-width');
    
    setTimeout(() => {
        progressBar.style.width = targetWidth;
    }, 200);
}

function animateStatNumber(statElement) {
    const numberElement = statElement.querySelector('.stat-number');
    const targetValue = parseInt(numberElement.getAttribute('data-target'));
    
    let currentValue = 0;
    const increment = targetValue / 60; // 60 frames
    
    function updateValue() {
        currentValue += increment;
        if (currentValue >= targetValue) {
            numberElement.textContent = targetValue;
            return;
        }
        
        numberElement.textContent = Math.floor(currentValue);
        requestAnimationFrame(updateValue);
    }
    
    setTimeout(updateValue, 300);
}

// ==========================================
// GESTION DU FORMULAIRE
// ==========================================

function initializeFormHandling() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Validation en temps réel
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('focus', () => clearFieldError(input));
    });
    
    // Soumission du formulaire
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    let isValid = true;
    let errorMessage = '';
    
    switch (name) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Le nom doit contenir au moins 2 caractères';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse email valide';
            }
            break;
            
        case 'project-type':
            if (!value) {
                isValid = false;
                errorMessage = 'Veuillez sélectionner un type de projet';
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Le message doit contenir au moins 10 caractères';
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#FF6B6B';
    field.style.boxShadow = '0 0 15px rgba(255, 107, 107, 0.3)';
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: #FF6B6B;
            font-size: 0.8rem;
            margin-top: 0.5rem;
            font-family: var(--font-mono);
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    setTimeout(() => {
        errorElement.style.opacity = '1';
        errorElement.style.transform = 'translateY(0)';
    }, 10);
}

function clearFieldError(field) {
    field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    field.style.boxShadow = 'none';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(-10px)';
        setTimeout(() => errorElement.remove(), 300);
    }
}

function handleFormSubmit(e) {
    // Valider tous les champs avant soumission
    const inputs = e.target.querySelectorAll('input:not([type="hidden"]), select, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        e.preventDefault();
        showFormMessage('Veuillez corriger les erreurs avant d\'envoyer', 'error');
        return;
    }
    
    // Animer le bouton de soumission
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Envoi en cours...';
    submitBtn.style.background = 'linear-gradient(135deg, #4ECDC4 0%, #00F5FF 100%)';
    
    // Le formulaire se soumet naturellement vers Formspree
    // La page thank-you.html s'affichera après soumission
}

function showFormMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? 'rgba(78, 205, 196, 0.95)' : 'rgba(255, 107, 107, 0.95)'};
        color: white;
        padding: 2rem 3rem;
        border-radius: 12px;
        font-weight: 600;
        font-size: 1.1rem;
        text-align: center;
        z-index: 10000;
        backdrop-filter: blur(20px);
        border: 1px solid ${type === 'success' ? '#4ECDC4' : '#FF6B6B'};
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    messageElement.textContent = message;
    document.body.appendChild(messageElement);
    
    // Animation d'entrée
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Animation de sortie
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => messageElement.remove(), 300);
    }, 4000);
}

// ==========================================
// INDICATEUR DE SCROLL
// ==========================================

function initializeScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;
    
    function handleScroll() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        if (scrolled > windowHeight * 0.3) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.transform = 'translateY(20px)';
        } else {
            scrollIndicator.style.opacity = '0.7';
            scrollIndicator.style.transform = 'translateY(0)';
        }
    }
    
    window.addEventListener('scroll', throttle(handleScroll, 16));
}

// ==========================================
// STATISTIQUES ANIMÉES
// ==========================================

function initializeStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target.parentNode);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

// ==========================================
// CARTES DE PROJETS
// ==========================================

function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
            
            // Effet de particules
            createCardParticles(card);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function createCardParticles(card) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00F5FF;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: cardParticle 1s ease-out forwards;
        `;
        
        card.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// ==========================================
// ÉVÉNEMENTS GLOBAUX
// ==========================================

function setupEventListeners() {
    // Gestion du redimensionnement
    window.addEventListener('resize', debounce(() => {
        if (particlesSystem) {
            particlesSystem.resize();
        }
        
        if (skillsRadar) {
            const canvas = document.getElementById('skillsRadar');
            if (canvas) {
                skillsRadar.destroy();
                skillsRadar = new SkillsRadar(canvas);
            }
        }
    }, 250));
    
    // Easter egg Konami Code
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateEasterEgg();
            konamiCode = [];
        }
    });
    
    // Gestion de la visibilité de la page
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause des animations coûteuses
            if (particlesSystem && particlesSystem.animationId) {
                cancelAnimationFrame(particlesSystem.animationId);
            }
        } else {
            // Reprendre les animations
            if (particlesSystem) {
                particlesSystem.animate();
            }
        }
    });
}

// ==========================================
// EASTER EGG
// ==========================================

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 3s ease-in-out';
    
    // Créer des confettis
    for (let i = 0; i < 50; i++) {
        createConfetti();
    }
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 3000);
    
    console.log('🎉 Easter Egg activé! Noan approuve! 🚀');
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        z-index: 10000;
        border-radius: 50%;
        animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        pointer-events: none;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 5000);
}

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================
// NETTOYAGE ET DESTRUCTION
// ==========================================

window.addEventListener('beforeunload', () => {
    if (particlesSystem) {
        particlesSystem.destroy();
    }
    
    if (skillsRadar) {
        skillsRadar.destroy();
    }
    
    if (typewriterInstance) {
        typewriterInstance.destroy();
    }
});

// ==========================================
// ANIMATIONS CSS SUPPLÉMENTAIRES
// ==========================================

// Injecter des styles d'animation supplémentaires
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes cardParticle {
        0% {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
        100% {
            transform: scale(0) translateY(-50px);
            opacity: 0;
        }
    }
    
    .form-message {
        animation: messageSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    @keyframes messageSlideIn {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9) translateY(-20px);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) translateY(0);
        }
    }
`;

document.head.appendChild(additionalStyles);

// ==========================================
// MESSAGE DE CONSOLE
// ==========================================

console.log(`
    ╔══════════════════════════════════════════════╗
    ║           🚀 NOAN PORTFOLIO 2024 🚀          ║
    ║                                              ║
    ║     Portfolio ultra-moderne développé        ║
    ║        avec passion et créativité            ║
    ║                                              ║
    ║    Freelance Developer • 19 ans • France    ║
    ║                                              ║
    ║         Prêt pour de nouveaux défis!         ║
    ╚══════════════════════════════════════════════╝
`);

// Exposer certaines fonctions globalement pour le débogage
window.noanPortfolio = {
    scrollToSection,
    particlesSystem,
    skillsRadar,
    activateEasterEgg
};
