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
        wrapper: {
            backdropFilter: props.selected
                ? 'brightness(1.7)'
                : 'none'
        },
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

const activeClass = computed(() => props.selected ? 'active' : '')
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
    <div :class="`vue-audio-player-item_wrapper ${activeClass} ${albumClass}`" 
        @dblclick="doubleClick" @click="selectTrack"
        @mouseenter="state.hovered = true"
        @mouseleave="state.hovered = false"
    >
        <!-- ALBUM VIEW -->
        <div v-show="albumView" class="album-img vue-audio-player_flex-centered">
            <div v-if="!imgLoaded" class="loading-shimmer"></div>
            <img :src="art" @load="loadImg" />
            <div @click="playPauseClick"
                 class="play-pause vue-audio-player_flex-centered album" 
                 :style="styleVars.playPause"
            >
                <div v-html="computedPlayPause"></div>
            </div>
        </div>

        <!-- LIST VIEW -->
        <div :class="`audio-player-item ${albumClass}`">
            <div v-show="!albumView" @click="playPauseClick"
                 :class="`play-pause vue-audio-player_flex-centered`" 
                 :style="styleVars.playPause"
            >
                <div v-html="computedPlayPause"></div>
            </div>
            <div :class="`audio-column title`" :style="styleVars.title">{{ title }}</div>
            <div v-if="artist" class="audio-column small" :style="styleVars.text">{{ artist }}</div>
             <div v-if="album" class="audio-column small" :style="styleVars.text">{{ album }}</div>
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
}

.vue-audio-player-item_wrapper:hover {
    backdrop-filter: brightness(1.4);
}

.vue-audio-player-item_wrapper.active {
    backdrop-filter: brightness(1.7);
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

.audio-player-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    width: 100%;
}

.audio-player-item .audio-column {
    display: flex;
    align-items: center;
    width: 33%;
    font-size: 16px;
    text-overflow: ellipsis;
}

.audio-player-item.album {
    flex-direction: column;
    justify-content: center;
    padding: 0;
}

.audio-player-item.album .audio-column {
    width: auto;
}

.audio-player-item.album .audio-column.title {
    margin-top: 7px;
}

.audio-player-item.album .audio-column.small {
    font-size: 12px;
}

.play-pause {
    margin-right: 10px;
    width: 20px;
    height: 20px;
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