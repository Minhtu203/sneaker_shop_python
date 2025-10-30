import React, { useEffect } from 'react';

export default function Basketball() {
  useEffect(() => {
    document.title = 'Basketball';
  }, []);
  return <div>Basketball</div>;
}
