// Attente du chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuBackBtn = document.querySelector('.menu-back-btn');
    const yearSpan = document.getElementById('currentYear');
    const contactForm = document.getElementById('form');
    const formMessage = document.getElementById('formMessage');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Mise à jour de l'année dans le footer
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Toggle menu mobile
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Bouton retour menu
    if (menuBackBtn && navLinks) {
        menuBackBtn.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    }

    // Navigation smooth scroll
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Fermer le menu mobile
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Animations au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
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

    // Formulaire de contact avec Web3Forms (code officiel adapté)
    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            formData.append("access_key", "f80e4838-78b7-46a3-8828-e49ef761d382");

            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Envoi en cours...";
            submitBtn.disabled = true;

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    // Rediriger vers la page avec paramètre de succès
                    window.location.href = window.location.pathname + '?form=success#contact';
                } else {
                    alert("Erreur : " + data.message);
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }

            } catch (error) {
                alert("Une erreur s'est produite. Veuillez réessayer.");
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Vérifier si le formulaire a été envoyé avec succès
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('form') === 'success') {
        const formMessage = document.getElementById('formMessage');
        if (formMessage) {
            formMessage.textContent = '✓ Votre message a bien été envoyé !';
            formMessage.className = 'form-message success';
        }

        // Scroller vers la section contact
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Nettoyer l'URL sans recharger la page
        window.history.replaceState({}, document.title, window.location.pathname + '#contact');
    }

    // Fonction de validation email sécurisée
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email) && !email.includes('..') && email.length <= 254;
    }
});
