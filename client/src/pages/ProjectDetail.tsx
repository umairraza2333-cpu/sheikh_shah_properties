import { useRoute } from 'wouter';
import { trpc } from '@/lib/trpc';
import { MapPin, Calendar, Building2, Users } from 'lucide-react';

export default function ProjectDetail() {
  const [match, params] = useRoute('/projects/:id');
  const projectId = params?.id ? parseInt(params.id) : null;

  const { data: project, isLoading, error } = trpc.projects.byId.useQuery(projectId || 0, {
    enabled: !!projectId,
  });

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
          <a
            href="/projects"
            className="inline-block bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Back to Projects
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-8">
        <div className="container">
          <a href="/projects" className="text-background/80 hover:text-background mb-4 inline-block">
            ← Back to Projects
          </a>
          <h1 className="text-4xl md:text-5xl font-bold">{project.name}</h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {(() => {
              const images = Array.isArray(project.images) ? project.images : [];
              return images.length > 0 ? (
                <div className="mb-8">
                  <div className="relative h-96 bg-muted rounded-xl overflow-hidden mb-4">
                    <img
                      src={images[0]}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {images.slice(0, 4).map((image: string, index: number) => (
                        <div key={index} className="h-24 bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                          <img
                            src={image}
                            alt={`${project.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null;
            })()}

            {/* Project Information */}
            <div className="bg-card border border-border rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Project Overview</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{project.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold capitalize">
                      {project.status === 'completed' ? '✓ Completed' : 'Ongoing'}
                    </p>
                  </div>
                </div>

                {project.totalUnits && (
                  <div className="flex items-start gap-3">
                    <Users size={24} className="text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Units</p>
                      <p className="font-semibold">{project.totalUnits}</p>
                    </div>
                  </div>
                )}

                {project.startDate && (
                  <div className="flex items-start gap-3">
                    <Calendar size={24} className="text-accent flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-semibold">
                        {new Date(project.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {project.totalUnits && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Project Progress</h3>
                    <span className="text-sm text-muted-foreground">
                      {project.completedUnits || 0} of {project.totalUnits} units completed
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-accent h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${((project.completedUnits || 0) / project.totalUnits) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Description */}
              {project.description && (
                <div>
                  <h3 className="font-semibold mb-3">About This Project</h3>
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-8 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Interested?</h3>

              <div className="space-y-4">
                <a
                  href={`https://wa.me/923392001927?text=Hi, I'm interested in ${project.name} project`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.782 1.14l-.46.264-4.771-.79 1.02 3.712c-.576 1.341-.893 2.823-.893 4.402 0 4.991 4.063 9.054 9.054 9.054 2.424 0 4.709-.936 6.412-2.632 1.703-1.697 2.638-3.98 2.638-6.412 0-5.091-4.063-9.054-9.054-9.054z" />
                  </svg>
                  WhatsApp Inquiry
                </a>

                <a
                  href="/contact"
                  className="flex items-center justify-center w-full bg-muted text-foreground py-3 rounded-lg font-semibold hover:bg-muted/80 transition-all"
                >
                  Contact Us
                </a>
              </div>

              {/* Project Stats */}
              <div className="mt-8 pt-8 border-t border-border">
                <h4 className="font-semibold mb-4">Quick Facts</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project Type</span>
                    <span className="font-semibold capitalize">{project.status}</span>
                  </div>
                  {project.totalUnits && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Units</span>
                      <span className="font-semibold">{project.totalUnits}</span>
                    </div>
                  )}
                  {project.completedUnits && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed Units</span>
                      <span className="font-semibold">{project.completedUnits}</span>
                    </div>
                  )}
                  {project.startDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Started</span>
                      <span className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
