
// Registra Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registrato');
      })
      .catch(err => {
        console.log('ServiceWorker non registrato: ', err);
      });
  });
}

// Intersection Observer per l'animazione about
const aboutSections = [
    document.querySelector('.aboutExternBox'),
    document.querySelector('.storyBox'),
    document.querySelector('.story2Box')
];

const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            aboutObserver.unobserve(entry.target); // Ferma l'osservazione dopo l'animazione
        }
    });
}, {
    threshold: 0.2, // Attiva quando almeno il 20% della sezione è visibile
    rootMargin: '0px'
});

aboutSections.forEach(section => {
    if (section) {
        aboutObserver.observe(section);
    }
});

function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const menuButton = document.querySelector('.navbarMenu');
    const body = document.body;
    const isOpen = menu.classList.contains('open');
    
    menu.classList.toggle('open');
    menuButton.classList.toggle('hidden');
    
    // Aggiorna gli attributi ARIA
    menu.setAttribute('aria-hidden', !isOpen);
    menuButton.setAttribute('aria-expanded', isOpen);
    
    // Toggle body scroll
    body.style.overflow = isOpen ? 'auto' : 'hidden';
}

// Aggiungi event listener per tutti i link nel menu
document.querySelectorAll('.side-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href') !== '#') {  // Non eseguire per il bottone close
            const targetId = this.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            // Chiudi il menu e riabilita lo scroll
            toggleMenu();
            document.body.style.overflow = 'auto';
            
            // Scroll alla sezione
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');

    if (window.scrollY === 0) {
        navbar.classList.remove('hidden');
    } else if (lastScrollY < window.scrollY) {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }

    lastScrollY = window.scrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateNavbar();
        });
        ticking = true;
    }
});

// Carousel functionality
function startCarousel(containerId) {
    const carouselContainer = document.getElementById(containerId);
    const imageCount = 30;  // Aumentato a 30 per supportare più immagini
    let loadedImages = [];
    
    // Funzione per randomizzare l'array delle immagini
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Funzione per provare a caricare un'immagine
    function tryLoadImage(index) {
        return new Promise((resolve) => {
            const img = new Image();
            const paddedIndex = String(index).padStart(2, '0');
            img.src = `images/gallery/${paddedIndex}.webp`;

            img.onload = () => {
                loadedImages.push(img.src);
                resolve(true);
            };

            img.onerror = () => {                        
                resolve(false);
            };
        });
    }

    // Carica tutte le immagini disponibili
    async function loadAllImages() {
        const loadPromises = [];
        for (let i = 1; i <= imageCount; i++) {
            loadPromises.push(tryLoadImage(i));
        }

        await Promise.all(loadPromises);
        
        // Randomizza l'ordine delle immagini
        loadedImages = shuffleArray(loadedImages);

        // Crea le slides con le immagini trovate
        loadedImages.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide' + (index === 0 ? ' active' : '');
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Collezione Eclettica ${index + 1}`;
            img.loading = 'eager';
            
            slide.appendChild(img);
            carouselContainer.appendChild(slide);
        });

        // Avvia il carousel con un delay casuale
        if (loadedImages.length > 0) {
            const randomDelay = Math.random() * 1500; // Delay casuale tra 0 e 1.5 secondi
            setTimeout(() => {
                startRotation(carouselContainer);
            }, randomDelay);
        }
    }

    function startRotation(container) {
        const slides = container.querySelectorAll('.carousel-slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        const rotationInterval = 3000 + Math.random() * 2000; // Intervallo casuale tra 3 e 5 secondi

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }

        setInterval(nextSlide, rotationInterval);
    }

    // Avvia il caricamento delle immagini
    loadAllImages();
}

// Avvia entrambi i carousel quando la pagina è caricata
document.addEventListener('DOMContentLoaded', () => {
    startCarousel('gallery-carousel-1');
    startCarousel('gallery-carousel-2');
});
