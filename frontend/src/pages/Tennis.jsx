import React, { useEffect } from 'react';

export default function Tennis() {
  useEffect(() => {
    document.title = 'Tennis';
  }, []);
  return <div>Tennis</div>;
}
