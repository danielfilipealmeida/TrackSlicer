<template>
    <section class="section">
        <div class="container">
            <h1 class="title">
                Open Project
            </h1>

            <div class="notification is-danger" v-show="errorMessage!=null">
                <button class="delete" @click="errorMessage=null"></button>
                {{ errorMessage }}
            </div>

            <table class="table is-striped is-bordered is-hoverable is-fullwidth">
                <thead>
                <tr>
                    <th>Project name</th>
                    <th>Output path</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="project, index in projects" @click="handleProjectSelection(project)">
                    <td>{{ project.name }}</td>
                    <td>{{ project.outputPath }}</td>
                </tr>
                </tbody>
            </table>

            <div class="field">
                <label class="label" for="selectedProject">Selected Project</label>
                <div class="control">
                    <input class="input" type="text" id="selectedProject" v-model="selectedProjectName"
                           placeholder="Click on the list to select the project to load...">
                </div>
            </div>


            <div class="buttons">
                <a class="button  is-success" @click="openProject">Open selected Project</a>
                <router-link class="button" to="/">Back</router-link>
            </div>
        </div>
    </section>
</template>

<script>
  export default {
    name: 'open',
    data () {
      return {
        selected: null,
        errorMessage: null
      }
    },
    components: {},
    methods: {
      handleProjectSelection (selectedProject) {
        this.selected = selectedProject
      },
      openProject () {
        if (this.selected === null) {
          this.errorMessage = 'No project selected!'
          return
        }
        this.$router.push({name: 'project', params: {name: this.selected.name}})
      }
    },
    computed: {
      selectedProjectName () {
        return this.selected === null ? '' : this.selected.name
      },
      projects () {
        return this.$store.state.Projects.projects
      }
    }
  }
</script>