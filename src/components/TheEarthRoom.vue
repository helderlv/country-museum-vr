<script setup>
import '../aframe/teleport-camera-rig.js';
import '../aframe/clickable.js';
import '../aframe/bind-rotation.js';

// Placement du pin sur la Terre au clic
if (!AFRAME.components['earth-pin']) {
    AFRAME.registerComponent('earth-pin', {
        init() {
            this.pinEl = null;
            this.lastGuessDir = null;
            this.el.addEventListener('click', (e) => {
                // N'accepter que le clic gauche (bouton 0)
                if (e.detail.mouseEvent && e.detail.mouseEvent.button !== 0) return;
                const intersection = e.detail && e.detail.intersection;
                if (!intersection) return;

                // Convertir le point d'intersection (espace monde) en espace local du globe
                const localPos = new THREE.Vector3();
                this.el.object3D.worldToLocal(localPos.copy(intersection.point));

                // Le globe a scale=0.002 → pour avoir un pin de 0.06 unités monde
                // il faut radius = 0.06 / 0.002 = 30 en espace local
                // On décale aussi le pin vers l'extérieur de cette même distance
                // pour qu'il soit bien posé EN SURFACE et non enfoncé dedans
                const SCALE = this.el.object3D.scale.x; // 0.002
                const worldRadius = 0.03;
                const localRadius = worldRadius / SCALE;
                const normal = localPos.clone().normalize();
                const pinPos = localPos.clone().add(normal.multiplyScalar(localRadius));

                if (!this.pinEl) {
                    this.pinEl = document.createElement('a-sphere');
                    // shader: standard → la sphère capte la lumière et paraît bien ronde (pas plate)
                    this.pinEl.setAttribute('material', 'shader: standard; color: #FF2222; roughness: 0.4; metalness: 0.1');
                    this.el.appendChild(this.pinEl);
                }
                this.pinEl.setAttribute('radius', localRadius.toString());
                this.pinEl.setAttribute('position', `${pinPos.x} ${pinPos.y} ${pinPos.z}`);
                this.lastGuessDir = localPos.clone().normalize();

                // ── DEBUG : affiche les coordonnées sphériques du point cliqué ──
                // Lire ces valeurs dans la console pour ajuster la cible Ethiopia
                const dir = this.lastGuessDir;
                const latDeg = THREE.MathUtils.radToDeg(Math.asin(Math.max(-1, Math.min(1, dir.y))));
                const lonDeg = THREE.MathUtils.radToDeg(Math.atan2(dir.x, dir.z));
                console.log(`[earth-pin] clic → lat=${latDeg.toFixed(1)}° lon=${lonDeg.toFixed(1)}°  (vecteur: x=${dir.x.toFixed(3)} y=${dir.y.toFixed(3)} z=${dir.z.toFixed(3)})`);

                const msg = document.querySelector('#earth-message');
                if (msg) { msg.setAttribute('value', "Lieu choisi ! Appuyez sur Valider."); msg.setAttribute('color', '#FFFFFF'); }
            });
        }
    });
}

// Validation de la reponse
if (!AFRAME.components['earth-validate']) {
    AFRAME.registerComponent('earth-validate', {
        init() {
            this.el.addEventListener('click', () => {
                const earth = document.querySelector('#earth-globe');
                const msg = document.querySelector('#earth-message');
                if (!earth || !msg) return;
                const pin = earth.components['earth-pin'];
                if (!pin || !pin.lastGuessDir) {
                    msg.setAttribute('value', "Placez d'abord un point sur la Terre !");
                    msg.setAttribute('color', '#FFDD44');
                    return;
                }
                // Vecteur mesuré réellement en cliquant sur l'Éthiopie sur CE modèle GLB
                // (log console : lat=6.9° lon=-142.4° → x=-0.606 y=0.120 z=-0.786)
                const target = new THREE.Vector3(-0.606, 0.120, -0.786).normalize();
                const dot = pin.lastGuessDir.dot(target);
                const angleDeg = THREE.MathUtils.radToDeg(Math.acos(Math.min(1, Math.max(-1, dot))));
                if (angleDeg < 15) {
                    msg.setAttribute('value', "Bravo ! C'est la bonne region !"); msg.setAttribute('color', '#00FF88');
                    const snd = document.querySelector('#audio-correct'); if (snd) { snd.currentTime = 0; snd.play(); }
                } else if (angleDeg < 35) {
                    msg.setAttribute('value', "Presque... tu n'es pas loin !"); msg.setAttribute('color', '#FFAA00');
                    const snd = document.querySelector('#audio-wrong'); if (snd) { snd.currentTime = 0; snd.play(); }
                } else {
                    msg.setAttribute('value', "Ce n'est pas le bon pays. Cherchez encore !"); msg.setAttribute('color', '#FF4444');
                    const snd = document.querySelector('#audio-wrong'); if (snd) { snd.currentTime = 0; snd.play(); }
                }
            });
        }
    });
}

