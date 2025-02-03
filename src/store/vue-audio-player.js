import { reactive, computed } from 'vue'
import Wavesurfer from 'wavesurfer.js'

export function useAudioPlayer(trackArr, baseUrl = "") {
    function getAudioObj(arr) {
        const audioObj = {}
            for (let i in arr) {
                const { title, artist, album, art, timestamps, spotifyUrl } = arr[i]
                const filename = title.replaceAll(' ', '+').replaceAll('–', '%E2%80%93')
                audioObj[`vue-audio-player_track-${i}`] = {
                    title,
                    artist,
                    album,
                    url: `${baseUrl}/${filename}`, 
                    timestamps: timestamps || [],
                    loaded: false,
                    playing: false, 
                    imgLoaded: false,
                    art: `${baseUrl}/${art}`,
                }
            }
        return reactive({ ...audioObj })
    }
    
    const audioPlayer = reactive({
        tracks: getAudioObj(trackArr),

        active: false,
        selectedTrack: null,
        loadedTrack: null,
        loadingTrack: null,
        playingTrack: null,
        wavesurfer: null,

        volume: 75,
        volumeBeforeMute: 75,
        volumeMousedown: false,
        volumeHover: false,
        leftBound: null,
        rightBound: null,
        
        primaryColor: null,
        secondaryColor: null,
        height: null,
        activeClass: computed(() => audioPlayer.active ? 'active' : ''),
        trackName: computed(() => audioPlayer.loadedTrack ? audioPlayer.tracks[audioPlayer.loadedTrack].title : null),
        timestamps: computed(() => audioPlayer.loadedTrack ? audioPlayer.tracks[audioPlayer.loadedTrack].timestamps : null),
        loadingClass: computed(() => audioPlayer.loadingTrack ? 'vue-audio-player_loading-shimmer' : ''),
    })

    function createTrack(trackId) {
        audioPlayer.active = true
        if (audioPlayer.wavesurfer) destroyTrack(audioPlayer.loadedTrack)  // destroy current waveform + player
        createWavesurfer(trackId)
    }
    function loadTrack(trackId) {
        audioPlayer.tracks[trackId].loaded = true
        audioPlayer.loadedTrack = trackId
    }
    function unloadTrack(trackId) {
        audioPlayer.tracks[trackId].loaded = false
        audioPlayer.loadedTrack = null
    }
    function playTrack(trackId) {
        audioPlayer.wavesurfer.play()
        audioPlayer.tracks[trackId].playing = true
        audioPlayer.playingTrack = trackId
    }
    function stopTrack(trackId) {
        audioPlayer.tracks[trackId].playing = false
        audioPlayer.playingTrack = null
    }
    function prevTrack() {
        const arr = Object.keys(audioPlayer.tracks)
        const currentIndex = arr.indexOf(audioPlayer.loadedTrack)
        if (currentIndex > 0) {
            createTrack(`vue-audio-player_track-${currentIndex - 1}`)
        }
        else {
            destroyTrack(audioPlayer.loadedTrack)
        }
    }
    function nextTrack() {
        const arr = Object.keys(audioPlayer.tracks)
        const currentIndex = arr.indexOf(audioPlayer.loadedTrack)
        if (currentIndex < arr.length - 1) {
            createTrack(`vue-audio-player_track-${currentIndex + 1}`)
        }
        else {
            destroyTrack(audioPlayer.loadedTrack)
        }
    }
    function destroyTrack(trackId) {
        stopTrack(trackId)
        unloadTrack(trackId)
        audioPlayer.wavesurfer.stop()
        audioPlayer.wavesurfer.destroy()
        audioPlayer.wavesurfer = null
    }
    function playPauseClick(trackId) {
        if (!trackId) {
            audioPlayer.selectedTrack = Object.keys(audioPlayer.tracks)[0]
            createTrack(audioPlayer.selectedTrack)
            return
        }
        audioPlayer.wavesurfer.playPause()
        audioPlayer.tracks[trackId].playing = !audioPlayer.tracks[trackId].playing
        audioPlayer.playingTrack = audioPlayer.tracks[trackId].playing ? trackId : null
    }
    function selectTrack(trackId) {
        audioPlayer.selectedTrack = trackId
    }
    function createWavesurfer(trackId) {
        audioPlayer.wavesurfer = Wavesurfer.create({
            container: '#vue-audio-player_waveform-wrapper',
            waveColor: audioPlayer.secondaryColor,
            height: 60,
            normalize: true,
            progressColor: audioPlayer.primaryColor,
            url: audioPlayer.tracks[trackId].url,
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
                loadTrack(trackId)
                playTrack(trackId)
        })
        audioPlayer.wavesurfer.on('finish', () => {
            const arr = Object.keys(audioPlayer.tracks)
            const currentIndex = arr.indexOf(audioPlayer.loadedTrack)
            if (currentIndex < arr.length - 1) {
                createTrack(`vue-audio-player_track-${currentIndex + 1}`)
            }
            else {
                destroyTrack(trackId)
            }
        })
    }
    function timestampClick(time) {
        audioPlayer.wavesurfer.setTime(time)
        audioPlayer.wavesurfer.play()
        audioPlayer.playingTrack = audioPlayer.loadedTrack
        audioPlayer.tracks[audioPlayer.playingTrack].playing = true
    }
    function closeAudioPlayer() {
        if (!audioPlayer.active) return
        stopTrack(audioPlayer.loadedTrack)
        destroyTrack(audioPlayer.loadedTrack)
        setTimeout(() => audioPlayer.wavesurfer = null, 0)
        audioPlayer.active = false
    }
    function setVolume(volume) {
        if (volume - 2 <= 0) audioPlayer.volume = 0
        else if (volume + 2 >= 100) audioPlayer.volume = 100
        else audioPlayer.volume = volume

        if (audioPlayer.wavesurfer) audioPlayer.wavesurfer.setVolume(audioPlayer.volume / 100)
    }
    function toggleMute(e) {
        if (audioPlayer.volumeBeforeMute === null) audioPlayer.volumeBeforeMute = audioPlayer.volume
        if (audioPlayer.volume > 0) {
            audioPlayer.volumeBeforeMute = audioPlayer.volume
            setVolume(0)
        }
        else if (audioPlayer.volume === 0) {
            setVolume(audioPlayer.volumeBeforeMute)
        }
    }
    function volumeMousedown(e) {
        const { offsetX } = e
        const { clientWidth, offsetLeft } = e.target
        const distanceFromLeft = e.target.getBoundingClientRect().left
        setVolume(offsetX)
        audioPlayer.volumeBeforeMute = offsetX
        audioPlayer.leftBound = distanceFromLeft
        audioPlayer.rightBound = distanceFromLeft + clientWidth
        audioPlayer.volumeMousedown = true
        window.addEventListener('mousemove', volumeMousedrag)
        window.addEventListener('mouseup',volumeMouseup)
    }
    function volumeMousedrag(e) {
        if (!audioPlayer.volumeMousedown) return
        const { clientX } = e
        if (clientX >= audioPlayer.leftBound && clientX <= audioPlayer.rightBound) {
            const newVolume = clientX - audioPlayer.leftBound
            setVolume(newVolume)
        }
    }
    function volumeMouseup(e) {
        audioPlayer.volumeMousedown = false
        window.removeEventListener('mousemove', volumeMousedrag)
        window.removeEventListener('mouseup', volumeMouseup)      
    }
    function getFormattedTimestamp(time) {
        return new Date(time * 1000).toISOString().slice(15, 19); // hh:mm:ss starts at char 11
    }
    function loadImg(type, trackId) {
        if (type === 'album') {
            setTimeout(() => audioPlayer.tracks[trackId].imgLoaded = true)
        }
    }

    return {
        audioPlayer,
        createTrack,
        loadTrack,
        unloadTrack,
        playTrack,
        stopTrack,
        prevTrack,
        nextTrack,
        destroyTrack,
        playPauseClick,
        selectTrack,
        createWavesurfer,
        timestampClick,
        closeAudioPlayer,
        setVolume,
        toggleMute,
        volumeMousedown,
        volumeMousedrag,
        volumeMouseup,
        getFormattedTimestamp,
        loadImg,
    }
}