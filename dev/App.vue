<script setup>
import VueAudioPlayer from '../src/components/VueAudioPlayer.vue';

const tracksArr = [
    {
        title: 'Meditate',
        artist: 'yokram',
        album: 'offerings [vol 1]',
        art: 'art-offerings-vol-1',
        timestamps: [
            { time: 0, label: 'intro' },
            { time: 24.7, label: 'main melody & beat' },
            { time: 106, label: 'shuffle beat' },
        ],
    },
    {
        title: 'Cruise',
        artist: 'yokram',
        album: 'offerings [vol 1]',
        art: 'art-offerings-vol-1',
        timestamps: [],
    },
    {
        title: 'Mahogany',
        artist: 'yokram',
        album: 'offerings [vol 1]',
        art: 'art-offerings-vol-1',
    },
    {
        title: 'At Night',
        artist: 'yokram',
        album: 'offerings [vol 1]',
        art: 'art-offerings-vol-1',
    },
    {
        title: 'Press Start',
        artist: 'yokram',
        album: 'offerings [vol 1]',
        art: 'art-offerings-vol-1',
    },
    {
        title: 'Slow Down',
        artist: 'yokram',
        album: 'offerings [vol 1]',
        art: 'art-offerings-vol-1',
    },
]

const baseUrl = 'https://studio-ztk-audio.s3.us-west-1.amazonaws.com'

const styles = {
    primaryColor: '#63ADF2',
    secondaryColor: '#ffffff',
    bgColor: '#545E75',
    textColor: 'white',
}

const audioPlayerProps = {
    tracksArr,
    baseUrl,
    // ...styles,
}

</script>

<template>
    <h1 class="text-center">VueAudioPlayer</h1>
    <h2 class="text-center">@zkramer22</h2>
    <h4 class="text-center">a Vue3 audio player with extended functionality and waveform display.</h4>

    <div class="spacer"></div>

    <VueAudioPlayer v-bind="audioPlayerProps" /> 
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

    /* lavender */
    background-color: #d4d0ff;

    /* light blue */
    /* background-color: #A7CCED; */
    
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
h1, h2, h4 {
    color: #120f2a;
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