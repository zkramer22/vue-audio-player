# vue-toggle-switch

An audio player component for Vue 3.

## [quick lil demo](https://zkramer22.github.io/vue-audio-player)

## Installation

You can install this component via npm or yarn:

```bash
npm install @zkramer22/vue-audio-player
```

## Usage

Import the components and stylesheet for use in your Vue project:

```vue
<script setup>
    import { ref } from 'vue'
    import VueToggleSwitch from '@zkramer22/vue-audio-player'
    import '@zkramer22/vue-audio-player/dist/vue-audio-player.css'

</script>

<template>
    <vue-toggle-switch v-model="switchState"/>
</template>
```

^ Make sure to pass an initial value from the parent component to the switch with `v-model`. the switch will update the value via two-way data binding.


## Props

Your component will look like this by default:

<picture>
  <img alt="Image Alt Text" src="/img/default-off.png">
</picture>
<picture>
  <img alt="Image Alt Text" src="/img/default-on.png">
</picture>

But, by using props...

```vue
<script setup>
    import { ref } from 'vue'
    import VueToggleSwitch from '@zkramer22/vue-toggle-switch'
    import '@zkramer22/vue-toggle-switch/dist/vue-toggle-switch.css'

    const switchState = ref(false)

    const switchProps = {
        states: ['one', 'two'],  // Array ([String, String])
        bgColor: 'white',  // String
        textColor: '#222222',  // String
        switchOnColor: 'rgb(107, 166, 255)',  // String
        switchOffColor: 'pink',  // String
        width: 150,  // Number
        height: 40,  // Number
        padding: 3,  // Number
        borderColor: 'black',  // String
        textSize: 18,  // Number
        textColor: '#222222',  // String
        borderRadius: 5,  // Number
        dropShadow: 'black'  // String
    }
</script>

<template>
    <vue-toggle-switch v-model="switchState" v-bind="switchProps"/>
</template>
```

...You can change the appearance of the switch!

<picture>
  <img alt="Image Alt Text" src="/img/props-off.png">
</picture>
<picture>
  <img alt="Image Alt Text" src="/img/props-on.png">
</picture>


### version 1.1.0 - `textOutside` prop added:

Move the text outside of the switch by passing `textOutside: true`:

```vue
<script setup>
    import { ref } from 'vue'
    import VueToggleSwitch from '@zkramer22/vue-toggle-switch'
    import '@zkramer22/vue-toggle-switch/dist/vue-toggle-switch.css'

    const switchState = ref(false)

    const switchProps = {
        width: 50,  // Number
        textOutside: true,  // Boolean
    }
</script>

<template>
    <vue-toggle-switch v-model="switchState" v-bind="switchProps"/>
</template>
```

<picture>
  <img alt="Image Alt Text" src="/img/text-outside.png">
</picture>