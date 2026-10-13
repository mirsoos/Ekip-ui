import { getIcon } from '@/lib/icons';

interface CoverPickerProps {
  options: string[];
  selectedUrl: string;
  onSelect: (url: string) => void;
  className?: string;
}

export function CoverPicker({ options, selectedUrl, onSelect, className = '' }: CoverPickerProps) {
  const Check = getIcon('Check');

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-foot text-secondary font-medium ml-1">Cover photo</label>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
        {options.map((url) => {
          const isSelected = selectedUrl === url;
          return (
            <button
              key={url}
              type="button"
              onClick={() => onSelect(url)}
              className={`relative w-24 h-16 rounded-2xl overflow-hidden shrink-0 spring-press cursor-pointer ${
                isSelected ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-transparent' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img src={url} alt="Cover option" className="w-full h-full object-cover" />
              {isSelected && (
                <div className="absolute inset-0 bg-pink-500/30 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md">
                    <Check size={14} strokeWidth={3} />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
