'use client';
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDocumentStore } from "@/lib/store";
import { useParams } from "next/navigation";

interface CommentSidebarProps {
  selectedRange: { start: number; end: number } | null;
  onCommentSubmit: (comment: string) => void;
}

export const CommentSidebar: React.FC<CommentSidebarProps> = ({ selectedRange, onCommentSubmit }) => {
  const [commentInput, setCommentInput] = useState<string>("");
  const { comments, updateComment, deleteComment } = useDocumentStore();
  const params = useParams();

  const handleCommentSubmit = (): void => {
    if (commentInput.trim()) {
      onCommentSubmit(commentInput.trim());
      setCommentInput("");
    }
  };

  const handleCommentUpdate = async (id: string, newComment: string): Promise<void> => {
    updateComment(id, newComment.trim());
    if (params.id) {
      await fetch(`/api/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id, commentId: id, comment: newComment.trim() }),
      });
    }
  };

  const handleCommentDelete = async (id: string): Promise<void> => {
    deleteComment(id);
    if (params.id) {
      await fetch(`/api/comment`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id, commentId: id }),
      });
    }
  };

  return (
    <Card className="w-80 h-full overflow-auto">
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedRange && (
          <div className="mb-4">
            <Textarea
              value={commentInput}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentInput(e.target.value)}
              placeholder="Add a comment..."
              className="mb-2"
            />
            <Button onClick={handleCommentSubmit} disabled={!commentInput.trim()}>
              Add Comment
            </Button>
          </div>
        )}
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment._id?.toString()} className="mb-2">
              <CardContent className="p-2">
                <p>{comment.comment}</p>
                <p className="text-sm text-gray-500">
                  Position: {comment.startOffset} - {comment.endOffset}
                </p>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => {
                      const newComment = prompt("Edit comment", comment.comment);
                      if (newComment) handleCommentUpdate(comment._id?.toString() || "", newComment);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCommentDelete(comment._id?.toString() || "")}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

