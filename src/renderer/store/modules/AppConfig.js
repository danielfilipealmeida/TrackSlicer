import { remote } from 'electron'

const expect = require('chai')

const state = {
  outputPath: remote.app.getPath('music')
}

const mutations = {
  setAppConfig (state, payload) {
    expect(payload).to.be.a('array')

    if (typeof payload.outputPath === 'string') state.outputPath = payload.outputPath
  }
}

const actions = {

}

export default {
  state,
  mutations,
  actions
}
