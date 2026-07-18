import { NextResponse } from 'next/server';
import { analyzeRepository } from '@/services/ai/provider';
import { NormalizedGithubData } from '@/types/github';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Ensure we have the minimum required data
    if (!body || !body.repository || !body.tree) {
      return NextResponse.json(
        { success: false, error: 'Invalid repository data provided.' },
        { status: 400 }
      );
    }

    const repositoryData = body as NormalizedGithubData;

    const analysis = await analyzeRepository(repositoryData);

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred during analysis.' },
      { status: 500 }
    );
  }
}
