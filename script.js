// Login Handling
document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-overlay');
    const loginButton = document.getElementById('login-button');
    const mainContent = document.querySelector('.desktop-icons').parentElement;
    const bootSound = document.getElementById('boot-sound');

    // Add main-content class to the body content
    mainContent.classList.add('main-content');

    loginButton.addEventListener('click', () => {
        // Fade out login overlay
        loginOverlay.classList.add('fade-out');

        // Play boot sound
        bootSound.play();

        // After fade out animation ends, hide the overlay and fade in main content
        setTimeout(() => {
            loginOverlay.style.display = 'none';
            mainContent.classList.add('fade-in');
        }, 500); // Make sure this matches your CSS animation duration
    });
});

// Desktop icon functionality
const desktopIcons = document.querySelectorAll('.desktop-icon');
const clickSound = document.getElementById('click-sound');
const contextMenu = document.getElementById('context-menu');

// Boot sound functionality
document.addEventListener('DOMContentLoaded', () => {
    const bootSound = document.getElementById('boot-sound');
    if (bootSound) {
        bootSound.play().then(() => {
            document.body.classList.add('booted');
            // Show about modal by default after boot sound
            const aboutModal = document.getElementById('about-modal');
            if (aboutModal) {
                aboutModal.classList.remove('hidden');
                aboutModal.classList.add('show');
            }
        }).catch(error => {
            console.warn('Failed to play boot sound:', error);
            document.body.classList.add('booted');
            // Show about modal by default even if boot sound fails
            const aboutModal = document.getElementById('about-modal');
            if (aboutModal) {
                aboutModal.classList.remove('hidden');
                aboutModal.classList.add('show');
            }
        });
    } else {
        // If no boot sound, still show about modal
        document.body.classList.add('booted');
        const aboutModal = document.getElementById('about-modal');
        if (aboutModal) {
            aboutModal.classList.remove('hidden');
            aboutModal.classList.add('show');
        }
    }
});

// Context menu functionality
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    // Only show context menu on desktop icons
    if (e.target.closest('.desktop-icon')) {
        const icon = e.target.closest('.desktop-icon');
        const rect = icon.getBoundingClientRect();
        
        // Position context menu
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.classList.remove('hidden');
        
        // Play click sound
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(error => {
                console.warn('Failed to play click sound:', error);
            });
        }
    }
});

// Hide context menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('#context-menu')) {
        contextMenu.classList.add('hidden');
    }
});

// Update clock
function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    clock.textContent = time;
    // Update aria-label for screen readers
    clock.setAttribute('aria-label', `Current time is ${time}`);
}

// Initialize clock and update every minute
updateClock();
setInterval(updateClock, 60000);

// Handle icon selection and keyboard navigation
desktopIcons.forEach(icon => {
    // Click handler
    icon.addEventListener('click', (e) => {
        handleIconSelection(icon);
    });

    // Keyboard handler
    icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleIconSelection(icon);
        }
    });
});

function handleIconSelection(icon) {
    // Remove selection from other icons
    desktopIcons.forEach(i => i.classList.remove('selected'));
    
    // Select clicked icon
    icon.classList.add('selected');
    
    // Play click sound
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(error => {
            console.warn('Failed to play click sound:', error);
        });
    }
    
    // Close any other open modals
    document.querySelectorAll('.modal').forEach(modal => {
        if (!modal.classList.contains('hidden')) {
            closeModal(modal);
        }
    });
    
    // Open corresponding modal
    const section = icon.dataset.section;
    const modal = document.getElementById(`${section}-modal`);
    if (modal) {
        // Reset position to center
        modal.style.left = '';
        modal.style.top = '';
        modal.style.transform = 'translate(-50%, -50%)';
        
        modal.classList.remove('hidden');
        modal.classList.add('show');
        // Focus the first focusable element in the modal
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
}

// Close modals when clicking close button or pressing Escape
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// Add keyboard support for modals
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(modal);
        }
    });
});

function closeModal(modal) {
    if (!modal) return;
    
    modal.classList.add('hidden');
    modal.classList.remove('show');
    
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(error => {
            console.warn('Failed to play click sound:', error);
        });
    }
    
    // Return focus to the triggering element
    const trigger = document.querySelector(`[data-section="${modal.id.replace('-modal', '')}"]`);
    if (trigger) {
        trigger.focus();
    }
}

// Start menu functionality
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');

if (startButton && startMenu) {
    startButton.addEventListener('click', (e) => {
        toggleStartMenu();
        e.stopPropagation();
    });

    // Keyboard support for start menu
    startButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleStartMenu();
        }
    });
}

