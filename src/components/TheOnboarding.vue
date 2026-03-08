<script setup>
import { ref } from 'vue';

defineProps({
  loaded: Boolean,
});

const showOnboarding = ref(true);

function enterScene() {
  showOnboarding.value = false;
  if (AFRAME.utils.device.checkHeadsetConnected() && !AFRAME.utils.device.isMobile()) {
    document.querySelector('a-scene').enterVR();
  }
  document.querySelector('a-scene').emit('enter-scene');
}
</script>

<template>
  <div id="onboarding" v-if="showOnboarding">
    <div class="onboarding-container">

      <div class="header">
        <h1>Country Museum</h1>
        <hr class="separator" />
      </div>

      <div v-if="!loaded" class="loading">
        <div class="spinner"></div>
        <p>Chargement...</p>
      </div>

      <div v-if="loaded" class="content">

        <div class="section about">
          <h2>À propos du musée virtuel</h2>
          <p class="intro">
            Vous êtes dans une salle d'exposition dédiée à un pays. Explorez la pièce, observez les objets traditionnels
            et lisez les indices culturels.
            Une fois que vous pensez avoir trouvé, localisez ce pays sur le globe terrestre pour valider votre réponse.
          </p>
        </div>

        <button class="enter-btn" @click="enterScene()">
          Entrer dans le musée
        </button>

        <div class="section controls">
          <h2>Contrôles</h2>
          <div class="control-row">
            <div class="control">
              <span class="label">Ordinateur</span>
              <span class="desc">Utilisez les touches les flèches (ou AWSD) pour marcher et la souris pour regarder
                autour de vous. Faites un clic gauche pour interagir, et maintenez le clic droit en bougeant la souris
                pour faire tourner le globe.</span>
            </div>
            <div class="control">
              <span class="label">VR</span>
              <span class="desc">Utilisez le joystick gauche pour vous déplacer, la gâchette droite pour interagir, et
                le joystick droit pour faire tourner le globe.</span>
            </div>
          </div>
        </div>

        <details class="credits" open>
          <summary>Crédits</summary>
          <div class="credits-list">
            <a href="https://github.com/helderlv/country-museum-vr" target="_blank">Code source - Country Museum VR</a>
            <a href="https://github.com/Chabloz/a-frame-vite-vue-boilerplate" target="_blank">Boilerplate A-Frame</a>
            <a href="https://github.com/AdaRoseCannon/aframe-htmlmesh" target="_blank">A-Frame HTMLMesh</a>
            <span>A-Frame • Vite • Vue</span>
          </div>
        </details>

      </div>
    </div>
  </div>
</template>

<style scoped>
#onboarding {
  position: fixed;
  inset: 0;
  background: linear-gradient(to bottom, #0a0a0a 0%, #1a1a1a 100%);
  color: #e8e8e8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  z-index: 10000;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
}

.onboarding-container {
  width: 100%;
  max-width: 600px;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== HEADER ========== */
.header {
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 1rem;
}

h1 {
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #c9a84c;
  margin: 0 0 1rem 0;
}

.separator {
  border: none;
  border-top: 1px solid rgba(201, 168, 76, 0.2);
  margin: 0 0 1rem 0;
}

/* ========== LOADING ========== */
.loading {
  text-align: center;
  padding: 4rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(201, 168, 76, 0.2);
  border-top-color: #c9a84c;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p {
  font-size: 0.9rem;
  letter-spacing: 0.1em;
  color: rgba(232, 232, 232, 0.5);
  margin: 0;
}

/* ========== CONTENT ========== */
.content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.section {
  text-align: left;
}

/* ========== ABOUT ========== */
.about h2 {
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(232, 232, 232, 0.5);
  margin: 0 0 1.5rem 0;
}

.intro {
  font-size: 1.05rem;
  line-height: 1.8;
  color: rgba(232, 232, 232, 0.8);
  margin: 0;
  font-weight: 300;
  text-align: justify;
}

/* ========== CONTROLS ========== */
.controls h2 {
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(232, 232, 232, 0.5);
  margin: 0 0 0 0;
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid rgba(201, 168, 76, 0.1);
  border-bottom: none;
  padding: 1rem;
  text-align: center;
}

.control-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid rgba(201, 168, 76, 0.1);
}

.control {
  background: #0a0a0a;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control .label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c9a84c;
  text-align: center;
}

.control .desc {
  font-size: 0.7rem;
  color: rgba(232, 232, 232, 0.5);
  font-weight: 300;
  line-height: 1.4;
  text-align: left;
}

/* ========== BUTTON ========== */
.enter-btn {
  width: 100%;
  padding: 1.2rem;
  background: transparent;
  color: #c9a84c;
  border: 1px solid #c9a84c;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.enter-btn:hover {
  background: #c9a84c;
  color: #0a0a0a;
  box-shadow: 0 0 30px rgba(201, 168, 76, 0.3);
}

.enter-btn:active {
  transform: scale(0.98);
}

/* ========== CREDITS ========== */
.credits {
  text-align: center;
  border-top: 1px solid rgba(201, 168, 76, 0.1);
  padding-top: 2rem;
}

.credits summary {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(232, 232, 232, 0.4);
  cursor: pointer;
  list-style: none;
  transition: color 0.3s ease;
}

.credits summary:hover {
  color: rgba(232, 232, 232, 0.7);
}

.credits summary::-webkit-details-marker {
  display: none;
}

.credits-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
  font-size: 0.8rem;
}

.credits-list a {
  color: rgba(201, 168, 76, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.credits-list a:hover {
  color: #c9a84c;
}

.credits-list span {
  color: rgba(232, 232, 232, 0.3);
  font-size: 0.75rem;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
  #onboarding {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.8rem;
    letter-spacing: 0.2em;
  }

  .subtitle {
    font-size: 1rem;
  }

  .control-row {
    grid-template-columns: 1fr;
  }

  .control {
    padding: 1.2rem;
  }
}
</style>
