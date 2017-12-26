import utils from '../utils'

describe('Launch', function () {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)

  it('Can see main menu', function () {
    /*
    return this.app.client.getTitle()
      .then(title => {
        expect(title).to.equal('track-slicer')
      })
      */

    return this.app.client.getText('.title')
      .then(value => {
        expect(value).to.equal('Track Slicer')
      })
  })
})
