import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FontSize = 'small' | 'medium' | 'large';

export function AccessibilityToggle() {
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;
    if (savedFontSize) {
      setFontSize(savedFontSize);
      applyFontSize(savedFontSize);
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    const root = document.documentElement;
    
    switch (size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'medium':
        root.style.fontSize = '16px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
    }
  };

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    applyFontSize(size);
    localStorage.setItem('fontSize', size);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-muted transition-colors"
          aria-label="Adjust text size"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => handleFontSizeChange('small')}
          className="cursor-pointer"
        >
          <span className="text-xs mr-2">A</span>
          <span className={fontSize === 'small' ? 'font-semibold' : ''}>
            Small
          </span>
          {fontSize === 'small' && (
            <svg className="ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleFontSizeChange('medium')}
          className="cursor-pointer"
        >
          <span className="text-sm mr-2">A</span>
          <span className={fontSize === 'medium' ? 'font-semibold' : ''}>
            Medium
          </span>
          {fontSize === 'medium' && (
            <svg className="ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleFontSizeChange('large')}
          className="cursor-pointer"
        >
          <span className="text-base mr-2">A</span>
          <span className={fontSize === 'large' ? 'font-semibold' : ''}>
            Large
          </span>
          {fontSize === 'large' && (
            <svg className="ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
