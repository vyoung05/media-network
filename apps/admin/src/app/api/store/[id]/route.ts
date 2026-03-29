import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/store/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    
    const { data, error } = await supabase
      .from('merch_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    console.error('Store GET [id] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/store/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    const {
      title,
      brand,
      price,
      category,
      status,
      description,
      images,
      sizes,
      printful_product_id,
    } = body;

    if (!title || !brand || !price || !category || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (isNaN(parseFloat(price))) {
      return NextResponse.json(
        { error: 'Invalid price value' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    
    const updateData = {
      title: title.trim(),
      description: description?.trim() || null,
      brand,
      price: parseFloat(price),
      images: images || [],
      sizes: sizes || [],
      category,
      status,
      printful_product_id: printful_product_id?.trim() || null,
    };

    const { data, error } = await supabase
      .from('merch_products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error updating product:', error);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    console.error('Store PUT [id] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/store/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();
    
    const { error } = await supabase
      .from('merch_products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Store DELETE [id] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
