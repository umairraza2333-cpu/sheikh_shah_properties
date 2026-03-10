import { Phone, MapPin, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';

const WHATSAPP_NUMBER = '923392001927';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Sheikh%20%26%20Shah%20Properties`;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-foreground font-bold">
                S&S
              </div>
              <div>
                <div className="font-bold text-sm">Sheikh & Shah</div>
                <div className="text-xs text-background/80">Properties</div>
              </div>
            </div>
            <p className="text-sm text-background/80 mb-4">
              Where Trust Meets Success - Your premier real estate partner in Karachi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-background/80 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-background/80 hover:text-accent transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-background/80 hover:text-accent transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-background/80 hover:text-accent transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="font-bold mb-4 text-accent">Areas We Cover</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-background/80">Scheme 33</li>
              <li className="text-background/80">Scheme 45</li>
              <li className="text-background/80">Gulshan-e-Iqbal</li>
              <li className="text-background/80">Gulshan-e-Johar</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-4 text-accent">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-accent" />
                <a href="tel:+923392001927" className="text-background/80 hover:text-accent transition-colors">
                  0339-2001927
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                <span className="text-background/80">Karachi, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-background/80 hover:text-accent transition-colors"
                >
                  <MessageCircle size={16} className="text-accent" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/80">
            <p>&copy; {currentYear} Sheikh & Shah Properties. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
