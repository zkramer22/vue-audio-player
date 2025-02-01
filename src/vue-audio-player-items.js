const FILE_PATH = 'https://studio-ztk-audio.s3.us-west-1.amazonaws.com'

const audioArr = [
    // insert track objects here:
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
    },    {
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
    }
]

function getAudioObj(arr) {
    const audioObj = {}
    // for (const [type, arr] of Object.entries(audio)) {  // used when audioItems is an object. ex: { type1: [{ title, artist, album }], type2: [], type3: [] }
        for (let i in arr) {
            const { title, artist, album, art, timestamps } = arr[i]
            const filename = title.replaceAll(' ', '+').replaceAll('–', '%E2%80%93')
            // audioObj[`${type}-${i}`] = {  // used when audioItems is an object.
            audioObj[`vue-audio-player_track-${i}`] = {
                title,
                artist,
                album,
                // type,
                art: `${FILE_PATH}/${art}`,
                url: `${FILE_PATH}/${filename}`, 
                timestamps,
                loaded: false,
                playing: false, 
                imgLoaded: false,
            }
        }
    // }
    return audioObj
}

export default getAudioObj(audioArr)