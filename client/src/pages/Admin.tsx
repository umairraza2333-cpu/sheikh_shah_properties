import { useState } from 'react';
import { Plus, Edit2, Trash2, BarChart3, Package } from 'lucide-react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Link } from 'wouter';
import PropertyForm from '@/components/PropertyForm';
import ProjectForm from '@/components/ProjectForm';

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'properties' | 'projects' | 'inquiries'>('properties');
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);

  const { data: properties = [], refetch: refetchProperties } = trpc.properties.list.useQuery();
  const { data: projects = [], refetch: refetchProjects } = trpc.projects.list.useQuery();
  const { data: inquiries = [] } = trpc.inquiries.list.useQuery();

  const deletePropertyMutation = trpc.properties.delete.useMutation({
    onSuccess: () => {
      toast.success('Property deleted successfully');
      refetchProperties();
    },
  });

  const deleteProjectMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      toast.success('Project deleted successfully');
      refetchProjects();
    },
  });

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Access Denied</p>
          <p className="text-muted-foreground">You need admin privileges to access this page</p>
          <Link href="/" className="text-accent hover:underline mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-8">
        <div className="container">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-background/80">Manage properties, projects, and inquiries</p>
        </div>
      </div>

      <div className="container py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'properties'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'projects'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'inquiries'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Inquiries
          </button>
        </div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Properties</h2>
              <button
                onClick={() => setShowAddProperty(!showAddProperty)}
                className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                <span>Add Property</span>
              </button>
            </div>

            {/* Add Property Form */}
            {showAddProperty && (
              <div className="bg-card border border-border rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold mb-6">Create New Property</h3>
                <PropertyForm
                  onSuccess={() => {
                    setShowAddProperty(false);
                    refetchProperties();
                  }}
                />
              </div>
            )}

            {/* Properties Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Title</th>
                      <th className="px-6 py-3 text-left font-semibold">Price</th>
                      <th className="px-6 py-3 text-left font-semibold">Location</th>
                      <th className="px-6 py-3 text-left font-semibold">Status</th>
                      <th className="px-6 py-3 text-left font-semibold">Images</th>
                      <th className="px-6 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property) => (
                      <tr key={property.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-3">{property.title}</td>
                        <td className="px-6 py-3">{property.price}</td>
                        <td className="px-6 py-3">{property.location}</td>
                        <td className="px-6 py-3">
                          <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold">
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          {property.images && property.images.length > 0
                            ? `${property.images.length} image(s)`
                            : 'No images'}
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <button className="p-2 text-muted-foreground hover:text-accent transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deletePropertyMutation.mutate(property.id)}
                            className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {properties.length === 0 && (
                <div className="p-6 text-center text-muted-foreground">
                  <Package size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No properties yet. Add your first property to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Projects</h2>
              <button
                onClick={() => setShowAddProject(!showAddProject)}
                className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:shadow-lg transition-all"
              >
                <Plus size={20} />
                <span>Add Project</span>
              </button>
            </div>

            {/* Add Project Form */}
            {showAddProject && (
              <div className="bg-card border border-border rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold mb-6">Create New Project</h3>
                <ProjectForm
                  onSuccess={() => {
                    setShowAddProject(false);
                    refetchProjects();
                  }}
                />
              </div>
            )}

            {/* Projects Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Name</th>
                      <th className="px-6 py-3 text-left font-semibold">Location</th>
                      <th className="px-6 py-3 text-left font-semibold">Status</th>
                      <th className="px-6 py-3 text-left font-semibold">Units</th>
                      <th className="px-6 py-3 text-left font-semibold">Images</th>
                      <th className="px-6 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-3">{project.name}</td>
                        <td className="px-6 py-3">{project.location}</td>
                        <td className="px-6 py-3">
                          <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold">
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">
                          {project.completedUnits || 0}/{project.totalUnits || 0}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          {project.images && project.images.length > 0
                            ? `${project.images.length} image(s)`
                            : 'No images'}
                        </td>
                        <td className="px-6 py-3 flex gap-2">
                          <button className="p-2 text-muted-foreground hover:text-accent transition-colors">
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteProjectMutation.mutate(project.id)}
                            className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {projects.length === 0 && (
                <div className="p-6 text-center text-muted-foreground">
                  <Package size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No projects yet. Add your first project to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Inquiries</h2>

            {/* Inquiries Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Name</th>
                      <th className="px-6 py-3 text-left font-semibold">Phone</th>
                      <th className="px-6 py-3 text-left font-semibold">Type</th>
                      <th className="px-6 py-3 text-left font-semibold">Status</th>
                      <th className="px-6 py-3 text-left font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inquiry) => (
                      <tr key={inquiry.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-3">{inquiry.name}</td>
                        <td className="px-6 py-3">{inquiry.phone}</td>
                        <td className="px-6 py-3 text-sm">{inquiry.inquiryType.replace('_', ' ')}</td>
                        <td className="px-6 py-3">
                          <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold">
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-muted-foreground">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {inquiries.length === 0 && (
                <div className="p-6 text-center text-muted-foreground">
                  <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No inquiries yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
