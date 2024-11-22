import clientPromise from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface Context {
  params: {
    id: string;
  };
}

export async function POST(
  request: NextRequest,
  context: Context
) {
  const { params } = context; 
  const { id } = params;
  const { word, comment } = await request.json();

  // Logging for debugging
  console.log(`Saving comment for document ${id}: ${word} - ${comment}`);

  try {
    const client = await clientPromise;
    const db = client.db('documentViewer');
    const commentsCollection = db.collection('comments');

    await commentsCollection.updateOne(
      { documentId: id, word },
      { $set: { comment } },
      { upsert: true }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving comment:', error);
    return NextResponse.json({ error: 'Error saving comment' }, { status: 500 });
  }
}
