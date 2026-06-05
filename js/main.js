document.addEventListener("DOMContentLoaded", async () => {
  // 1. 외부 모달 HTML 파일들을 비동기로 불러와 삽입
    await loadModals();

    // 2. 타이핑 애니메이션 실행
    initTypewriter();

    // 3. 카드 3D 틸트 효과 및 키보드 접근성 실행
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

    // 3D Tilt 효과
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