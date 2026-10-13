import { getIcon } from '@/lib/icons';
import { useTheme } from '@/lib/theme';

interface EkipDetailHeaderProps {
  coverUrl: string;
  onBack: () => void;
  onShare: () => void;
  onBookmark?: () => void;
}

export function EkipDetailHeader({ coverUrl, onBack, onShare, onBookmark }: EkipDetailHeaderProps) {
  const { theme } = useTheme();
  const Back = getIcon('ArrowLeft');
  const Share = getIcon('Share');
  const Bookmark = getIcon('Bookmark');

  return (
    <div className="relative h-56 overflow-hidden shrink-0">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: `url(${coverUrl})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgb(0 0 0 / 0.35) 0%, transparent 35%, rgb(0 0 0 / 0.6) 100%)',
        }}
      />
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className={`absolute top-4 left-4 w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center spring-press z-10 cursor-pointer shadow-md ${
          theme === 'dark' ? 'text-white' : 'text-primary'
        }`}
      >
        <Back size={20} strokeWidth={2.4} />
      </button>

      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          type="button"
          onClick={onShare}
          aria-label="Share"
          className={`w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center spring-press cursor-pointer shadow-sm ${
            theme === 'dark' ? 'text-white' : 'text-primary'
          }`}
        >
          <Share size={18} strokeWidth={2.2} />
        </button>
        {onBookmark && (
          <button
            type="button"
            onClick={onBookmark}
            aria-label="Bookmark"
            className={`w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center spring-press cursor-pointer shadow-sm ${
              theme === 'dark' ? 'text-white' : 'text-primary'
            }`}
          >
            <Bookmark size={18} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </div>
  );
}
