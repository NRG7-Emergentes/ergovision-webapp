import { Injectable } from '@angular/core';

export interface MonitoringStats {
  totalMs: number;
  goodMs: number;
  badMs: number;
  pauseMs: number;
  pauseCount: number;
}

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private _totalMs = 0;
  private _goodMs = 0;
  private _badMs = 0;
  private _pauseMs = 0;
  private _pauseCount = 0;

  private _running = false;
  private _paused = false;
  private _lastTick = 0;
  private _isGoodPosture = true;
  private _intervalId: any;

  start() {
    if (this._running) return;
    this._running = true;
    this._paused = false;
    this._lastTick = Date.now();
    this._intervalId = setInterval(() => this.tick(), 1000);
  }

  pause() {
    if (!this._running) return;
    this._paused = !this._paused;
    if (this._paused) {
      this._pauseCount++;
      this._lastTick = Date.now();
    } else {
      this._lastTick = Date.now();
    }
  }

  end() {
    if (!this._running) return;
    this._running = false;
    if (this._intervalId) clearInterval(this._intervalId);
    this._intervalId = undefined;
  }

  setPosture(isGood: boolean) {
    this._isGoodPosture = isGood;
  }

  reset() {
    this._totalMs = 0;
    this._goodMs = 0;
    this._badMs = 0;
    this._pauseMs = 0;
    this._pauseCount = 0;
    this._running = false;
    this._paused = false;
    if (this._intervalId) clearInterval(this._intervalId);
    this._intervalId = undefined;
  }

  private tick() {
    const now = Date.now();
    const elapsed = now - this._lastTick;
    this._lastTick = now;

    if (!this._running) return;
    if (this._paused) {
      this._pauseMs += elapsed;
      return;
    }

    this._totalMs += elapsed;
    if (this._isGoodPosture) this._goodMs += elapsed;
    else this._badMs += elapsed;
  }

  getStats(): MonitoringStats {
    return {
      totalMs: this._totalMs,
      goodMs: this._goodMs,
      badMs: this._badMs,
      pauseMs: this._pauseMs,
      pauseCount: this._pauseCount,
    };
  }
}
