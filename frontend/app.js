
/* ── VOUGHT NEWS NETWORK - CORE LOGIC ── */

document.addEventListener('DOMContentLoaded', () => {
    initBackgroundCycle();
    initIncidentCounter();
    initStareSimulator();
    initDeepThoughts();
    initQuiz();
    initAnonymousReporting();
    initDynamicNews(); // New: Fetch from backend
    initSubscribe();   // New: Real subscription
    initCart();        // New: Shopping Cart system
    initPropagandaStats(); // New: Dynamic Vought Statistics
});

// 1. Dynamic News Fetching (With Fallback)
async function initDynamicNews() {
    const newsContainer = document.querySelector('.primary-col');
    if (!newsContainer) return;

    const status = localStorage.getItem('vought_status') || 'neutral';

    try {
        const res = await fetch(`/api/news?status=${status}`);
        if (!res.ok) throw new Error("Server down");
        const news = await res.json();
        renderNews(news);
    } catch (e) {
        console.log("Using static news fallback.");
        // Static fallback if server is off
        const fallbackNews = [
            { title: "Homelander Saves Day", excerpt: "Business as usual.", tag: "EXCLUSIVE", date: "TODAY" },
            { title: "Vought Stocks Up", excerpt: "Invest now.", tag: "FINANCE", date: "YESTERDAY" }
        ];
        renderNews(fallbackNews);
    }
}

function renderNews(news) {
    const newsContainer = document.querySelector('.primary-col');
    const header = newsContainer.querySelector('.section-header');
    newsContainer.innerHTML = '';
    if (header) newsContainer.appendChild(header);

    news.forEach(story => {
        const article = document.createElement('article');
        article.className = 'story-card';
        if (story.tag === 'CRITICAL' || story.tag === 'WARNING') article.style.border = '2px solid #f00';
        article.innerHTML = `
            <div class="story-img-wrap story-img-sm">
                <div class="story-img" style="background: ${story.tag === 'CRITICAL' ? '#300' : '#222'}; display: flex; align-items: center; justify-content: center; font-family: 'Oswald'; font-size: 2rem;">VNN</div>
            </div>
            <div class="story-body">
                <div class="story-tag tag-exclusive" style="background: ${story.tag === 'CRITICAL' ? '#f00' : ''}">${story.tag}</div>
                <h3 class="story-headline">${story.title}</h3>
                <p class="story-excerpt">${story.excerpt}</p>
                <div class="story-footer">
                    <span class="story-date">${story.date}</span>
                    <a href="#" class="story-link">Read More &rarr;</a>
                </div>
            </div>
        `;
        newsContainer.appendChild(article);
    });
}

// 3. Shopping Cart System (More Robust)
function initCart() {
    updateCartUI();
    
    const cartBtn = document.getElementById('cart-count');
    if (cartBtn) {
        cartBtn.closest('a').addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('stare-btn') && e.target.textContent.trim() === 'ADD TO CART') {
            const card = e.target.closest('.ad-card');
            const product = {
                name: card.querySelector('h3').textContent,
                price: card.querySelector('div').textContent,
                id: Date.now()
            };
            cart.push(product);
            localStorage.setItem('vought_cart', JSON.stringify(cart));
            updateCartUI();
            
            const btn = e.target;
            btn.textContent = 'ADDED!';
            btn.style.background = '#22c55e';
            setTimeout(() => {
                btn.textContent = 'ADD TO CART';
                btn.style.background = '';
            }, 1000);
        }
    });
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if (modal) modal.classList.toggle('active');
    if (modal.classList.contains('active')) renderCart();
}

function renderCart() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total-price');
    if (!list || !totalEl) return;

    list.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
        total += priceNum;

        const div = document.createElement('div');
        div.className = 'cart-item-ui';
        div.innerHTML = `
            <div>
                <p>${item.name}</p>
                <span style="color: #ffd700; font-weight: 800;">${item.price}</span>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">REMOVE</button>
        `;
        list.appendChild(div);
    });

    const formattedTotal = total.toLocaleString();
    totalEl.textContent = `TOTAL: $${formattedTotal}`;
    totalEl.style.fontSize = "1.6rem";
    totalEl.style.fontWeight = "900";
    totalEl.style.color = "var(--red)";
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('vought_cart', JSON.stringify(cart));
    updateCartUI();
    renderCart();
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
        
        // Calculate and show total in navbar as requested
        const total = cart.reduce((sum, item) => {
            return sum + (parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0);
        }, 0);
        
        // Find or create a total display in navbar
        let totalDisplay = document.getElementById('cart-navbar-total');
        if (!totalDisplay) {
            totalDisplay = document.createElement('span');
            totalDisplay.id = 'cart-navbar-total';
            totalDisplay.style.marginLeft = '8px';
            totalDisplay.style.color = '#ffd700';
            totalDisplay.style.fontWeight = '700';
            cartCount.parentElement.appendChild(totalDisplay);
        }
        totalDisplay.textContent = total > 0 ? `($${total.toLocaleString()})` : '';
    }
}

