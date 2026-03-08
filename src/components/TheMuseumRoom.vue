<script setup>
import InfoPlate from './InfoPlate.vue';
import TheWelcomeSign from './TheWelcomeSign.vue';
</script>

<template>
  <!-- ========== SALLE PRINCIPALE DU MUSÉE ========== -->
  
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

  <!-- Room -->
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
    position="2.5 0.85 -4.62" 
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
      text="Récipient en terre noire, utilisé lors de la cérémonie traditionnelle du café. Dans cette région considérée comme le berceau du café, ce rituel incarne l'hospitalité et le partage."
    />

  </a-entity>

  <!-- Button paysage display -->
  <a-plane 
    id="paysage-display" 
    src="#paysage_1" 
    position="9.53 1.77 -0.03" 
    rotation="0 90 0" 
    scale="2.65 1.8 -5.35"
    width="3.71" 
    height="2.61" 
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
  <a-entity 
  id="frames" position="4.3 0.1 4.75" rotation="0 90 0">

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
    <a-entity id="painting3" gltf-model="#frame" position="0 0 2" scale="1 0.7 0.8"></a-entity>

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
      text="Le rouge rend hommage au courage et au sacrifice de celles et ceux qui ont défendu l'indépendance. Il rappelle le prix de la liberté."
    />

    <!-- Painting 4 -->
    <a-entity 
        id="painting4" 
        gltf-model="#frame" 
        position="0 0 4" 
        scale="1 0.7 0.8"
    ></a-entity>

    <a-entity 
      geometry="primitive: plane; height: 1.1; width: 1." 
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
    teleport-camera-rig="x: 18; y: 0; z: -2; rot: -90; handleRotation: true"
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

</template>
