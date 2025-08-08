export class EventBus {
  constructor() {
    this._handlers = new Map(); // eventName -> Set<fn>
  }

  on(eventName, handler) {
    if (!this._handlers.has(eventName)) this._handlers.set(eventName, new Set());
    this._handlers.get(eventName).add(handler);
    return () => this.off(eventName, handler);
  }

  off(eventName, handler) {
    const set = this._handlers.get(eventName);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) this._handlers.delete(eventName);
  }

  emit(eventName, payload) {
    const set = this._handlers.get(eventName);
    if (!set) return;
    for (const handler of set) {
      try { handler(payload); } catch { /* no-op */ }
    }
  }
}


