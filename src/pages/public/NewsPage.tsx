import React from 'react';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';
import { INITIAL_NEWS } from '../../data/mockData';
import { Newspaper } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const publishedNews = INITIAL_NEWS.filter((n) => n.status === 'PUBLISHED');

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <PublicHeader />
      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-zinc-900 pb-8">
          <div className="inline-flex items-center gap-2 text-amber-500 font-mono text-xs tracking-widest uppercase mb-2">
            <Newspaper className="w-4 h-4" /> PRESS & INSIGHTS
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase font-mono">NEWSROOM & ANNOUNCEMENTS</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {publishedNews.map((article) => (
            <div key={article.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden p-6 space-y-4">
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-zinc-950">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">{article.category} • {article.publishDate}</span>
              <h3 className="text-xl font-bold text-white">{article.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{article.summary}</p>
            </div>
          ))}
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};