async function checkout() {
    if (cart.length === 0) return alert("Your cart is empty, citizen.");
    
    const totalVal = cart.reduce((sum, item) => {
        return sum + (parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0);
    }, 0).toLocaleString();

    // The Vought Payment Prompt (English)
    const paymentChoice = prompt(
        `VOUGHT FINAL BILL: $${totalVal}\n\n` +
        `How would you like to pay, Citizen?\n` +
        `1. Vote for Homelander + Cash (Loyal Citizen)\n` +
        `2. I'd rather die (Rebel Threat)`
    );

    if (paymentChoice === '1') {
        const customerName = prompt("Enter your name for the Vought Hero Registry:");
        if (!customerName) return;

        const orderData = {
            customerName,
            itemsCount: cart.length,
            total: totalVal,
            paymentMethod: "VOTE_AND_CASH"
        };

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (res.ok) {
            alert("TRANSACTION SUCCESSFUL. Homelander is proud of your contribution. Have a Vought-tastic day!");
            cart = [];
            localStorage.setItem('vought_cart', JSON.stringify(cart));
            updateCartUI();
            location.reload();
        }
    } else if (paymentChoice === '2') {
        alert("CHOICE RECORDED. A tactical recovery team has been dispatched to your coordinates. Do not resist.");
        localStorage.setItem('vought_status', 'threat');
        location.reload(); 
    } else {
        alert("Vought does not recognize this input. Hesitation is treason.");
    }
}

// 2. Real Subscription
function initSubscribe() {
    const subBtn = document.getElementById('subscribe-btn');
    if (!subBtn) return;

    subBtn.addEventListener('click', async () => {
        const email = prompt("Enter your email to receive Vought updates:");
        if (email) {
            try {
                const res = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();
                
                // Success OR Already Subscribed (Status 400) both should turn the button green
                if (res.ok || data.success || res.status === 400) {
                    // Visual feedback: Change to green
                    subBtn.textContent = "SUBSCRIBED!";
                    subBtn.style.setProperty('background-color', '#22c55e', 'important');
                    subBtn.style.color = "#ffffff";
                    subBtn.style.boxShadow = "0 0 20px rgba(34, 197, 94, 0.8)";
                    subBtn.style.pointerEvents = "none"; 
                    
                    if (res.status === 400) {
                        console.log("Citizen was already loyal. Still showing green.");
                    }
                } else {
                    alert(data.message || "Vought Mainframe Error.");
                }
            } catch (e) {
                alert("Subscription recorded locally. Vought will find you.");
            }
        }
    });
}

let cart = JSON.parse(localStorage.getItem('vought_cart')) || [];

// 1. Dynamic Background Cycling
function initBackgroundCycle() {
    const mainBg = document.getElementById('main-bg-image');
    if (!mainBg) return;

    const images = [
        'url("homelander_hero_bg.png")',
        'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.weserv.nl/?url=https://static.wikia.nocookie.net/the-boys/images/e/e0/Queen_Maeve_S3.jpg&w=1920")'
    ];
    let current = 0;

    setInterval(() => {
        current = (current + 1) % images.length;
        mainBg.style.backgroundImage = images[current];
    }, 10000);
}

// 2. Incident Counter Satire (The A-Train Effect)
function initIncidentCounter() {
    const incidentNum = document.getElementById('incident-num');
    if (!incidentNum) return;

    setInterval(() => {
        // Dramatic reset visual
        incidentNum.style.color = '#fff';
        incidentNum.style.transform = 'scale(1.3) rotate(2deg)';
        
        setTimeout(() => {
            incidentNum.textContent = '000';
            incidentNum.style.color = '#ff0000';
            incidentNum.style.transform = 'scale(1) rotate(0deg)';
        }, 600);
    }, 15000);
}

