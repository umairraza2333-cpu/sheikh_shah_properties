import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const WHATSAPP_NUMBER = '923392001927';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Sheikh%20%26%20Shah%20Properties`;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: 'general_inquiry' as const,
  });

  const createInquiryMutation = trpc.inquiries.create.useMutation({
    onSuccess: () => {
      toast.success('Inquiry sent successfully! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        inquiryType: 'general_inquiry',
      });
    },
    onError: (error) => {
      toast.error('Failed to send inquiry. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    createInquiryMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Contact Us</h1>
          <p className="text-background/80 text-lg">Get in touch with our team</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-accent/20 p-3 rounded-lg">
                <Phone className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-bold">Phone</h3>
                <a href="tel:+923392001927" className="text-accent hover:underline">
                  0339-2001927
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-accent/20 p-3 rounded-lg">
                <MessageCircle className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-bold">WhatsApp</h3>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  Message Us
                </a>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-accent/20 p-3 rounded-lg">
                <MapPin className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="font-bold">Location</h3>
                <p className="text-muted-foreground text-sm">Karachi, Pakistan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0300-0000000"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              {/* Inquiry Type */}
              <div>
                <label className="block text-sm font-semibold mb-2">Inquiry Type</label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-background"
                >
                  <option value="general_inquiry">General Inquiry</option>
                  <option value="property_inquiry">Property Inquiry</option>
                  <option value="project_inquiry">Project Inquiry</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  rows={5}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={createInquiryMutation.isPending}
                className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
                <span>{createInquiryMutation.isPending ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

          {/* Additional Info */}
          <div>
            <div className="bg-card border border-border rounded-xl p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Have questions about our properties or services? We're here to help! Contact us through any of the channels below and our team will get back to you as soon as possible.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="text-accent flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Call Us</p>
                    <p className="text-muted-foreground">0339-2001927</p>
                    <p className="text-sm text-muted-foreground">Monday - Friday, 9 AM - 6 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="text-accent flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <p className="text-muted-foreground">Quick response via WhatsApp</p>
                    <p className="text-sm text-muted-foreground">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-accent flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">Karachi, Pakistan</p>
                    <p className="text-sm text-muted-foreground">Serving Scheme 33, 45, Gulshan-e-Iqbal, Gulshan-e-Johar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-muted rounded-xl h-64 flex items-center justify-center border border-border">
              <div className="text-center">
                <MapPin size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Karachi, Pakistan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
