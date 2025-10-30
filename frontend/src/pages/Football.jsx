import React, { useEffect } from 'react';

export default function Football() {
  useEffect(() => {
    document.title = 'Football';
  }, []);
  return <div>Football</div>;
}
