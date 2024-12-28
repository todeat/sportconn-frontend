import React, { useEffect, useRef, useState } from 'react';

const SmoothCollapse = ({ isOpen, children }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;

    const contentHeight = contentRef.current.scrollHeight;
    
    if (isOpen) {
      setHeight(contentHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen, children]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ height }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

export default SmoothCollapse;