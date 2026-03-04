<script setup>
import { computed, onMounted } from 'vue';

onMounted(() => {
    const scene = document.querySelector('a-scene');
    const setup = () => {
        const btn3d = document.querySelector('#audio-btn-3d');
        const htmlBtn = document.querySelector('#welcome-audio-btn');
        if (!btn3d || !htmlBtn) return;

        const getCartelHtmlComp = () => {
            const cartelEl = document.querySelector('#welcome-cartel-entity');
            return cartelEl?.components?.html ?? null;
        };

        const forceUpdate = () => {
            const comp = getCartelHtmlComp();
            if (comp) {
                if (comp.mesh) comp.mesh.material.map.needsUpdate = true;
                if (typeof comp.update === 'function') comp.update();
            }
        };

        btn3d.addEventListener('mouseenter', () => {
            htmlBtn.style.backgroundColor = '#f0d080';
            htmlBtn.style.boxShadow = '0 0 0 6px white';
            forceUpdate();
        });
        btn3d.addEventListener('mouseleave', () => {
            htmlBtn.style.backgroundColor = '#c9a84c';
            htmlBtn.style.boxShadow = 'none';
            forceUpdate();
        });
    };
    if (scene && scene.hasLoaded) setup();
    else document.querySelector('a-scene')?.addEventListener('loaded', setup);
});

// Réutilisation du même wrapText que InfoPlate
const MAX_CHARS = 48;
function wrapText(text) {
    const words = text.trim().replace(/\s+/g, ' ').split(' ').filter(w => w.length > 0);
    const lines = [];
    let current = '';
    for (const word of words) {
        const candidate = current ? current + ' ' + word : word;
        if (candidate.length > MAX_CHARS) {
            if (current) lines.push(current);
            current = word;
        } else {
            current = candidate;
        }
    }
    if (current) lines.push(current);
    return lines;
}

const cartelText = `"Bienvenue au Musée des Pays" Cette phrase est écrite en amharique, la langue officielle, utilisant l'alphabet Ge'ez.`;
const textLines = computed(() => wrapText(cartelText));
</script>

<template>
    <!-- Grand panneau Amharique -->
    <Teleport to="body">
        <div id="welcome-amharic"
            style="position: fixed; top: 0; left: 0; transform: translateY(-9999px); pointer-events: none; width: 1400px;">
            <div style="
                width: 1400px;
                padding: 70px 90px;
                background-color: #000000;
                border: 12px solid #c9a84c;
                box-sizing: border-box;
                font-family: 'Noto Sans Ethiopic', serif;
                text-align: center;
            ">
                <!-- Barre décorative top -->
                <div
                    style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 48px;">
                    <div
                        style="height: 2px; width: 160px; background: linear-gradient(to right, transparent, #c9a84c);">
                    </div>
                    <div style="width: 12px; height:12px; background-color: #c9a84c; transform: rotate(45deg);"></div>
                    <div style="width: 8px; height: 8px; background-color: #f0d080; transform: rotate(45deg);"></div>
                    <div style="width: 12px; height: 12px; background-color: #c9a84c; transform: rotate(45deg);"></div>
                    <div style="height: 2px; width: 160px; background: linear-gradient(to left, transparent, #c9a84c);">
                    </div>
                </div>

                <!-- Texte principal Amharique -->
                <div style="
                    font-size: 74px;
                    font-weight: 900;
                    color: #f5e6b8;
                    line-height: 1.4;
                    letter-spacing: 4px;
                    text-shadow: 0 0 40px rgba(201, 168, 76, 0.5), 0 2px 8px rgba(0,0,0,0.8);
                    white-space: nowrap;
                ">ወደ ሀገራት ሙዚየም እንኳን ደህና መጡ</div>

                <!-- Barre décorative bottom -->
                <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 48px;">
                    <div
                        style="height: 2px; width: 160px; background: linear-gradient(to right, transparent, #c9a84c);">
                    </div>
                    <div style="width: 12px; height: 12px; background-color: #c9a84c; transform: rotate(45deg);"></div>
                    <div style="width: 8px; height: 8px; background-color: #f0d080; transform: rotate(45deg);"></div>
                    <div style="width: 12px; height: 12px; background-color: #c9a84c; transform: rotate(45deg);"></div>
                    <div style="height: 2px; width: 160px; background: linear-gradient(to left, transparent, #c9a84c);">
                    </div>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Cartel d'information avec bouton audio -->
    <Teleport to="body">
        <div id="welcome-cartel"
            style="position: fixed; top: 0; left: 0; transform: translateY(-9999px); pointer-events: auto; width: 840px;">
            <div style="
                width: 840px;
                padding: 56px 64px;
                background-color: #000000;
                border: 10px solid #c9a84c;
                box-sizing: border-box;
                font-family: Georgia, serif;
            ">
                <!-- Titre -->
                <div
                    style="font-size: 44px; font-weight: bold; color: #f0e6cc; margin: 0 0 28px 0; line-height: 1.3; white-space: nowrap;">
                    MESSAGE DE BIENVENUE
                </div>
                <!-- Séparateur -->
                <div style="width: 80px; height: 4px; background-color: #c9a84c; margin-bottom: 28px;"></div>
                <!-- Texte -->
                <div v-for="(line, i) in textLines" :key="i"
                    style="font-size: 30px; color: #c8baa0; line-height: 1.7; margin: 0; padding: 0; white-space: nowrap;">
                    {{ line }}</div>
                <!-- Bouton HTML visible (décoratif) -->
                <div style="margin-top: 40px; text-align: center;">
                    <button id="welcome-audio-btn" style="
                        font-family: Georgia, serif;
                        font-size: 30px;
                        font-weight: bold;
                        color: #1c1a17;
                        background-color: #c9a84c;
                        border: none;
                        padding: 20px 48px;
                        letter-spacing: 2px;
                        pointer-events: none;
                    ">▶ ÉCOUTER</button>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Grand panneau Amharique en 3D -->
    <a-entity position="-1.6 1.8 0.03" rotation="0 90 0" scale="3.25 3.3 1"
        html="html:#welcome-amharic;cursor:#cursor">
    </a-entity>

    <!-- Cartel info -->
    <a-entity
        id="welcome-cartel-entity"
        position="-1.44 0.75 0.03"
        rotation="-40 90 0"
        visible="false"
        emit-when-near="distance: 2"
        event-set__enter="value: true; attribute: visible; event: click;"
        event-set__leave="value: false; attribute: visible; event: unclick;"
        html="html:#welcome-cartel;cursor:#cursor">
    </a-entity>

    <!-- Bouton 3D invisible pour interaction (outline CSS sur le bouton HTML) -->
    <a-entity
        id="audio-btn-3d"
        position="-1.337 0.63 0.03"
        rotation="-40 90 0"
        geometry="primitive: plane; width: 0.31; height: 0.08"
        material="color: white; shader: flat; transparent: true; opacity: 0"
        visible ="false"
        clickable
        sound="src: #audio-amharique; on: click"
    ></a-entity>
</template>
