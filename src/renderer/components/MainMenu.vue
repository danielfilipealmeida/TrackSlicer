<template>
    <section class="section">
        <waveform filePath="/Users/daniel/WebDev/TrackSlicer/test/unit/specs/files/input.wav" :cutpoints="[0.2, 0.3, 0.9]" channel="1"></waveform>
        <cutpoints :cutpoints="[0.2, 0.3, 0.9]"></cutpoints>
        <div class="container">
            <h1 class="title">
                Track Slicer
            </h1>
            <p class="subtitle">
                Convert your Vinyl or Tape rips into digital albums
            </p>

            <p>Here you can:</p>
            <ul>
                <li>
                    <router-link to="/new">Create a new Project</router-link>
                </li>
                <li>
                    <router-link to="/open">Open an existing Project</router-link>
                </li>
                <li>
                    <router-link to="/settings">Configure this application</router-link>
                </li>
                <li>
                    <hr>
                </li>
                <li>
                    <router-link to="/credits">Check some credits</router-link>
                </li>
                <li><a @click="confirmQuit">Quit</a></li>
            </ul>
        </div>
    </section>
</template>

<script>
  import { remote } from 'electron'
  import waveform from './widgets/waveform'
  import cutpoints from './widgets/cutpoints'

  export default {
    name: 'main-menu-page',
    components: {waveform, cutpoints},
    methods: {
      confirmQuit () {
        remote.dialog.showMessageBox({
          type: 'question',
          buttons: ['No... keep on working...', 'Yes, quit!'],
          title: 'Quitting...',
          message: 'You are about to exit the Tracke Slicer application. Are you sure?'
        },
        (response) => {
          if (response) remote.app.quit()
        })
      }
    }
  }
</script>