import { reactive, computed } from 'vue'
import Wavesurfer from 'wavesurfer.js'
import { audioObj } from './vue-audio-player-items.js'

export const audioItems = reactive({ ...audioObj })

export const audioPlayer = reactive({
    active: false,
    loadedTrack: null,
    loadingTrack: null,
    playingTrack: null,
    wavesurfer: null,
    volume: null,
    volumeMousedown: false,
    leftBound: null,
    rightBound: null,
    activeClass: computed(() => audioPlayer.active ? 'active' : ''),
    trackName: computed(() => audioPlayer.loadedTrack ? audioItems[audioPlayer.loadedTrack].name : null),
    timestamps: computed(() => audioPlayer.loadedTrack ? audioItems[audioPlayer.loadedTrack].timestamps : null),
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
        if (!audioPlayer.wavesurfer) return
        if (!trackId) return
        audioPlayer.wavesurfer.playPause()
        audioItems[trackId].playing = !audioItems[trackId].playing
        audioPlayer.playingTrack = audioItems[trackId].playing ? trackId : null
    },
    createWavesurfer(trackId) {
        audioPlayer.wavesurfer = Wavesurfer.create({
            container: '#audio-waveform-wrapper',
            waveColor: '#ffffff',
            height: 60,
            normalize: true,
            progressColor: '#6A66A3',
            url: audioItems[trackId].url,
            barWidth: 3,
            barGap: 1,
            barRadius: 30,
            interact: true,
            dragToSeek: true,
        })
        audioPlayer.wavesurfer.on('load', () => {
            audioPlayer.loadingTrack = trackId
            audioMethods.loadTrack(trackId)
        })
        audioPlayer.wavesurfer.on('ready', () => {
                audioPlayer.loadingTrack = null
                if (!audioPlayer.volume) {
                    audioPlayer.volume = 75
                    audioPlayer.wavesurfer.setVolume(.75)
                }
                audioMethods.playTrack(trackId)
        
        })
        audioPlayer.wavesurfer.on('finish', () => {
            audioMethods.stopTrack(trackId)
        })
    },
    timestampClick(time) {
        audioPlayer.wavesurfer.setTime(time)
        audioPlayer.wavesurfer.play()
        audioPlayer.playingTrack = audioPlayer.loadedTrack
        audioItems[audioPlayer.playingTrack].playing = true
    },
    closeAudioPlayer() {
        audioMethods.stopTrack(audioPlayer.loadedTrack)
        audioMethods.destroyTrack(audioPlayer.loadedTrack)
        setTimeout(() => audioPlayer.wavesurfer = null, 0)
        audioPlayer.active = false
    },
    setVolume(volume) {
        if (volume < 0 || volume > 100) return
        audioPlayer.volume = volume
        audioPlayer.wavesurfer.setVolume(volume / 100)
    },
    volumeMousedown(e) {
        const { offsetX } = e
        const { clientWidth, offsetLeft } = e.target
        audioMethods.setVolume(offsetX)
        audioPlayer.leftBound = offsetLeft + 10
        audioPlayer.rightBound = offsetLeft + clientWidth + 10
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