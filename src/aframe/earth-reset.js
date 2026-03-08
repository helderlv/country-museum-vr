/**
 * Composant A-Frame : Réinitialisation du pin sur le globe
 * Supprime le pin et réinitialise le message
 */
AFRAME.registerComponent('earth-reset', {
    init() {
        this.el.addEventListener('click', () => {
            const earth = document.querySelector('#earth-globe');
            const msg = document.querySelector('#earth-message');

            if (!earth) return;

            const pin = earth.components['earth-pin'];
            if (pin) {
                if (pin.pinEl) {
                    pin.pinEl.parentNode && pin.pinEl.parentNode.removeChild(pin.pinEl);
                    pin.pinEl = null;
                }
                pin.lastGuessDir = null;
            }

            if (msg) {
                msg.setAttribute('value', "Devinez de quel pays il s'agit. Tournez le globe pour le localiser, puis validez.");
                msg.setAttribute('color', '#FFFFFF');
            }
        });
    }
});
