import {Singleton} from "../framework/Singleton";

export class MultiTrackPlayerService {
  private static _singleton = new Singleton(MultiTrackPlayerService);

  /**
   * The instance function is a convenience function for accessing your singleton object.
   * This is useful if you want to call static methods of the Singleton from another class.
   *
   * @return The singleton instance
   *
   * @docauthor Trelent
   */
  public static instance = () => this._singleton.instance;


  private audioContext: AudioContext;

  private audioBuffers: Map<string, AudioBuffer>;

  private audioSources: Map<string, AudioBufferSourceNode>;

  public constructor() {
    this.audioContext = new AudioContext();
    this.audioBuffers = new Map<string, AudioBuffer>();
    this.audioSources = new Map<string, AudioBufferSourceNode>();
  }

  public async loadTrack(url: string) {
    let audioBuffer = this.audioBuffers.get(url);
    if (!audioBuffer) {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.audioBuffers.set(url, audioBuffer);

      const sourceNode = this.audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(this.audioContext.destination);
      this.audioSources.set(url, sourceNode);
    }
    return audioBuffer;
  }

  public async loadTracks(urls: string[]) {
    await Promise.all(urls.map(url => this.loadTrack(url)));
  }

  public async playAll() {
    await this.forAllSources((source) => source.start());
  }

  private async forAllSources(action: (source: AudioBufferSourceNode) => void) {
    const sources = this.getAllSources();
    await Promise.all(sources.map(source => Promise.resolve().then(() => action(source))));
  }

  private getAllSources() {
    return [...this.audioSources.values()];
  }

  public async stopAll() {
    await this.forAllSources(source => source.stop());
  }
}