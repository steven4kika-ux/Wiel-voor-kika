/**
 * Eenvoudig “spin the wheel” met canvas.
 * Niet-cryptografische RNG; voor spel/actie voldoende.
 */

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resetBtn = document.getElementById('resetBtn');
const resultEl = document.getElementById('result');
document.getElementById('year').textContent = new Date().getFullYear();

const segments = [
  { label: 'Bedankt! 🎉', color: '#F44336' },
  { label: 'High Five ✋', color: '#FF9800' },
  { label: 'Applaus 👏', color: '#FFEB3B' },
  { label: 'Glimlach 😊', color: '#4CAF50' },
  { label: 'Ster ✨', color: '#2196F3' },
  { label: 'Hart ❤️', color: '#9C27B0' },
  { label: 'Topper 🌟', color: '#009688' },
  { label: 'Goed bezig 💪', color: '#795548' }
];

let angle = 0;            // huidige rotatie (radialen)
let spinning = false;     // state
const center = { x: canvas.width / 2, y: canvas.height / 2 };
const radius = Math.min(center.x, center.y) - 10;

function drawWheel() {
  const arc = (2 * Math.PI) / segments.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Schaduw
  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(angle);

  for (let i = 0; i < segments.length; i++) {
    // Sector
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, i * arc, (i + 1) * arc);
    ctx.closePath();
    ctx.fillStyle = segments[i].color;
    ctx.fill();

    // Tekst
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.rotate(i * arc + arc / 2);
    ctx.textAlign = 'right';
    ctx.font = 'bold 16px system-ui, -apple-system, Segoe UI, Roboto, Arial';
    ctx.fillText(segments[i].label, radius - 12, 6);
    ctx.restore();
  }

  // Middencirkel
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#6a1b9a';
  ctx.stroke();

  ctx.restore();

  // Pijl/indicator
  ctx.beginPath();
  ctx.moveTo(center.x, center.y - radius - 5);
  ctx.lineTo(center.x - 12, center.y - radius - 25);
  ctx.lineTo(center.x + 12, center.y - radius - 25);
  ctx.closePath();
  ctx.fillStyle = '#6a1b9a';
  ctx.fill();
}

function spin() {
  if (spinning) return;
  spinning = true;
  resultEl.textContent = '';

  // Willekeurige eindrotatie: 5–8 rondjes + offset
  const rounds = 5 + Math.random() * 3;
  const target = angle + rounds * 2 * Math.PI + (Math.random() * 2 * Math.PI);

  const duration = 2500; // ms
  const start = performance.now();

  function animate(now) {
    const t = Math.min((now - start) / duration, 1);
    // Ease-out quart
    const eased = 1 - Math.pow(1 - t, 4);
    angle = angle + (target - angle) * eased;

    drawWheel();

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      angle = target % (2 * Math.PI);
      announceResult();
    }
  }
  requestAnimationFrame(animate);
}

function announceResult() {
  // Bepaal welk segment boven staat bij de pijl (0 rad = rechts; pijl staat "noord")
  const arc = (2 * Math.PI) / segments.length;
  // Zet 90° offset (pijl staat boven)
  let normalized = (2 * Math.PI - angle + Math.PI / 2) % (2 * Math.PI);
  const index = Math.floor(normalized / arc) % segments.length;
  const hit = segments[index];
  resultEl.textContent = `🎁 Uitkomst: ${hit.label}`;
}

spinBtn.addEventListener('click', spin);
resetBtn.addEventListener('click', () => {
  if (spinning) return;
  angle = 0;
  resultEl.textContent = '';
  drawWheel();
});

drawWheel();
``
