import { create } from 'zustand';
import { PositionComment } from './db';

interface DocumentState {
  content: string;
  comments: PositionComment[];
  setContent: (content: string) => void;
  setComments: (comments: PositionComment[]) => void;
  addComment: (comment: PositionComment) => void;
  updateComment: (id: string, comment: string) => void;
  deleteComment: (id: string) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  content: '',
  comments: [],
  
  setContent: (content) => set({ content }),

  setComments: (comments) => 
    set({ comments: Array.isArray(comments) ? comments : [] }),

  addComment: (comment) => 
    set((state) => ({
      comments: [...state.comments, comment],
    })),

  updateComment: (id, comment) => 
    set((state) => ({
      comments: state.comments.map((c) => 
        c._id?.toString() === id ? { ...c, comment } : c
      ),
    })),

  deleteComment: (id) => 
    set((state) => ({
      comments: state.comments.filter((c) => c._id?.toString() !== id),
    })),
}));
