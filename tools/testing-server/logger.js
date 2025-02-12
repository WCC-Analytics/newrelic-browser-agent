class TestServerLogger {
  level = 'info'

  #config
  #parentLogger

  constructor (config) {
    this.#config = config

    if (!config.logger) {
      this.#parentLogger = console
    } else {
      this.#parentLogger = config.logger
    }
  }

  logNetworkRequest (request) {
    if (this.#config.logRequests) {
      this.#parentLogger.info(`${request.server.testServerId} -> ${request.method} ${request.url}`)
    }
  }

  logDebugShimMessage (request) {
    this.#parentLogger.info(`DEBUG [${request.query.testId}](${request.query.ix}): ${request.query.m}`)
  }
}

module.exports = TestServerLogger
