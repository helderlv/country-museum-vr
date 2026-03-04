<script setup>
import { onMounted, ref } from 'vue';
import '../aframe/clickable.js';
import '../aframe/outline.js';

import TheCameraRig from './TheCameraRig.vue';
import InfoPlate from './InfoPlate.vue';
import TheWelcomeSign from './TheWelcomeSign.vue';
import TheEarthRoom from './TheEarthRoom.vue';
import '../aframe/teleport-camera-rig.js';

import '../aframe/my-hexagon-tessellation.js';
import '../aframe/bloom.js';
import '../aframe/duplicate.js';
import '../aframe/look-at.js';
import '../aframe/emit-when-near.js';
import '../aframe/event-set.js';

// Joue l'animation GLB interne "push" à chaque clic et toggle l'image paysage
AFRAME.registerComponent('play-animation-on-click', {
  init() {
    this.playing = false;
    this.el.addEventListener('click', () => {
      if (this.playing) return;
      this.playing = true;

      // Son clic bouton
      const sndClick = document.querySelector('#audio-click-button');
      if (sndClick) { sndClick.currentTime = 0; sndClick.play(); }

      // Toggle l'image paysage
      const paysage = document.querySelector('#paysage-display');
      if (paysage) {
        const isVisible = paysage.getAttribute('visible');
        const willShow = (isVisible === 'false' || isVisible === false);
        paysage.setAttribute('visible', willShow ? 'true' : 'false');
        if (willShow) {
          const sndAppear = document.querySelector('#audio-image-appear');
          if (sndAppear) { sndAppear.currentTime = 0; sndAppear.play(); }
        }
      }

      // Lance l'animation du bouton
      this.el.removeAttribute('animation-mixer');
      setTimeout(() => {
        this.el.setAttribute('animation-mixer', 'clip: push.001; loop: once; clampWhenFinished: true');
      }, 0);
    });
    this.el.addEventListener('animation-finished', () => {
      this.el.removeAttribute('animation-mixer');
      this.playing = false;
    });
  }
});

const emit = defineEmits(['loaded']);

const allAssetsLoaded = ref(false);

