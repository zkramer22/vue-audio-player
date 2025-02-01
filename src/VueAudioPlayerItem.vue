<script setup>
import { computed, reactive } from 'vue'
import playSVG from './svg/play.svg?raw'
import pauseSVG from './svg/pause.svg?raw'
import barsSVG from './svg/bars.svg?raw'

const emit = defineEmits(['createTrack', 'playPauseClick', 'loadImg', 'selectTrack'])
const props = defineProps({
    index: Number,
    trackId: String,
    title: String,
    artist: String,
    album: String,
    art: String,
    playing: Boolean,
    loading: Boolean,
    loaded: Boolean,
    selected: Boolean,
    imgLoaded: Boolean,
    albumView: Boolean,
    primaryColor: String,
    secondaryColor: String,
    textColor: String,
})

const styleVars = computed(() => {
    return {
        playPause: {
            color: props.loaded
                ? props.primaryColor
                : props.textColor || props.secondaryColor
        },
        title: {
            color: props.loaded
            ? props.primaryColor
            : props.textColor || props.secondaryColor
        },
        text: {
            color: props.textColor,
        },
    }
})

const state = reactive({
    hovered: false,
})

const computedPlayPause = computed(() => {
    let playPause, svgColor

    if (props.selected || state.hovered) {
        if (props.playing) playPause = pauseSVG
        else if (props.loading) playPause = '•••'
        else playPause = playSVG

        svgColor = props.secondaryColor
    }
    else {
        if (props.playing) playPause = barsSVG
        else playPause = `${props.index + 1}`
        
        svgColor = props.primaryColor
    }

    return playPause.replace(/fill="[^"]*"/g, `fill="${svgColor}"`)
})

const selectedClass = computed(() => props.selected ? 'selected' : '')
const playingClass = computed(() => props.playing ? 'playing' : '')
const albumClass = computed(() => props.albumView ? 'album' : '')

function playPauseClick() {
    if (props.loading) return
    if (props.loaded) emit('playPauseClick', props.trackId)
    else emit('createTrack', props.trackId)
}
function doubleClick() {
    if (props.loading) return
    if (props.loaded) emit('playPauseClick', props.trackId)
    else emit('createTrack', props.trackId)
}
function selectTrack() {
    if (!props.selected) emit('selectTrack', props.trackId)
}
function loadImg() {
    emit('loadImg', 'album', props.trackId)
}

</script>

<template>
    <div :class="`vue-audio-player-item_wrapper ${selectedClass} ${playingClass} ${albumClass}`" 
        @dblclick="doubleClick" @click="selectTrack"
        @mouseenter="state.hovered = true"
        @mouseleave="state.hovered = false"
    >
            <!-- LIST VIEW -->
        <div :class="`vue-audio-player-item ${albumClass} tracklist-row`">
            <div v-show="!albumView" @click="playPauseClick"
                    :class="`play-pause vue-audio-player_flex-centered`" 
                    :style="styleVars.playPause"
            >
                <div v-html="computedPlayPause"></div>
            </div>
            <div class="audio-column">
                <div class="title" :style="styleVars.title">{{ title }}</div>
                <div v-if="artist" class="artist small-text" :style="styleVars.text">{{ artist }}</div>
            </div>
            
            <div v-if="album" class="audio-column" :style="styleVars.text">{{ album }}</div>
            <!-- <div>{{ duration }}</div> -->
        </div>
    
        <!-- ALBUM VIEW -->
        <div v-show="albumView" class="album-img vue-audio-player_flex-centered">
            <div v-if="!imgLoaded" class="vue-audio-player_loading-shimmer"></div>
            <img :src="art" @load="loadImg" />
            <div @click="playPauseClick"
                 class="play-pause vue-audio-player_flex-centered album" 
                 :style="styleVars.playPause"
            >
                <div v-html="computedPlayPause"></div>
            </div>
        </div>
    </div>
</template>

<style>
.audio-items.album {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    padding: 0 10px 10px;
}

.vue-audio-player-item_wrapper {
    position: relative;
    width: 100%;
    padding: 0 10px;
    user-select: none;
    border-radius: 6px;
}

.vue-audio-player-item_wrapper:hover {
    backdrop-filter: brightness(1.2);
}

.vue-audio-player-item_wrapper.selected {
    backdrop-filter: brightness(1.1);
    filter: brightness(1.5);
}

.vue-audio-player-item_wrapper.playing {
    filter: brightness(1.5);
}

.vue-audio-player-item_wrapper.album {
    padding: 10px;
    border-radius: 7px;
}

.vue-audio-player-item_wrapper.album .album-img {
    position: relative;
    border-radius: 7px;
    overflow: hidden;
}

.vue-audio-player-item_wrapper.album .album-img .play-pause {
    position: absolute;
    opacity: 0;
}

.vue-audio-player-item_wrapper.album:hover .album-img .play-pause {
    opacity: 1;
}

.vue-audio-player-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    width: 100%;
}

.vue-audio-player-item .audio-column {
    text-overflow: ellipsis;
}

.vue-audio-player-item.album {
    flex-direction: column;
    justify-content: center;
    padding: 0;
}

.vue-audio-player-item.album .audio-column {
    width: auto;
}

.vue-audio-player-item.album .audio-column.title {
    margin-top: 7px;
}

.small-text {
    font-size: .8rem;
}

.title, .artist {
    margin: 5px 0;
}

.artist {
    filter: brightness(.8);
}

.play-pause {
    width: 20px;
    height: 20px;
    font-size: .8rem;
}

.play-pause.album {
    position: absolute;
    margin-right: 0;
    width: 50px;
    height: 50px;
    padding: 10px;
    background-color: blueviolet;
}

.play-pause.album:hover {
    background-color: violet;
}


</style>