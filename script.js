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
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // Fermer le menu après avoir cliqué sur un lien
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

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

    // Smooth scroll pour tous les liens d’ancre
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    });

    // Validation simple du formulaire de contact
    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            formMessage.textContent = '';
            formMessage.className = 'form-message';

            const name = contactForm.querySelector('#name');
            const email = contactForm.querySelector('#email');
            const message = contactForm.querySelector('#message');
            const privacy = contactForm.querySelector('#privacy');

            if (!name.value.trim() || !email.value.trim() || !message.value.trim() || !privacy.checked) {
                formMessage.textContent = 'Merci de remplir tous les champs obligatoires et de cocher la case de confidentialité.';
                formMessage.classList.add('error');
                return;
            }

            // Ici, on pourrait appeler une API ou un service d’email.
            // Pour l’instant, on simule l’envoi.
            formMessage.textContent = 'Votre message a été envoyé. Merci pour votre confiance.';
            formMessage.classList.add('success');
            contactForm.reset();
        });
    }
});