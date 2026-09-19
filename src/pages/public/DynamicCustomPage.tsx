import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Film, ArrowLeft, AlertCircle } from 'lucide-react';
import { CustomPage } from '../../types';
import { getCustomPageBySlug } from '../../lib/cmsService';
import { BlockRenderer } from '../../components/builder/BlockRenderer';
import { PublicHeader } from '../../components/public/PublicHeader';
import { PublicFooter } from '../../components/public/PublicFooter';

export const DynamicCustomPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadPage() {
      if (!slug) return;
      try {
        setLoading(true);
        setNotFound(false);
        const fetched = await getCustomPageBySlug(slug);
        if (fetched) {
          setPage(fetched);
          document.title = `${fetched.seoTitle || fetched.title} | Stargaze Media`;
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error loading custom page:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <Sparkles className="w-8 h-8 text-amber-500 animate-spin mb-4" />
        <p className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
          LOADING CINEMATIC EXPERIENCE...
        </p>
      </div>
    );
  }

  if (notFound || !page) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-amber-500 flex items-center justify-center mb-4">
          <Film className="w-8 h-8" />
        </div>
        <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold mb-2">
          404 // SCENE NOT FOUND
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase font-display mb-3">
          Page Does Not Exist
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-6 font-light">
          The custom page you are looking for has been moved, un-published, or does not exist.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  const showHeaderFooter = page.template !== 'canvas-blank';

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white font-sans selection:bg-amber-500 selection:text-black">
      {/* Custom CSS Injection if specified */}
      {page.customCss && (
        <style dangerouslySetInnerHTML={{ __html: page.customCss }} />
      )}

      {/* Public Navigation Header */}
      {showHeaderFooter && <PublicHeader />}

      {/* Main Page Blocks Canvas */}
      <main className={`flex-1 ${showHeaderFooter ? 'pt-20' : ''}`}>
        {page.blocks && page.blocks.length > 0 ? (
          page.blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              isEditing={false}
            />
          ))
        ) : (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              This page currently has no active content blocks.
            </p>
          </div>
        )}
      </main>

      {/* Public Footer */}
      {showHeaderFooter && <PublicFooter />}
    </div>
  );
};
