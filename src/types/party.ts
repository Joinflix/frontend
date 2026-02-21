export type PartyType = "PUBLIC" | "PRIVATE";

//VideoStatus(BE)
export interface VideoStatus {
  currentTime: number;
  paused: boolean;
}

//VideoSyncRequest(BE)
export interface VideoSyncMessage {
  currentTime: number;
  paused: boolean;
  action: "PLAY" | "PAUSE" | "SEEK";
  senderId: number | undefined;
}

//PartyRoomResponse(BE)
export interface PartyRoomData {
  id: number;
  movieTitle: string;
  backdrop: string;
  isPublic: boolean;
  roomName: string;
  hostNickname: string;
  currentMemberCount: number;
  videoStatus?: VideoStatus;
  hostControl: boolean;
  hostId: number;
}
