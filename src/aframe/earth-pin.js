/**
 * Composant A-Frame : Placement du pin sur le globe terrestre au clic
 * Convertit le point cliqué en coordonnées sphériques et place un marqueur rouge
 */
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
            if (msg) {
                msg.setAttribute('value', "Lieu choisi ! Appuyez sur Valider.");
                msg.setAttribute('color', '#FFFFFF');
            }
        });
    }
});
