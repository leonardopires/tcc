import {FileService} from "../../../services/FileService";
import {IVoice} from "../../../features/revoicer/IVoice";
import {ITrack} from "../../../features/revoicer/ITrack";
import {TrackType} from "../../../features/revoicer/TrackType";

const instruments = new Map<string, Partial<ITrack>>([
  ["vocals", {id: "vocals", name: "Original", icon: "fa-duotone fa-microphone-stand", priority: -99, type: TrackType.Vocal}],
  ["bass", {id: "bass", name: "Baixo", icon: "fa-duotone fa-guitar-electric", priority: 2, type: TrackType.Instrument}],
  ["guitar", {id: "guitar", name: "Guitarras & Violões", icon: "fa-duotone fa-guitars", priority: 3, type: TrackType.Instrument}],
  ["drums", {id: "drums", name: "Bateria & Percussão", icon: "fa-duotone fa-drum", priority: 1, type: TrackType.Instrument}],
  ["piano", {id: "piano", name: "Piano", icon: "fa-duotone fa-piano", priority: 3, type: TrackType.Instrument}],
  ["no_vocals", {id: "no_vocals", name: "Instrumental", icon: "fa-duotone fa-music", priority: 99, type: TrackType.Instrument}],
  ["other", {id: "other", name: "Outros", icon: "fa-duotone fa-music", priority: 99, type: TrackType.Instrument}],
]);

export function getTrackInfo(filePath: string, voices: IVoice[]): ITrack {
  let fileName = FileService.formatName(filePath);
  let id = fileName.replace(/\.mp3$/, "");
  let voice: Partial<ITrack> = voices.find(voice => voice.id === id) as Partial<ITrack>;
  if (voice) {
   voice = {
     ...voice,
     icon: "fa-duotone fa-microphone-stand",
     priority: -1,
     type: TrackType.Vocal,
   }
  }

  let result: ITrack = {
    ...(voice ?? instruments.get(id) ?? {id, name: id}),
    filePath,
    fileName,
  } as ITrack;

  return result;
}