// 📁 logger.js - Client-side logging utility
class ClientLogger {
  constructor(config = {}) {
    this.config = {
      appName: config.appName || 'MyApp',
      logLevel: config.logLevel || 'info', // debug, info, warn, error
      enableConsole: config.enableConsole !== false,
      enableStorage: config.enableStorage || false,
      maxLogs: config.maxLogs || 1000,
      enableServerLogging: config.enableServerLogging || false,
      serverEndpoint: config.serverEndpoint || '/api/logs',
      ...config
    };

    this.logs = [];
    this.initialize();
  }

  initialize() {
    if (this.config.enableStorage) {
      this.loadFromStorage();
    }
    
    // บันทึก session start
    this.info('Session started', {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
  }

  // ระดับการบันทึกต่างๆ
  debug(message, data = {}) {
    this.log('debug', message, data);
  }

  info(message, data = {}) {
    this.log('info', message, data);
  }

  warn(message, data = {}) {
    this.log('warn', message, data);
  }

  error(message, data = {}) {
    this.log('error', message, data);
  }

  log(level, message, data = {}) {
    const logEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level: level,
      message: message,
      data: data,
      app: this.config.appName,
      page: window.location.pathname,
      sessionId: this.getSessionId()
    };

    // กรองตาม log level
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.logLevel);
    const logLevelIndex = levels.indexOf(level);

    if (logLevelIndex >= currentLevelIndex) {
      // บันทึกใน console
      if (this.config.enableConsole) {
        this.consoleLog(level, logEntry);
      }

      // เก็บใน memory
      this.logs.push(logEntry);
      this.trimLogs();

      // เก็บใน localStorage (ถ้าเปิด)
      if (this.config.enableStorage) {
        this.saveToStorage();
      }

      // ส่งไปเซิร์ฟเวอร์ (ถ้าเปิด)
      if (this.config.enableServerLogging && level !== 'debug') {
        this.sendToServer(logEntry);
      }
    }

    return logEntry;
  }

  // แสดงใน console ด้วยสี
  consoleLog(level, entry) {
    const styles = {
      debug: 'color: gray',
      info: 'color: blue',
      warn: 'color: orange',
      error: 'color: red; font-weight: bold'
    };

    const style = styles[level] || 'color: black';
    const time = new Date(entry.timestamp).toLocaleTimeString();

    console.log(
      `%c[${time}] [${level.toUpperCase()}] ${entry.message}`,
      style,
      entry.data
    );
  }

  // ส่งไปเซิร์ฟเวอร์
  async sendToServer(logEntry) {
    try {
      // ใช้ Beacon API สำหรับการส่งที่ไม่ต้องการ response
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(logEntry)], {
          type: 'application/json'
        });
        navigator.sendBeacon(this.config.serverEndpoint, blob);
      } else {
        // Fallback ใช้ fetch
        fetch(this.config.serverEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logEntry),
          keepalive: true // สำหรับปิดแท็บแล้วยังส่งได้
        });
      }
    } catch (error) {
      console.warn('Failed to send log to server:', error);
    }
  }

  // เก็บใน localStorage
  saveToStorage() {
    try {
      const storageKey = `${this.config.appName}_logs`;
      const logsToSave = this.logs.slice(-this.config.maxLogs);
      localStorage.setItem(storageKey, JSON.stringify(logsToSave));
    } catch (error) {
      console.warn('Failed to save logs to storage:', error);
    }
  }

  // โหลดจาก localStorage
  loadFromStorage() {
    try {
      const storageKey = `${this.config.appName}_logs`;
      const savedLogs = localStorage.getItem(storageKey);
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (error) {
      console.warn('Failed to load logs from storage:', error);
    }
  }

  // จัดการจำนวน logs
  trimLogs() {
    if (this.logs.length > this.config.maxLogs) {
      this.logs = this.logs.slice(-this.config.maxLogs);
    }
  }

  // ดึง logs
  getLogs(level = null, limit = null) {
    let filteredLogs = this.logs;

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }

    return filteredLogs;
  }

  // clear logs
  clearLogs() {
    this.logs = [];
    if (this.config.enableStorage) {
      const storageKey = `${this.config.appName}_logs`;
      localStorage.removeItem(storageKey);
    }
  }

  // สร้าง session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('logger_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('logger_session_id', sessionId);
    }
    return sessionId;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Performance monitoring
  startTimer(name) {
    const timerId = `timer_${name}_${Date.now()}`;
    performance.mark(`${timerId}_start`);
    return timerId;
  }

  endTimer(timerId, message = '') {
    performance.mark(`${timerId}_end`);
    performance.measure(timerId, `${timerId}_start`, `${timerId}_end`);
    
    const measures = performance.getEntriesByName(timerId);
    const duration = measures[measures.length - 1].duration;
    
    this.debug(`${message || timerId} took ${duration.toFixed(2)}ms`, {
      duration: duration,
      timerId: timerId
    });
    
    performance.clearMarks(`${timerId}_start`);
    performance.clearMarks(`${timerId}_end`);
    performance.clearMeasures(timerId);
  }

  // Error boundary สำหรับ React (ถ้าใช้)
  static withErrorBoundary(WrappedComponent, logger) {
    return class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
        this.logger = logger || new ClientLogger();
      }

      static getDerivedStateFromError(error) {
        return { hasError: true };
      }

      componentDidCatch(error, errorInfo) {
        this.logger.error('React Error Boundary caught error', {
          error: error.toString(),
          componentStack: errorInfo.componentStack,
          props: this.props
        });
      }

      render() {
        if (this.state.hasError) {
          return <div>Something went wrong.</div>;
        }
        return <WrappedComponent {...this.props} />;
      }
    };
  }
}