import React from "react";

type BlueBoxProps = {
  children?: React.ReactNode;
  className?: string;
  bgFrom?: string;
  bgVia?: string;
  bgTo?: string;
  rounded?: string;
  onClick?: () => void;
};

const BlueBox = ({
  children,
  className = "",

  bgFrom = "#0B1D3A", 
  bgVia = "#123E6B",
  bgTo = "#2F7DBA", 

  rounded = "rounded-2xl",
  onClick,
}: BlueBoxProps) => {
  return (
    // shadow-[0_0_40px_rgba(0,0,0,0.6)]
    <div
      className={`${rounded}  border border-white/10 p-5 ${className}`}
      onClick={onClick}
      style={{
        background: `linear-gradient(1350deg, ${bgFrom}, ${bgVia}, ${bgTo})`,
      }}
    >
      {children}
    </div>
  );
};

export default BlueBox;
