import { PerformanceEntry, PerformanceObserver } from 'perf_hooks';
import { v4 as uuidv4 } from 'uuid';
import { CustomLogger } from '../custom-logger/custom-logger.service';

export class PerformanceMeasureHelper {
  // unique id of class instance, to ensure parallel measure won't influence each other
  private _uuid = uuidv4();

  constructor(
    // pretty name for performance measure
    private _name: string,
    // overrule env variable to ensure performance is always measured
    private _alwaysEnabled: boolean = false,
  ) {
    if (this._isEnabled()) {
      // set start mark
      performance.mark(this._formatStartLabel());
    }
  }

  // only measure and log performance if explicitly specified via env variables
  private _isEnabled = (): boolean =>
    this._alwaysEnabled || process.env.PERFORMANCE_MEASURING_ENABLED === 'true';

  static initObserver() {
    // subscribe to performance measures
    new PerformanceObserver((items) => {
      // iterate over all received performance measure
      for (const item of items.getEntries()) {
        // handle measured performance
        PerformanceMeasureHelper._performanceMeasured(item);
      }

      // clean up the marks afterwards
      // performance.clearMarks();
    }).observe({ entryTypes: ['measure'] });
  }

  // ensure duration of measure is always formatted the same way
  static formatDuration = (duration: number): string =>
    `${(duration / 1000).toFixed(4)} s`;

  // ensure start- and end-label are always formatted the same way
  private _formatStartLabel = (): string => `${this._name}-${this._uuid}-start`;
  private _formatEndLabel = (): string => `${this._name}-${this._uuid}-end`;

  // handle performance entry received by observer
  private static _performanceMeasured(item: PerformanceEntry) {
    const logger = new CustomLogger(PerformanceMeasureHelper.name);

    logger.log({
      message: 'performance measured',
      name: item.name,
      // format duration pretty in seconds
      duration: PerformanceMeasureHelper.formatDuration(item.duration),
    });
  }

  end(): PerformanceMeasure {
    if (this._isEnabled()) {
      // set end mark + measure performance
      performance.mark(this._formatEndLabel());
      return performance.measure(
        this._name,
        this._formatStartLabel(),
        this._formatEndLabel(),
      );
    } else {
      return null;
    }
  }
}
