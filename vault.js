// let dial = document.getElementById("dial");
const cursor = document.getElementById("cursor");
const vault = document.getElementById("vault");
const angleInput = document.getElementById("password");
let clearbutton = document.getElementById("clear");
angleInput.value = "";
let currentAngle = 0;
let startedOnVault = false;
let isDragging = false;

// Code secret sous forme d’angles
const combination = [30, 180, 300];
let step = 0;

vault.addEventListener("mousedown", () => {
    isDragging = true;
    startedOnVault = true;
});

document.addEventListener("mouseup", () => {
    if (startedOnVault) {
        let value = Math.round(currentAngle);
        if (value === 10) value = 0;
        angleInput.value += value;

    }
    isDragging = false;
    startedOnVault = false;
});

document.addEventListener("mousemove", e => {
  if (!isDragging) return;

  const rect = vault.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const dx = e.clientX - cx;
  const dy = e.clientY - cy;

  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  angle = (angle + 360) % 360;

  currentAngle = angle / 36;

  // Rotation du cercle
  dial.style.transform = `rotate(${angle}deg)`;

  // Faire tourner le curseur autour du centre
  cursor.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
});

function checkStep(angle) {
    // Tolérance de 10 degrés
    const tolerance = 10;

    if (Math.abs(angle - combination[step]) < tolerance) {
        console.log("Étape validée :", step + 1);
        step++;

        if (step === combination.length) {
            unlock();
        }
    }
}

  // Création des graduations 0 à 9
  for (let i = 0; i < 10; i++) {
    const grad = document.createElement('div');
    grad.className = 'graduation';
    const angle = i * (360 / 10);
    grad.style.transform = `rotate(${angle}deg) translateY(-140px)`;
    
    // Ajouter un label
    const label = document.createElement('div');
    label.style.position = 'absolute';
    label.style.transform = `rotate(${angle}deg) translateY(-160px) rotate(${-angle}deg)`;
    label.style.left = '50%';
    label.style.top = '50%';
    label.style.transformOrigin = 'center';
    label.innerText = i;
    label.style.fontSize = '16px';
    label.style.userSelect = 'none';
    
    vault.appendChild(grad);
    vault.appendChild(label);
  }

  // Faire tourner le curseur avec la souris
const radius = 200; // rayon du vault

document.addEventListener("mousemove", e => {
  if (!isDragging) return;

  const rect = vault.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const dx = e.clientX - cx;
  const dy = e.clientY - cy;

  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  angle = (angle + 360) % 360;

  cursor.style.transform = `translate(-50%, -50%) translateY(-${radius}px) rotate(${angle}deg)`;
});

function clearInput() {
    angleInput.value = "";
}

document.getElementById("clear").addEventListener("click", clearInput);