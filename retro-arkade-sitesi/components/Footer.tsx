
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white mt-12">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Retro Arkade. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Link to="/about" className="hover:text-arkade-orange transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-arkade-orange transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
