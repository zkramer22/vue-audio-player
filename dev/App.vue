<script setup>
import VueAudioPlayer from '../src/VueAudioPlayer.vue';

import { audioItems } from '../src/vue-audio-player-store.js'

const audioPlayer1Props = {
    audioItems,
    primaryColor: '#63ADF2',
    secondaryColor: '#ffffff',
    bgColor: '#545E75',
    // textColor: 'white',
    // fixed: true,
}

</script>

<template>
    <h1 class="text-center">VueAudioPlayer</h1>
    <h2 class="text-center">@zkramer22</h2>
    <h4 class="text-center">a Vue3 audio player with extended functionality and waveform display.</h4>

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
    /* background-color: rgb(255, 252, 244); */
    background-color: #A7CCED;
    
}
#app {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100%;
    font-family: monospace;
    min-height: 100%;
    max-width: 768px;
    margin: 0 auto;
}
.text-center {
    text-align: center;
}

h2 {
    margin: 5px 0 15px;
}
h4 {
    margin: 0 0 30px;
    line-height: 2;
}
.spacer {
    height: 25px;
}
.spacer.large {
    height: 150px;
}
</style>