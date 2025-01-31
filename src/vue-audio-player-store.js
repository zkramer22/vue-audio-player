import { reactive, computed } from 'vue'
import Wavesurfer from 'wavesurfer.js'
import { audioObj } from './vue-audio-player-items.js'

export const audioItems = reactive({ ...audioObj })

export const audioPlayer = reactive({
    active: false,
    selectedTrack: null,
    loadedTrack: null,
    loadingTrack: null,
    playingTrack: null,
    wavesurfer: null,
    volume: 75,
    volumeBeforeMute: null,
    volumeMousedown: false,
    volumeHover: false,
    leftBound: null,
    rightBound: null,
    primaryColor: null,
    secondaryColor: null,
    height: null,
    activeClass: computed(() => audioPlayer.active ? 'active' : ''),
    trackName: computed(() => audioPlayer.loadedTrack ? audioItems[audioPlayer.loadedTrack].title : null),
    timestamps: computed(() => audioPlayer.loadedTrack ? audioItems[audioPlayer.loadedTrack].timestamps : null),
    loadingClass: computed(() => audioPlayer.loadingTrack ? 'loading-shimmer' : '')
})

export const audioMethods = {
    createTrack(trackId) {
        audioPlayer.active = true
        if (audioPlayer.wavesurfer) audioMethods.destroyTrack(audioPlayer.loadedTrack)  // destroy current waveform + player
        audioMethods.createWavesurfer(trackId)  // create new player
    },
    loadTrack(trackId) {
        audioItems[trackId].loaded = true
        audioPlayer.loadedTrack = trackId
    },
    unloadTrack(trackId) {
        audioItems[trackId].loaded = false
        audioPlayer.loadedTrack = null
    },
    playTrack(trackId) {
        audioPlayer.wavesurfer.play()
        audioItems[trackId].playing = true
        audioPlayer.playingTrack = trackId
    },
    stopTrack(trackId) {
        audioItems[trackId].playing = false
        audioPlayer.playingTrack = null
    },
    destroyTrack(trackId) {
        audioMethods.stopTrack(trackId)
        audioMethods.unloadTrack(trackId)
        audioPlayer.wavesurfer.stop()
        audioPlayer.wavesurfer.destroy()
    },
    playPauseClick(trackId) {
        if (!trackId) {
            audioPlayer.selectedTrack = Object.keys(audioItems)[0]
            audioMethods.createTrack(audioPlayer.selectedTrack)
            return
        }
        audioPlayer.wavesurfer.playPause()
        audioItems[trackId].playing = !audioItems[trackId].playing
        audioPlayer.playingTrack = audioItems[trackId].playing ? trackId : null
    },
    selectTrack(trackId) {
        audioPlayer.selectedTrack = trackId
    },
    createWavesurfer(trackId) {
        audioPlayer.wavesurfer = Wavesurfer.create({
            container: '#vue-audio-player_waveform-wrapper',
            waveColor: audioPlayer.secondaryColor,
            height: 60,
            normalize: true,
            progressColor: audioPlayer.primaryColor,
            url: audioItems[trackId].url,
            barWidth: 3,
            barGap: 1,
            barRadius: 30,
            interact: true,
            dragToSeek: true,
        })
        audioPlayer.wavesurfer.on('load', () => {
            audioPlayer.loadingTrack = trackId
        })
        audioPlayer.wavesurfer.on('ready', () => {
                audioPlayer.loadingTrack = null
                audioPlayer.wavesurfer.setVolume(audioPlayer.volume / 100)
                audioMethods.loadTrack(trackId)
                audioMethods.playTrack(trackId)
        })
        audioPlayer.wavesurfer.on('finish', () => {
            const arr = Object.keys(audioItems)
            const currentIndex = arr.indexOf(audioPlayer.loadedTrack)
            if (currentIndex < arr.length - 1) {
                audioMethods.createTrack(`vue-audio-player_track-${currentIndex + 1}`)
            }
            else {
                audioMethods.stopTrack(trackId)
            }
        })
    },
    timestampClick(time) {
        audioPlayer.wavesurfer.setTime(time)
        audioPlayer.wavesurfer.play()
        audioPlayer.playingTrack = audioPlayer.loadedTrack
        audioItems[audioPlayer.playingTrack].playing = true
    },
    closeAudioPlayer() {
        if (!audioPlayer.active) return
        audioMethods.stopTrack(audioPlayer.loadedTrack)
        audioMethods.destroyTrack(audioPlayer.loadedTrack)
        setTimeout(() => audioPlayer.wavesurfer = null, 0)
        audioPlayer.active = false
    },
    setVolume(volume) {
        if (volume - 2 <= 0) audioPlayer.volume = 0
        else if (volume + 2 >= 100) audioPlayer.volume = 100
        else audioPlayer.volume = volume

        if (audioPlayer.wavesurfer) audioPlayer.wavesurfer.setVolume(audioPlayer.volume / 100)
    },
    toggleMute(e) {
        if (audioPlayer.volumeBeforeMute === null) audioPlayer.volumeBeforeMute = audioPlayer.volume
        if (audioPlayer.volume > 0) {
            audioPlayer.volumeBeforeMute = audioPlayer.volume
            audioMethods.setVolume(0)
        }
        else if (audioPlayer.volume === 0) {
            audioMethods.setVolume(audioPlayer.volumeBeforeMute)
        }
    },
    volumeMousedown(e) {
        const { offsetX } = e
        const { clientWidth, offsetLeft } = e.target
        const distanceFromLeft = e.target.getBoundingClientRect().left
        audioMethods.setVolume(offsetX)
        audioPlayer.leftBound = distanceFromLeft
        audioPlayer.rightBound = distanceFromLeft + clientWidth
        audioPlayer.volumeMousedown = true
        window.addEventListener('mousemove', audioMethods.volumeMousedrag)
        window.addEventListener('mouseup',audioMethods.volumeMouseup)
    },
    volumeMousedrag(e) {
        if (!audioPlayer.volumeMousedown) return
        const { clientX } = e
        if (clientX >= audioPlayer.leftBound && clientX <= audioPlayer.rightBound) {
            const newVolume = clientX - audioPlayer.leftBound
            audioMethods.setVolume(newVolume)
        }
    },
    volumeMouseup(e) {
        audioPlayer.volumeMousedown = false
        window.removeEventListener('mousemove', audioMethods.volumeMousedrag)
        window.removeEventListener('mouseup', audioMethods.volumeMouseup)      
    },
}

export const formatMethods = {
    getFormattedTimestamp(time) {
        return new Date(time * 1000).toISOString().slice(15, 19); // hh:mm:ss starts at char 11
    },
    objectFilter(obj, condition) {
        return Object.keys(obj)
            .filter(key => condition(obj[key]))
            .reduce((res, key) => (res[key] = obj[key], res), {})
    },
}

export const loaderMethods = {
    loadImg(type, trackId) {
        if (type === 'album') {
            setTimeout(() => audioItems[trackId].imgLoaded = true)
        }
    },
}