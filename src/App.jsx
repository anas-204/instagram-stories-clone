import React, { useRef } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useStoryStore } from '../hooks/useStoryStore';
import { processMedia } from './utils/mediaProcessor';

export default function App() {
  const { 
    stories, activeStoryId, isConfirmingDelete,
    addStory, removeStory, openViewer, closeViewer, promptDelete, cancelDelete
  } = useStoryStore();

  const fileInputRef = useRef(null);
  const activeStory = stories.find(s => s.id === activeStoryId);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.loading('Processing story...', { id: 'uploading' });
      const { data, type } = await processMedia(file);
      addStory(data, type);
      toast.success('Story added successfully!', { id: 'uploading' });
    } catch (error) {
      toast.error('Failed to add story.', { id: 'uploading' });
    }
    
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-yellow-500/30">
      <Toaster theme="dark" position="top-center" />

      <main className="max-w-2xl mx-auto pt-16 px-6">
        <header className="mb-8">
          <h2 className="text-orange-500 text-xs font-bold tracking-widest uppercase mb-2">Fleeting</h2>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Stories that vanish in 24 hours</h1>
          <p className="text-gray-400 text-sm">
            Add a photo, watch it play for three seconds, swipe through the rest. <br/>
            Everything is saved only on this device.
          </p>
        </header>

        <div className="flex items-center gap-4 overflow-x-auto py-4 border border-gray-800 rounded-2xl px-4 bg-[#111] mb-12 scrollbar-hide">
          <div className="flex-shrink-0 flex items-center gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-yellow-400 hover:text-yellow-400 transition-colors cursor-pointer"
            >
              <Plus size={24} />
            </button>
            <input 
              type="file" 
              accept="image/*,video/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            {stories.length === 0 && (
              <span className="text-sm text-gray-500">No stories yet — tap + to add one.</span>
            )}
          </div>

          {stories.map((story) => (
            <button 
              key={story.id} 
              onClick={() => openViewer(story.id)}
              className="flex-shrink-0 w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-orange-500 to-fuchsia-600 cursor-pointer"
            >
              <div className="w-full h-full rounded-full border-2 border-[#111] overflow-hidden bg-gray-900">
                {story.type === 'image' ? (
                  <img src={story.mediaData} alt="Story" className="w-full h-full object-cover" />
                ) : (
                  <video src={story.mediaData} className="w-full h-full object-cover" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-20">
          {stories.map((story) => (
            <button 
              key={`feed-${story.id}`} 
              onClick={() => openViewer(story.id)}
              className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 group cursor-pointer"
            >
              {story.type === 'image' ? (
                <img src={story.mediaData} alt="Story preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <video src={story.mediaData} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                <span className="text-xs font-medium text-white shadow-sm">23h left</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="absolute top-6 right-6 flex flex-col gap-4 z-50">
            <button onClick={closeViewer} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
              <X size={24} />
            </button>
            <button onClick={promptDelete} className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded-full transition-colors cursor-pointer">
              <Trash2 size={24} />
            </button>
          </div>

          <div className="relative w-full max-w-sm aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
            {activeStory.type === 'image' ? (
              <img src={activeStory.mediaData} alt="Full Story" className="w-full h-full object-contain" />
            ) : (
              <video src={activeStory.mediaData} controls autoPlay className="w-full h-full object-contain" />
            )}
            
            {isConfirmingDelete && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
                <div className="bg-[#111] border border-gray-800 p-6 rounded-2xl w-full text-center">
                  <h3 className="text-lg font-bold mb-2">Delete this story?</h3>
                  <p className="text-sm text-gray-400 mb-6">This action cannot be undone.</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={cancelDelete}
                      className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        removeStory(activeStory.id);
                        toast.success('Story deleted');
                      }}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium text-white transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}