/**
 * Composant A-Frame : Joue une animation GLB et cycle entre les images paysage
 * Utilisé sur le bouton qui contrôle l'affichage des paysages
 */
AFRAME.registerComponent('play-animation-on-click', {
    init() {
        this.playing = false;
        this.currentIndex = 0; // 0 = caché, 1-4 = paysage_1 à paysage_4

        this.el.addEventListener('click', () => {
            if (this.playing) return;
            this.playing = true;

            // Son clic bouton
            const sndClick = document.querySelector('#audio-click-button');
            if (sndClick) {
                sndClick.currentTime = 0;
                sndClick.play();
            }

            // Cycle entre les images paysage (0 -> 1 -> 2 -> 3 -> 4 -> 0)
            const paysage = document.querySelector('#paysage-display');
            if (paysage) {
                this.currentIndex = (this.currentIndex + 1) % 5;

                if (this.currentIndex === 0) {
                    // Cacher l'image
                    paysage.setAttribute('visible', 'false');
                } else {
                    // Afficher l'image correspondante
                    paysage.setAttribute('src', `#paysage_${this.currentIndex}`);
                    paysage.setAttribute('visible', 'true');
                    const sndAppear = document.querySelector('#audio-image-appear');
                    if (sndAppear) {
                        sndAppear.currentTime = 0;
                        sndAppear.play();
                    }
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
