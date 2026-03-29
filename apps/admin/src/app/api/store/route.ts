import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

// GET /api/store - List products (with optional brand filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const supabase = getSupabaseServiceClient();
    
    // Build query
    let query = supabase
      .from('merch_products')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (brand && brand !== 'all') {
      query = query.eq('brand', brand);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Store API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/store - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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
    
    const productData = {
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
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    console.error('Store POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
