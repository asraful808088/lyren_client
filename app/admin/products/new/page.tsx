

'use client';

import ProductForm from '../ProductForm';
import '../../admin.css';

export default function NewProductPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Product</h1>
          <p className="page-subtitle">Add a new product to your catalog</p>
        </div>
      </div>

      <div style={{ background: 'var(--admin-sidebar)', padding: '2rem', borderRadius: '0.75rem', border: '1px solid var(--admin-border)' }}>
        <ProductForm />
      </div>
    </div>
  );
}
