import React from 'react';

export const Textz = (props) => {
  const { className, ...prop } = props;
  return (
    <span className={`${className} text-md text-[var(--primary-blue)]`} {...prop}>
      {props.children}
    </span>
  );
};
