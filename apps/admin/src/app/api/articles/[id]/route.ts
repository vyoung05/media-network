import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient, updateArticle, updateArticleStatus, deleteArticle } from '@media-network/shared';
import type { ArticleStatus } from '@media-network/shared';
import { validateRequest } from '@/lib/api-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await validateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    const supabase = getSupabaseServiceClient();
    const body = await request.json();
    const { id } = params;

    const article = await updateArticle(supabase, id, body);
    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await validateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const supabase = getSupabaseServiceClient();
    await deleteArticle(supabase, params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete article' },
      { status: 500 }
    );
  }
}
