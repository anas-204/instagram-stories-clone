import React, { useRef, useState } from 'react';
import { Plus, X, Trash2, Type, Heart, ThumbsUp, MessageCircle, Send } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useStoryStore } from '../hooks/useStoryStore';
import { processMedia } from './utils/mediaProcessor';

const GRADIENTS = [
  'linear-gradient(to top right, #ff758c 0%, #ff7eb3 100%)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(to right, #fa709a 0%, #fee140 100%)'
];

export default function App() {
  const { 
    stories, activeStoryId, isConfirmingDelete,
    addStory, removeStory, openViewer, closeViewer, promptDelete, cancelDelete,
    addTextStory, addReaction, addComment
  } = useStoryStore();

  const fileInputRef = useRef(null);
  const activeStory = stories.find(s => s.id === activeStoryId);

  const [isCreatingTextStory, setIsCreatingTextStory] = useState(false);
  const [textStoryContent, setTextStoryContent] = useState('');
  const [textStoryBg, setTextStoryBg] = useState(GRADIENTS[0]);

  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

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

  const handlePostTextStory = () => {
    if (!textStoryContent.trim()) return;
    addTextStory(textStoryContent, textStoryBg);
    setIsCreatingTextStory(false);
    setTextStoryContent('');
    toast.success('Story added successfully!');
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !activeStory) return;
    addComment(activeStory.id, newComment);
    setNewComment('');
  };

  const handleCloseViewer = () => {
    setIsCommentsOpen(false);
    closeViewer();
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
              title="Add Photo/Video Story"
            >
              <Plus size={24} />
            </button>
            <button 
              onClick={() => setIsCreatingTextStory(true)}
              className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center hover:border-fuchsia-400 hover:text-fuchsia-400 transition-colors cursor-pointer"
              title="Add Text Story"
            >
              <Type size={24} />
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
              <div className="w-full h-full rounded-full border-2 border-[#111] overflow-hidden bg-gray-900 flex items-center justify-center">
                {story.type === 'text' ? (
                  <div className="w-full h-full flex items-center justify-center p-1" style={{ background: story.bgColor }}>
                    <span className="text-[8px] font-bold truncate px-1 shadow-sm text-center w-full">{story.mediaData}</span>
                  </div>
                ) : story.type === 'image' ? (
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
              className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-900 group cursor-pointer flex items-center justify-center"
              style={story.type === 'text' ? { background: story.bgColor } : {}}
            >
              {story.type === 'text' ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <p className="font-bold text-center text-lg whitespace-pre-wrap break-words">{story.mediaData}</p>
                </div>
              ) : story.type === 'image' ? (
                <img src={story.mediaData} alt="Story preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : (
                <video src={story.mediaData} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-medium text-white shadow-sm mb-1 flex items-center gap-2">
                  <Heart size={12} className={story.reactions?.love > 0 ? "text-red-500 fill-current" : ""} /> {story.reactions?.love || 0}
                  <MessageCircle size={12} className="ml-2" /> {story.comments?.length || 0}
                </span>
                <span className="text-[10px] text-gray-300">Tap to view</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Text Story Creation Modal */}
      {isCreatingTextStory && (
        <div className="fixed inset-0 z-[60] flex flex-col" style={{ background: textStoryBg }}>
          <header className="flex justify-between items-center p-6 text-white/90">
            <button onClick={() => setIsCreatingTextStory(false)} className="p-2 hover:bg-black/10 rounded-full cursor-pointer transition-colors">
              <X size={28} />
            </button>
            <div className="flex gap-2">
              {GRADIENTS.map((bg, idx) => (
                <button
                  key={idx}
                  onClick={() => setTextStoryBg(bg)}
                  className={`w-8 h-8 rounded-full border-2 ${textStoryBg === bg ? 'border-white' : 'border-transparent shadow-sm'}`}
                  style={{ background: bg }}
                />
              ))}
            </div>
            <button onClick={handlePostTextStory} className="font-bold text-lg bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full transition-colors cursor-pointer">
              Post
            </button>
          </header>
          <div className="flex-1 flex items-center justify-center p-8">
            <textarea
              autoFocus
              value={textStoryContent}
              onChange={(e) => setTextStoryContent(e.target.value)}
              placeholder="Type something..."
              className="w-full bg-transparent text-center text-4xl font-bold text-white placeholder:text-white/50 focus:outline-none resize-none"
              rows={5}
            />
          </div>
        </div>
      )}

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="absolute top-6 right-6 flex flex-col gap-4 z-50">
            <button onClick={handleCloseViewer} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
              <X size={24} />
            </button>
            <button onClick={promptDelete} className="p-3 bg-red-500/20 text-red-500 hover:bg-red-500/40 rounded-full transition-colors cursor-pointer">
              <Trash2 size={24} />
            </button>
          </div>

          <div className="relative w-full max-w-sm h-[80vh] bg-gray-900 rounded-lg overflow-hidden shadow-2xl flex flex-col" style={activeStory.type === 'text' ? { background: activeStory.bgColor } : {}}>
            {/* Media/Text Content */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
              {activeStory.type === 'text' ? (
                <div className="p-8 w-full h-full flex items-center justify-center">
                  <p className="text-3xl font-bold text-center whitespace-pre-wrap break-words shadow-sm">{activeStory.mediaData}</p>
                </div>
              ) : activeStory.type === 'image' ? (
                <img src={activeStory.mediaData} alt="Full Story" className="w-full h-full object-contain" />
              ) : (
                <video src={activeStory.mediaData} controls autoPlay className="w-full h-full object-contain" />
              )}
            </div>

            {/* Interaction Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between z-40">
              <div className="flex gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); addReaction(activeStory.id, 'like'); }}
                  className="flex items-center gap-1.5 text-white/90 hover:text-white hover:scale-110 transition-all cursor-pointer"
                >
                  <ThumbsUp size={24} className={activeStory.reactions?.like > 0 ? "text-yellow-400 fill-current" : ""} />
                  <span className="font-semibold text-sm drop-shadow-md">{activeStory.reactions?.like || 0}</span>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); addReaction(activeStory.id, 'love'); }}
                  className="flex items-center gap-1.5 text-white/90 hover:text-white hover:scale-110 transition-all cursor-pointer"
                >
                  <Heart size={24} className={activeStory.reactions?.love > 0 ? "text-red-500 fill-current" : ""} />
                  <span className="font-semibold text-sm drop-shadow-md">{activeStory.reactions?.love || 0}</span>
                </button>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsCommentsOpen(!isCommentsOpen); }}
                className="flex items-center gap-1.5 text-white/90 hover:text-white cursor-pointer transition-colors"
              >
                <span className="font-semibold text-sm drop-shadow-md">{activeStory.comments?.length || 0}</span>
                <MessageCircle size={24} />
              </button>
            </div>

            {/* Comments Overlay */}
            {isCommentsOpen && (
              <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-black/90 backdrop-blur-md flex flex-col border-t border-gray-800 z-50 transition-all">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                  <h3 className="font-bold">Comments</h3>
                  <button onClick={() => setIsCommentsOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
                  {(!activeStory.comments || activeStory.comments.length === 0) ? (
                    <p className="text-gray-500 text-center text-sm mt-4">No comments yet. Be the first!</p>
                  ) : (
                    activeStory.comments.map(comment => (
                      <div key={comment.id} className="bg-gray-800/50 rounded-lg p-3 text-sm">
                        <p className="break-words">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handlePostComment} className="p-3 border-t border-gray-800 flex gap-2">
                  <input 
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Send a comment..."
                    className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
                  />
                  <button type="submit" disabled={!newComment.trim()} className="p-2 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 disabled:hover:bg-fuchsia-600 rounded-full flex items-center justify-center transition-colors">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}
            
            {/* Delete Confirmation Overlay */}
            {isConfirmingDelete && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-[60]">
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