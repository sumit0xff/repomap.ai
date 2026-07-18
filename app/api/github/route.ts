import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { owner, repo } = body;

    if (!owner || !repo) {
      return NextResponse.json(
        { success: false, error: 'Missing owner or repo in request body.' },
        { status: 400 }
      );
    }

    // For now, simply return the parsed info successfully
    return NextResponse.json({
      success: true,
      owner,
      repo
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body.' },
      { status: 400 }
    );
  }
}
