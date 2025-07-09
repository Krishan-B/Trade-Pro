import React from "react";

interface MobileMenuProps {
  onMenuToggle?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onMenuToggle }) => (
  <div onClick={onMenuToggle}>MobileMenu (stub)</div>
);

export default MobileMenu;
