import { create } from "zustand";

interface ChatState {
  messages: { text: string; sender: string }[];
  addMessage: (text: string, sender: string) => void;
}

const useStore = create<ChatState>((set) => ({
  messages: [],
  threadId: `chat_session_${Math.random().toString(36).substring(2, 15)}`,
  updateLastMessage: (text: string) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last) {
        last.text = text;
      }
      return { messages };
    }),
  addMessage: (text, sender) =>
    set((state) => ({ messages: [...state.messages, { text, sender }] })),
}));

export default useStore;
