import SpecMatcher from '../../../tools/browser-matcher/spec-matcher.mjs'
import runTest from './run-test'

const supported = new SpecMatcher()
  .include('safari')
  .include('chrome')
  .include('edge')
  .include('firefox')
  .include('android')

describe('jspdf compatibility', () => {
  withBrowsersMatching(supported)('2.5.1', async () => {
    await runTest({
      browser,
      testAsset: 'third-party-compatibility/jspdf/2.5.1.html',
      afterLoadCallback: async () => {
        const [errorsResults] = await Promise.all([
          browser.testHandle.expectErrors(10000, true),
          $('body').click() // Setup expects before interacting with page
        ])
        expect(errorsResults).not.toBeDefined()

        const pdfGenerated = await browser.execute(function () {
          return !!pdfGenerated
        })
        expect(pdfGenerated).toEqual(true)
      }
    })
  })
})
