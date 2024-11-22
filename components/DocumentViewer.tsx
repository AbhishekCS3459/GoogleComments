"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function DocumentViewer() {
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<Record<string, string>>({});
  const [selectedWord, setSelectedWord] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const params = useParams();

  useEffect(() => {
    const fetchDocument = async () => {
      if (params.id) {
        const response = await fetch(`/api/document/${params.id}`);
        if (response.ok) {
          const { content, comments } = await response.json();
          setContent(content);
          setComments(comments);
        }
      }
    };

    fetchDocument();
  }, [params.id]);

  const handleWordClick = (word: string) => {
    setSelectedWord(word);
    setCommentInput(comments[word] || "");
  };

  const handleCommentSubmit = async () => {
    if (selectedWord && commentInput) {
      const updatedComments = { ...comments, [selectedWord]: commentInput };
      setComments(updatedComments);

      await fetch(`/api/comment/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: selectedWord, comment: commentInput }),
      });

      setSelectedWord("");
      setCommentInput("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Document Viewer</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] w-full rounded border p-4">
            <div
              className="document-content prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: content.replace(/\S+/g, (word) => {
                  const hasComment = comments[word];
                  return `<span
                    class="word ${hasComment ? "has-comment" : ""}"
                    data-word="${word}"
                  >${word}</span>`;
                }),
              }}
              
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains("word")) {
                  handleWordClick(target.dataset.word || "");
                }
              }}
            />
          </ScrollArea>
        </CardContent>
      </Card>
      {selectedWord && (
        <Card>
          <CardHeader>
            <CardTitle>Add/Edit Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Selected Word:</span>
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded">
                  {selectedWord}
                </span>
              </div>
              <Textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Enter your comment here..."
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleCommentSubmit}
                  className="w-full sm:w-auto"
                >
                  Save Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