function onAssetsLoaded() {
  allAssetsLoaded.value = true;
  emit('loaded');
  const startAmbiance = () => {
    const ambiance = document.querySelector('#audio-ambiance');
    if (ambiance && ambiance.paused) {
      ambiance.volume = 0.04;
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
      <a-asset-item id="kirar" src="assets/kirar.glb"></a-asset-item>
      <a-asset-item id="kirar_2" src="assets/kirar_2.glb"></a-asset-item>
      <a-asset-item id="kirar-v1" src="assets/kirar-v1.glb"></a-asset-item>
      <a-asset-item id="jebena" src="assets/jebena_model.glb"></a-asset-item>
      <a-asset-item id="button" src="assets/button.glb"></a-asset-item>
      <img id="paysage" :src="'assets/paysage.jpeg'" />
      <img id="calendrier" :src="'assets/calendrier.png'" />
      <audio id="audio-amharique" src="assets/amharique.mp3" preload="auto"></audio>
      <audio id="audio-click-button" src="assets/click-button.mp3" preload="auto"></audio>
      <audio id="audio-image-appear" src="assets/image_appear.mp3" preload="auto"></audio>
      <audio id="audio-correct" src="assets/correct.mp3" preload="auto"></audio>
      <audio id="audio-wrong" src="assets/wrong.mp3" preload="auto"></audio>
      <audio id="audio-ambiance" src="assets/ambiance_music.mp3" preload="auto"></audio>
      <a-asset-item id="optimerBoldFont2" src="https://supermedium.com/superframe/components/text-geometry/examples/vaporwave/fonts/exo2BlackItalic.typeface.json"></a-asset-item>

    </a-assets>
    <template v-if="allAssetsLoaded">

      <!-- Text 3D Country Museum -->
 
       <a-entity
        place-id="name_museum_1" 
        position="11 1.10 -3.6"
        rotation="0 -80 0"
        scale="2.3 2.3 5.5" 
        text-geometry="value:COUNTRY; font: #optimerBoldFont2"
        material="color: #FFFFFF; shader: standard; roughness: 0.3; metalness: 0.05"
       ></a-entity>

       <a-entity
        place-id="name_museum_2" 
        position="11 0 -3.6"
        rotation="0 -80 0"
        scale="2.3 2.3 5.5" 
        text-geometry="value:MUSEUM; font: #optimerBoldFont2 "
        material="color: #FFFFFF; shader: standard; roughness: 0.3; metalness: 0.05"
       ></a-entity>

      <!--Room -->
      <a-entity 
        gltf-model="#room"
        position="0 0 0" 
        scale="0.22 0.25 0.22"
       ></a-entity>

       <!-- Calendar -->
      <a-entity 
        gltf-model="#frame_calendar" 
        position="2.5 1.81 -4.76" 
        rotation="0 0 0" 
        scale="1.395 1.230 -0.120"
      ></a-entity>

      <a-image
        src="#calendrier"
        position="2.5 1.81 -4.76"
        rotation="0 0 0"
        width="2.3"
        height="1.21"
      ></a-image>

      <InfoPlate
        plate-id="calendrier"
        position="2.5 0.85 -4.5"
        rotation="-30 0 0"
        :distance="2"
        title="Calendrier GE'EZ"
        text="Ce calendrier compte sept à huit années de décalage par rapport au calendrier grégorien. Il est composé de douze mois de trente jours, suivis d'un treizième mois très court de cinq ou six jours. La nouvelle année y est célébrée en septembre."
      />

      <!-- Stand -->
      <a-entity id="stands" position="-0.55 0 0">

        <!-- Stand kirar -->
        <a-entity 
          gltf-model="#stand" 
          position="0 0 -3.5" 
          rotation="0 50 0" 
          scale="2 1.30 2"
        ></a-entity>

        <a-entity 
          gltf-model="#kirar-v1" 
          position="0 1.36 -3.5" 
          rotation="0 50 0" 
          scale="1.75 1.5 2"
        ></a-entity>
        
        <InfoPlate
          plate-id="kirar-v1"
          position="0.35 0.75 -3.2"
          rotation="-40 50 0"
          :distance="1.5"
          title="Kirar"
          text="Instrument à cordes traditionnel, utilisé pour accompagner chants et récits poétiques. Il participe à la transmission des histoires et des légendes à travers les générations."
        />

        <!-- Stand jebena -->
        <a-entity 
          gltf-model="#stand" 
          position="0 0 3.5" 
          rotation="0 50 0" 
          scale="2 1.40 2"
        ></a-entity>

        <a-entity 
          gltf-model="#jebena" 
          position="0 1.26 3.5" 
          rotation="0 -50 0" 
          scale="2 1.5 2"
        ></a-entity>

        <InfoPlate
          plate-id="jebena"
          position="0.275 0.75 3.16"
          rotation="-40 140 0"
          :distance="1.5"
          title="Jebena"
          text="Récipient en terre noire, utilisé lors de la cérémonie traditionnelle du café. Dans cette région considérée comme le berceau du café, ce rituel incarne l’hospitalité et le partage."
        />

      </a-entity>

      <!-- Button paysage display -->
      <a-plane
        id="paysage-display"
        src="#paysage"
        position="9.68 1.78 -0.09"
        rotation="0 90 0"
        scale="2.65 1.8 -5.35"
        width="3.75"
        height="2.1"
        visible="false"
      ></a-plane>

      <a-entity 
        gltf-model="#button" 
        position="4.5 0 1.5" 
        rotation="0 -90 0"
        scale="0.5 0.5 0.5"
        clickable
        outline-on-event
        play-animation-on-click
      ></a-entity>
      
      <!-- Frames -->
      <a-entity id="frames" position="4.3 0.1 4.75" rotation="0 90 0">

        <!-- Painting 1 -->
         <a-entity 
          id="painting1"
          gltf-model="#frame" 
          position="0 0 -2" 
          scale="1 0.7 0.8" 
        ></a-entity>

        <a-text 
          id="symbole 1" 
          value="CERCLE" 
          align="center"
          color="#0F47AF" 
          position="0.01 1.7 -2.565" 
          rotation="0 90 0"
          scale="1 1 0.1" 
          width="3.5"
        ></a-text>

        <a-text 
          id="symbole 2" 
          value="ETOILE" 
          align="center"
          color="#FCDD09" 
          position="0.01 1.4 -2.565"
          rotation="0 90 0"
          scale="1 1 0.1" 
          width="3.5"
        ></a-text>

        <InfoPlate
          plate-id="frame1"
          position="0.15 0.75 -2.565"
          rotation="-40 90 0"
          :distance="1.5"
          title="L'unité nationale"
          text="Le cercle bleu incarne la paix, tandis que l'étoile jaune exprime l'égalité et l'unité. Ensemble, ils symbolisent un avenir commun partagé par toute la nation."
        />
        
        <!-- Painting 2 -->
        <a-entity 
          id="painting2"
          gltf-model="#frame" 
          position="0 0 0" 
          scale="1 0.7 0.8" 
        ></a-entity>

        <a-entity 
          geometry="primitive: plane; height: 1.1; width: 1;" 
          position="0.01 1.56 -0.565" 
          rotation="0 90 0"
          material="color: #009A44;"
        ></a-entity>

        <InfoPlate
          plate-id="frame2"
          position="0.11 0.75 -0.565"
          rotation="-40 90 0"
          :distance="1.5"
          title="Le travail et le développement"
          text="Le vert évoque la fertilité des terres et la richesse naturelle du territoire. Il symbolise aussi le travail et le développement tourné vers l'avenir."
        />

        <!-- Painting 3 -->
        <a-entity 
          id="painting3"
          gltf-model="#frame" 
          position="0 0 2" 
          scale="1 0.7 0.8" 
        ></a-entity>

        <a-entity 
          geometry="primitive: plane; height: 1.1; width: 1;" 
          position="0.01 1.56 1.435" 
          rotation="0 90 0"
          material="color: #EF3340;"
        ></a-entity>

        <InfoPlate
          plate-id="frame3"
          position="0.11 0.75 1.435"
          rotation="-40 90 0"
          :distance="1.5"
          title="Le sacrifice et la liberté"
          text="Le rouge rend hommage au courage et au sacrifice de celles et ceux qui ont défendu l’indépendance. Il rappelle le prix de la liberté."
        />

       <!-- Painting 4 --> 
        <a-entity 
          id="painting4"
          gltf-model="#frame" 
          position="0 0 4" 
          scale="1 0.7 0.8" 
        ></a-entity>

        <a-entity 
          geometry="primitive: plane; height: 1.1; width: 1;" 
          position="0.01 1.56 3.435" 
          rotation="0 90 0"
          material="color: #FEDD00;"
        ></a-entity>

        <InfoPlate
          plate-id="frame4"
          position="0.11 0.75 3.435"
          rotation="-40 90 0"
          :distance="1.5"
          title="L'espoir et la justice"
          text="Le jaune représente l'espoir, la justice et la liberté religieuse. Il traduit la volonté de paix et d'harmonie entre les peuples."
        />

      </a-entity>

      <TheWelcomeSign />

      <!-- Portail vers la salle de la Terre -->
      <a-plane
        geometry="width: 1.46; height: 2.45"
        material="color: #001133; emissive: #0044cc; emissiveIntensity: 0.8; shader: flat"
        position="6.48 1.23 -4.77"
        rotation="0 0 0"
        clickable
        outline-on-event
        teleport-camera-rig="x: 17; y: 0; z: -1; rot: -90; handleRotation: true"
      ></a-plane>

      <!-- Panneau titre portail Terre -->
      <a-text
        value="Salle de la Terre"
        align="center"
        position="6.48 2.75 -4.76"
        rotation="0 0 0"
        color="#000000"
        width="3.2"
        font="exo2bold"
      ></a-text>

      <!-- Nav-mesh salle principale (rouge = debug, passer visible à false quand OK) -->
      <a-entity
        geometry="primitive: plane; width: 10.35; height: 8.5"
        position="3.97 0.01 0.02"
        rotation="-90 0 0"
        data-role="nav-mesh"
        material="color: red; opacity: 0.5; transparent: true"
        visible="false"
      ></a-entity>

      <TheEarthRoom />

    </template>

    <TheCameraRig />

  </a-scene>
</template>

