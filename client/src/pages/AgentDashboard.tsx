import { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Building2, Plus, Edit, Trash2, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { useLocation } from 'wouter';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showAddProperty, setShowAddProperty] = useState(false);

  // Redirect if not an agent
  if (user?.role !== 'agent' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Only agents can access this dashboard</p>
          <Button onClick={() => setLocation('/')} className="bg-accent">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const { data: properties = [] } = trpc.properties.list.useQuery({});

  // Calculate trial status
  const trialEndDate = user?.trialEndDate ? new Date(user.trialEndDate) : null;
  const now = new Date();
  const daysRemaining = trialEndDate ? Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const isTrialActive = user?.isTrialActive && daysRemaining > 0;

  return (
    <>
      <SEO
        title="Agent Dashboard | Sheikh & Shah Properties"
        description="Manage your property listings and profile as an agent on Sheikh & Shah Properties"
        url="https://sheikhprop-p3nkkbke.manus.space/agent-dashboard"
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-foreground to-foreground/90 text-background py-8">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Agent Dashboard</h1>
                <p className="text-background/80">Manage your property listings and profile</p>
              </div>
              <Building2 size={48} className="opacity-50" />
            </div>
          </div>
        </div>

        <div className="container py-12">
          {/* Trial Status Card */}
          {isTrialActive && (
            <div className="mb-8 p-6 bg-accent/10 border border-accent rounded-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <CheckCircle size={24} className="text-accent mt-1" />
                  <div>
                    <h3 className="text-lg font-bold mb-1">Free Trial Active</h3>
                    <p className="text-sm text-muted-foreground">
                      You have <span className="font-bold text-accent">{daysRemaining} days</span> remaining in your free trial period
                    </p>
                  </div>
                </div>
                <Button className="bg-accent hover:bg-accent/90">
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          )}

          {daysRemaining <= 0 && user?.isTrialActive === false && !user?.isPremium && (
            <div className="mb-8 p-6 bg-destructive/10 border border-destructive rounded-xl">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <AlertCircle size={24} className="text-destructive mt-1" />
                  <div>
                    <h3 className="text-lg font-bold mb-1">Trial Expired</h3>
                    <p className="text-sm text-muted-foreground">
                      Your free trial has ended. Subscribe to continue posting properties.
                    </p>
                  </div>
                </div>
                <Button className="bg-destructive hover:bg-destructive/90">
                  Subscribe Now
                </Button>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Properties */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Total Properties</p>
                  <p className="text-3xl font-bold">{properties.length}</p>
                </div>
                <Building2 size={40} className="text-accent opacity-50" />
              </div>
            </div>

            {/* Active Listings */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Active Listings</p>
                  <p className="text-3xl font-bold">{properties.filter(p => p.status === 'available').length}</p>
                </div>
                <CheckCircle size={40} className="text-accent opacity-50" />
              </div>
            </div>

            {/* Trial Days Remaining */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Trial Days Left</p>
                  <p className="text-3xl font-bold">{Math.max(0, daysRemaining)}</p>
                </div>
                <Calendar size={40} className="text-accent opacity-50" />
              </div>
            </div>
          </div>

          {/* Add Property Button */}
          <div className="mb-8">
            <Button
              onClick={() => setLocation('/admin')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Property
            </Button>
          </div>

          {/* Properties List */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold">Your Properties</h2>
            </div>

            {properties.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(property => (
                      <tr key={property.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-semibold">{property.title}</td>
                        <td className="px-6 py-4 text-muted-foreground">{property.location}</td>
                        <td className="px-6 py-4 font-semibold">{property.price}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            property.status === 'available'
                              ? 'bg-green-100 text-green-800'
                              : property.status === 'sold'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit">
                              <Edit size={18} className="text-accent" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Delete">
                              <Trash2 size={18} className="text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Building2 size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No Properties Yet</h3>
                <p className="text-muted-foreground mb-6">Start by adding your first property listing</p>
                <Button
                  onClick={() => setLocation('/admin')}
                  className="bg-accent hover:bg-accent/90"
                >
                  Add Your First Property
                </Button>
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className="mt-12 bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Agent Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <p className="text-foreground">{user?.name || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <p className="text-foreground">{user?.email || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Company Name</label>
                <p className="text-foreground">{user?.companyName || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Phone</label>
                <p className="text-foreground">{user?.phone || 'Not set'}</p>
              </div>
            </div>
            <Button className="mt-6 bg-accent hover:bg-accent/90">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
