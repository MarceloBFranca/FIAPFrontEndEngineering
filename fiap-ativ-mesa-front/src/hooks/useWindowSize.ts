// src/hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

interface Size {
  width: number;
  height: number;
}

export default function useWindowSize(): Size {
  const [windowSize, setWindowSize] = useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Executa na montagem para pegar o tamanho inicial

    return () => window.removeEventListener('resize', handleResize);
  }, []); 

  return windowSize;
}