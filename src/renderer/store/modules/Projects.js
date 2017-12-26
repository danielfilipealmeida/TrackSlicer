const assert = require('chai').assert
const fs = require('fs')

const state = {
  projects: []
}

function getIndexOfProjectByName (projects, name) {
  let projectIndex = -1

  for (let index in state.projects) {
    let project = projects[index]
    if (project.name === name) {
      return index
    }
  }

  return projectIndex
}

const mutations = {
  /**
   * Mutator for adding a new project to the project list
   *
   * @param state
   * @param payload
   */
  addNewProject (state, payload) {
    assert.typeOf(payload, 'object', 'Invalid project data.')
    assert.typeOf(payload.name, 'string', 'Invalid project name')
    assert.isNotEmpty(payload.name, 'Project name should not be empty')
    assert.typeOf(payload.outputPath, 'string', 'Invalid output path.')
    assert.typeOf(payload.createFolder, 'boolean', 'Create folder should be true or false.')
    if (!fs.existsSync(payload.outputPath)) throw new Error('Output path doesn\'t exist!')
    if (state.projects.filter(
      (project) => {
        return project.name === payload.name
      }
    ).length > 0) throw new Error('There is already a project with the desired name, please choose another.')
    state.projects.push(payload)
  },

  /**
   * Mutator for updating the input files on a project, define by it's name
   *
   * @param state
   * @param payload
   */
  setInputsInProject (state, payload) {
    let projectIndex = getIndexOfProjectByName(state.projects, payload.name)
    if (projectIndex === -1) return

    state.projects[projectIndex].inputFiles = payload.inputFiles
  },

  /**
   * Adds a track to a project that is defined by it's name
   *
   * @param state
   * @param payload
   */
  addNewTrack (state, payload) {
    let projectIndex = getIndexOfProjectByName(state.projects, payload.name)
    if (projectIndex === -1) return

    let project = state.projects[projectIndex]
    if (!project.tracks) {
      project.tracks = []
    }
    project.tracks.push(payload.trackName)
  }
}

const actions = {

}

const getters = {

  /**
   * Project getter that returns a project specified by it's name
   * @param state
   */
  getByProjectName: (state) => (name) => {
    return state.projects.find((project) => {
      return (project.name === name)
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
