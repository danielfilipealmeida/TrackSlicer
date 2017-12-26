<template>
    <section class="section">
        <div class="container">
            <h1 class="title">
                Project {{ name }}
            </h1>

            <div class="notification is-danger" v-show="errorMessage!=null">
                <button class="delete" @click="errorMessage=null"></button>
                {{ errorMessage }}
            </div>


            <table class="table is-striped is-bordered is-hoverable is-fullwidth" v-if="project">
                <thead>
                <tr>
                    <th>Input Files</th>
                </tr>
                </thead>
                <tbody v-if="inputFiles">
                <tr v-for="file in project.inputFiles">
                    <td>{{ file }}</td>
                </tr>
                </tbody>
            </table>

            <div class="buttons is-right">
                <a class="button is-right" @click="handleNewInputFile">Add new input file</a>
            </div>


            <table class="table is-striped is-bordered is-hoverable is-fullwidth" v-if="project">
                <thead>
                <tr>
                    <th>Tracks</th>
                </tr>
                </thead>
                <tbody v-if="project.tracks">
                <tr v-for="track in project.tracks">
                    <td>{{ track }}</td>
                </tr>
                </tbody>
            </table>

            <div class="columns">
                <div class="column">
                    <input class="input" placeholder="The name of a new track" type="text" v-model="newTrack">
                </div>
                <div class="column is-one-fifth ">
                    <a class="button is-pulled-right is-fullwidth" @click="handleNewTrack">Add new track</a>
                </div>
            </div>


            <hr/>

            <div class="buttons">
                <a class="button is-success" @click="executeSlice">Slice!</a>
                <router-link to="/" class="button">Back</router-link>
            </div>

        </div>
    </section>
</template>

<script>
  import { remote } from 'electron'

  let dialog = remote.dialog

  export default {
    name: 'project',
    components: {},
    mounted () {
      let inputParams = this.$route.params
      if (typeof inputParams.name !== 'string') {
        this.errorMessage = 'No project set!'
        return
      }
      this.projectName = inputParams.name
      this.project = this.$store.getters.getByProjectName(this.projectName)
    },
    data () {
      return {
        projectName: null,
        errorMessage: null,
        project: {},
        inputFiles: [],
        tracks: [],
        newTrack: null
      }
    },
    methods: {
      executeSlice () {
      },
      /**
       * Handles the click on the button to add new input files
       */
      handleNewInputFile () {
        let newInputFiles = dialog.showOpenDialog({
          properties: ['openFile', 'multiSelections'],
          title: 'Select files to use as input',
          filters: [
            {
              name: 'Uncompressed audio files',
              extensions: ['wav', 'aiff', 'mp3', 'wma', 'flac']
            },
            {
              name: 'Compressed audio files',
              extensions: ['mp3', 'wma', 'flac']
            },
            {
              name: 'All',
              extensions: ['*']
            }
          ]
        })

        newInputFiles.forEach((newInputFile) => {
          if (this.inputFiles.indexOf(newInputFile) === -1) {
            this.inputFiles.push(newInputFile)
          }
        }, this)

        try {
          this.$store.commit('setInputsInProject', {
            name: this.projectName,
            inputFiles: this.inputFiles
          })
        } catch (err) {
          this.errorMessage = err.message
        }
      },
      /**
       * Handles the button to add new tracks
       */
      handleNewTrack () {
        this.$store.commit('addNewTrack', {
          name: this.projectName,
          trackName: this.newTrack
        })
        this.newTrack = ''
      }
    },
    computed: {
      name () {
        return (!!this.project && typeof this.project.name === 'string') ? this.project.name : '<No name>'
      }
    }
  }
</script>