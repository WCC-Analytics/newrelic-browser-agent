import { registerHandler } from '../../common/event-emitter/register-handler'
import { FeatureBase } from './feature-base'
import { getInfo, isConfigured, getRuntime } from '../../common/config/config'
import { configure } from '../../loaders/configure/configure'
import { gosCDN } from '../../common/window/nreum'

export class AggregateBase extends FeatureBase {
  constructor (...args) {
    super(...args)
    this.checkConfiguration()
  }

  waitForFlags (flagNames = []) {
    return Promise.all(flagNames.map(fName => new Promise((resolve) => {
      registerHandler(`feat-${fName}`, () => {
        resolve({ name: fName, value: true })
      }, this.featureName, this.ee)
      registerHandler(`block-${fName}`, () => {
        resolve({ name: fName, value: false })
      }, this.feature, this.ee)
    })
    ))
  }

  /**
   * Checks for additional `jsAttributes` items to support backward compatibility with implementations of the agent where
   * loader configurations may appear after the loader code is executed.
   */
  checkConfiguration () {
    // NOTE: This check has to happen at aggregator load time
    if (!isConfigured(this.agentIdentifier)) {
      let jsAttributes = { ...gosCDN().info?.jsAttributes }
      try {
        jsAttributes = {
          ...jsAttributes,
          ...getInfo(this.agentIdentifier)?.jsAttributes
        }
      } catch (err) {
        // do nothing
      }
      configure(this.agentIdentifier, {
        ...gosCDN(),
        info: {
          ...gosCDN().info,
          jsAttributes
        },
        runtime: getRuntime(this.agentIdentifier)
      })
    }
  }
}
