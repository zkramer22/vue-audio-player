<script setup>
import { ref } from 'vue'
import VueAudioPlayer from '../src/VueAudioPlayer.vue';
import VueAudioPlayerItem from '../src/VueAudioPlayerItem.vue';

import { audioItems, formatMethods } from '../src/vue-audio-player-store.js'
const { objectFilter } = formatMethods
const musicItems = objectFilter(audioItems, (item) => item.type === 'music')

</script>

<template>
    <h1>VueAudioPlayer</h1>
    <h2>@zkramer22</h2>
    <h4>a Vue3 audio player with a beautiful waveform display.</h4>

    <div class="spacer"></div>

    <!-- <VueAudioPlayerItem /> -->
    
    <VueAudioPlayer/>
</template>

<style>
html, body {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: rgb(255, 252, 244);
}
#app {
    font-family: monospace;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}
h1 {
    margin: 0 0 5px;
}
h2 {
    margin: 5px 0 15px;
}
h4 {
    margin: 0 0 30px;
    text-align: center;
    line-height: 2;
}
.label {
    font-size: 12px;
    margin-bottom: 10px;
}
.spacer {
    height: 25px;
}
</style>