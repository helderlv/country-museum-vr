/**
 * Composant A-Frame : Synchronisation du hover entre élément 3D et élément HTML
 * Permet de changer le style d'un bouton HTML quand on survole son équivalent 3D
 * 
 * Usage:
 * <a-entity html-hover-sync="htmlSelector: #my-html-button; 
 *                             hoverStyles: backgroundColor:#f0d080,boxShadow:0 0 0 6px white;
 *                             normalStyles: backgroundColor:#c9a84c,boxShadow:none">
 */
AFRAME.registerComponent('html-hover-sync', {
    schema: {
        htmlSelector: { type: 'string', default: '' },
        cartelSelector: { type: 'string', default: '' },
        hoverStyles: { type: 'string', default: '' },
        normalStyles: { type: 'string', default: '' }
    },

    init() {
        const setupSync = () => {
            const htmlEl = document.querySelector(this.data.htmlSelector);
            if (!htmlEl) {
                console.warn(`[html-hover-sync] HTML element not found: ${this.data.htmlSelector}`);
                return;
            }

            const getCartelHtmlComp = () => {
                if (!this.data.cartelSelector) return null;
                const cartelEl = document.querySelector(this.data.cartelSelector);
                return cartelEl?.components?.html ?? null;
            };

            const forceUpdate = () => {
                const comp = getCartelHtmlComp();
                if (comp) {
                    if (comp.mesh) comp.mesh.material.map.needsUpdate = true;
                    if (typeof comp.update === 'function') comp.update();
                }
            };

            const applyStyles = (styleString) => {
                if (!styleString) return;
                const pairs = styleString.split(',');
                pairs.forEach(pair => {
                    const [prop, value] = pair.split(':').map(s => s.trim());
                    if (prop && value !== undefined) {
                        // Convertir camelCase en kebab-case pour les propriétés CSS
                        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
                        htmlEl.style[prop] = value;
                    }
                });
                forceUpdate();
            };

            this.el.addEventListener('mouseenter', () => {
                applyStyles(this.data.hoverStyles);
            });

            this.el.addEventListener('mouseleave', () => {
                applyStyles(this.data.normalStyles);
            });
        };

        const scene = document.querySelector('a-scene');
        if (scene && scene.hasLoaded) {
            setupSync();
        } else {
            scene?.addEventListener('loaded', setupSync);
        }
    }
});
