// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(8, 8, 20, 0.9)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'rgba(8, 8, 20, 0.8)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Create floating particles
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const numberOfParticles = 50;
    
    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('span');
        particle.classList.add('particle');
        
        // Randomize particle properties
        const size = Math.random() * 5 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 15 + 10;
        const opacity = Math.random() * 0.5 + 0.1;
        
        // Set particle styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.bottom = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.opacity = opacity;
        
        // Add different colors to particles
        const colors = ['#6c5ce7', '#a29bfe', '#00b894', '#ff7675', '#00cec9'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = randomColor;
        particle.style.boxShadow = `0 0 ${size + 2}px ${randomColor}`;
        
        particlesContainer.appendChild(particle);
    }
}

// Add particles on load
window.addEventListener('load', createParticles);

// Add animation to elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.section-title, .project-card, .skill-category, .achievement-item, .social-item, .contact-item, .certification-item, .timeline-content');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100 && elementBottom > 0) {
            element.classList.add('animate');
        }
    });
};

// Call animation function on scroll
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Add current year to copyright text
const currentYear = new Date().getFullYear();
const copyrightElement = document.querySelector('footer p');
if (copyrightElement) {
    copyrightElement.textContent = `© ${currentYear} Daksh Mor. All rights reserved.`;
}

// Optimus Prime Easter Egg
const logo = document.querySelector('.logo');
let logoClickCount = 0;

if (logo) {
    logo.addEventListener('click', () => {
        logoClickCount++;
        
        if (logoClickCount === 5) {
            logo.classList.add('activated');
            
            // Create transforming animation
            logo.style.transition = 'transform 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
            logo.style.transform = 'rotate(360deg) scale(1.2)';
            
            setTimeout(() => {
                // Add Optimus Prime quote
                const quote = document.createElement('div');
                quote.textContent = 'Freedom is the right of all sentient beings.';
                quote.style.position = 'fixed';
                quote.style.bottom = '20px';
                quote.style.right = '20px';
                quote.style.padding = '10px 15px';
                quote.style.backgroundColor = 'rgba(8, 8, 20, 0.9)';
                quote.style.color = '#a29bfe';
                quote.style.borderRadius = '5px';
                quote.style.fontWeight = 'bold';
                quote.style.zIndex = '1000';
                quote.style.boxShadow = '0 0 10px rgba(108, 92, 231, 0.8)';
                quote.style.animation = 'fadeInUp 0.5s forwards';
                
                document.body.appendChild(quote);
                
                setTimeout(() => {
                    quote.style.animation = 'fadeInUp 0.5s reverse forwards';
                    setTimeout(() => {
                        document.body.removeChild(quote);
                    }, 500);
                }, 3000);
            }, 1000);
            
            // Reset
            setTimeout(() => {
                logo.style.transform = '';
                logoClickCount = 0;
                setTimeout(() => {
                    logo.classList.remove('activated');
                }, 5000);
            }, 2000);
        }
    });
}

// Travis Scott Easter Egg
const heroTitle = document.querySelector('.hero-content h2');
let isTransformed = false;

if (heroTitle) {
    heroTitle.addEventListener('click', () => {
        if (!isTransformed) {
            heroTitle.classList.add('transformed');
            
            // Play a quick animation
            heroTitle.style.animation = 'fadeInUp 0.5s ease';
            
            // Create a brief flame effect
            const flame = document.createElement('div');
            flame.style.position = 'fixed';
            flame.style.top = '0';
            flame.style.left = '0';
            flame.style.width = '100%';
            flame.style.height = '100%';
            flame.style.backgroundColor = 'rgba(255, 140, 0, 0.1)';
            flame.style.zIndex = '9998';
            flame.style.pointerEvents = 'none';
            
            // Add flame emoji raining
            for (let i = 0; i < 20; i++) {
                const emoji = document.createElement('div');
                emoji.textContent = '🔥';
                emoji.style.position = 'absolute';
                emoji.style.fontSize = '24px';
                emoji.style.left = `${Math.random() * 100}%`;
                emoji.style.top = '-50px';
                emoji.style.animationDuration = `${Math.random() * 2 + 1}s`;
                emoji.style.animationName = 'matrixRain';
                emoji.style.animationIterationCount = '1';
                emoji.style.animationFillMode = 'forwards';
                flame.appendChild(emoji);
            }
            
            document.body.appendChild(flame);
            
            // Remove after animation
            setTimeout(() => {
                document.body.removeChild(flame);
            }, 3000);
            
            isTransformed = true;
            
            // Reset after a while
            setTimeout(() => {
                heroTitle.classList.remove('transformed');
                isTransformed = false;
            }, 5000);
        }
    });
}

// Add hover effect for project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 0 20px rgba(108, 92, 231, 0.8)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
});

