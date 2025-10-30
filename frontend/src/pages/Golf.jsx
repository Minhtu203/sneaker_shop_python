import React, { useEffect } from 'react';

export default function Golf() {
  useEffect(() => {
    document.title = 'Golf';
  }, []);
  return <div>Golf</div>;
}
