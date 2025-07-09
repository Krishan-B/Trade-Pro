import React from "react";
type MainNavProps = React.HTMLAttributes<HTMLDivElement>;
const MainNav: React.FC<MainNavProps> = ({ className, ...rest }) => (
  <div className={className} {...rest}>
    MainNav (stub)
  </div>
);
export default MainNav;
