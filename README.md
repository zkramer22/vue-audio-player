# vue-audio-player

An audio player component for Vue 3.

## [quick lil demo](https://zkramer22.github.io/vue-audio-player)


## Installation

You can install this component via npm or yarn:

```bash
npm install @zkramer22/vue-audio-player
```


## Usage

Import the component and stylesheet for use in your Vue project. Make sure to include necessary props `tracksArr` and `baseUrl`.

Include title, artist, and album name.

`title` is combined with `baseUrl` to complete the file path for use in the audio player. Be sure that `title` matches the filename exactly.

Example:
<picture>
  <img alt="Image Alt Text" src="/img/s3-object.png">
</picture>

```vue
<script setup>
    import { ref } from 'vue'
    import VueAudioPlayer from '@zkramer22/vue-audio-player'
    import '@zkramer22/vue-audio-player/dist/vue-audio-player.css'

</script>

<template>
    <vue-audio-player v-bind="audioPlayer1Props" />
</template>
```

This the default style:\
<picture>
  <img alt="Image Alt Text" src="/img/default.png">
</picture>


## Props

|     prop     |      type    |    default   |  description |
| ------------ | ------------ | ------------ | ------------ |
|`tracksArr`|`Array`|`[]`|Array of track objects. track object outlined below.|
|`baseUrl`|`String`|`""`|the base url that will be used to locate the audio file. combined with each track object's `title` field to complete the file path.|
|`primaryColor`|`String`|`"#a7a0ff"`|color of play/pause button, active track text, active volume slider, waveform progress indicator|
|`secondaryColor`|`String`|`"#ffffff"`|color of waveform, UI elements|
|`bgColor`|`String`|`"rgba(35, 35, 35, 0.95)"`|background color of audio player container|
|`textColor`|`String`|`"#ffffff"`|color of text|
|`timestampBgColor`|`String`|none|color of timestamp button containers. falls back to `primaryColor` if not specified|


```vue
<script setup>
    import { ref } from 'vue'
    import VueAudioPlayer from '@zkramer22/vue-audio-player'
    import '@zkramer22/vue-audio-player/dist/vue-audio-player.css'

    const tracksArr = [
        {
            title: 'Meditate',
            artist: 'yokram',
            album: 'offerings [vol 1]',
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
        },
        {
            title: 'Mahogany',
            artist: 'yokram',
            album: 'offerings [vol 1]',
        },
        {
            title: 'At Night',
            artist: 'yokram',
            album: 'offerings [vol 1]',
        },
        {
            title: 'Press Start',
            artist: 'yokram',
            album: 'offerings [vol 1]',
        },
        {
            title: 'Slow Down',
            artist: 'yokram',
            album: 'offerings [vol 1]',
        },
    ]

    const baseUrl = 'https://studio-ztk-audio.s3.us-west-1.amazonaws.com'

    const styles: {
        primaryColor: '#63ADF2',
        secondaryColor: '#ffffff',
        bgColor: '#545E75',
        textColor: 'white',
    }

    const audioPlayerProps = { tracksArr, baseUrl, ...styles }

</script>

<template>
    <vue-audio-player v-model="audioPlayerProps" />
</template>
```

<picture>
  <img alt="Image Alt Text" src="/img/with-styles.png">
</picture>