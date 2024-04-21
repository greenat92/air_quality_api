import { Injectable, Logger, LoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger implements LoggerService {
  private readonly _logger = new Logger();

  constructor(
    private className: string,
    private functionName: string = null,
  ) {}

  private _formatAndEnrichMessage(message: any): any {
    // ensure given message is an object
    if (typeof message === 'string') {
      message = {
        message: message,
      };
    }

    // add name of class and function to each log message
    if (this.className) {
      message.className = this.className;
    }
    if (this.functionName) {
      message.functionName = this.functionName;
    }

    return message;
  }

  verbose(message: any) {
    const messageObj = this._formatAndEnrichMessage(message);
    this._logger.verbose(messageObj, this.className);
  }

  debug(message: any) {
    const messageObj = this._formatAndEnrichMessage(message);
    this._logger.debug(messageObj, this.className);
  }

  log(message: any) {
    const messageObj = this._formatAndEnrichMessage(message);
    this._logger.log(messageObj, this.className);
  }

  warn(message: any) {
    const messageObj = this._formatAndEnrichMessage(message);
    this._logger.warn(messageObj, this.className);
  }

  error(message: any) {
    const messageObj = this._formatAndEnrichMessage(message);
    this._logger.error(messageObj, null, this.className);
  }
}
