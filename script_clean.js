// Attente du chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.getElementById('backToTop');
    const yearSpan = document.getElementById('currentYear');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    // Mise à jour de l'année dans le footer
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Gestion du menu mobile
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Fermer le menu au clic sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Bouton de retour
        const menuBackBtn = document.querySelector('.menu-back-btn');
        if (menuBackBtn) {
            menuBackBtn.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                window.history.back();
            });
        }
    }

    // Navigation des liens - VERSION ULTRA SIMPLE
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            
            const target = document.querySelector(href);
            if (!target) return;
            
            // Scroll simple vers la cible
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Bouton retour en haut + animations au scroll
    const handleScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset;

        // Affichage backToTop
        if (backToTop) {
            if (scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }

        // Animations des blocs
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 120) {
                el.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Clic retour en haut
    if (backToTop) {
        backToTop.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Formulaire de contact fonctionnel avec Netlify Forms
    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            formMessage.textContent = '';
            formMessage.className = 'form-message';

            const name = contactForm.querySelector('#name');
            const email = contactForm.querySelector('#email');
            const message = contactForm.querySelector('#message');
            const privacy = contactForm.querySelector('#privacy');

            // Validation et nettoyage
            const cleanName = name.value.trim().replace(/[<>]/g, '');
            const cleanEmail = email.value.trim().replace(/[<>]/g, '');
            const cleanMessage = message.value.trim().replace(/[<>]/g, '');

            // Validation renforcée
            if (!cleanName || cleanName.length < 2 || cleanName.length > 50) {
                formMessage.textContent = 'Nom invalide (2-50 caractères requis).';
                formMessage.classList.add('error');
                return;
            }

            if (!cleanEmail || !isValidEmail(cleanEmail)) {
                formMessage.textContent = 'Email invalide.';
                formMessage.classList.add('error');
                return;
            }

            if (!cleanMessage || cleanMessage.length < 10 || cleanMessage.length > 1000) {
                formMessage.textContent = 'Message invalide (10-1000 caractères requis).';
                formMessage.classList.add('error');
                return;
            }

            if (!privacy.checked) {
                formMessage.textContent = 'Veuillez accepter la politique de confidentialité.';
                formMessage.classList.add('error');
                return;
            }

            // Protection contre la soumission multiple
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';

            // Soumission via Netlify
            const formData = new FormData(contactForm);
            
            fetch('/', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    formMessage.textContent = '✅ Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.';
                    formMessage.classList.remove('error');
                    formMessage.classList.add('success');
                    contactForm.reset();
                } else {
                    throw new Error('Erreur serveur');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                formMessage.textContent = '❌ Erreur lors de l\'envoi. Veuillez réessayer ou m\'appeler directement au 06 16 83 59 71.';
                formMessage.classList.add('error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
        });
    }

    // Fonction de validation email sécurisée
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email) && !email.includes('..') && email.length <= 254;
    }
});
