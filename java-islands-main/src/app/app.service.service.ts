import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  currentLevel = 0;

  constructor() { }

  public getCurrentLevel(): number {
    return this.currentLevel!;
  }

  public setCurrentLevel(level: number) {
    this.currentLevel = level;
  }
}
