export type ChatMessage = {
  type: "system" | "chat";
  text: string;
  user?: string;
};

export const chatMessages: ChatMessage[] = [
  { type: "system", text: "파티에 오신 것을 환영해요!" },
  { type: "system", text: "**님이 입장했어요" },
  {
    type: "chat",
    text: "채팅 메시지 예시1",
    user: "host",
  },
  {
    type: "chat",
    text: "채팅 메시지 예시2",
    user: "user1",
  },
  {
    type: "chat",
    text: "채팅 메시지 예시3",
    user: "user2",
  },

  {
    type: "chat",
    text: "채팅 메시지 예시4 ",
    user: "user3",
  },
  { type: "system", text: "시스템 메시지 예시1" },
  { type: "system", text: "시스템 메시지 예시2" },
];
