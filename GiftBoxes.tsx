import React, { useState } from 'react';
import { Gift, Sparkles, Award, Heart, Check, Plus, Lock } from 'lucide-react';
import { GiftItem } from '../types';
import { audioEngine } from '../utils/audio';
import { triggerGiftSparkles } from '../utils/confetti';

interface GiftBoxesProps {
  personName: string;
}

const INITIAL_GIFTS: GiftItem[] = [
  {
    id: '1',
    title: 'VIP Golden Voucher 🎟️',
    category: 'voucher',
    description: 'Redeemable for 1x All-Expenses Paid Birthday Dinner & Dessert treat!',
    iconName: 'Award',
    unwrapped: false,
    color: 'from-amber-500 to-yellow-600'
  },
  {
    id: '2',
    title: 'Lifetime Hug Pass 🤗',
    category: 'secret',
    description: 'Valid for unlimited free hugs, high-fives, and endless smiles anytime!',
    iconName: 'Heart',
    unwrapped: false,
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: '3',
    title: 'Magic Wish Box ✨',
    category: 'wish',
    description: 'May every goal you set this year turn into pure gold and huge success!',
    iconName: 'Sparkles',
    unwrapped: false,
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: '4',
    title: 'Adventure Ticket ✈️',
    category: 'memory',
    description: 'A promise for an unforgettable road trip or getaway adventure this year!',
    iconName: 'Gift',
    unwrapped: false,
    color: 'from-cyan-500 to-blue-600'
  }
];

export const GiftBoxes: React.FC<GiftBoxesProps> = ({ personName }) => {
  const [gifts, setGifts] = useState<GiftItem[]>(INITIAL_GIFTS);
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);

  const unboxGift = (id: string, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    setGifts((prev) =>
      prev.map((g) => (g.id === id ? { ...g, unwrapped: true } : g))
    );

    const gift = gifts.find((g) => g.id === id);
    if (gift) {
      setSelectedGift({ ...gift, unwrapped: true });
    }

    audioEngine.playUnboxSound();
    triggerGiftSparkles(x, y);
  };

  return (
    <div className="my-12 px-4 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-pink-300 flex items-center justify-center gap-2">
          <Gift className="w-6 h-6 text-pink-400 animate-bounce" />
          Unwrap Your Birthday Presents!
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Tap each gift box to open your personalized birthday surprises!
        </p>
      </div>

      {/* Gifts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            onClick={(e) => unboxGift(gift.id, e)}
            className={`relative rounded-3xl p-6 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 shadow-2xl flex flex-col items-center justify-between min-h-[220px] overflow-hidden group ${gift.unwrapped ? 'bg-slate-900/90 border border-white/20' : `bg-gradient-to-br ${gift.color} border-2 border-white/30 shadow-[0_0_25px_rgba(236,72,153,0.3)]`}`}
          >
            {/* Ribbon Decoration if Wrapped */}
            {!gift.unwrapped ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
                
                {/* Horizontal & Vertical Ribbon Lines */}
                <div className="absolute inset-y-0 w-8 bg-amber-300/30 backdrop-blur-xs pointer-events-none" />
                <div className="absolute inset-x-0 h-8 bg-amber-300/30 backdrop-blur-xs pointer-events-none" />

                {/* Bow icon */}
                <div className="p-4 rounded-full bg-amber-300 text-slate-950 shadow-xl z-10 group-hover:scale-110 transition-transform animate-pulse">
                  <Gift className="w-8 h-8" />
                </div>

                <p className="font-extrabold text-white text-base mt-4 z-10 tracking-wide drop-shadow-md">
                  Tap to Open 🎁
                </p>
                <p className="text-xs text-amber-100 mt-1 z-10">
                  Surprise Gift #{gift.id}
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center text-center z-10 my-auto animate-in fade-in zoom-in duration-300">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-3">
                  <Sparkles className="w-6 h-6" />
                </div>

                <h4 className="font-extrabold text-lg text-amber-300 mb-1">
                  {gift.title}
                </h4>

                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {gift.description}
                </p>

                <div className="mt-4 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Unwrapped</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Unwrapped Detail Modal Popup */}
      {selectedGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl relative">
            <div className="p-4 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 text-slate-950 inline-block mb-4 shadow-xl animate-bounce">
              <Gift className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-amber-300 mb-2">
              {selectedGift.title}
            </h3>

            <p className="text-sm text-slate-200 my-4 leading-relaxed bg-slate-800/80 p-4 rounded-2xl border border-white/10">
              {selectedGift.description}
            </p>

            <button
              onClick={() => setSelectedGift(null)}
              className="mt-2 w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-bold text-sm shadow-lg hover:brightness-110 transition-all"
            >
              Yay! Thank You! 🎉
            </button>
          </div>
        </div>
      )}

    </div>
  );
};