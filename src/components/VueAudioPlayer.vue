<script setup>
import { ref, computed, onMounted } from 'vue'
import playSVG from '../assets/play.svg?raw'
import pauseSVG from '../assets/pause.svg?raw'
import xSVG from '../assets/closeX.svg?raw'
import volumeOffSVG from '../assets/volumeOff.svg?raw'
import volumeLoSVG from '../assets/volumeLo.svg?raw'
import volumeMidSVG from '../assets/volumeMid.svg?raw'
import volumeHiSVG from '../assets/volumeHi.svg?raw'
import VueAudioPlayerItem from './VueAudioPlayerItem.vue'

import { useAudioPlayer } from '../store/vue-audio-player.js'

const props = defineProps({
    tracksArr: {
        type: Array[Object],
        default: [],
    },
    baseUrl: {
        type: String,
        default: "",
    },
    primaryColor: {
        type: String,
        default: '#a7a0ff',
    },
    secondaryColor: {
        type: String,
        default: '#fff',
    },
    bgColor: {
        type: String,
        default: 'rgba(35, 35, 35, 0.95)'
    },
    textColor: {
        type: String,
        default: '#fff',
    },
    timestampBgColor: {
        type: String,
    },
    fixed: {
        type: Boolean, 
        default: false,
    },
})

const { 
    audioPlayer,
    playPauseClick, timestampClick, 
    selectTrack, createTrack, prevTrack, nextTrack, 
    volumeMousedown, toggleMute,
    closeAudioPlayer,
    loadImg, getFormattedTimestamp,
} = useAudioPlayer(props.tracksArr, props.baseUrl, props.useSpotify)

