document.addEventListener("DOMContentLoaded", async () => {
    await loadModals();

    initTypewriter();

    initCards();
});

/* 모달 컴포넌트 불러오기 (Fetch API) */
async function loadModals() {
    const modals = ['about', 'projects', 'skills', 'career'];
    const container = document.getElementById('modal-container');

    for (const id of modals) {
        try {
            const response = await fetch(`modals/${id}.html`);
            if (response.ok) {
                const html = await response.text();
                container.insertAdjacentHTML('beforeend', html);
            }
        } catch (error) {
            console.error(`모달 로드 실패: modals/${id}.html`, error);
        }
    }

    // ⭐ 모달 껍데기가 다 만들어진 후 텍스트 데이터를 불러옵니다.
    await loadAboutData();
}

/* ─────────────────────────────────────────
   JSON 데이터 불러오기
───────────────────────────────────────── */
async function loadAboutData() {
    try {
        const response = await fetch('data/about.json'); 
        
        if (response.ok) {
            const data = await response.json();
            
            document.getElementById('about-intro1').textContent = data.intro1;
            document.getElementById('about-intro2').textContent = data.intro2;
            document.getElementById('about-interests').textContent = data.interests;
        }
    } catch (error) {
        console.error('소개글 데이터 로드 실패:', error);
    }
}

/* ─────────────────────────────────────────
   전역 함수 (HTML 인라인 onclick에서 호출 가능하도록)
───────────────────────────────────────── */
window.panelOpen = function(id) {
    const el = document.getElementById('ov-' + id);
    if (!el) return;
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.panelClose = function(id) {
    const el = document.getElementById('ov-' + id);
    if (!el) return;
    el.classList.remove('open');
    document.body.style.overflow = '';
};

window.handleBg = function(e, id) {
    if (e.target === e.currentTarget) window.panelClose(id);
};

/* ─────────────────────────────────────────
   이벤트 리스너 및 애니메이션 초기화
───────────────────────────────────────── */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
    document.querySelectorAll('.overlay.open').forEach(el => {
        el.classList.remove('open');
    });
    document.body.style.overflow = '';
    }
});

function initCards() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
    // 키보드 엔터키 지원
    if (card.getAttribute('tabindex') === '0') {
        card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
        });
    }

    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
    });
}

function initTypewriter() {
    const roleEl = document.querySelector('.hero-role');
    if(!roleEl) return;

    const text = roleEl.getAttribute('data-text');
    let i = 0;

    function typeWriter() {
    if (i < text.length) {
        roleEl.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 40); 
    }
    }
    setTimeout(typeWriter, 800); 
}

document.addEventListener("DOMContentLoaded", () => {
    const encodedPhone = "MDEwLTMxMDktOTM5OA=="; 
    
    const phoneEl = document.getElementById('safe-phone');
    if (phoneEl) {
        phoneEl.textContent = atob(encodedPhone);
    }
});