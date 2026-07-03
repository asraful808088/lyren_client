'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { productService, type Product } from '@/services/productService';

interface ProductFormProps {
  productId?: string;
}

interface Color {
  colorName: string;
  colorCode: string;
}

interface Image {
  image: string;
  file?: File;
  type: 'main' | 'gallery' | 'thumbnail';
  uploaded: boolean;
}

const CATEGORIES = ['For Him', 'For Her', 'Seasonal'] as const;
const COLLECTIONS = ['Essential', 'New Arrival', 'Limited'] as const;

type Category = typeof CATEGORIES[number];
type Collection = typeof COLLECTIONS[number];

export default function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    count: 0,
    miniDesc: '',
    description: '',
    careDetails: '',
    price: 0,
    discount: 0,
    injectorUser: 'admin',
    category: '' as Category | '',
    collection: '' as Collection | '',
  });

  const [colors, setColors] = useState<Color[]>([]);
  const [colorInput, setColorInput] = useState({ name: '', code: '#000000' });

  
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState('');

  const [images, setImages] = useState<Image[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState({ url: '', type: 'main' as 'main' | 'gallery' | 'thumbnail' });
  const [imageAddMode, setImageAddMode] = useState<'file' | 'url'>('file');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        try {
          setLoading(true);
          const product = await productService.getProductById(productId);

          setForm({
            name: product.name,
            count: product.count,
            miniDesc: product.miniDesc,
            description: product.description,
            careDetails: product.careDetails,
            price: product.price,
            discount: product.discount,
            injectorUser: product.injectorUser,
            category: product.category as Category,
            collection: product.collection as Collection,
          });

          setColors(product.colors);
          
          setSizes(
            product.sizes.map((s: any) => (typeof s === 'string' ? s : s.size))
          );
          setImages(product.images.map((img) => ({ ...img, uploaded: true })));
          setError('');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load product');
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [productId]);

  const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setSubmitting(true);

  try {
    if (!form.name || form.price <= 0) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }
    if (!form.category) {
      setError('Please select a category');
      setSubmitting(false);
      return;
    }
    if (!form.collection) {
      setError('Please select a collection');
      setSubmitting(false);
      return;
    }

    
    const finalImages = await Promise.all(
      images.map(async (img) => {
        if (img.file) {
          
          const base64 = await fileToBase64(img.file);
          return { image: base64, type: img.type };
        }
        
        return { image: img.image, type: img.type };
      })
    );

    const payload = {
      ...form,
      colors,
      sizes: sizes.map((s) => ({ size: s })),
      images: finalImages,
    };

    console.log('Submitting payload:', JSON.stringify(payload, null, 2));

    if (productId) {
      await productService.updateProduct(productId, payload);
    } else {
      await productService.createProduct(payload);
    }

    setTimeout(() => router.push('/admin/products'), 300);
  } catch (err: any) {
    setError(err?.message ?? 'Failed to save product');
    console.error('Error saving product:', err);
    setSubmitting(false);
  }
};

  const handleFiles = (files: FileList | null, type: 'main' | 'gallery' | 'thumbnail' = 'gallery') => {
    if (!files) return;
    const newImages: Image[] = Array.from(files).map((file) => ({
      image: URL.createObjectURL(file),
      file,
      type,
      uploaded: false,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const changeImageType = (index: number, type: 'main' | 'gallery' | 'thumbnail') => {
    setImages((prev) => prev.map((img, i) => (i === index ? { ...img, type } : img)));
  };

  const addImageByUrl = () => {
    if (!imageUrlInput.url) return;
    setImages((prev) => [...prev, { image: imageUrlInput.url, type: imageUrlInput.type, uploaded: true }]);
    setImageUrlInput({ url: '', type: 'main' });
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const img = prev[index];
      if (img.image.startsWith('blob:')) URL.revokeObjectURL(img.image);
      return prev.filter((_, i) => i !== index);
    });
  };

  

  

  const addColor = () => {
    if (colorInput.name && colorInput.code) {
      setColors([...colors, { colorName: colorInput.name, colorCode: colorInput.code }]);
      setColorInput({ name: '', code: '#000000' });
    }
  };

  const removeColor = (index: number) => setColors(colors.filter((_, i) => i !== index));

  

  const addSize = () => {
    if (sizeInput.trim()) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput('');
    }
  };

  const removeSize = (index: number) => setSizes(sizes.filter((_, i) => i !== index));

  

  function SelectorGroup<T extends string>({
    label, options, value, onChange,
  }: {
    label: string;
    options: readonly T[];
    value: T | '';
    onChange: (v: T) => void;
  }) {
    return (
      <div>
        <label className="block text-xs tracking-[0.05em] text-gray-400 mb-3 uppercase">
          {label} *
        </label>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase rounded border transition
                ${value === opt
                  ? 'bg-[#d4af37] text-black border-[#d4af37]'
                  : 'bg-zinc-950 text-gray-400 border-white/10 hover:border-[#d4af37]/50 hover:text-white'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400">Loading product...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-sm">
          {error}
        </div>
      )}

      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs tracking-[0.05em] text-gray-400 mb-2 uppercase">Product Name *</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-zinc-950 border border-white/10 text-white rounded focus:outline-none focus:border-[#d4af37] text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs tracking-[0.05em] text-gray-400 mb-2 uppercase">Creator</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-zinc-950 border border-white/10 text-white rounded focus:outline-none focus:border-[#d4af37] text-sm"
              value={form.injectorUser}
              onChange={(e) => setForm({ ...form, injectorUser: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs tracking-[0.05em] text-gray-400 mb-2 uppercase">Mini Description (255 chars) *</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-zinc-950 border border-white/10 text-white rounded focus:outline-none focus:border-[#d4af37] text-sm"
            value={form.miniDesc}
            onChange={(e) => setForm({ ...form, miniDesc: e.target.value })}
            maxLength={255}
            required
          />
          <small className="text-xs text-gray-500 mt-1 block">{form.miniDesc.length}/255</small>
        </div>

        <div className="mb-4">
          <label className="block text-xs tracking-[0.05em] text-gray-400 mb-2 uppercase">Description *</label>
          <textarea
            className="w-full px-4 py-2 bg-zinc-950 border border-white/10 text-white rounded focus:outline-none focus:border-[#d4af37] text-sm min-h-[120px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.05em] text-gray-400 mb-2 uppercase">Care Details</label>
          <textarea
            className="w-full px-4 py-2 bg-zinc-950 border border-white/10 text-white rounded focus:outline-none focus:border-[#d4af37] text-sm min-h-[120px]"
            value={form.careDetails}
            onChange={(e) => setForm({ ...form, careDetails: e.target.value })}
          />
        </div>
      </div>

      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Category & Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectorGroup
            label="Category"
            options={CATEGORIES}
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
          />
          <SelectorGroup
            label="Collection"
            options={COLLECTIONS}
            value={form.collection}
            onChange={(v) => setForm({ ...form, collection: v })}
          />
        </div>
      </div>

      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Pricing & Stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs tracking-[0.05em] text-gray-400 mb-2 uppercase">Price ($) *</label>
            <input
              type="number"
              className="w-full px-4 py-2 bg-zinc-950 border border-white/10 text-white rounded focus:outline-none focus:border-[#d4af37] text-sm"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div>
            <label className="block text-xs tracking-[0.05em] text-gray-400 mb-2 uppercase">Discount (%)</label>
            <input
              type="number"
              className="w-full px-4 py-2 bg-zinc-950 border border-white/10 text-white rounded focus:outline-none focus:border-[#d4af37] text-sm"
              min="0"
              max="100"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="block text-xs tracking-[0.05em] text-gray-400 mb-2 uppercase">Stock Count</label>
            <input
              type="number"
              className="w-full px-4 py-2 bg-zinc-950 border border-white/10 text-white rounded focus:outline-none focus:border-[#d4af37] text-sm"
              min="0"
              value={form.count}
              onChange={(e) => setForm({ ...form, count: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Available Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs tracking-[0.05em] text-gray-400 mb-2 uppercase">Color Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-zinc-950 border border-white/10 text-white rounded focus:outline-none focus:border-[#d4af37] text-sm"
              placeholder="Navy Blue"
              value={colorInput.name}
              onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs tracking-[0.05em] text-gray-400 mb-2 uppercase">Color Code</label>
            <div className="flex gap-2">
              <input
                type="color"
                className="h-10 w-16 rounded cursor-pointer"
                value={colorInput.code}
                onChange={(e) => setColorInput({ ...colorInput, code: e.target.value })}
              />
              <button
                type="button"
                onClick={addColor}
                className="flex-1 px-4 py-2 bg-[#d4af37] text-black font-semibold rounded hover:bg-yellow-400 transition flex items-center justify-center gap-1"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>
        </div>
        {colors.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {colors.map((color, idx) => (
              <div key={idx} className="p-3 border border-white/10 rounded flex items-center gap-2">
                <div className="w-10 h-10 rounded border border-white/10" style={{ backgroundColor: color.colorCode }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{color.colorName}</p>
                  <p className="text-[10px] text-gray-500">{color.colorCode}</p>
                </div>
                <button type="button" onClick={() => removeColor(idx)} className="p-1 hover:text-red-400 transition">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Available Sizes</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 px-4 py-2 bg-zinc-950 border border-white/10 text-white rounded focus:outline-none focus:border-[#d4af37] text-sm"
            placeholder="XS, S, M, L, XL"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
          />
          <button
            type="button"
            onClick={addSize}
            className="px-6 py-2 bg-[#d4af37] text-black font-semibold rounded hover:bg-yellow-400 transition flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, idx) => (
              <div key={idx} className="px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37] rounded flex items-center gap-1 text-xs">
                {size}
                <button type="button" onClick={() => removeSize(idx)} className="hover:text-red-400 transition">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Product Images</h2>

        <div className="flex gap-1 mb-4 p-1 bg-zinc-900 rounded w-fit">
          <button
            type="button"
            onClick={() => setImageAddMode('file')}
            className={`px-4 py-1.5 text-xs font-semibold rounded transition ${imageAddMode === 'file' ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setImageAddMode('url')}
            className={`px-4 py-1.5 text-xs font-semibold rounded transition ${imageAddMode === 'url' ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:text-white'}`}
          >
            Paste URL
          </button>
        </div>

        {imageAddMode === 'file' ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-lg p-10 cursor-pointer transition
              ${dragOver ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-white/10 hover:border-[#d4af37]/50 hover:bg-white/[0.02]'}`}
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Upload size={22} className="text-[#d4af37]" />
            </div>
            <div className="text-center">
              <p className="text-sm text-white font-medium">Drop images here or click to browse</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP — multiple files supported</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs tracking-[0.05em] text-gray-400 mb-2 uppercase">Image URL</label>
              <input
                type="url"
                className="w-full px-4 py-2 bg-zinc-950 border border-white/10 text-white rounded focus:outline-none focus:border-[#d4af37] text-sm"
                placeholder="https://..."
                value={imageUrlInput.url}
                onChange={(e) => setImageUrlInput({ ...imageUrlInput, url: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.05em] text-gray-400 mb-2 uppercase">Type</label>
              <select
                className="w-full px-4 py-2 bg-zinc-950 border border-white/10 text-white rounded focus:outline-none focus:border-[#d4af37] text-sm"
                value={imageUrlInput.type}
                onChange={(e) => setImageUrlInput({ ...imageUrlInput, type: e.target.value as any })}
              >
                <option value="main">Main</option>
                <option value="gallery">Gallery</option>
                <option value="thumbnail">Thumbnail</option>
              </select>
            </div>
            <button
              type="button"
              onClick={addImageByUrl}
              className="md:col-span-3 px-4 py-2 bg-[#d4af37] text-black font-semibold rounded hover:bg-yellow-400 transition flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Image
            </button>
          </div>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {images.map((image, idx) => (
              <div key={idx} className="border border-white/10 rounded overflow-hidden group relative">
                <div className="relative h-36 bg-zinc-900">
                  <NextImage
                    src={image.image}
                    alt={`Product ${idx}`}
                    fill
                    className="object-cover"
                  />
                  {!image.uploaded && (
                    <span className="absolute top-2 left-2 bg-yellow-500/90 text-black text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                      Pending
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500"
                  >
                    <X size={12} />
                  </button>
                </div>
                <div className="p-2 bg-zinc-950 border-t border-white/10">
                  <select
                    className="w-full bg-transparent text-[10px] text-gray-400 outline-none cursor-pointer hover:text-white transition"
                    value={image.type}
                    onChange={(e) => changeImageType(idx, e.target.value as any)}
                  >
                    <option value="main">Main</option>
                    <option value="gallery">Gallery</option>
                    <option value="thumbnail">Thumbnail</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
            <ImageIcon size={14} />
            <span>No images added yet</span>
          </div>
        )}
      </div>

      
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-2 border border-white/10 text-white font-semibold rounded hover:bg-white/5 transition uppercase text-sm tracking-[0.05em]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-6 py-2 bg-[#d4af37] text-black font-semibold rounded hover:bg-yellow-400 disabled:opacity-50 transition uppercase text-sm tracking-[0.05em]"
        >
          {submitting ? 'Saving...' : productId ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}