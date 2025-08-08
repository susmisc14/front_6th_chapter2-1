export class StateManager {
  constructor(initialState = {}) {
    this._state = { ...initialState };
    this._subscribers = new Set();
  }

  getState() {
    return { ...this._state };
  }

  setState(partial) {
    const prev = this._state;
    this._state = { ...this._state, ...partial };
    for (const sub of this._subscribers) {
      try { sub(this._state, prev); } catch { /* no-op */ }
    }
  }

  subscribe(listener) {
    this._subscribers.add(listener);
    return () => this._subscribers.delete(listener);
  }
}


