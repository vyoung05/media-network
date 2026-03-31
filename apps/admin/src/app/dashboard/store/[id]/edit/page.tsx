'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type { MerchCategory, MerchStatus, MerchProduct } from '@media-network/shared';

interface ProductFormData {
  title: string;
  description: string;
  brand: string;
  price: string;
  images: string[];
  sizes: string[];
  category: MerchCategory;
  status: MerchStatus;
  printful_product_id: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<MerchProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [imageInput, setImageInput] = useState('');
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    brand: '',
    price: '',
    images: [],
    sizes: [],
    category: 'tee',
    status: 'active',
    printful_product_id: '',
  });

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const supabase = getSupabaseBrowserClient();
      
      const { data, error } = await supabase
        .from('merch_products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Product not found');
      
      setProduct(data);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        brand: data.brand || '',
        price: data.price?.toString() || '',
        images: data.images || [],
        sizes: data.sizes || [],
        category: data.category || 'tee',
        status: data.status || 'active',
        printful_product_id: data.printful_product_id || '',
      });
    } catch (err) {
      console.error('Error loading product:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      setError('');

      // Basic validation
      if (!formData.title.trim()) {
        throw new Error('Product title is required');
      }
      if (!formData.price || isNaN(parseFloat(formData.price))) {
        throw new Error('Valid price is required');
      }

      const supabase = getSupabaseBrowserClient();
      
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        brand: formData.brand,
        price: parseFloat(formData.price),
        images: formData.images,
        sizes: formData.sizes,
        category: formData.category,
        status: formData.status,
        printful_product_id: formData.printful_product_id.trim() || null,
      };

      const { error: updateError } = await supabase
        .from('merch_products')
        .update(updateData)
        .eq('id', productId);

      if (updateError) throw updateError;

      router.push('/dashboard/store');
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      setError('');

      const supabase = getSupabaseBrowserClient();
      
      const { error: deleteError } = await supabase
        .from('merch_products')
        .delete()
        .eq('id', productId);

      if (deleteError) throw deleteError;

      router.push('/dashboard/store');
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="glass-panel p-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="glass-panel p-6">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Link href="/dashboard/store" className="btn-primary">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/store"
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Product</h1>
          <p className="text-gray-400 mt-1">{product?.title}</p>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6"
      >
        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="input-field"
                placeholder="e.g. Sauce Caviar Luxury Tee"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Brand *
              </label>
              <select
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="input-field"
                required
              >
                <option value="Young Empire">Young Empire</option>
                <option value="Sauce Caviar">Sauce Caviar</option>
                <option value="Trap Glow">Trap Glow</option>
                <option value="Trap Frequency">Trap Frequency</option>
                <option value="SauceWire">SauceWire</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Product description..."
            />
          </div>

          {/* Price & Category */}
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="input-field"
                placeholder="29.99"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value as MerchCategory)}
                className="input-field"
                required
              >
                <option value="tee">T-Shirt</option>
                <option value="hoodie">Hoodie</option>
                <option value="tank">Tank Top</option>
                <option value="longsleeve">Long Sleeve</option>
                <option value="sweatshirt">Sweatshirt</option>
                <option value="hat">Hat</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as MerchStatus)}
                className="input-field"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="sold_out">Sold Out</option>
              </select>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    formData.sizes.includes(size)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Images
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="input-field flex-1"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="btn-secondary px-4"
                >
                  Add
                </button>
              </div>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg bg-gray-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxIiBkPSJNNCAyMGgxNmEyIDIgMCAwIDAgMi0yVjZhMiAyIDAgMCAwLTItMkg0YTIgMiAwIDAgMC0yIDJ2MTJhMiAyIDAgMCAwIDIgMnptMi0xMGw0LjU4Ni00LjU4NmEyIDIgMCAwIDEgMi44MjggMEwxNiAxNm0tMi0yIDEuNTg2LTEuNTg2YTIgMiAwIDAgMSAyLjgyOCAwTDIwIDE0bS02LTZoLjAxTTYgMjBIMThhMiAyIDAgMCAwIDItMlY2YTIgMiAwIDAgMC0yLTJINmEyIDIgMCAwIDAtMiAydjEyYTIgMiAwIDAgMCAyIDJ6Ii8+PC9zdmc+';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Printful Integration */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Printful Product ID
              <span className="text-gray-500 text-xs ml-2">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.printful_product_id}
              onChange={(e) => handleInputChange('printful_product_id', e.target.value)}
              className="input-field"
              placeholder="e.g. 123456"
            />
            <p className="text-xs text-gray-500 mt-1">
              Link this product to a Printful sync product for order fulfillment
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
            <div className="flex gap-3 flex-1">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 sm:flex-none"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/dashboard/store"
                className="btn-secondary flex-1 sm:flex-none text-center"
              >
                Cancel
              </Link>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="btn-danger"
            >
              {deleting ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}