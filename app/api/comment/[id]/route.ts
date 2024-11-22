import clientPromise from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id, word, comment } = await request.json();

    if (!id || !word || !comment) {
      return NextResponse.json(
        { error: "Missing required fields: id, word, or comment" },
        { status: 400 }
      );
    }

    console.log(`Saving comment for document ${id}: ${word} - ${comment}`);

    const client = await clientPromise;
    const db = client.db("documentViewer");
    const commentsCollection = db.collection("comments");

    await commentsCollection.updateOne(
      { documentId: id, word },
      { $set: { comment } },
      { upsert: true }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error saving comment:", error);
    return NextResponse.json(
      { error: "Error saving comment" },
      { status: 500 }
    );
  }
}
