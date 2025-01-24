<script setup>
import { onMounted } from 'vue'
import play from './svg/play.svg?raw'
import pause from './svg/pause.svg?raw'
import closex from './svg/closex.svg?raw'
import { audioItems, audioPlayer, audioMethods, formatMethods } from './vue-audio-player-store.js'
const { timestampClick, playPauseClick, closeAudioPlayer, volumeMousedown, } = audioMethods
const { getFormattedTimestamp } = formatMethods

onMounted(() => {
    window.addEventListener('keydown', (e) => {
        const { code } = e
        const { loadedTrack, loadingTrack } = audioPlayer
        if (code === 'Space') {
            e.preventDefault()
            if (loadedTrack !== null && !loadingTrack) {
                playPauseClick(loadedTrack)
            }
        }
    })
})
</script>

<template>
    <div :class="`audio-player-wrapper ${audioPlayer.activeClass}`">
        <div class="controls-area">
            <div class="audio-title small">
                <div>{{ audioPlayer.trackName }}</div>
            </div>
            |
            <div class="audio-timestamps-wrapper">
                <div v-for="timestamp in audioPlayer.timestamps" class="audio-timestamp" @click="timestampClick(timestamp.time)">
                    <strong>{{ getFormattedTimestamp(timestamp.time) }}</strong> <span>{{ timestamp.name }}</span>
                </div>
            </div>
            <div id="volume-control-container" class="" @mousedown="volumeMousedown">
                <div id="volume-track">
                    <div :style="{ width: `${audioPlayer.volume}%` }" id="volume-fill"></div>
                </div>
                <div id="volume-ball"
                    :style="{ left: `calc(${audioPlayer.volume}% - 10px` }"></div>
            </div>
            <div v-html="closex" id="close-audio-player-x" @click="closeAudioPlayer"></div>
        </div> 
        <div class="audio-area">
            <div id="primary-play-pause" class="play-pause" @click="playPauseClick(audioPlayer.loadedTrack)">
                <div v-if="audioPlayer.playingTrack" v-html="pause" class="pause"></div>
                <div v-else v-html="play" class="play"></div>
            </div>
            <div id="loading-div" class="loading-shimmer"></div>
            <!-- <div v-if="audioPlayer.loadingTrack" id="loading-div" class="loading-shimmer"></div> -->
            <!-- <div :style="audioPlayer.loadingTrack ? { width: '0%' } : { width: '100%' }" id="audio-waveform-wrapper"></div> -->
        </div>
    </div>

</template>

<style>

.audio-player-wrapper {
    position: fixed;
    z-index: 100;
    /* bottom: -120px; */
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(35, 35, 35, 0.95);
    padding: 10px;
    height: 120px;
    transition: bottom 0.3s ease;
}

.audio-player-wrapper #primary-play-pause {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    padding: 10px;
    width: 50px;
    height: 50px;
    background-color: blueviolet;
}

.audio-player-wrapper #primary-play-pause:hover {
    background-color: violet;
}

.audio-player-wrapper #primary-play-pause:active {
    background-color: lightpink;
}

.audio-player-wrapper.active {
    border-top: 2px inset #646464;
    bottom: 0px;
}

.play svg {
    position: relative;
    left: 2px;
}

#close-audio-player-x {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    padding: 6px;
    position: absolute;
    right: 0px;
    border-radius: 50%;
}

#close-audio-player-x:hover {
    background-color: #eeeeee;
}

#audio-waveform-wrapper {
    width: 100%;
    margin: 5px 0;
    overflow: hidden;
}

#volume-control-container {
    display: flex;
    align-items: center;
    user-select: none;
    z-index: 101;
    position: absolute;
    right: 100px;
    height: 30px;
}

#volume-control-container #volume-track {
    pointer-events: none;
    width: 100px;
    height: 7px;
    border-radius: 10px;
    background-color: white;
    overflow: hidden;
}

#volume-control-container #volume-fill {
    pointer-events: none;
    background-color: blueviolet;
    height: 100%;
}

#volume-control-container #volume-ball {
    position: absolute;
    pointer-events: none;
    left: calc(0% - 10px);
    border-radius: 50%;
    border: 1px solid violet;
    background-color: blueviolet;
    height: 20px;
    width: 20px;
}

#loading-div {
    height: 60px;
    width: 100%;
    margin: 5px 0;
    border-radius: 7px;
    overflow: hidden;
    display: flex;
    align-items: center;
}

.audio-title.small {
    line-height: 1;
    font-size: 18px;
    margin-right: 10px;
}

.controls-area {
    position: relative;
    display: flex;
    align-items: center;
}

.audio-area {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    margin-top: 5px;
    border-radius: 7px;
    overflow: hidden;
}

.audio-timestamps-wrapper {
    display: flex;
    margin-left: 10px;
}

.audio-timestamp {
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-right: 5px;
    border-radius: 15px;
    padding: 3px 8px;
    background-color: #555555;
}

.audio-timestamp:hover {
    background-color: #666666;
}

.audio-timestamp:active {
    background-color: #444444;
}

.audio-timestamp strong {
    margin-right: 4px;
}

</style>