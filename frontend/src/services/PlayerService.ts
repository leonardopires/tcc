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
    await this.performInAllPlayersAsync(async (player) => {
      if (player.paused) {
        return player.play();
      }
    });
  }

  public async pauseAll(): Promise<void> {
    await this.performInAllPlayersAsync(async (player) => {
      let oldOnPause = player.onpause;

      if (!player.paused) {
        return new Promise((resolve, reject) => {
          try {
            player.onpause = (ev) => {
              player.onpause = oldOnPause;
              if (typeof oldOnPause === "function") {
                // @ts-ignore
                oldOnPause(ev);
              }
              resolve();
            };
            player.pause();
          } catch (e) {
            reject(e);
          }
        });
      }
    });
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
    for (let player of this.getAllPlayers()) {
      try {
        action(player);
      } catch (e) {
        console.error(e);
      }
    }
  }

  public async performInAllPlayersAsync(action: (element: HTMLAudioElement) => Promise<void>) {
    let promises = [];
    for (let player of this.getAllPlayers()) {
      promises.push(this.wrapAction(action, player)());
    }
    await Promise.all(promises);
  }

  private wrapAction(action: (element: HTMLAudioElement) => Promise<void>, player: HTMLAudioElement) {
    return async () => {
      try {
        return await action(player);
      } catch (e) {
        console.error(e);
      }
    };
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