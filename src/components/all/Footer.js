import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Despre SportConn</h3>
            <p className="text-primary-400 text-sm">
              Platforma ta completă pentru rezervări și management de baze sportive. 
              Simplifică procesul de rezervare și gestionare a facilităților sportive.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Link-uri Rapide</h3>
            <ul className="space-y-2 text-primary-400">
              <li>
                <Link to="/facilities" className="hover:text-white transition-colors">
                  Baze Sportive
                </Link>
              </li>
              <li>
                <Link to="/register-facility" className="hover:text-white transition-colors">
                  Înregistrează Bază Sportivă
                </Link>
              </li>
              <li>
                <Link to="/despre-noi" className="hover:text-white transition-colors">
                  Despre Noi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-primary-400">
              <li>
                <Link to="/termeni-si-conditii" className="hover:text-white transition-colors">
                  Termeni și Condiții
                </Link>
              </li>
              <li>
                <Link to="/politica-de-confidentialitate" className="hover:text-white transition-colors">
                  Politica de Confidențialitate
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-white transition-colors">
                  Politica de Cookies
                </Link>
              </li>
              <li>
                <Link to="/gdpr" className="hover:text-white transition-colors">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="space-y-3 text-primary-400">
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <a href="mailto:contact@sportconn.ro" className="hover:text-white transition-colors">
                  tudor@fluxer.ai
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <a href="tel:+40722334455" className="hover:text-white transition-colors">
                  +40 735 563 812
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>Str. Dr. Mihail Marcus nr. 26, Arad</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4 pt-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-400/30 mt-8 pt-8 text-center text-primary-400 text-sm">
          <p>© {new Date().getFullYear()} SportConn. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;