function toggleStartMenu() {
    const isHidden = startMenu.classList.contains('hidden');
    startMenu.classList.toggle('hidden');
    startButton.setAttribute('aria-expanded', !isHidden);
    
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(error => {
            console.warn('Failed to play click sound:', error);
        });
    }
    
    if (!isHidden) {
        // Focus first menu item when opening
        const firstMenuItem = startMenu.querySelector('.start-menu-item');
        if (firstMenuItem) {
            firstMenuItem.focus();
        }
    }
}

// Hide start menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('#start-menu') && !e.target.closest('#start-button')) {
        startMenu.classList.add('hidden');
        startButton.setAttribute('aria-expanded', 'false');
    }
});

// Handle start menu item clicks and keyboard navigation
document.querySelectorAll('.start-menu-item[data-section]').forEach(item => {
    item.addEventListener('click', () => {
        handleStartMenuItem(item);
    });

    item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleStartMenuItem(item);
        }
    });
});

function handleStartMenuItem(item) {
    // Skip if this is the shutdown button
    if (item.id === 'shutdown-btn') {
        return;
    }
    
    const section = item.getAttribute('data-section');
    
    // Close any other open modals
    document.querySelectorAll('.modal').forEach(modal => {
        if (!modal.classList.contains('hidden')) {
            closeModal(modal);
        }
    });
    
    const modal = document.getElementById(`${section}-modal`);
    if (modal) {
        // Reset position to center
        modal.style.left = '';
        modal.style.top = '';
        modal.style.transform = 'translate(-50%, -50%)';
        
        modal.classList.remove('hidden');
        modal.classList.add('show');
        // Focus the first focusable element in the modal
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }
    startMenu.classList.add('hidden');
    startButton.setAttribute('aria-expanded', 'false');
    
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(error => {
            console.warn('Failed to play click sound:', error);
        });
    }
}

// Click outside to deselect icons
document.addEventListener('click', (e) => {
    if (!e.target.closest('.desktop-icon')) {
        desktopIcons.forEach(icon => icon.classList.remove('selected'));
    }
});


// Shutdown functionality
const shutdownBtn = document.getElementById('shutdown-btn');
const shutdownModal = document.getElementById('shutdown-modal');
const shutdownConfirm = document.getElementById('shutdown-confirm');
const shutdownCancel = document.getElementById('shutdown-cancel');

if (shutdownBtn && shutdownModal) {
    shutdownBtn.addEventListener('click', () => {
        // Close any open modals except the shutdown modal
        const openModals = document.querySelectorAll('.modal:not(.hidden):not(#shutdown-modal)');
        openModals.forEach(modal => {
            modal.classList.add('hidden');
            modal.classList.remove('show');
        });

        // Close start menu if it's open
        const startMenu = document.getElementById('start-menu');
        if (startMenu) {
            startMenu.classList.add('hidden');
        }

        // Show shutdown modal
        shutdownModal.classList.remove('hidden');
        shutdownModal.classList.add('show');
    });

    if (shutdownConfirm) {
        shutdownConfirm.addEventListener('click', () => {
            const shutdownSound = document.getElementById('shutdown-sound');
            if (shutdownSound) {
                shutdownSound.play().catch(error => {
                    console.warn('Failed to play shutdown sound:', error);
                });
            }
            document.body.classList.add('shutting-down');
            setTimeout(() => {
                window.location.href = 'https://www.google.com';
            }, 2000);
        });
    }

    if (shutdownCancel) {
        shutdownCancel.addEventListener('click', () => {
            shutdownModal.classList.add('hidden');
            shutdownModal.classList.remove('show');
            
            // Play click sound
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(error => {
                    console.warn('Failed to play click sound:', error);
                });
            }
        });
    }
    
    // Handle close button
    const closeBtn = shutdownModal.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            shutdownModal.classList.add('hidden');
            shutdownModal.classList.remove('show');
            
            // Play click sound
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(error => {
                    console.warn('Failed to play click sound:', error);
                });
            }
        });
    }
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<img src="assets/mail.png" alt="" class="w-4 h-4 mr-1 inline"> Sending...';
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('Message sent successfully!');
                contactForm.reset();
            } else {
                // Check for specific error messages from Formspree
                if (result.error) {
                    throw new Error(result.error);
                } else {
                    throw new Error('Failed to send message. Please try again later.');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Error sending message: ' + error.message);
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });
} 
