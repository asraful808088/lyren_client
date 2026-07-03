import { FC } from 'react';
import { Star } from 'lucide-react';

const reviews = Array.from({ length: 50 }, (_, i) => ({
  name: `Customer ${i + 1}`,
  rating: Math.floor(Math.random() * 2) + 4,
  text: `This is review number ${i + 1}. The quality is truly impeccable and the design is timeless. Highly recommended!`,
  date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
  time: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}));

const ProductReviews: FC = () => {
  return (
    <div className="space-y-6">
      <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {reviews.map((r, i) => (
          <div key={i} className="flex bg-[#0a0a0a] border border-white/10 p-3 gap-4">
            <div className="w-1/4 shrink-0 flex flex-col justify-between">
              <span className="text-[8px] text-white uppercase tracking-widest">{r.name}</span>
              <div className="flex text-[#d4af37]">
                {[...Array(r.rating)].map((_, j) => <Star key={j} size={8} fill="currentColor" />)}
              </div>
              <span className="text-[8px] text-gray-500">{r.date} - {r.time}</span>
            </div>
            <div className="w-3/4 text-[10px] text-gray-400 font-light pr-2">
              {r.text}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0a0a0a] p-4 border border-white/10">
        <h4 className="text-[10px] uppercase text-white tracking-widest mb-3">Write a Review</h4>
        <div className="flex flex-col gap-2">
          <textarea className="w-full h-16 bg-black border border-white/10 p-2 text-[10px] text-white custom-scrollbar" placeholder="Your review..."></textarea>
          <button className="w-fit px-4 py-1 bg-white text-black text-[8px] uppercase hover:bg-[#d4af37] hover:text-white transition-colors">Submit Review</button>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
