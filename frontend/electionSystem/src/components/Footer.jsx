import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/photo.png";


function Footer() {
  return (
    <>
<footer className="footer  bg-base-200 text-primary-content p-10 flex items-center gap-28">
  <aside className='flex'>
   <img src={logo} className='w-28' alt="" />
   <div className="footer-div">
    <p className="font-bold text-2xl">
      صوتك
    </p>
      <p className=' font-semibold text-lg'>
      "صوتك... مستقبل الأردن يبدأ هنا" بصوتك تصنع القرار و تنهض بالأردن"
      </p>
      </div>
  </aside>

  <nav className="grid grid-flow-col gap-4">
    <ul>
      <li> </li>
      <li></li>
      <li></li> 
      <li></li>
    </ul>
    <a className="link link-hover transition-all text-lg hover:text-red-600">المناظرات</a>
    <a className="link link-hover transition-all text-nowrap text-lg hover:text-red-600">الحملات الأنتخابية</a>
    <a className="link link-hover transition-all text-nowrap text-lg hover:text-red-600">حملات المرشحين</a>
   

  </nav>
      <p>Copyright © {new Date().getFullYear()} - All right reserved</p>

 
</footer>
    </>
  )
}

export default Footer