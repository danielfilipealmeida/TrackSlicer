<template>
    <section class="section">
        <div class="container">
            <h1 class="title">
                New Project
            </h1>

            <div class="notification is-danger" v-show="errorMessage!=null">
                <button class="delete" @click="errorMessage=null"></button>
                {{ errorMessage }}
            </div>

            <div class="field">
                <label class="label" for="projectName">New Project Name</label>
                <div class="control">
                    <input class="input" type="text" id="projectName" v-model="projectName"
                           placeholder="Give me a name so you can easly find me later">
                </div>
            </div>

            <div class="field">
                <label class="label" for="outputPath">Output Path</label>
                <div class="columns">
                    <div class="control column">
                        <input class="input" type="text" id="outputPath" v-model="outputPath"
                               placeholder="Where the files will be stored">
                    </div>
                    <div class="column is-one-quarter">
                        <a class="button is-fullwidth" @click="handleSelectPath">Select path</a>
                    </div>
                </div>

            </div>


            <div class="field">
                <div class="control">
                    <label class="checkbox">
                        <input type="checkbox" v-model="createFolder">
                        Create Folder
                    </label>
                </div>
            </div>

            <div class="buttons">
                <a class="button  is-success" @click="newProject">Create new Project</a>
                <router-link to="/" class="button">Back</router-link>
            </div>

        </div>
    </section>
</template>

<script>
  import { remote } from 'electron'

  let dialog = remote.dialog

  export default {
    name: 'open',
    data () {
      return {
        projectName: null,
        outputPath: null,
        createFolder: true,
        errorMessage: null
      }
    },
    mounted () {
      this.outputPath = this.$store.state.AppConfig.outputPath
    },
    components: {},
    methods: {
      newProject () {
        try {
          this.$store.commit('addNewProject', {
            name: this.projectName,
            outputPath: this.outputPath,
            createFolder: this.createFolder
          })
        } catch (err) {
          this.errorMessage = err.message
          return
        }
        this.$router.push({name: 'project', params: {name: this.projectName}})
      },
      handleSelectPath () {
        this.outputPath = dialog.showOpenDialog({properties: ['openDirectory']})[0]
      }
    }
  }
</script>