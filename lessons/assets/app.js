
// shared behaviors: persistent checklists + instant-feedback quizzes
document.addEventListener('change', e => {
  if (e.target.matches('.check input[type=checkbox]')) {
    const store = JSON.parse(localStorage.getItem('vcpm-checks') || '{}');
    store[e.target.dataset.key] = e.target.checked;
    localStorage.setItem('vcpm-checks', JSON.stringify(store));
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const store = JSON.parse(localStorage.getItem('vcpm-checks') || '{}');
  document.querySelectorAll('.check input[type=checkbox]').forEach(cb => {
    if (store[cb.dataset.key]) cb.checked = true;
  });
  document.querySelectorAll('.quiz').forEach(initQuiz);
});
function initQuiz(q) {
  const key = 'vcpm-quiz-' + q.dataset.key;
  const answered = localStorage.getItem(key);
  q.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.answered) return;
      const correct = btn.dataset.correct === '1';
      if (correct) { btn.classList.add('right'); }
      else {
        btn.classList.add('wrong');
        const right = q.querySelector('button[data-correct="1"]');
        if (right) right.classList.add('right');
      }
      const fb = q.querySelector('.feedback');
      fb.textContent = correct ? btn.dataset.good : btn.dataset.bad;
      fb.className = 'feedback show ' + (correct ? 'good' : 'badf');
      localStorage.setItem(key, correct ? '1' : '0');
      q.querySelectorAll('button').forEach(b => { b.disabled = true; b.dataset.answered = '1'; });
    });
    if (answered !== null && answered !== '') { btn.disabled = true; btn.dataset.answered = '1'; }
  });
  if (answered !== null) {
    const fb = q.querySelector('.feedback');
    fb.textContent = answered === '1' ? 'ตอบถูกไปแล้ว ✓' : 'เคยตอบผิด — ลองอ่านใหม่แล้วรีเฟรชหน้าเพื่อทำอีกครั้ง';
    fb.className = 'feedback show ' + (answered === '1' ? 'good' : 'badf');
  }
}
