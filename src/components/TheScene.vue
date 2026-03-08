<script setup>
import { onMounted, ref } from 'vue';
import '../aframe/clickable.js';
import '../aframe/outline.js';
import '../aframe/emit-when-near.js';
import '../aframe/event-set.js';

import TheCameraRig from './TheCameraRig.vue';
import TheMuseumRoom from './TheMuseumRoom.vue';
import TheEarthRoom from './TheEarthRoom.vue';
import '../aframe/teleport-camera-rig.js';
import '../aframe/play-animation-on-click.js';

const emit = defineEmits(['loaded']);

const allAssetsLoaded = ref(false);

function onAssetsLoaded() {
  allAssetsLoaded.value = true;
  emit('loaded');
  const startAmbiance = () => {
    const ambiance = document.querySelector('#audio-ambiance');
    if (ambiance && ambiance.paused) {
      ambiance.volume = 0.09;
      ambiance.loop = true;
      ambiance.play();
    }
    document.removeEventListener('click', startAmbiance);
    document.removeEventListener('keydown', startAmbiance);
  };
  document.addEventListener('click', startAmbiance);
  document.addEventListener('keydown', startAmbiance);
}
</script>

<template>
  <a-scene background="color: #a3d0ed" outline="strength: 4; glow: 2; color: white">

    <!-- Curseur nécessaire pour aframe-htmlmesh -->
    <a-sphere color="black" radius="0.01" id="cursor" material="shader:flat" visible="false"></a-sphere>

    <a-assets @loaded="onAssetsLoaded">
      <a-asset-item id="room" src="assets/vr_exhibition_gallery_baked.glb"></a-asset-item>
      <a-asset-item id="earth" src="assets/earth.glb"></a-asset-item>
      <a-asset-item id="stand" src="assets/stand_low_poly.glb"></a-asset-item>
      <a-asset-item id="frame_calendar" src="assets/frame_calendar.glb"></a-asset-item>
      <a-asset-item id="frame" src="assets/picture_frame_-_emapale_enmarcate.glb"></a-asset-item>
      <a-asset-item id="kirar-v1" src="assets/kirar-v1.glb"></a-asset-item>
      <a-asset-item id="jebena" src="assets/jebena_model.glb"></a-asset-item>
      <a-asset-item id="button" src="assets/button.glb"></a-asset-item>
      <img id="paysage_1" :src="'assets/paysage_1.jpeg'" />
      <img id="paysage_2" :src="'assets/paysage_2.jpeg'" />
      <img id="paysage_3" :src="'assets/paysage_3.jpeg'" />
      <img id="paysage_4" :src="'assets/paysage_4.jpeg'" />
      <img id="calendrier" :src="'assets/calendrier.png'" />
      <audio id="audio-amharique" src="assets/amharique.mp3" preload="auto"></audio>
      <audio id="audio-click-button" src="assets/click-button.mp3" preload="auto"></audio>
      <audio id="audio-image-appear" src="assets/image_appear.mp3" preload="auto"></audio>
      <audio id="audio-correct" src="assets/correct.mp3" preload="auto"></audio>
      <audio id="audio-wrong" src="assets/wrong.mp3" preload="auto"></audio>
      <audio id="audio-ambiance" src="assets/ambiance_music.mp3" preload="auto"></audio>
      <a-asset-item id="optimerBoldFont2"
        src="https://supermedium.com/superframe/components/text-geometry/examples/vaporwave/fonts/exo2BlackItalic.typeface.json"></a-asset-item>

    </a-assets>
    <template v-if="allAssetsLoaded">

      <TheMuseumRoom />

      <TheEarthRoom />

    </template>

    <TheCameraRig />

  </a-scene>
</template>
