import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

// GET /api/brand-settings/[brand]
export async function GET(
  request: NextRequest,
  { params }: { params: { brand: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from('brand_settings')
      .select('*')
      .eq('brand', params.brand)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/brand-settings/[brand]
export async function PUT(
  request: NextRequest,
  { params }: { params: { brand: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    const settings = await request.json();

    const { data, error } = await supabase
      .from('brand_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq('brand', params.brand)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
