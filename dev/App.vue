<script setup>
import VueAudioPlayer from '../src/VueAudioPlayer.vue';

import { audioItems } from '../src/vue-audio-player-store.js'

const audioPlayer1Props = {
    audioItems,
    // primaryColor: 'rgb(0,0,0)',
    // secondaryColor: 'blue',
    // bgColor: 'teal',
    // textColor: '#222222',
    // fixed: true,
}

// const audioPlayer1State

</script>

<template>
    <h1>VueAudioPlayer</h1>
    <h2>@zkramer22</h2>
    <h4>a Vue3 audio player with extended functionality and waveform display.</h4>

    <div class="spacer"></div>

    <VueAudioPlayer v-bind="audioPlayer1Props" /> 
</template>

<style>
* {
    box-sizing: border-box;
}
html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    flex-direction: column;
    background-color: rgb(255, 252, 244);
}
#app {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    font-family: monospace;
    text-align: center;
    height: 100%;
    max-width: 768px;
    margin: 0 auto;
}
h1 {
    /* margin: 200px 0 5px; */
}
h2 {
    margin: 5px 0 15px;
}
h4 {
    margin: 0 0 30px;
    text-align: center;
    line-height: 2;
}
.spacer {
    height: 25px;
}
.spacer.large {
    height: 150px;
}
</style>