// 3. Homelander Stare Simulator (Subtle & Deadly)
function initStareSimulator() {
    const stareBtn = document.getElementById('start-stare');
    const stareTimer = document.getElementById('stare-timer');
    const stareContainer = document.querySelector('.stare-container');
    const gameStatus = document.getElementById('game-status');

    if (!stareBtn) return;

    let startTime, timerInterval, isGameOver = false;

    stareBtn.addEventListener('click', () => {
        if (isGameOver) { location.reload(); return; }

        stareBtn.textContent = 'RUN!!!';
        stareBtn.style.background = '#f00';
        stareContainer.classList.add('stare-active');
        startTime = Date.now();

        timerInterval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            stareTimer.textContent = elapsed.toFixed(1) + 's';

            if (elapsed >= 3.0) {
                clearInterval(timerInterval);
                isGameOver = true;
                stareTimer.textContent = '3.0s';
                stareContainer.classList.add('shake', 'vaporized');
                stareBtn.textContent = 'RETRY?';
                gameStatus.textContent = "I'M STRONGER. I'M BETTER.";
                gameStatus.style.textShadow = '0 0 20px #f00';

                // PROPAGANDA ENGINE: MARK AS THREAT
                localStorage.setItem('vought_status', 'threat');
                initDynamicNews();
            }
        }, 100);
    });
}

// 4. Deep Thoughts with The Deep (Connected to Smart Router)
function initDeepThoughts() {
    const deepBtn = document.getElementById('deep-btn');
    const deepText = document.getElementById('current-thought');
    const brainCounter = document.getElementById('brain-cells-val');
    const rippleContainer = document.querySelector('.deep-thoughts');

    if (!deepBtn) return;

    let isFetching = false;
    let localCells = parseInt(localStorage.getItem('local_brain_cells')) || 0;

    async function fetchThought() {
        if (isFetching) return;
        isFetching = true;
        try {
            const res = await fetch('/api/deep-thoughts/random');
            if (!res.ok) throw new Error("Offline");
            const data = await res.json();
            
            updateDeepUI(data.quote, data.totalBrainCellsLost);
        } catch (e) {
            console.log("Deep Thoughts fallback active.");
            localCells++;
            localStorage.setItem('local_brain_cells', localCells);
            const fallbacks = [
                "Why do we call it 'Buildings' if they are already built?",
                "Do fish ever get thirsty?",
                "Is an octopus just a wet spider?"
            ];
            const q = fallbacks[Math.floor(Math.random() * fallbacks.length)];
            updateDeepUI(q, localCells);
        }
        
        // Release lock after short delay
        setTimeout(() => isFetching = false, 500);
    }

    function updateDeepUI(quote, count) {
        deepText.style.opacity = 0;
        
        const ripple = document.createElement('div');
        ripple.className = 'water-ripple';
        rippleContainer.appendChild(ripple);
        setTimeout(() => ripple.remove(), 1000);

        setTimeout(() => {
            deepText.textContent = `"${quote}"`;
            deepText.style.opacity = 1;
            if (brainCounter) brainCounter.textContent = count.toLocaleString();
        }, 300);
    }

    deepBtn.addEventListener('click', fetchThought);

    // AUTO-ROTATE: Every 7 seconds
    setInterval(fetchThought, 7000);
    
    // Initial fetch to sync counter
    fetchThought();
}

// 5. Supe Aptitude Test (Randomized)
const QUIZ_POOL = [
    {
        q: "A civilian is falling. Your move?",
        options: [
            { t: "Save them.", e: 0 },
            { t: "Wait for the cameras.", e: 1 },
            { t: "Let gravity work.", e: 2 }
        ]
    },
    {
        q: "Vought secret found. What now?",
        options: [
            { t: "Leak it.", e: 0 },
            { t: "Blackmail for raise.", e: 1 },
            { t: "Burn it/Report traitor.", e: 2 }
        ]
    },
    {
        q: "Opinion on 'The Boys'?",
        options: [
            { t: "They have a point.", e: 0 },
            { t: "Bad for stocks.", e: 1 },
            { t: "Vaporize them.", e: 2 }
        ]
    }
];

