import { create } from "zustand";

interface ChatState {
  messages: { text: string; sender: string }[];
  addMessage: (text: string, sender: string) => void;
}

const useStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (text, sender) =>
    set((state) => ({ messages: [...state.messages, { text, sender }] })),
}));

export default useStore;
