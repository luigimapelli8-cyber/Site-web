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

    // Formulaire de contact avec Web3Forms (AJAX - pas de rechargement de page)
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
            
            // Créer un élément pour le message de confirmation s'il n'existe pas
            let formMessage = document.getElementById('formMessage');
            if (!formMessage) {
                formMessage = document.createElement('div');
                formMessage.id = 'formMessage';
                formMessage.style.marginTop = '15px';
                formMessage.style.padding = '15px';
                formMessage.style.borderRadius = '5px';
                contactForm.appendChild(formMessage);
            }
            
            // Récupérer les données du formulaire
            const formData = new FormData(contactForm);
            
            // Envoyer via Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formMessage.textContent = '✅ Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.';
                    formMessage.style.backgroundColor = '#d4edda';
                    formMessage.style.color = '#155724';
                    formMessage.style.border = '1px solid #c3e6cb';
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Erreur lors de l\'envoi');
                }
            })
            .catch(error => {
                formMessage.textContent = '❌ Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.';
                formMessage.style.backgroundColor = '#f8d7da';
                formMessage.style.color = '#721c24';
                formMessage.style.border = '1px solid #f5c6cb';
                console.error('Erreur:', error);
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
