document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Management (Dark/Light mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 2. Shrink Navigation Header on Scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Mobile Navigation Menu Toggle
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // 4. Set Active Navigation Link based on current page URL
    const currentPath = window.location.pathname;
    const pageName = currentPath.split("/").pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === pageName || (pageName === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 5. Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger animation once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 6. Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const statsSection = document.querySelector('.stats') || statNumbers[0].parentElement;
        let countStarted = false;

        const countUp = (element) => {
            const target = parseInt(element.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;
            
            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    element.textContent = target.toLocaleString('ar-EG') + '+';
                    clearInterval(timer);
                } else {
                    element.textContent = current.toLocaleString('ar-EG') + '+';
                }
            }, stepTime);
        };

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countStarted) {
                    statNumbers.forEach(num => countUp(num));
                    countStarted = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }

    // 7. Accordion for FAQ
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const isActive = currentItem.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                currentItem.classList.add('active');
            }
        });
    });

    // 8. Contact/Demo Request Form Submission Simulator
    const contactForm = document.getElementById('medixia-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            const statusDiv = document.getElementById('form-status-message');
            
            // Simple validation check
            const doctorName = document.getElementById('doctor-name').value.trim();
            const doctorPhone = document.getElementById('doctor-phone').value.trim();
            const specialty = document.getElementById('clinic-specialty') ? document.getElementById('clinic-specialty').value.trim() : '';
            const systemType = document.getElementById('system-type').value;
            const notes = document.getElementById('notes') ? document.getElementById('notes').value.trim() : '';
            
            if (!doctorName || !doctorPhone || !systemType) {
                showStatus('يرجى ملء جميع الحقول المطلوبة.', 'error');
                return;
            }

            // Disable button & show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 38 38" stroke="currentColor" style="animation: rotate 1s linear infinite;">
                    <g fill="none" fill-rule="evenodd">
                        <g transform="translate(1 1)" stroke-width="3">
                            <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                            <path d="M36 18c0-9.94-8.06-18-18-18"></path>
                        </g>
                    </g>
                </svg>
                جاري إرسال طلبك...
            `;
            
            // CSS for rotation spinner
            if (!document.getElementById('spinner-style')) {
                const style = document.createElement('style');
                style.id = 'spinner-style';
                style.textContent = `
                    @keyframes rotate {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }

            // Build email content and send via mailto
            const systemLabels = {
                'clinics': 'سيستم العيادات (750 ج.م/شهر)',
                'centers': 'سيستم المراكز الطبية (2500 ج.م/شهر)',
                'both': 'طلب استشارة لاختيار النظام'
            };

            const emailSubject = encodeURIComponent(`طلب تجربة مجانية - ${doctorName} - ${systemLabels[systemType] || systemType}`);
            const emailBody = encodeURIComponent(
                `طلب تجربة مجانية من موقع ميديكسيا\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `الاسم: ${doctorName}\n` +
                `الهاتف: ${doctorPhone}\n` +
                `التخصص / العيادة: ${specialty || 'غير محدد'}\n` +
                `النظام المطلوب: ${systemLabels[systemType] || systemType}\n` +
                `ملاحظات: ${notes || 'لا توجد'}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `تم الإرسال من موقع Medixia`
            );

            const mailtoLink = `mailto:medixiasoft@gmail.com?subject=${emailSubject}&body=${emailBody}`;

            // Open email client
            window.location.href = mailtoLink;

            // Also build WhatsApp message as backup
            const waMessage = encodeURIComponent(
                `*طلب تجربة مجانية من موقع ميديكسيا*\n\n` +
                `الاسم: ${doctorName}\n` +
                `الهاتف: ${doctorPhone}\n` +
                `التخصص: ${specialty || 'غير محدد'}\n` +
                `النظام: ${systemLabels[systemType] || systemType}\n` +
                `ملاحظات: ${notes || 'لا توجد'}`
            );

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                
                // Show success message with WhatsApp backup link
                showStatus('تم فتح برنامج البريد الإلكتروني لإرسال طلبك! إذا لم يُفتح تلقائياً، يمكنك التواصل عبر واتساب: 01552241839', 'success');
                contactForm.reset();
            }, 1000);

            function showStatus(msg, type) {
                statusDiv.textContent = msg;
                statusDiv.className = `form-status ${type}`;
                statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // 9. Offer Countdown Timer
    const countdownElement = document.getElementById('countdown-timer');
    if (countdownElement) {
        // Set target date: 4 days from now
        let targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        targetDate.setHours(23, 59, 59, 0);
        
        // Update countdown every second
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;
            
            if (distance < 0) {
                countdownElement.textContent = "انتهى العرض الحالي! تواصل معنا للحصول على السعر الجديد.";
                clearInterval(countdownInterval);
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElement.textContent = `ينتهي هذا العرض المحدود خلال: ${days} أيام و ${hours} ساعات و ${minutes} دقائق و ${seconds} ثانية`;
        };
        
        updateCountdown(); // Run immediately
        const countdownInterval = setInterval(updateCountdown, 1000);
    }
});
