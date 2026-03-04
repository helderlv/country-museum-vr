<script setup>
import { computed } from 'vue';

const props = defineProps({
    plateId: { type: String, required: true },
    position: { type: String, default: '0 1.6 0' },
    rotation: { type: String, default: '-40 90 0' },
    distance: { type: Number, default: 1.5 },
    title: { type: String, required: true },
    text: { type: String, required: true },
});

// Découpe le texte en lignes de max MAX_CHARS caractères, en coupant aux espaces
const MAX_CHARS = 55;
function wrapText(text) {
    const words = text.trim().replace(/\s+/g, ' ').split(' ').filter(w => w.length > 0);
    const lines = [];
    let current = '';
    for (const word of words) {
        const candidate = current ? current + ' ' + word : word;
        if (candidate.length > MAX_CHARS) {
            if (current) lines.push(current);
            current = word;
        } else {
            current = candidate;
        }
    }
    if (current) lines.push(current);
    return lines;
}

const textLines = computed(() => wrapText(props.text));
</script>

<template>
    <!-- Cartel HTML téléporté dans le body pour aframe-htmlmesh -->
    <Teleport to="body">
        <div :id="`html-content-${plateId}`"
            style="position: fixed; top: 0; left: 0; width: 846px; transform: translateY(-9999px); pointer-events: none;">
            <div
                style="width: 846px; padding: 56px 40px; background-color: #1c1a17; border: 12px solid #c9a84c; box-sizing: border-box; font-family: Georgia, serif;">
                <div style="font-size: 44px; font-weight: bold; color: #f0e6cc; margin: 0 0 28px 0; line-height: 1.3;">
                    {{ title }}</div>
                <div style="width: 80px; height: 4px; background-color: #c9a84c; margin-bottom: 28px;"></div>
                <!-- Un <div> par ligne : seule méthode fiable avec le canvas renderer de HTMLMesh -->
                <div v-for="(line, i) in textLines" :key="i"
                    style="font-size: 30px; color: #c8baa0; line-height: 1.7; margin: 0; padding: 0; white-space: nowrap;">
                    {{ line }}</div>
            </div>
        </div>
    </Teleport>

    <!-- Entité A-Frame qui affiche le mesh HTML au bon endroit -->
    <a-entity :id="'info-plate-' + plateId" :position="position" :rotation="rotation" visible="false"
        :emit-when-near="`distance: ${distance};`" event-set__enter="value: true; attribute: visible; event: click;"
        event-set__leave="value: false; attribute: visible; event: unclick;"
        :html="`html:#html-content-${plateId};cursor:#cursor`">
    </a-entity>
</template>
