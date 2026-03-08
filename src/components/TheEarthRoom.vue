<script setup>
import '../aframe/teleport-camera-rig.js';
import '../aframe/clickable.js';
import '../aframe/bind-rotation.js';
import '../aframe/earth-pin.js';
import '../aframe/earth-validate.js';
import '../aframe/exit-vr-portal.js';
import '../aframe/globe-vr-rotate.js';
import '../aframe/earth-controls.js';
import '../aframe/earth-reset.js';
</script>

<template>
    <!-- Piece noire  -->
    <a-box 
        position="20 3 -1" 
        width="7" 
        height="6" 
        depth="7"
        material="color: #080810; side: back; shader: flat"
    ></a-box>

    <a-plane 
        position="20 0.01 -1" 
        rotation="-90 0 0" 
        width="7" height="7"
        material="color: #050508; shader: flat"
    ></a-plane>

    <a-entity 
        id="earth-globe" 
        gltf-model="#earth" 
        position="20 1.8 -1" 
        scale="0.002 0.002 0.002" 
        clickable earth-pin
        earth-controls globe-vr-rotate>

        <!-- globe -->
        <a-sphere 
            id="earth-target-debug" 
            radius="120" 
            position="-303 60 -393"
            material="color: #00FF44; opacity: 0.55; transparent: true; shader: standard" 
            visible="false"
        ></a-sphere>
    </a-entity>

    <a-text 
        id="earth-message"
        value="Devinez de quel pays il s'agit. Tournez le globe pour le localiser, puis validez."
        align="center"
        color="#FFFFFF" 
        position="20 2.8 -4.2" 
        width="3.5"
        wrap-count="25"
    ></a-text>

    <!-- Bouton de validation-->
    <a-box 
        position="20 1.4 -4.2" 
        width="1.2" 
        height="0.28" 
        depth="0.05" 
        material="color: #00AA55; shader: flat"
        outline-on-event
        clickable earth-validate
    ></a-box>

    <a-text 
        value="Valider" 
        align="center" 
        position="20 1.4 -4.17" 
        width="2.5" 
        color="white"
    ></a-text>

    <!-- Bouton de reinitialisation-->
    <a-box 
        position="20 1.0 -4.2" 
        width="1.2" 
        height="0.24" 
        depth="0.05" 
        material="color: #AA4400; shader: flat"
        outline-on-event
        clickable earth-reset
    ></a-box>

    <a-text 
        value="Recommencer" 
        align="center" 
        position="20 1.0 -4.17" 
        width="2.5" 
        color="white"
    ></a-text>

    <!-- Portail pour retourner au musée -->
    <a-plane
        width="1.46" 
        height="2.45"
        material="color: #1a1a4e; emissive: #2233aa; emissiveIntensity: 0.8; shader: flat" 
        position="16.52 1.23 -1"
        rotation="0 90 0"
        outline-on-event
        clickable teleport-camera-rig="x: 6.5; y: 0; z: -3; rot: 180; handleRotation: true"
    ></a-plane>

    <!-- Panneau titre portail retour -->
    <a-text 
        value="Salle principale" 
        align="center" 
        position="16.52 2.75 -1" 
        rotation="0 90 0" 
        color="white"
        font="exo2bold"
        width="3.2"
    ></a-text>

    <!-- ========== PORTAIL DE SORTIE VR ========== -->
    <!-- Apparaît quand le lieu est trouvé correctement -->
    <a-plane
        id="exit-portal"
        width="1.5" 
        height="2.5"
        material="color: #00FF88; emissive: #00FFAA; emissiveIntensity: 1.2; shader: flat; transparent: true; opacity: 0.9" 
        position="19.2 1.25 2.49"
        rotation="0 180 0"
        outline-on-event
        visible="false"
        animation="property: material.emissiveIntensity; from: 0.8; to: 1.5; dur: 1000; easing: easeInOutSine; loop: true; dir: alternate"
    ></a-plane>

    <!-- Titre du portail de sortie -->
    <a-text 
        value="SORTIE" 
        align="center" 
        position="19.2 2.8 2.49" 
        rotation="0 180 0" 
        color="#00FF88"
        font="exo2bold"
        width="3.5"
    ></a-text>

    <!-- Nav-mesh salle de la Terre (rouge = debug, passer visible à false quand OK) -->
    <a-entity
        geometry="primitive: plane; width: 6; height: 5.4"
        position="20 0.02 -0.9"
        rotation="-90 0 0"
        data-role="nav-mesh"
        material="color: red; opacity: 0.5; transparent: true"
        visible="false"
    ></a-entity>

</template>
