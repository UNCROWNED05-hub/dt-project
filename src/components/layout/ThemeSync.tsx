'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ThemeSync() {
  const pathname = usePathname();

  useEffect(() => {
    let theme = 'desk';
    let colorScheme = 'light';

    if (pathname?.startsWith('/ai-ml')) {
      theme = 'sunrise';
      colorScheme = 'light';
    } else if (pathname?.startsWith('/cybersecurity')) {
      theme = 'midnight';
      colorScheme = 'dark';
    } else if (pathname?.startsWith('/iot')) {
      theme = 'blueprint';
      colorScheme = 'light';
    } else {
      theme = 'desk';
      colorScheme = 'light';
    }

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = colorScheme;
  }, [pathname]);

  return null;
}
