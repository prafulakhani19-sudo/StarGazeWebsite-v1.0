import React, { useState, useEffect } from 'react';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';
import { INITIAL_NEWS } from '../../data/mockData';
import { NewsArticle } from '../../types';
import { resolveNewsMedia } from '../../lib/mediaResolver';
import { getNewsArticles } from '../../lib/cmsService';
import { Newspaper } from 'lucide-react';
import { StargazeImage } from '../../components/common/StargazeImage';

export const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>(INITIAL_NEWS);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const cmsData = await getNewsArticles();
        const base = cmsData && cmsData.length > 0 ? cmsData : INITIAL_NEWS;
        const resolved = await Promise.all(base.map(resolveNewsMedia));
        if (isMounted) setNews(resolved);
      } catch (err) {
        console.warn('Error loading news, using defaults:', err);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const publishedNews = news.filter((n) => n.status === 'PUBLISHED');

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
                <StargazeImage src={article.imageUrl} alt={article.title} focalPoint={article.focalPoint} className="w-full h-full object-cover" />
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
