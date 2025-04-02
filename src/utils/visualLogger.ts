// Visual Logger for displaying logs in the UI
export type LogEntry = {
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success';
};

class VisualLoggerSingleton {
  private static instance: VisualLoggerSingleton;
  private logs: LogEntry[] = [];
  private subscribers: ((logs: LogEntry[]) => void)[] = [];

  private constructor() {
    // Override console methods to capture logs
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    console.log = (...args: any[]) => {
      originalConsoleLog(...args);
      this.addLog('info', args.map(arg => this.formatArg(arg)).join(' '));
    };
    
    console.error = (...args: any[]) => {
      originalConsoleError(...args);
      this.addLog('error', args.map(arg => this.formatArg(arg)).join(' '));
    };
  }

  public static getInstance(): VisualLoggerSingleton {
    if (!VisualLoggerSingleton.instance) {
      VisualLoggerSingleton.instance = new VisualLoggerSingleton();
    }
    return VisualLoggerSingleton.instance;
  }

  private formatArg(arg: any): string {
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch (e) {
        return String(arg);
      }
    }
    return String(arg);
  }

  public addLog(type: 'info' | 'error' | 'success', message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    const entry: LogEntry = { timestamp, message, type };
    this.logs = [entry, ...this.logs].slice(0, 100); // Keep only the last 100 logs
    this.notifySubscribers();
  }

  public getLogs(): LogEntry[] {
    return this.logs;
  }

  public clearLogs(): void {
    this.logs = [];
    this.notifySubscribers();
  }

  public subscribe(callback: (logs: LogEntry[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.logs));
  }
}

export const VisualLogger = VisualLoggerSingleton.getInstance(); 