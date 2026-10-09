/* ==========================================================================
   FATHIMA FARHA - PERSONAL PORTFOLIO JAVASCRIPT
   Features: Theme Switcher, Responsive Mobile Menu, Scroll Reveal,
   Active Link Highlighting, Copy Email, Form Validation, Modal View
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. DYNAMIC COPYRIGHT YEAR
       -------------------------------------------------------------------------- */
    const copyrightYearEl = document.getElementById('copyright-year');
    if (copyrightYearEl) {
        copyrightYearEl.textContent = new Date().getFullYear();
    }

    /* --------------------------------------------------------------------------
       2. LIGHT / DARK THEME TOGGLE
       -------------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            showToast(`Switched to ${newTheme.toUpperCase()} theme`);
        });
    }

    /* --------------------------------------------------------------------------
       3. MOBILE NAVIGATION MENU TOGGLE
       -------------------------------------------------------------------------- */
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggleBtn && navMenu) {
        mobileToggleBtn.addEventListener('click', () => {
            const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
            mobileToggleBtn.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggleBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    /* --------------------------------------------------------------------------
       4. NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHTING
       -------------------------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
        // Sticky shadow on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section detection
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', handleScroll);

    /* --------------------------------------------------------------------------
       5. COPY EMAIL TO CLIPBOARD
       -------------------------------------------------------------------------- */
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailText = 'farahfouzan123456@gmail.com';

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(emailText);
                showToast('Email address copied to clipboard!');
            } catch (err) {
                // Fallback for older browsers
                const tempInput = document.createElement('input');
                tempInput.value = emailText;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast('Email address copied to clipboard!');
            }
        });
    }

    /* --------------------------------------------------------------------------
       6. DOWNLOAD CV BUTTON HANDLER
       -------------------------------------------------------------------------- */
    const downloadCvBtn = document.getElementById('btn-download-cv');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', () => {
            // Checks if a CV file exists or prompts the user with instructions
            const cvPath = 'CV_Fathima_Farha.pdf';
            
            // Create temporary link element
            const link = document.createElement('a');
            link.href = cvPath;
            link.download = 'Fathima_Farha_CV.pdf';
            
            // Handle file missing fallback safely
            fetch(cvPath, { method: 'HEAD' })
                .then(res => {
                    if (res.ok) {
                        link.click();
                        showToast('Downloading CV...');
                    } else {
                        showToast('Please add your "CV_Fathima_Farha.pdf" file to the portfolio directory.');
                    }
                })
                .catch(() => {
                    showToast('CV download ready. Add CV_Fathima_Farha.pdf to root folder.');
                });
        });
    }

    /* --------------------------------------------------------------------------
       7. CONTACT FORM VALIDATION & FRONT-END DEMO
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('portfolio-contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const subjectInput = document.getElementById('form-subject');
            const messageInput = document.getElementById('form-message');

            // Reset error states
            document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));

            // Name validation
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('has-error');
                isValid = false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('has-error');
                isValid = false;
            }

            // Subject validation
            if (!subjectInput.value.trim()) {
                subjectInput.parentElement.classList.add('has-error');
                isValid = false;
            }

            // Message validation
            if (!messageInput.value.trim()) {
                messageInput.parentElement.classList.add('has-error');
                isValid = false;
            }

            if (isValid) {
                const btnSubmit = document.getElementById('btn-submit-form');
                const originalText = btnSubmit.innerHTML;

                btnSubmit.disabled = true;
                btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;

                setTimeout(() => {
                    showToast('Thank you! Your message inquiry has been recorded (Front-end Demo).');
                    contactForm.reset();
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = originalText;
                }, 1200);
            }
        });
    }

    /* --------------------------------------------------------------------------
       8. PROJECT DETAILS MODAL
       -------------------------------------------------------------------------- */
    const projectData = {
        'elegance-wear': {
            title: 'Elegance Wear — Custom Tailoring Management Website',
            category: 'Web Application',
            image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop',
            description: 'A web application project focused on improving the management of custom tailoring orders. Planned features include customer and admin panels, dress and fabric selection, order tracking, payment options, delivery date estimation, and order status updates.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'],
            features: [
                'Customer dashboard for selecting fabric styles and submitting custom measurements',
                'Admin management portal for order status updates & client communication',
                'Delivery date estimation algorithm based on tailor workload',
                'Interactive dress catalog and fabric selection showcase',
                'Comprehensive database schema for tailoring workflows'
            ],
            github: 'https://github.com/fathimafarha2004/Elegance-wear'
        },
        'coffee-shop': {
            title: 'Coffee Shop Management System',
            category: 'Desktop Application',
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop',
            description: 'A desktop application project developed using C# Windows Forms and SQL Server LocalDB to practise interface development and database operations.',
            tech: ['C#', 'Windows Forms', 'SQL Server LocalDB', '.NET Framework'],
            features: [
                'Point of Sale (POS) checkout interface with instant item calculation',
                'Menu catalog management (Add, Update, Delete beverage items)',
                'LocalDB integration for persistent sales transactions and bill history',
                'Simple reporting view for daily sales summary'
            ],
            github: 'https://github.com/fathimafarha2004'
        }
    };

    const modalOverlay = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const projectKey = btn.getAttribute('data-project');
            const data = projectData[projectKey];

            if (data) {
                modalBody.innerHTML = `
                    <div style="margin-bottom: 1.5rem;">
                        <span class="project-category-badge" style="position:static; display:inline-block; margin-bottom:0.75rem;">${data.category}</span>
                        <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 700;">${data.title}</h2>
                    </div>
                    <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 240px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">${data.description}</p>
                    
                    <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;"><i class="fa-solid fa-list-check" style="color: var(--primary-pink);"></i> Detailed Features:</h4>
                    <ul style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
                        ${data.features.map(f => `<li style="font-size: 0.9rem; color: var(--text-secondary); display:flex; align-items:center; gap:0.5rem;"><i class="fa-solid fa-check" style="color:var(--primary-pink); font-size:0.8rem;"></i> ${f}</li>`).join('')}
                    </ul>

                    <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;"><i class="fa-solid fa-code" style="color: var(--accent-lavender-dark);"></i> Technologies Used:</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
                        ${data.tech.map(t => `<span class="tech-pill">${t}</span>`).join('')}
                    </div>

                    <div style="display: flex; gap: 1rem;">
                        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                            <i class="fa-brands fa-github"></i> View GitHub Repository
                        </a>
                        <button class="btn btn-outline btn-sm" onclick="document.getElementById('project-modal').classList.remove('active')">
                            Close
                        </button>
                    </div>
                `;

                modalOverlay.classList.add('active');
                modalOverlay.setAttribute('aria-hidden', 'false');
            }
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            modalOverlay.setAttribute('aria-hidden', 'true');
        }
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    /* --------------------------------------------------------------------------
       9. TOAST NOTIFICATION UTILITY
       -------------------------------------------------------------------------- */
    let toastTimeout;
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');

        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');

            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove('show');
            }, 3500);
        }
    }

});
