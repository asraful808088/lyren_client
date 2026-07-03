'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';
import Image from 'next/image';
import { productService, type Product } from '@/services/productService';
import '../admin.css';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const extractProducts = (result: any): Product[] => {
    const list = result?.items ?? result?.data ?? result?.Data ?? [];
    return Array.isArray(list) ? list : [];
  };

  

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await productService.getAllProducts(1, 100);
      setProducts(extractProducts(result));
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  

  const handleSearch = async (query: string) => {
    setSearch(query);
    try {
      if (!query.trim()) {
        const result = await productService.getAllProducts(1, 100);
        setProducts(extractProducts(result));
      } else {
        const result = await productService.searchProducts(query, 1, 100);
        setProducts(extractProducts(result));
      }
    } catch (err: any) {
      setError(err?.message ?? 'Search failed');
    }
  };

  

  const handleDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err?.message ?? 'Failed to delete product');
    }
  };

  

  return (
    <div>
      
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">
            {loading ? 'Loading...' : `${products.length} products`}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      
      {error && (
        <div style={{
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'rgba(239,68,68,0.1)',
          borderLeft: '3px solid rgb(239,68,68)',
          borderRadius: '4px',
          color: 'rgb(220,38,38)',
        }}>
          {error}
          <button
            onClick={loadProducts}
            style={{ marginLeft: '1rem', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      )}

      
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', color: 'var(--admin-text-muted)' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
          />
        </div>
      </div>

      
      {loading && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{
              height: '52px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '8px',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      )}

      
      {!loading && !error && products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <Package size={28} style={{ color: 'var(--admin-text-muted)' }} />
          </div>
          <h3 style={{ color: 'var(--admin-text)', marginBottom: '0.5rem' }}>
            {search ? `No results for "${search}"` : 'No products yet'}
          </h3>
          {!search && (
            <Link href="/admin/products/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <Plus size={16} /> Add your first product
            </Link>
          )}
        </div>
      )}

      
      {!loading && products.length > 0 && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Discount</th>
                <th>Category</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const mainImage =
                  (product.images as any[])?.find((i) => i.type === 'main') ??
                  (product.images as any[])?.[0];
                const imageUrl = mainImage?.image ?? mainImage;

                return (
                  <tr key={product.id}>
                    
                    <td>
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          width={44}
                          height={44}
                          style={{
                            objectFit: 'cover', borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '6px',
                          background: 'rgba(255,255,255,0.05)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Package size={18} style={{ color: 'var(--admin-text-muted)' }} />
                        </div>
                      )}
                    </td>

                    <td><strong>{product.name}</strong></td>

                    <td>
                      {product.discount > 0 ? (
                        <span>
                          <span style={{ color: 'var(--admin-accent)' }}>
                            ${(product.price - (product.price * product.discount) / 100).toFixed(2)}
                          </span>
                          <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginLeft: '4px', textDecoration: 'line-through' }}>
                            ${product.price.toFixed(2)}
                          </span>
                        </span>
                      ) : (
                        <span>${product.price.toFixed(2)}</span>
                      )}
                    </td>

                    <td>
                      <span className={`badge ${product.count > 0 ? 'badge-success' : 'badge-warning'}`}>
                        {product.count} units
                      </span>
                    </td>

                    <td>
                      {product.discount > 0 ? (
                        <span style={{ color: 'var(--admin-accent)' }}>{product.discount}%</span>
                      ) : (
                        <span style={{ color: 'var(--admin-text-muted)' }}>—</span>
                      )}
                    </td>

                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>
                      {(product as any).category ?? '—'}
                    </td>

                    <td style={{ color: 'var(--admin-text-muted)' }}>
                      {product.injectorUser}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <Link
  href={`/admin/products/${product.id}`}
  className="btn btn-secondary"
  style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}
>
  <Edit2 size={14} />
</Link>
                        <button
                          onClick={() => setDeleteConfirm(String(product.id))}
                          className="btn btn-danger"
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Product</h2>
              <button onClick={() => setDeleteConfirm(null)} className="modal-close">✕</button>
            </div>
            <p style={{ marginBottom: '2rem', color: 'var(--admin-text-muted)' }}>
              Are you sure you want to delete this product? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setDeleteConfirm(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn btn-danger" style={{ flex: 1 }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}