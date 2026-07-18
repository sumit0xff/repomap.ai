import { NextResponse } from 'next/server';
import { fetchAndNormalizeRepository } from '@/services/github';

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

    const normalizedData = await fetchAndNormalizeRepository(owner, repo);

    return NextResponse.json({
      success: true,
      repository: normalizedData.repository,
      tree: normalizedData.tree
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 400 }
    );
  }
}
