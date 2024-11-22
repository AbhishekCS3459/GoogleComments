import clientPromise from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params
  const { word, comment } = await request.json()


  // In a real application, you'd save the comment to a database
  console.log(`Saving comment for document ${id}: ${word} - ${comment}`)


  try {
    const client = await clientPromise
    const db=client.db("documentViewer")
    const commentsCollection = db.collection("comments")

    await commentsCollection.updateOne(
      {documentId: id, word},
      { $set: {comment}},
      {upsert: true}
    )
    return NextResponse.json({ success: true }, { status: 200 })
    
  } catch (error) {
    console.error('Error saving comment:', error)
    return NextResponse.json({ error: 'Error saving comment' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}

