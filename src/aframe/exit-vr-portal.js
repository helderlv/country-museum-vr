/**
 * Composant A-Frame : Portail de sortie VR
 * Quitte le mode VR immersif quand on clique dessus
 */
AFRAME.registerComponent('exit-vr-portal', {
    init() {
        this.el.addEventListener('click', () => {
            if (document.querySelector("a-scene").is("vr-mode")) {
                document.querySelector("a-scene").exitVR();
                console.info("Exit VR mode… bye!");
            }
        });
    }
});
