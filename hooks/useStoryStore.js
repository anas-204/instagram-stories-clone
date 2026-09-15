import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStoryStore = create(
  persist(
    (set) => ({
      stories: [],
      activeStoryId: null,
      isConfirmingDelete: false,
      
      addStory: (mediaData, type) => set((state) => ({
        stories: [{ id: Date.now().toString(), mediaData, type, timestamp: Date.now() }, ...state.stories]
      })),
      
      removeStory: (id) => set((state) => ({
        stories: state.stories.filter((s) => s.id !== id),
        activeStoryId: null,
        isConfirmingDelete: false
      })),
      
      openViewer: (id) => set({ activeStoryId: id }),
      closeViewer: () => set({ activeStoryId: null, isConfirmingDelete: false }),
      promptDelete: () => set({ isConfirmingDelete: true }),
      cancelDelete: () => set({ isConfirmingDelete: false }),
    }),
    {
      name: 'fleeting-stories',
    }
  )
);