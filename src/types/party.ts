export type PartyType = "PUBLIC" | "PRIVATE";

export interface VideoStatus {
  currentTime: number;
  paused: boolean;
}

export interface VideoSyncMessage {
  currentTime: number;
  paused: boolean;
  action: "PLAY" | "PAUSE" | "SEEK";
  senderId: number;
}

export interface PartyData {
  id: number;
  movieTitle: string;
  backdrop: string;
  isPublic: boolean;
  roomName: string;
  hostNickname: string;
  currentMemberCount: number;
  videoStatus?: VideoStatus;
  hostControl: boolean;
}
