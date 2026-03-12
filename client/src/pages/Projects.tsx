import { Building2, MapPin, CheckCircle, Clock } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';

export default function Projects() {
  const [, setLocation] = useLocation();
  const { data: projects = [] } = trpc.projects.list.useQuery();

  const ongoingProjects = projects.filter(p => p.status === 'ongoing');
  const completedProjects = projects.filter(p => p.status === 'completed');

  const ProjectCard = ({ project }: { project: any }) => (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {(() => {
          const imageUrl = Array.isArray(project.images) && project.images.length > 0 ? project.images[0] : project.imageUrl;
          return imageUrl ? (
            <img
              src={imageUrl}
              alt={project.name}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
              <Building2 size={48} className="text-muted-foreground" />
            </div>
          );
        })()}
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
          {project.status === 'completed' ? (
            <>
              <CheckCircle size={16} className="text-green-500" />
              <span>Completed</span>
            </>
          ) : (
            <>
              <Clock size={16} className="text-accent" />
              <span>Ongoing</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.name}</h3>

        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin size={16} />
          <span className="text-sm">{project.location}</span>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>

        {project.totalUnits && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">
                {project.completedUnits || 0}/{project.totalUnits} Units
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((project.completedUnits || 0) / project.totalUnits) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        <button 
          onClick={() => setLocation(`/projects/${project.id}`)}
          className="w-full bg-accent text-accent-foreground py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        >
          Learn More
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Our Projects</h1>
          <p className="text-background/80 text-lg">Explore our premium development projects across Karachi</p>
        </div>
      </div>

      <div className="container py-12">
        {/* Ongoing Projects */}
        {ongoingProjects.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Ongoing Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Projects */}
        {completedProjects.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Completed Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No projects available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
