// Fonction pour activer/désactiver la vue mobile
function toggleMobileView(enable) {
    const body = document.body;
    const mobileToggleBtn = document.getElementById('mobileToggle');
    
    if (enable) {
        // Créer le conteneur de prévisualisation mobile s'il n'existe pas
        if (!document.getElementById('mobilePreviewContainer')) {
            const mobilePreview = document.createElement('div');
            mobilePreview.id = 'mobilePreviewContainer';
            mobilePreview.className = 'mobile-preview-container';
            
            // Créer l'iframe
            const iframe = document.createElement('iframe');
            iframe.className = 'mobile-preview-iframe';
            iframe.src = window.location.href + (window.location.search ? '&' : '?') + 'mobile-preview=true';
            
            // Créer le bouton de fermeture
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-mobile-preview';
            closeBtn.innerHTML = '&times;';
            closeBtn.onclick = () => toggleMobileView(false);
            
            mobilePreview.appendChild(iframe);
            mobilePreview.appendChild(closeBtn);
            document.body.appendChild(mobilePreview);
            
            // Ajouter un écouteur pour fermer en cliquant à l'extérieur
            mobilePreview.addEventListener('click', (e) => {
                if (e.target === mobilePreview) {
                    toggleMobileView(false);
                }
            });
        }
        
        // Activer la vue mobile
        body.classList.add('mobile-view');
        mobileToggleBtn.classList.add('active');
        mobileToggleBtn.title = 'Revenir à la version bureau';
        mobileToggleBtn.innerHTML = '<i class="fas fa-desktop"></i>';
        
        // Empêcher le défilement du body
        document.body.style.overflow = 'hidden';
    } else {
        // Désactiver la vue mobile
        body.classList.remove('mobile-view');
        mobileToggleBtn.classList.remove('active');
        mobileToggleBtn.title = 'Afficher la version mobile';
        mobileToggleBtn.innerHTML = '<i class="fas fa-mobile-alt"></i>';
        
        // Rétablir le défilement
        document.body.style.overflow = '';
        
        // Supprimer l'iframe pour libérer les ressources
        const previewContainer = document.getElementById('mobilePreviewContainer');
        if (previewContainer) {
            previewContainer.remove();
        }
    }
}

// Attente du chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTop = document.getElementById('backToTop');
    const yearSpan = document.getElementById('currentYear');
    const contactForm = document.getElementById('contactForm');

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

    // Formulaire de contact avec Web3Forms
    const form = document.getElementById('form');
    const formMessage = document.getElementById('formMessage');
    if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            formData.append("access_key", "f80e4838-78b7-46a3-8828-e49ef761d382");

            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Envoi en cours...";
            submitBtn.disabled = true;

            // Réinitialiser le message
            if (formMessage) {
                formMessage.textContent = "";
                formMessage.className = "form-message";
            }

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    if (formMessage) {
                        formMessage.textContent = "✓ Votre message a bien été envoyé !";
                        formMessage.className = "form-message success";
                    }
                    form.reset();
                } else {
                    if (formMessage) {
                        formMessage.textContent = "Erreur : " + data.message;
                        formMessage.className = "form-message error";
                    }
                }

            } catch (error) {
                if (formMessage) {
                    formMessage.textContent = "Une erreur s'est produite. Veuillez réessayer.";
                    formMessage.className = "form-message error";
                }
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Gestion du bouton de basculement mobile
    const mobileToggle = document.getElementById('mobileToggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = mobileToggle.classList.contains('active');
            toggleMobileView(!isActive);
        });

        // Fermer avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileToggle.classList.contains('active')) {
                toggleMobileView(false);
            }
        });
    }

    // Vérifier le paramètre d'URL pour la prévisualisation mobile
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mobile-preview') === 'true') {
        // Ajouter une classe au body pour la vue mobile
        document.body.classList.add('mobile-preview-mode');
        
        // Ajouter un bouton pour quitter la prévisualisation
        const exitPreview = document.createElement('button');
        exitPreview.id = 'exitMobilePreview';
        exitPreview.className = 'btn btn-primary';
        exitPreview.innerHTML = '<i class="fas fa-times"></i> Quitter la prévisualisation mobile';
        exitPreview.style.position = 'fixed';
        exitPreview.style.bottom = '20px';
        exitPreview.style.left = '50%';
        exitPreview.style.transform = 'translateX(-50%)';
        exitPreview.style.zIndex = '1000';
        exitPreview.style.padding = '10px 20px';
        exitPreview.style.borderRadius = '30px';
        exitPreview.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        exitPreview.onclick = () => {
            window.location.href = window.location.href.replace(/[?&]mobile-preview=true/, '');
        };
        
        document.body.appendChild(exitPreview);
    }
});