const styleVars = computed(() => {
    return {
        wrapper: {
            backgroundColor: props.bgColor,
            bottom: props.fixed
                ? audioPlayer.active 
                    ? '0px'
                    : `-${(audioPlayer.height)}px`
                : 'unset'
        },
        playPause: {
            backgroundColor: props.primaryColor,
        },
        volumeFill: {
            backgroundColor: audioPlayer.volumeMousedown || audioPlayer.volumeHover ? props.primaryColor : props.secondaryColor,
            width: `${audioPlayer.volume}%`,
        },
        volumeBall: { 
            left: `calc(${audioPlayer.volume}% - 7px`,
            scale: audioPlayer.volumeMousedown ? 1 : 0,
        },
        text: {
            color: props.textColor || props.secondaryColor,
            fill: props.textColor || props.secondaryColor,
            stroke: props.textColor || props.secondaryColor,
        },
        timestamps: {
            backgroundColor: props.timestampBgColor || props.primaryColor,
            color: props.textColor || props.secondaryColor,
        }
    }
})
const fixedClass = computed(() => props.fixed ? 'vue-audio-player_fixed' : '')
const computedTitle = computed(() => {
    if (audioPlayer.active) {
        if (audioPlayer.loadedTrack) return audioPlayer.trackName
        else return '•••'
    }
    else {
        return 'select a track:'
    }
})
const computedX = computed(() => audioPlayer.loadedTrack ? xSVG.replace(/stroke="[^"]*"/g, `stroke="${props.secondaryColor}"`) : '•')
const computedMute = computed(() => {
    let mute

    if (audioPlayer.volume === 0) mute = volumeOffSVG
    else if (audioPlayer.volume > 0 && audioPlayer.volume <= 33) mute = volumeLoSVG
    else if (audioPlayer.volume > 33 && audioPlayer.volume <= 66) mute = volumeMidSVG
    else if (audioPlayer.volume > 66 && audioPlayer.volume <= 100) mute = volumeHiSVG
    else mute = ''

    return mute
        .replace(/stroke="[^"]*"/g, `stroke="${props.secondaryColor}"`)
        .replace(/fill="secondaryColor"/g, `fill="${props.secondaryColor}"`)
})
const computedPlayPause = computed(() => {
    let playPause

    if (audioPlayer.playingTrack) playPause = pauseSVG
    else if (audioPlayer.loadingTrack) playPause = '•••'
    else playPause = playSVG

    return playPause.replace(/fill="[^"]*"/g, `fill="${props.secondaryColor}"`)
})

const vueAudioPlayer = ref(null)

function addKeyListeners() {
    window.addEventListener('keydown', (e) => {
        const { code, metaKey } = e
        const { loadedTrack, loadingTrack, selectedTrack } = audioPlayer

        if (code === 'Space') {
            e.preventDefault()
            if (loadedTrack !== null && !loadingTrack) {
                playPauseClick(loadedTrack)
            }
        }
        else if (code === 'ArrowDown') {
            e.preventDefault()
            const arr = Object.keys(audioPlayer.tracks)
            const currentIndex = arr.indexOf(selectedTrack)
            if (currentIndex < arr.length - 1) {
                selectTrack(`vue-audio-player_track-${currentIndex + 1}`)
            }
        }
        else if (code === 'ArrowUp') {
            e.preventDefault()
            const arr = Object.keys(audioPlayer.tracks)
            const currentIndex = arr.indexOf(selectedTrack)
            if (currentIndex > 0) {
                selectTrack(`vue-audio-player_track-${currentIndex - 1}`)
            }
        }
        else if (code === 'ArrowLeft') {
            if (metaKey) prevTrack()
        }
        else if (code === 'ArrowRight') {
            if (metaKey) nextTrack()
        }
        else if (code === 'Enter') {
            e.preventDefault()
            if (!selectedTrack) return
            if (!loadedTrack) {
                createTrack(selectedTrack)
            }
            else {
                if (selectedTrack === loadedTrack) playPauseClick(selectedTrack)
                else createTrack(selectedTrack)
            }
        }
    })
}
function addColorPropsToState() {
    audioPlayer.primaryColor = props.primaryColor
    audioPlayer.secondaryColor = props.secondaryColor
}
function addHeightToState() {
    audioPlayer.height = vueAudioPlayer.value.clientHeight
}

onMounted(() => {
    addKeyListeners()
    addColorPropsToState()
    addHeightToState()
})

</script>

<template>
    <div ref="vueAudioPlayer" :class="`vue-audio-player_wrapper ${audioPlayer.activeClass} ${fixedClass}`" :style="styleVars.wrapper">
        <div class="vue-audio-player_controls-area">
            <div class="vue-audio-player_flex-aligned vue-audio-player_overflow-scroll">
                <div class="vue-audio-player_audio-title" :style="styleVars.text">
                    <div>{{ computedTitle }}</div>
                </div>
                <div class="vue-audio-player_timestamps">
                    <div v-for="timestamp in audioPlayer.timestamps" 
                        :style="styleVars.timestamps"
                        class="vue-audio-player_timestamp" @click="timestampClick(timestamp.time)"
                    >
                        <strong>{{ getFormattedTimestamp(timestamp.time) }}</strong> <span>{{ timestamp.label }}</span>
                    </div>
                </div>
            </div>
            <div class="vue-audio-player_flex-aligned">
                <div id="vue-audio-player_volume-icon" v-html="computedMute" @click="toggleMute"></div>
                <div id="vue-audio-player_volume-control" @mousedown="volumeMousedown" 
                    @mouseenter="audioPlayer.volumeHover = true"
                    @mouseleave="audioPlayer.volumeHover = false"
                >
                    <div id="vue-audio-player_volume-track">
                        <div id="vue-audio-player_volume-fill" :style="styleVars.volumeFill"></div>
                    </div>
                    <div id="vue-audio-player_volume-ball" :style="styleVars.volumeBall"></div>
                </div>
                <div v-html="computedX" id="vue-audio-player_close" @click="closeAudioPlayer" :style="styleVars.text"></div>
            </div>
        </div> 

        <div class="vue-audio-player_audio-area">
            <div id="vue-audio-player_play-pause" 
                 @click="playPauseClick(audioPlayer.loadedTrack)" 
                 :style="styleVars.playPause"
            >
                <div v-html="computedPlayPause" :style="styleVars.text"></div>
            </div>
            <div id="vue-audio-player_waveform-wrapper" 
                 :class="audioPlayer.loadingClass">
            </div>
        </div>

        <div class="vue-audio-player_tracklist">
            <div class="tracklist-header tracklist-row">
                <div class="play-pause vue-audio-player_flex-centered" :style="styleVars.text">#</div>
                <div class="audio-column vue-audio-player_flex-aligned" :style="styleVars.text">title</div>
                <div class="audio-column vue-audio-player_flex-aligned" :style="styleVars.text">album</div>
            </div>
            
            <VueAudioPlayerItem v-for="(item, trackId, index) in audioPlayer.tracks" 
                :key="`audio-item-${trackId}`" :index
                v-bind="item"
                :trackId
                :loading="audioPlayer.loadingTrack === trackId"
                :selected="audioPlayer.selectedTrack === trackId"
                :imgLoaded="item.imgLoaded"
                @create-track="createTrack"
                @play-pause-click="playPauseClick"
                @load-img="loadImg"
                @select-track="selectTrack"
                :primaryColor
                :secondaryColor
                :textColor
            />
        </div>
        
    </div>


</template>

<style>

svg {
    display: block;
}

.vue-audio-player_fixed {
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    transition: bottom 0.3s ease;
}

.vue-audio-player_wrapper {
    font-size: 1rem;
    padding: 14px;
    display: grid;
    grid-template-rows: 1fr 3fr;
    width: 100%;
    max-width: 100%;
    border-radius: 14px;
}

.vue-audio-player_wrapper #vue-audio-player_play-pause {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    padding: 10px;
    width: 50px;
    height: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    scale: 1;
    transition: scale .1s ease;
}

