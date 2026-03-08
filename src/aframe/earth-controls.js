/**
 * Composant A-Frame : Contrôles souris du globe terrestre
 * Permet de :
 *  - Clic droit : faire tourner le globe (rotation)
 *  - Clic molette : déplacer physiquement le globe dans la pièce (translation)
 *  - Clic gauche : poser un pin (géré par earth-pin via l'event A-Frame 'click')
 */
AFRAME.registerComponent('earth-controls', {
    init() {
        this.isDragging = false;   // clic droit maintenu → rotation
        this.isMoving = false;     // molette maintenue  → translation
        this.hasMoved = false;
        this.isHovered = false;
        this.previousMousePosition = { x: 0, y: 0 };

        const canvas = this.el.sceneEl.canvas;

        // ── Survol ──
        this.el.addEventListener('mouseenter', () => {
            this.isHovered = true;
            canvas.style.cursor = 'grab';
        });
        this.el.addEventListener('mouseleave', () => {
            if (!this.isDragging && !this.isMoving) {
                this.isHovered = false;
                canvas.style.cursor = 'default';
            }
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
                        THREE.MathUtils.degToRad(dx * 0.2)
                    );
                    this.el.object3D.quaternion.premultiply(quatY);
                }
                // Rotation X (verticale) — axe perpendiculaire à la caméra (vecteur right)
                if (dy !== 0) {
                    const cam = this.el.sceneEl.camera;
                    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0).normalize();
                    const quatX = new THREE.Quaternion().setFromAxisAngle(
                        right,
                        THREE.MathUtils.degToRad(dy * 0.2)
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
