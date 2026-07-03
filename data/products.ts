
export interface Product {
  id: number; 
  name: string; 
  price: number; 
  description: string;
  rating: number;
  discountPrice?: number;
  imageColor: string;
  tag?: string;
  category?: 'For Him' | 'For Her' | 'Seasonal';
};

export interface UIProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  rating: number;
  tag?: string;
  category: string;
  imageUrl?: string;
  imageColor: string;
  encodedId: string;
}

export const products: Product[] = [
  { id: 1, name: 'Cotton T-Shirt', price: 29, description: 'Soft, organic cotton tee for everyday comfort.', rating: 4.5, imageColor: 'from-gray-700 to-gray-900', tag: 'Essential', category: 'For Him' },
  { id: 2, name: 'Denim Jacket', price: 89, discountPrice: 69, description: 'Structured denim with a vintage finish.', rating: 5, imageColor: 'from-blue-800 to-blue-950', tag: 'New Arrival', category: 'For Him' },
  { id: 3, name: 'Slim Jeans', price: 59, description: 'Tailored fit that contours to you perfectly.', rating: 4, imageColor: 'from-slate-700 to-slate-900', category: 'For Him' },
  { id: 4, name: 'Wool Sweater', price: 79, description: 'Ethically sourced wool for premium warmth.', rating: 4.8, imageColor: 'from-stone-600 to-stone-800', tag: 'Limited', category: 'Seasonal' },
  { id: 5, name: 'Linen Trousers', price: 69, description: 'Breathable linen for warm afternoons.', rating: 4.3, imageColor: 'from-amber-700 to-amber-900', category: 'For Him' },
  { id: 6, name: 'Silk Blouse', price: 129, discountPrice: 99, description: 'Luxurious silk with a soft drape.', rating: 4.9, imageColor: 'from-emerald-700 to-emerald-900', tag: 'New Arrival', category: 'For Her' },
  { id: 7, name: 'Leather Boots', price: 189, description: 'Handcrafted leather for timeless style.', rating: 4.7, imageColor: 'from-zinc-700 to-zinc-900', tag: 'Limited', category: 'For Him' },
  { id: 8, name: 'Cashmere Scarf', price: 49, description: 'Ultra-soft cashmere for cold days.', rating: 4.6, imageColor: 'from-rose-700 to-rose-900', category: 'Seasonal' },
  { id: 9, name: 'Tailored Trench Coat', price: 249, discountPrice: 199, description: 'Double-breasted gabardine coat with structured silhouette.', rating: 4.9, imageColor: 'from-stone-800 to-zinc-950', tag: 'Limited', category: 'Seasonal' },
  { id: 10, name: 'Suede Loafers', price: 149, description: 'Italian velvet suede loafers with dynamic leather lining.', rating: 4.4, imageColor: 'from-amber-950 to-stone-900', tag: 'Essential', category: 'For Him' },
  { id: 11, name: 'Silk Midi Dress', price: 199, description: 'Flowing pure silk midi dress with an asymmetric drape.', rating: 5, imageColor: 'from-emerald-900 to-teal-950', tag: 'New Arrival', category: 'For Her' },
  { id: 12, name: 'Satin Slip Skirt', price: 89, description: 'High-waisted bias cut slip skirt in premium silk satin.', rating: 4.2, imageColor: 'from-rose-900 to-stone-900', category: 'For Her' },
  { id: 13, name: 'Knit Polo Shirt', price: 79, description: 'Fine-gauge knit polo shirt with structured rib collar.', rating: 4.6, imageColor: 'from-gray-800 to-slate-900', tag: 'Essential', category: 'For Him' },
  { id: 14, name: 'Velvet Blazer', price: 229, description: 'Double-breasted cotton velvet blazer with peak lapels.', rating: 4.8, imageColor: 'from-indigo-950 to-slate-950', tag: 'Limited', category: 'Seasonal' },
  { id: 15, name: 'Chelsea Boots', price: 179, discountPrice: 149, description: 'Classic elastic side panel leather boots with pull tabs.', rating: 4.5, imageColor: 'from-neutral-800 to-stone-950', category: 'For Her' },
  { id: 16, name: 'Gold Link Necklace', price: 119, description: '18k gold-plated brass bold link collar necklace.', rating: 4.7, imageColor: 'from-yellow-700 to-amber-900', tag: 'New Arrival', category: 'For Her' },
];