.vue-audio-player_wrapper #vue-audio-player_play-pause:hover {
    scale: 1.1;
}

.vue-audio-player_wrapper #vue-audio-player_play-pause:active {
    scale: 1;
}

.vue-audio-player_play,
.vue-audio-player_pause {
    display: flex;
}

.vue-audio-player_play svg {
    position: relative;
    left: 2px;
}

#vue-audio-player_close {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    padding: 3px;
    scale: 1;
}

#vue-audio-player_waveform-wrapper {
    width: 100%;
    max-width: 100vw;
    margin: 5px 0;
    border-radius: 10px;
}

#vue-audio-player_volume-control {
    display: flex;
    align-items: center;
    user-select: none;
    z-index: 101;
    position: relative;
    margin: 0 20px 0 10px;
    height: 30px;
}

#vue-audio-player_volume-icon {
    width: 20px;
    height: 20px;
    margin-left: 10px;
}

#vue-audio-player_volume-control #vue-audio-player_volume-track {
    pointer-events: none;
    width: 100px;
    height: 5px;
    border-radius: 10px;
    background-color: gray;
    overflow: hidden;
}

#vue-audio-player_volume-control #vue-audio-player_volume-fill {
    pointer-events: none;
    height: 100%;
}

#vue-audio-player_volume-control #vue-audio-player_volume-ball {
    position: absolute;
    pointer-events: none;
    left: calc(0% - 7px);
    border-radius: 50%;
    height: 15px;
    width: 15px;
    scale: 0;
    background-color: white;
}

.vue-audio-player_audio-title {
    line-height: 1;
    font-size: 1.2rem;
    padding-right: 10px;
}

.vue-audio-player_controls-area {
    display: grid;
    grid-template-columns: 1fr 185px;
    position: relative;
}

.vue-audio-player_audio-area {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 70px;
    margin: 7px auto;
}

.vue-audio-player_timestamps {
    display: flex;
    margin-left: 10px;
}

.vue-audio-player_timestamp {
    display: flex;
    align-items: center;
    font-size: .8rem;
    margin-right: 7px;
    border-radius: 15px;
    padding: 3px 8px;
    cursor: pointer;
    white-space: nowrap;
}

.vue-audio-player_timestamp:active {
    background-color: #444444;
}

.vue-audio-player_timestamp strong {
    margin-right: 4px;
}

.vue-audio-player_tracklist {
    width: 100%;
}

.tracklist-row {
    display: grid;
    grid-template-columns: 35px 1fr 1fr;
}

.tracklist-header {
    font-size: .8rem;
    padding: 0 10px;
    filter: brightness(.8);
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid white;
}

@media (hover:hover) {
    .vue-audio-player_timestamp:hover {
        filter: brightness(1.1);
    }
    .vue-audio-player_timestamp:active {
        filter: brightness(.9);
    }
    #vue-audio-player_volume-control:hover #vue-audio-player_volume-ball {
        scale: 1 !important;
    }
    #vue-audio-player_close:hover {
        scale: 1.2;
    }
}

.vue-audio-player_flex-aligned {
    display: flex;
    align-items: center;
}

.vue-audio-player_flex-centered {
    display: flex;
    align-items: center;
    justify-content: center;
}

.vue-audio-player_overflow-scroll {
    overflow: scroll;
}

.vue-audio-player_overflow-scroll::-webkit-scrollbar {
    display: none;
}

.vue-audio-player_loading-shimmer {
    animation-duration: 2.2s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: vue-audio-player_shimmer;
    animation-timing-function: linear;
    background: #ddd;
    background: linear-gradient(to right, #e8e8e8 8%, #d5d5d5 18%, #e8e8e8 33%);
    background-size: 1200px 100%;
}

@keyframes vue-audio-player_shimmer {
    0% {
        background-position: -1200px 0;
    }
    100% {
        background-position: 1200px 0;
    }
}

</style>