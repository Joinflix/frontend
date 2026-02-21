export interface ChatStompMessage {
  messageType: "TALK" | "ENTER" | "LEAVE" | "SYSTEM";
  sender: string;
  message: string;
  currentCount?: number;
}
