

'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../ProductForm';
import '../../admin.css';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div>
      <div className="page-header">
        <div>
          <Link
            href="/admin/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--admin-text-muted)',
              fontSize: '0.85rem',
              marginBottom: '0.5rem',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={14} /> Back to Products
          </Link>
          <h1 className="page-title">Edit Product</h1>
          <p className="page-subtitle">Update product details — changes save on submit</p>
        </div>
      </div>

      <div style={{
        background: 'var(--admin-sidebar)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--admin-border)',
      }}>
        
        <ProductForm productId={id} />
      </div>
    </div>
  );
}