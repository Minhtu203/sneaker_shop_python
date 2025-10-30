import React, { useEffect } from 'react';

export default function Nike() {
  useEffect(() => {
    document.title = 'Nike';
  }, []);
  return <div>Nike page</div>;
}
