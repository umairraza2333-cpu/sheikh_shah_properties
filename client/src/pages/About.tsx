import { Award, Users, Target, Heart } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in all our real estate services and transactions.',
    },
    {
      icon: Users,
      title: 'Trust',
      description: 'Building lasting relationships with our clients through transparency and integrity.',
    },
    {
      icon: Target,
      title: 'Results',
      description: 'Delivering exceptional outcomes for buyers, sellers, and investors.',
    },
    {
      icon: Heart,
      title: 'Commitment',
      description: 'Dedicated to understanding and fulfilling the unique needs of each client.',
    },
  ];

  const team = [
    {
      name: 'Sheikh',
      role: 'Founder & Lead Advisor',
      expertise: 'Real Estate Investment & Property Marketing',
    },
    {
      name: 'Shah',
      role: 'Co-Founder & Senior Consultant',
      expertise: 'Property Valuation & Client Relations',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">About Sheikh & Shah Properties</h1>
          <p className="text-background/80 text-lg">Your trusted partner in real estate excellence</p>
        </div>
      </div>

      <div className="container py-12">
        {/* Company Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Sheikh & Shah Properties was founded with a vision to revolutionize the real estate market in Karachi. With years of experience in property investment, marketing, and consultancy, we have built a reputation for excellence and trustworthiness.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                Our mission is simple: to connect the right properties with the right people. Whether you're looking to buy, sell, or invest, we provide comprehensive solutions tailored to your needs.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We operate across the most sought-after locations in Karachi, including Scheme 33, Scheme 45, Gulshan-e-Iqbal, and Gulshan-e-Johar, ensuring our clients have access to the finest properties and investment opportunities.
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent to-accent/80 rounded-xl p-12 text-accent-foreground">
              <div className="space-y-6">
                <div>
                  <p className="text-5xl font-bold">500+</p>
                  <p className="text-accent-foreground/80">Properties Sold</p>
                </div>
                <div>
                  <p className="text-5xl font-bold">1000+</p>
                  <p className="text-accent-foreground/80">Happy Clients</p>
                </div>
                <div>
                  <p className="text-5xl font-bold">10+</p>
                  <p className="text-accent-foreground/80">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-accent/20 p-3 rounded-lg">
                      <Icon className="text-accent" size={28} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Our Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center text-accent-foreground text-4xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                <p className="text-accent font-semibold mb-3">{member.role}</p>
                <p className="text-muted-foreground">{member.expertise}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-foreground text-background rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Sheikh & Shah Properties?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Expert advisors with deep market knowledge',
              'Comprehensive property portfolio across prime locations',
              'Transparent and ethical business practices',
              'Fast and hassle-free transactions',
              'Professional marketing and promotion',
              'Personalized investment consultancy',
              'Dedicated customer support',
              'Proven track record of success',
            ].map((reason, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center mt-1">
                  <span className="text-foreground font-bold text-sm">✓</span>
                </div>
                <p className="text-lg">{reason}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
