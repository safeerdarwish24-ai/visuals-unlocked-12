import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Github, X, Plus, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { useImageStorageContext } from "@/contexts/ImageStorageContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const categories = ["All", "Web", "Mobile", "UI/UX", "E-Commerce"];

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
}

const defaultProjects: Project[] = [
  {
    id: 1,
    title: "Modern E-Commerce Platform",
    category: "E-Commerce",
    description: "A full-featured e-commerce platform with real-time inventory, secure payments, and admin dashboard.",
    tags: ["Next.js", "Stripe", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 2,
    title: "Social Media Dashboard",
    category: "Web",
    description: "Analytics dashboard for social media managers with real-time data visualization.",
    tags: ["React", "D3.js", "Node.js"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "Fitness Tracking App",
    category: "Mobile",
    description: "Cross-platform fitness app with workout tracking, progress charts, and social features.",
    tags: ["React Native", "Firebase", "HealthKit"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 4,
    title: "Finance App Redesign",
    category: "UI/UX",
    description: "Complete redesign of a banking app focusing on user experience and accessibility.",
    tags: ["Figma", "Prototyping", "User Research"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 5,
    title: "Real Estate Platform",
    category: "Web",
    description: "Property listing platform with virtual tours, advanced filters, and agent dashboards.",
    tags: ["Vue.js", "Google Maps", "MongoDB"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 6,
    title: "Food Delivery App",
    category: "Mobile",
    description: "On-demand food delivery app with real-time order tracking and restaurant management.",
    tags: ["Flutter", "Node.js", "Socket.io"],
    liveUrl: "#",
    githubUrl: "#",
  },
];

export const PortfolioSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { getImage, uploadImage, removeImage } = useImageStorageContext();

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const handleProjectImageUpload = async (projectId: number, file: File) => {
    await uploadImage(`project_${projectId}`, file);
  };

  const handleProjectImageRemove = (projectId: number) => {
    removeImage(`project_${projectId}`);
  };

  const getProjectImage = (projectId: number) => {
    const stored = getImage(`project_${projectId}`);
    if (stored) return stored.url;
    // Return default placeholder based on project
    const defaultImages = [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
    ];
    return defaultImages[(projectId - 1) % defaultImages.length];
  };

  const addNewProject = () => {
    const newId = Math.max(...projects.map(p => p.id), 0) + 1;
    const newProject: Project = {
      id: newId,
      title: "New Project",
      category: "Web",
      description: "Click to edit this project description.",
      tags: ["Tag 1", "Tag 2"],
      liveUrl: "#",
      githubUrl: "#",
    };
    setProjects([...projects, newProject]);
    setEditingProject(newProject);
    setIsEditing(true);
  };

  const updateProject = (updated: Project) => {
    setProjects(projects.map(p => p.id === updated.id ? updated : p));
    setEditingProject(null);
    setIsEditing(false);
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
    removeImage(`project_${id}`);
    setSelectedProject(null);
  };

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A selection of my recent work across various industries and technologies
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-accent to-accent-secondary mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-accent to-accent-secondary text-primary"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
          
          {/* Add Project Button */}
          <motion.button
            onClick={addNewProject}
            className="px-5 py-2 rounded-full text-sm font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4" />
            Add Project
          </motion.button>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border">
                  {/* Image with Upload */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageUpload
                      imageUrl={getProjectImage(project.id)}
                      onUpload={(file) => handleProjectImageUpload(project.id, file)}
                      onRemove={() => handleProjectImageRemove(project.id)}
                      shape="square"
                      aspectRatio="landscape"
                      showOverlay={true}
                      className="w-full h-full"
                    />
                    
                    {/* Project Info Overlay */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 cursor-pointer pointer-events-none group-hover:pointer-events-auto"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="text-primary-foreground">
                        <p className="text-sm font-medium text-accent mb-2">
                          {project.category}
                        </p>
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <div className="flex gap-2 flex-wrap">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-primary-foreground/20 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                        setIsEditing(true);
                      }}
                      className="p-2 rounded-full bg-background/90 text-foreground hover:bg-background"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {isEditing && editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full bg-card rounded-2xl overflow-hidden shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold mb-6">Edit Project</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background"
                  >
                    {categories.filter(c => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags (comma separated)</label>
                  <Input
                    value={editingProject.tags.join(", ")}
                    onChange={(e) => setEditingProject({ 
                      ...editingProject, 
                      tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Live URL</label>
                    <Input
                      value={editingProject.liveUrl}
                      onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">GitHub URL</label>
                    <Input
                      value={editingProject.githubUrl}
                      onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => updateProject(editingProject)}
                    className="flex-1 bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 text-primary"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && !isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <img
                src={getProjectImage(selectedProject.id)}
                alt={selectedProject.title}
                className="w-full h-64 object-cover"
              />

              {/* Content */}
              <div className="p-8">
                <span className="text-accent text-sm font-medium">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl font-bold mt-2 mb-4">
                  {selectedProject.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {selectedProject.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button className="bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 text-primary gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View Live
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Github className="w-4 h-4" />
                    Source Code
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
