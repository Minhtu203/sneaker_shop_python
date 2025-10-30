import React, { useEffect } from 'react';

export default function Airmax() {
  useEffect(() => {
    document.title = 'Airmax';
  }, []);

  return <div>Airmax</div>;
}
