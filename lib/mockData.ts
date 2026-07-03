

export interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  count: number;
  miniDesc: string;
  description: string;
  careDetails: string;
  injectorUser: string;
  createdAt: string;
  colors: { colorName: string; colorCode: string }[];
  sizes: { size: string }[];
  images: { image: string; type: 'main' | 'gallery' | 'thumbnail' }[];
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Silk Midi Dress',
    price: 299.99,
    discount: 10,
    count: 15,
    miniDesc: 'Elegant silk midi dress perfect for any occasion',
    description: 'This beautiful silk midi dress features a flowing silhouette and luxurious feel. Perfect for evening wear or special occasions.',
    careDetails: 'Dry clean only. Store in cool, dry place.',
    injectorUser: 'admin',
    createdAt: new Date().toISOString(),
    colors: [
      { colorName: 'Navy', colorCode: '#001f3f' },
      { colorName: 'Black', colorCode: '#000000' },
      { colorName: 'Burgundy', colorCode: '#800020' },
    ],
    sizes: [
      { size: 'XS' },
      { size: 'S' },
      { size: 'M' },
      { size: 'L' },
      { size: 'XL' },
    ],
    images: [
      {
        image: 'https://images.unsplash.com/photo-1595777712802-dba875f16c28?w=500&h=500&fit=crop',
        type: 'main',
      },
      {
        image: 'https://images.unsplash.com/photo-1612336307429-8a88e8d08dbb?w=500&h=500&fit=crop',
        type: 'gallery',
      },
    ],
  },
  {
    id: '2',
    name: 'Cashmere Sweater',
    price: 199.99,
    discount: 0,
    count: 8,
    miniDesc: 'Premium cashmere knit sweater in neutral tones',
    description: 'Luxurious cashmere sweater crafted from the finest materials. Soft, warm, and timeless.',
    careDetails: 'Hand wash in cold water. Lay flat to dry.',
    injectorUser: 'admin',
    createdAt: new Date().toISOString(),
    colors: [
      { colorName: 'Cream', colorCode: '#FFFDD0' },
      { colorName: 'Camel', colorCode: '#C19A6B' },
      { colorName: 'Grey', colorCode: '#808080' },
    ],
    sizes: [
      { size: 'XS' },
      { size: 'S' },
      { size: 'M' },
      { size: 'L' },
    ],
    images: [
      {
        image: 'https://images.unsplash.com/photo-1556821552-a46ab03a3c35?w=500&h=500&fit=crop',
        type: 'main',
      },
    ],
  },
  {
    id: '3',
    name: 'Leather Belt',
    price: 89.99,
    discount: 15,
    count: 25,
    miniDesc: 'Handcrafted Italian leather belt',
    description: 'Classic leather belt made from premium Italian leather. Perfect accessory for any outfit.',
    careDetails: 'Wipe with damp cloth. Condition regularly.',
    injectorUser: 'admin',
    createdAt: new Date().toISOString(),
    colors: [
      { colorName: 'Black', colorCode: '#000000' },
      { colorName: 'Brown', colorCode: '#8B4513' },
      { colorName: 'Tan', colorCode: '#D2B48C' },
    ],
    sizes: [
      { size: 'S' },
      { size: 'M' },
      { size: 'L' },
      { size: 'XL' },
    ],
    images: [
      {
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
        type: 'main',
      },
    ],
  },
];


const STORAGE_KEY = 'fashionstore_products';

export function getProducts(): Product[] {
  if (typeof window === 'undefined') return MOCK_PRODUCTS;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : MOCK_PRODUCTS;
}

export function saveProducts(products: Product[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

export function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  const products = getProducts();
  saveProducts([...products, newProduct]);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | undefined {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  
  const updated = { ...products[index], ...updates };
  products[index] = updated;
  saveProducts(products);
  return updated;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}