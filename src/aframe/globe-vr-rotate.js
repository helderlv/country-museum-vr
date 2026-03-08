/**
 * Composant A-Frame : Rotation VR du globe terrestre
 * Permet de faire tourner le globe en VR avec :
 *  - Grip droit : attraper et tourner en déplaçant la manette
 *  - Thumbstick droit : rotation directe
 *  - Rotation automatique (idle) quand personne n'interagit
 */
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
                        new THREE.Vector3(0, 1, 0), x * 0.03
                    );
                    this.el.object3D.quaternion.premultiply(quatY);
                }
                // Rotation X (verticale) — axe perpendiculaire à la caméra (vecteur right)
                if (Math.abs(y) >= 0.15) {
                    const cam = this.el.sceneEl.camera;
                    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0).normalize();
                    const quatX = new THREE.Quaternion().setFromAxisAngle(right, y * 0.03);
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
        if (fallback) {
            this.rightHand = fallback;
            attachToHand(fallback);
        }
    },

    tick(t, dt) {
        // ── Rotation automatique désactivée ──
        // Le globe reste à l'arrêt sauf si l'utilisateur interagit

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