// Rotation VR du globe — principe bind-rotation (delta quaternion main droite)
// blink-controls est sur #hand-LEFT → on réserve la main DROITE pour le globe
// grip droit = attraper+tourner   thumbstick droit = pivoter
if (!AFRAME.components['globe-vr-rotate']) {
    AFRAME.registerComponent('globe-vr-rotate', {
        schema: {
            grabDistance: { type: 'number', default: 1.0 }
        },
        init() {
            this.isGrabbing = false;
            this.rightHand = null;
            this.prevHandQuat = new THREE.Quaternion();
            this.currHandQuat = new THREE.Quaternion();

            const attachToHand = (hand) => {
                // ── Grip : attraper et tourner en déplaçant la manette ──
                hand.addEventListener('gripdown', () => {
                    const handPos = new THREE.Vector3();
                    const globePos = new THREE.Vector3();
                    hand.object3D.getWorldPosition(handPos);
                    this.el.object3D.getWorldPosition(globePos);
                    if (handPos.distanceTo(globePos) > this.data.grabDistance) return;
                    this.isGrabbing = true;
                    // Mémoriser la rotation initiale — même logique que bind-rotation au 1er tick
                    hand.object3D.getWorldQuaternion(this.prevHandQuat);
                });
                hand.addEventListener('gripup', () => { this.isGrabbing = false; });

                // ── Thumbstick droit : rotation directe (pas de conflit blink-controls gauche) ──
                hand.addEventListener('thumbstickmoved', (e) => {
                    const x = e.detail.x || 0;
                    const y = e.detail.y || 0;
                    // Rotation Y (horizontal) — axe monde Y fixe
                    if (Math.abs(x) >= 0.15) {
                        const quatY = new THREE.Quaternion().setFromAxisAngle(
                            new THREE.Vector3(0, 1, 0), x * 0.06
                        );
                        this.el.object3D.quaternion.premultiply(quatY);
                    }
                    // Rotation X (verticale) — axe perpendiculaire à la caméra (vecteur right)
                    if (Math.abs(y) >= 0.15) {
                        const cam = this.el.sceneEl.camera;
                        const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0).normalize();
                        const quatX = new THREE.Quaternion().setFromAxisAngle(right, y * 0.06);
                        this.el.object3D.quaternion.premultiply(quatX);
                    }
                });
            };

            // En VR les manettes se connectent de façon asynchrone → controllerconnected
            this.el.sceneEl.addEventListener('controllerconnected', (e) => {
                const el = e.detail.el || e.target;
                // On cible uniquement la manette DROITE (hand-controls hand:right)
                const hc = el.components['hand-controls'];
                if (hc && hc.data && hc.data.hand === 'right') {
                    this.rightHand = el;
                    attachToHand(el);
                }
            });

            // Fallback desktop/simulateur : #hand-right déjà présent
            const fallback = document.querySelector('#hand-right');
            if (fallback) { this.rightHand = fallback; attachToHand(fallback); }
        },

        tick(t, dt) {
            // ── Rotation automatique (idle) quand personne n'interagit ──
            const earthCtrl = this.el.components['earth-controls'];
            const isInteracting = earthCtrl && (earthCtrl.isDragging || earthCtrl.isMoving);
            if (!this.isGrabbing && !isInteracting) {
                const idleSpeed = 0.01 * (dt / 16); // ~0.01 rad/s à 60fps
                const idleQuat = new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(idleSpeed)
                );
                this.el.object3D.quaternion.premultiply(idleQuat);
            }

            // ── Rotation par grip VR ──
            if (!this.isGrabbing || !this.rightHand) return;
            // Lire la rotation monde actuelle de la main (idem bind-rotation tick)
            this.rightHand.object3D.getWorldQuaternion(this.currHandQuat);
            // Delta = qCurr * qPrev⁻¹
            const delta = this.currHandQuat.clone().multiply(this.prevHandQuat.clone().invert());
            this.el.object3D.quaternion.premultiply(delta);
            this.prevHandQuat.copy(this.currHandQuat);
        }
    });
}