// Add glowing effect to skills on hover
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = 'rgba(108, 92, 231, 0.3)';
        item.style.transform = 'translateY(-3px)';
        item.style.boxShadow = '0 0 10px rgba(108, 92, 231, 0.5)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = '';
        item.style.transform = '';
        item.style.boxShadow = '';
    });
    
    // Show ML facts for ML-related skills
    item.addEventListener('click', () => {
        const mlSkills = ['PyTorch', 'TensorFlow', 'Hugging Face', 'Transformers', 'LightGBM', 'XGBoost', 'Scikit-learn', 'NumPy', 'Pandas'];
        
        if (mlSkills.includes(item.textContent.trim())) {
            const mlFacts = [
                'Backpropagation is just the chain rule in calculus!',
                'A neural network with no activation functions is just linear regression!',
                'Gradient descent is like rolling a ball down a hill to find the lowest point.',
                'Ensemble models combine multiple models to improve performance.',
                'Transformers revolutionized NLP by using attention mechanisms.',
                'Residual connections help deep networks train by providing gradient shortcuts.',
                'Batch normalization reduces internal covariate shift during training.',
                'Dropout prevents overfitting by randomly turning off neurons during training.',
                'Data augmentation is creating modified copies of your data to improve generalization.'
            ];
            
            const factIndex = Math.floor(Math.random() * mlFacts.length);
            
            const factBubble = document.createElement('div');
            factBubble.textContent = mlFacts[factIndex];
            factBubble.style.position = 'fixed';
            factBubble.style.bottom = '20px';
            factBubble.style.left = '20px';
            factBubble.style.padding = '10px 15px';
            factBubble.style.backgroundColor = 'rgba(0, 184, 148, 0.8)';
            factBubble.style.color = 'white';
            factBubble.style.borderRadius = '5px';
            factBubble.style.maxWidth = '300px';
            factBubble.style.zIndex = '1000';
            factBubble.style.boxShadow = '0 0 10px rgba(0, 184, 148, 0.5)';
            factBubble.style.animation = 'fadeInUp 0.5s forwards';
            
            document.body.appendChild(factBubble);
            
            setTimeout(() => {
                factBubble.style.animation = 'fadeInUp 0.5s reverse forwards';
                setTimeout(() => {
                    document.body.removeChild(factBubble);
                }, 500);
            }, 3000);
        }
    });
});

// Interactive profile image
const profileImage = document.querySelector('.profile-image');
if (profileImage) {
    profileImage.addEventListener('click', () => {
        profileImage.style.animation = 'pulse 0.5s';
        
        setTimeout(() => {
            profileImage.style.animation = '';
        }, 500);
    });
}

// Matrix code effect on Konami code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    // Get the key pressed
    const key = e.key.toLowerCase();
    
    // Check if the key matches the current expected key in the sequence
    const expectedKey = konamiCode[konamiIndex].toLowerCase();
    
    if (key === expectedKey) {
        // Move to the next key in the sequence
        konamiIndex++;
        
        // If the full sequence is entered
        if (konamiIndex === konamiCode.length) {
            activateMatrixMode();
            konamiIndex = 0; // Reset for next time
        }
    } else {
        // Reset if wrong key
        konamiIndex = 0;
    }
});

function activateMatrixMode() {
    // Create Matrix-style overlay
    const matrix = document.createElement('div');
    matrix.className = 'matrix-code';
    
    const matrixText = document.createElement('div');
    matrixText.className = 'matrix-text';
    matrixText.textContent = 'Entering the Neural Network...';
    
    const codeContainer = document.createElement('div');
    codeContainer.className = 'matrix-code-container';
    
    // Add some ML jargon that falls down the screen
    const mlJargon = [
        'Gradient Descent', 'Backpropagation', 'Regularization', 'Hyperparameter',
        'Convolutional Neural Network', 'Tensor', 'Activation Function', 'Batch Normalization',
        'Dropout', 'LSTM', 'ReLU', 'Sigmoid', 'Softmax', 'Cross-Entropy',
        'Precision-Recall', 'F1 Score', 'ROC Curve', 'AUC', 'Ensemble Method',
        'Random Forest', 'XGBoost', 'GAN', 'Transformer', 'Attention Mechanism',
        'Fine-tuning', 'Transfer Learning', 'Dimensionality Reduction', 'PCA',
        'Cross-Validation', 'Overfitting', 'Underfitting', 'Bias-Variance Tradeoff'
    ];
    
    for (let i = 0; i < 100; i++) {
        const term = document.createElement('div');
        term.textContent = mlJargon[Math.floor(Math.random() * mlJargon.length)];
        term.style.position = 'absolute';
        term.style.left = `${Math.random() * 100}%`;
        term.style.top = `-50px`;
        term.style.color = '#00FF00';
        term.style.fontFamily = 'monospace';
        term.style.fontSize = `${Math.random() * 10 + 10}px`;
        term.style.opacity = `${Math.random() * 0.5 + 0.5}`;
        term.style.animationDuration = `${Math.random() * 3 + 2}s`;
        term.style.animationDelay = `${Math.random() * 2}s`;
        term.style.animationName = 'matrixRain';
        term.style.animationIterationCount = 'infinite';
        
        codeContainer.appendChild(term);
    }
    
    matrix.appendChild(matrixText);
    matrix.appendChild(codeContainer);
    document.body.appendChild(matrix);
    
    // Display matrix effect
    matrix.style.display = 'flex';
    
    // Remove after a few seconds
    setTimeout(() => {
        matrix.style.opacity = '0';
        matrix.style.transition = 'opacity 1s ease';
        
        setTimeout(() => {
            document.body.removeChild(matrix);
        }, 1000);
    }, 5000);
}

// Add blinking cursor to Education section for coding vibe
window.addEventListener('load', () => {
    const courseworkText = document.querySelector('.timeline-details p');
    if (courseworkText) {
        const textContent = courseworkText.textContent;
        courseworkText.innerHTML = `${textContent}<span class="blinking-cursor">|</span>`;
        
        const cursor = document.querySelector('.blinking-cursor');
        if (cursor) {
            cursor.style.opacity = '1';
            cursor.style.animation = 'blink 1s infinite';
        }
    }
});

// Add custom CSS for animations we've added
const customCSS = document.createElement('style');
customCSS.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .blinking-cursor {
        color: var(--primary-light);
        font-weight: bold;
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;
document.head.appendChild(customCSS);