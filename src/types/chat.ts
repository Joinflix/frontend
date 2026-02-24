export interface ChatStompMessage {
  messageType: "TALK" | "ENTER" | "LEAVE" | "SYSTEM";
  senderNickname: string;
  message: string;
  currentCount?: number;
  senderId?: number;
}
