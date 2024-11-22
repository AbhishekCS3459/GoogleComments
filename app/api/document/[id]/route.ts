import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import mammoth from 'mammoth'
import clientPromise from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params
  const filepath = join(process.cwd(), 'uploads', `${id}.docx`)

  try {
    const buffer = await readFile(filepath)
    const result = await mammoth.convertToHtml({ buffer })
    const content = result.value

  const client = await clientPromise;
  const db = client.db("documentViewer");
  const commentsCollection = db.collection("comments");
  const commentsArray = await commentsCollection.find({ documentId: id }).toArray();

  const comments = commentsArray.reduce((acc, curr) => {
    acc[curr.word] = curr.comment
    return acc
  }, {} as Record<string, string>)

    return NextResponse.json({ content, comments }, { status: 200 })
  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json({ error: 'Error reading file' }, { status: 500 })
  }
}