// Contrôles souris du globe :
//   clic gauche  → poser le pin (géré par earth-pin via l'event A-Frame 'click')
//   clic droit   → faire tourner le globe (drag)
//   clic molette → déplacer physiquement le globe dans la pièce (drag)
if (!AFRAME.components['earth-controls']) {
    AFRAME.registerComponent('earth-controls', {
        init() {
            this.isDragging = false;   // clic droit maintenu → rotation
            this.isMoving = false;   // molette maintenue  → translation
            this.hasMoved = false;
            this.isHovered = false;
            this.previousMousePosition = { x: 0, y: 0 };

            const canvas = this.el.sceneEl.canvas;

            // ── Survol ──
            this.el.addEventListener('mouseenter', () => { this.isHovered = true; canvas.style.cursor = 'grab'; });
            this.el.addEventListener('mouseleave', () => {
                if (!this.isDragging && !this.isMoving) { this.isHovered = false; canvas.style.cursor = 'default'; }
            });

            // ── Début interaction ──
            this.onMouseDown = (e) => {
                if (!this.isHovered) return;
                this.hasMoved = false;
                this.previousMousePosition = { x: e.clientX, y: e.clientY };
                if (e.button === 2) {
                    // Clic droit → rotation
                    this.isDragging = true;
                    canvas.style.cursor = 'grabbing';
                    e.preventDefault();
                } else if (e.button === 1) {
                    // Clic molette → déplacement dans la pièce
                    this.isMoving = true;
                    canvas.style.cursor = 'move';
                    e.preventDefault();
                }
            };

            // ── Mouvement ──
            this.onMouseMove = (e) => {
                if (!this.isDragging && !this.isMoving) return;

                let dx = e.movementX || 0;
                let dy = e.movementY || 0;
                if (dx === 0 && dy === 0) {
                    dx = e.clientX - this.previousMousePosition.x;
                    dy = e.clientY - this.previousMousePosition.y;
                }
                if (dx === 0 && dy === 0) return;
                this.hasMoved = true;

                // Stoppe l'event → look-controls ne pivote pas la caméra
                e.stopImmediatePropagation();

                if (this.isDragging) {
                    // Rotation Y (horizontal) — axe monde Y fixe
                    if (dx !== 0) {
                        const quatY = new THREE.Quaternion().setFromAxisAngle(
                            new THREE.Vector3(0, 1, 0),
                            THREE.MathUtils.degToRad(dx * 0.4)
                        );
                        this.el.object3D.quaternion.premultiply(quatY);
                    }
                    // Rotation X (verticale) — axe perpendiculaire à la caméra (vecteur right)
                    if (dy !== 0) {
                        const cam = this.el.sceneEl.camera;
                        const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0).normalize();
                        const quatX = new THREE.Quaternion().setFromAxisAngle(
                            right,
                            THREE.MathUtils.degToRad(dy * 0.4)
                        );
                        this.el.object3D.quaternion.premultiply(quatX);
                    }
                }

                if (this.isMoving) {
                    // ── Translation du globe dans le plan de la caméra ──
                    const cam = this.el.sceneEl.camera;
                    const globePos = new THREE.Vector3();
                    const camPos = new THREE.Vector3();
                    this.el.object3D.getWorldPosition(globePos);
                    cam.getWorldPosition(camPos);
                    const dist = camPos.distanceTo(globePos);
                    const sensitivity = dist * 0.0018;

                    const right = new THREE.Vector3();
                    const up = new THREE.Vector3();
                    cam.matrixWorld.extractBasis(right, up, new THREE.Vector3());

                    const move = right.multiplyScalar(dx * sensitivity)
                        .add(up.multiplyScalar(-dy * sensitivity));
                    this.el.object3D.position.add(move);
                }

                this.previousMousePosition = { x: e.clientX, y: e.clientY };
            };

            // ── Fin interaction ──
            this.onMouseUp = () => {
                const wasActive = this.isDragging || this.isMoving;
                this.isDragging = false;
                this.isMoving = false;
                this.isHovered = false;
                canvas.style.cursor = 'default';
                // Bloquer le clic gauche suivant uniquement si on a bougé
                if (wasActive && this.hasMoved) {
                    const blockClick = (ev) => {
                        ev.stopImmediatePropagation();
                        window.removeEventListener('click', blockClick, true);
                    };
                    window.addEventListener('click', blockClick, true);
                }
            };

            // Empêcher le menu contextuel sur le canvas
            this.onContextMenu = (e) => e.preventDefault();

            canvas.addEventListener('mousedown', this.onMouseDown, true);
            canvas.addEventListener('mousemove', this.onMouseMove, true);
            canvas.addEventListener('mouseup', this.onMouseUp, true);
            canvas.addEventListener('contextmenu', this.onContextMenu, true);
        },

        remove() {
            const canvas = this.el.sceneEl.canvas;
            canvas.removeEventListener('mousedown', this.onMouseDown, true);
            canvas.removeEventListener('mousemove', this.onMouseMove, true);
            canvas.removeEventListener('mouseup', this.onMouseUp, true);
            canvas.removeEventListener('contextmenu', this.onContextMenu, true);
        }
    });
}
// Reinitialisation du pin
if (!AFRAME.components['earth-reset']) {
    AFRAME.registerComponent('earth-reset', {
        init() {
            this.el.addEventListener('click', () => {
                const earth = document.querySelector('#earth-globe');
                const msg = document.querySelector('#earth-message');
                if (!earth) return;
                const pin = earth.components['earth-pin'];
                if (pin) {
                    if (pin.pinEl) { pin.pinEl.parentNode && pin.pinEl.parentNode.removeChild(pin.pinEl); pin.pinEl = null; }
                    pin.lastGuessDir = null;
                }
                if (msg) { msg.setAttribute('value', "Devinez de quel pays il s'agit. Tournez le globe pour le localiser, puis validez."); msg.setAttribute('color', '#FFFFFF'); }
            });
        }
    });
}
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

        <!-- Sphère verte DEBUG = zone cible (Éthiopie), enfant du globe → tourne avec lui
             lon=38° lat=9° → x=sin(38)·cos(9)·500≈306  y=sin(9)·500≈78  z=cos(38)·cos(9)·500≈388
             DÉPLACER : changez position d'après les logs console (ouvrir DevTools, cliquer sur Éthiopie)
             AGRANDIR/RÉDUIRE : changez radius (60 ≈ 12 cm dans le monde réel) -->
        <!-- position = vecteur mesuré * 500 (rayon local du globe) -->
        <!-- x=-0.606*500=-303  y=0.120*500=60  z=-0.786*500=-393 -->
        <!-- radius=120 → arcsin(120/500)≈14° → correspond au seuil "Bravo" de 15° -->
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
        clickable teleport-camera-rig="x: 0; y: 0; z: 2; rot: 0; handleRotation: true"
    ></a-plane>

    <!-- Nav-mesh salle de la Terre (rouge = debug, passer visible à false quand OK) -->
    <a-entity
        geometry="primitive: plane; width: 6; height: 5.4"
        position="20 0.02 -0.9"
        rotation="-90 0 0"
        data-role="nav-mesh"
        material="color: red; opacity: 0.5; transparent: true"
        visible="false"
    ></a-entity>

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
</template>
