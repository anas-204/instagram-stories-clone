import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set as idbSet, del } from 'idb-keyval';

const storage = {
  getItem: async (name) => {
    return (await get(name)) || null;
  },
  setItem: async (name, value) => {
    await idbSet(name, value);
  },
  removeItem: async (name) => {
    await del(name);
  },
};

export const useStoryStore = create(
  persist(
    (set) => ({
      stories: [],
      activeStoryId: null,
      isConfirmingDelete: false,
      
      addStory: (mediaData, type) => set((state) => ({
        stories: [{ 
          id: Date.now().toString(), 
          mediaData, 
          type, 
          timestamp: Date.now(),
          reactions: { like: 0, love: 0 },
          comments: []
        }, ...state.stories]
      })),
      
      addTextStory: (text, bgColor) => set((state) => ({
        stories: [{
          id: Date.now().toString(),
          mediaData: text,
          type: 'text',
          bgColor,
          timestamp: Date.now(),
          reactions: { like: 0, love: 0 },
          comments: []
        }, ...state.stories]
      })),

      addReaction: (storyId, reactionType) => set((state) => ({
        stories: state.stories.map(story => 
          story.id === storyId 
            ? { ...story, reactions: { ...story.reactions, [reactionType]: story.reactions[reactionType] + 1 } }
            : story
        )
      })),

      addComment: (storyId, text) => set((state) => ({
        stories: state.stories.map(story => 
          story.id === storyId 
            ? { ...story, comments: [...story.comments, { id: Date.now().toString(), text, timestamp: Date.now() }] }
            : story
        )
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
      storage: createJSONStorage(() => storage),
    }
  )
);
