import { LoggerService } from '@nestjs/common';

export class CustomLoggerMock implements LoggerService {
  private logs: any[] = [];

  private _formatAndEnrichMessage(message: any): any {
    if (typeof message === 'string') {
      return {
        message: message,
      };
    }
    return message;
  }

  verbose(message: any) {
    const messageObj = this._formatAndEnrichMessage(message);
    this.logs.push({ level: 'verbose', message: messageObj });
  }

  debug(message: any) {
    const messageObj = this._formatAndEnrichMessage(message);
    this.logs.push({ level: 'debug', message: messageObj });
  }

  log(message: any) {
    const messageObj = this._formatAndEnrichMessage(message);
    this.logs.push({ level: 'log', message: messageObj });
  }

  warn(message: any) {
    const messageObj = this._formatAndEnrichMessage(message);
    this.logs.push({ level: 'warn', message: messageObj });
  }

  error(message: any) {
    const messageObj = this._formatAndEnrichMessage(message);
    this.logs.push({ level: 'error', message: messageObj });
  }

  getLogs(): any[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
}