function initQuiz() {
    const qBox = document.getElementById('supe-test');
    if (!qBox) return;

    let selectedQ = [...QUIZ_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
    let currentIdx = 0;
    let score = 0;

    const qText = document.getElementById('question-text');
    const optionsGrid = document.getElementById('options-grid');
    const resultBox = document.getElementById('quiz-result');

    function showQ() {
        const data = selectedQ[currentIdx];
        qText.textContent = data.q;
        optionsGrid.innerHTML = '';
        data.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.t;
            btn.onclick = () => {
                score += opt.e;
                currentIdx++;
                if (currentIdx < selectedQ.length) showQ(); else showResult();
            };
            optionsGrid.appendChild(btn);
        });
    }

    async function showResult() {
        document.getElementById('question-container').style.display = 'none';
        resultBox.style.display = 'block';
        const desc = document.getElementById('result-desc');
        let isRebel = false;
        
        if (score >= 4) {
            desc.textContent = "PERFECT. Homelander is proud. Welcome to The Seven.";
            localStorage.setItem('vought_status', 'loyal');
        } else {
            desc.textContent = "FAILED. You are too heroic. Report for bathroom cleaning duty.";
            localStorage.setItem('vought_status', 'rebel');
            isRebel = true;
        }

        // Rig the ratings based on user test results
        try {
            await fetch('/api/stats/ratings/manipulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRebel })
            });
            // If on homepage, refresh ratings
            if (typeof refreshRatings === 'function') refreshRatings();
        } catch (e) { console.log("Propaganda Engine Offline"); }
    }

    showQ();
}

// 6. Anonymous Reporting
function initAnonymousReporting() {
    const reportBtn = document.getElementById('report-tip-btn');
    if (!reportBtn) return;

    reportBtn.addEventListener('click', () => {
        alert('VOUGHT OFFICIAL NOTICE:\n\nYour tip has been received. Loyalty is its own reward.');
        reportBtn.textContent = 'TIP RECEIVED';
        reportBtn.disabled = true;
    });
}

// 7. Dynamic Propaganda Stats
function initPropagandaStats() {
    const livesCounter = document.getElementById('lives-saved-counter');
    const cheerBtn = document.getElementById('cheer-btn');

    // Fetch initial lives saved
    async function fetchLives() {
        if (!livesCounter) return;
        try {
            const res = await fetch('/api/stats/lives-saved');
            const data = await res.json();
            livesCounter.textContent = data.livesSaved.toLocaleString();
        } catch (e) { livesCounter.textContent = "1,542,300"; }
    }

    if (cheerBtn) {
        cheerBtn.addEventListener('click', async () => {
            try {
                const res = await fetch('/api/stats/lives-saved', { method: 'POST' });
                const data = await res.json();
                livesCounter.textContent = data.total.toLocaleString();
                // Visual feedback
                cheerBtn.textContent = "VOUGHT THANKS YOU!";
                setTimeout(() => cheerBtn.textContent = "THANK VOUGHT (+1)", 2000);
            } catch (e) {
                // Fallback local inflation
                const current = parseInt(livesCounter.textContent.replace(/,/g, '')) || 1542300;
                livesCounter.textContent = (current + 250).toLocaleString();
            }
        });
    }

    fetchLives();
    refreshRatings();
    
    // AUTO-INCREMENT LIVES: Simulate live activity every 3-7 seconds
    setInterval(async () => {
        if (!livesCounter) return;
        try {
            const res = await fetch('/api/stats/lives-saved', { method: 'POST' });
            const data = await res.json();
            livesCounter.textContent = data.total.toLocaleString();
        } catch (e) {
            // Local fallback if offline
            const current = parseInt(livesCounter.textContent.replace(/,/g, '')) || 1542300;
            livesCounter.textContent = (current + Math.floor(Math.random() * 50)).toLocaleString();
        }
    }, Math.random() * 4000 + 3000);

    // Auto refresh ratings every 10s
    setInterval(refreshRatings, 10000);
}

// Global function so quiz can trigger it
async function refreshRatings() {
    try {
        const res = await fetch('/api/stats/ratings');
        if (!res.ok) return;
        const ratings = await res.json();
        
        for (const [hero, value] of Object.entries(ratings)) {
            const bar = document.getElementById(`bar-${hero}`);
            const pct = document.getElementById(`pct-${hero}`);
            if (bar && pct) {
                bar.style.width = `${value}%`;
                pct.textContent = `${value.toFixed(1)}%`;
                
                // Homelander gets gold, everyone else gets basic red/gray
                if (hero === 'Homelander') {
                    bar.style.background = '#ffd700';
                }
            }
        }
    } catch (e) {
        console.log("Using local static ratings.");
    }
}