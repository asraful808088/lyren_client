import { ArrowRight } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="py-20 border-b border-white/10 flex flex-col items-center text-center bg-[#121212] bg-[url('https://images.unsplash.com/photo-1577974936453-6c7028120c02?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
        <div className="bg-black/70 p-12 w-full flex flex-col items-center">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] mb-4">Newsletter</div>
        <h4 className="text-3xl font-serif mb-4">Join the circle</h4>
        <p className="text-sm opacity-50 mb-8 max-w-xs leading-relaxed">Receive early access to seasonal drops and private atelier viewing invitations.</p>
        <div className="border border-white/20 p-2 flex gap-4 w-full max-w-md">
            <input type="email" placeholder="Enter Email" className="bg-transparent flex-1 p-2 text-xs uppercase focus:outline-none" />
            <button className="text-[10px] uppercase tracking-[0.3em] py-2 px-4 border-l border-white/20 hover:bg-white hover:text-black transition flex items-center gap-2">
                Sign Up <ArrowRight size={14}/>
            </button>
        </div>
        </div>
    </section>
  );
}
