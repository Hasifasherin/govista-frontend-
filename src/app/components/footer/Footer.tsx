"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Govista</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            Discover unforgettable travel experiences, book tours with trusted
            operators, and explore the world your way.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-5">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-600 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-600 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-600 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-600 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Discover */}
        <div>
          <h3 className="text-white font-semibold mb-4">Discover</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/components/tour" className="hover:text-white">Tours</Link></li>
            <li><Link href="/" className="hover:text-white">Activities</Link></li>
            <li><Link href="/" className="hover:text-white">Destinations</Link></li>
            <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
          </ul>
        </div>

        {/* Company */}
<div>
  <h3 className="text-white font-semibold mb-4">Company</h3>
  <ul className="space-y-3 text-sm">
    <li><Link href="/about" className="hover:text-white">About Us</Link></li>
    <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
    <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
    <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
  </ul>
</div>


        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Govista. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Built with ❤️ for travelers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
