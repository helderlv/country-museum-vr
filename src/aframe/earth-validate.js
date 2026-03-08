/**
 * Composant A-Frame : Validation de la réponse (pays sur le globe)
 * Calcule l'angle entre le point cliqué et la cible (Éthiopie)
 * Affiche le portail de sortie si la réponse est correcte
 */
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
                msg.setAttribute('value', "Bravo ! C'est la bonne region !");
                msg.setAttribute('color', '#00FF88');

                const snd = document.querySelector('#audio-correct');
                if (snd) {
                    snd.currentTime = 0;
                    snd.play();
                }

                // Faire apparaître le portail de sortie ET le rendre cliquable
                const portal = document.querySelector('#exit-portal');
                if (portal) {
                    portal.setAttribute('visible', 'true');
                    portal.setAttribute('clickable', '');
                    portal.setAttribute('exit-vr-portal', '');
                }
            } else if (angleDeg < 35) {
                msg.setAttribute('value', "Presque... tu n'es pas loin !");
                msg.setAttribute('color', '#FFAA00');

                const snd = document.querySelector('#audio-wrong');
                if (snd) {
                    snd.currentTime = 0;
                    snd.play();
                }
            } else {
                msg.setAttribute('value', "Ce n'est pas le bon pays. Cherchez encore !");
                msg.setAttribute('color', '#FF4444');

                const snd = document.querySelector('#audio-wrong');
                if (snd) {
                    snd.currentTime = 0;
                    snd.play();
                }
            }
        });
    }
});
