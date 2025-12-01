import React, { useState } from 'react';
import DesktopNav from './DesktopNav';
import MobileNav from '../MobileNav';
import logo from '/logo.svg';

const Header = () => {
  const [hideLeft, setHideLeft] = useState("-left-[1000px]");

  // ĐÚNG CÚ PHÁP: mảng các object { label, to }
  const menuItems = [
    { label: "Trang Chủ",   to: "/" },
    { label: "Công Thức",   to: "/recipes" },
    { label: "Giới Thiệu",  to: "/about" },
    { label: "Liên Hệ",     to: "/contact" },
  ];

  const onOpen = () => {
    setHideLeft("left-0");
  };

  const onClose = () => {
    setHideLeft("-left-[1000px]");
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block"> 
        <DesktopNav menuItems={menuItems} Logo={logo} />
      </div>
    </>
  );
};

export default Header;