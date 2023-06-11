import {PlayerState} from "../features/player/playerSlice";

export class PlayerService {
  private static _instance: PlayerService;

  private players;

  constructor() {
    this.players = new Map<string, HTMLAudioElement>();
  }

  public registerPlayer(id: string, player: HTMLAudioElement) {
    if (id && player && !this.players.has(id)) {
      console.log("Registering player: ", id);
      this.players.set(id, player);
    }
  }

  public getPlayer(id: string) {
    return this.players.get(id);
  }

  public getAllPlayers(): HTMLAudioElement[] {
    return [...this.players.values()];
  }

  public async playAll(): Promise<void> {
    await this.performInAllPlayersAsync((player) => player.play());
  }

  public pauseAll(): void {
    this.performInAllPlayers((player) => player.pause());
  }

  public setTime(updatedTime: number) {
    this.performInAllPlayers(player => player.currentTime = updatedTime);
  }

  public mutePlayer(id: string, isMuted: boolean) {
    let player = this.getPlayer(id);
    if (player) {
      player.muted = isMuted;
    }
  }

  public performInAllPlayers(action: (element: HTMLAudioElement) => void) {
    let promises = [];
    for (let player of this.getAllPlayers()) {
      action(player);
    }
  }

  public async performInAllPlayersAsync(action: (element: HTMLAudioElement) => Promise<void>) {
    let promises = [];
    for (let player of this.getAllPlayers()) {
      promises.push(action(player));
    }
    await Promise.all(promises);
  }

  getPlayingTime() {
    return this.getAllPlayers()[0]?.currentTime;
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new PlayerService();
    }
    return this._instance;
  }
}