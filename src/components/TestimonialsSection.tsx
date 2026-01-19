import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star, Plus, Trash2, Edit3, X } from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { useImageStorageContext } from "@/contexts/ImageStorageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
    content:
      "Darwish exceeded all expectations. The website he built for us increased our conversion rate by 150%. His attention to detail and creative solutions are unmatched.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder, DesignHub",
    content:
      "Working with Darwish was a game-changer for our startup. He delivered a beautiful, functional app in record time. Highly recommended for any serious project.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Marketing Director, GrowthCo",
    content:
      "The e-commerce platform Darwish developed has transformed our business. Sales have doubled and our customers love the seamless shopping experience.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Park",
    role: "CTO, InnovateTech",
    content:
      "Exceptional technical skills combined with great communication. Darwish understood our complex requirements and delivered a scalable solution.",
    rating: 5,
  },
];

const defaultAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
];

export const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { getImage, uploadImage, removeImage } = useImageStorageContext();
  const { isAdmin } = useAuth();

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getTestimonialAvatar = (id: number) => {
    const stored = getImage(`testimonial_${id}`);
    if (stored) return stored.url;
    return defaultAvatars[(id - 1) % defaultAvatars.length];
  };

  const handleAvatarUpload = async (id: number, file: File) => {
    await uploadImage(`testimonial_${id}`, file);
  };

  const handleAvatarRemove = (id: number) => {
    removeImage(`testimonial_${id}`);
  };

  const addNewTestimonial = () => {
    const newId = Math.max(...testimonials.map(t => t.id), 0) + 1;
    const newTestimonial: Testimonial = {
      id: newId,
      name: "New Client",
      role: "Position, Company",
      content: "Click to edit this testimonial.",
      rating: 5,
    };
    setTestimonials([...testimonials, newTestimonial]);
    setCurrentIndex(testimonials.length);
    setEditingTestimonial(newTestimonial);
    setIsEditing(true);
  };

  const updateTestimonial = (updated: Testimonial) => {
    setTestimonials(testimonials.map(t => t.id === updated.id ? updated : t));
    setEditingTestimonial(null);
    setIsEditing(false);
  };

  const deleteTestimonial = (id: number) => {
    const newTestimonials = testimonials.filter(t => t.id !== id);
    setTestimonials(newTestimonials);
    removeImage(`testimonial_${id}`);
    if (currentIndex >= newTestimonials.length) {
      setCurrentIndex(Math.max(0, newTestimonials.length - 1));
    }
  };

  if (testimonials.length === 0) {
    return (
      <section id="testimonials" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-display font-bold mb-8">Testimonials</h2>
          <p className="text-muted-foreground mb-8">No testimonials yet.</p>
          {isAdmin && (
            <Button onClick={addNewTestimonial} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Testimonial
            </Button>
          )}
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--accent)/0.05),transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-4">
            What Clients Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take my word for it — hear from the people I've worked with
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-accent to-accent-secondary mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            {/* Main Card */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent to-accent-secondary flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Action Buttons - Admin Only */}
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    onClick={() => {
                      setEditingTestimonial(currentTestimonial);
                      setIsEditing(true);
                    }}
                    className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => deleteTestimonial(currentTestimonial.id)}
                    className="p-2 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

              {/* Rating */}
              <div className="flex gap-1 mb-6 pt-4">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>

              {/* Content */}
              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                "{currentTestimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                {isAdmin ? (
                  <ImageUpload
                    imageUrl={getTestimonialAvatar(currentTestimonial.id)}
                    onUpload={(file) => handleAvatarUpload(currentTestimonial.id, file)}
                    onRemove={() => handleAvatarRemove(currentTestimonial.id)}
                    shape="circle"
                    size="sm"
                    className="w-14 h-14 border-2 border-accent/20"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full border-2 border-accent/20 overflow-hidden">
                    <img
                      src={getTestimonialAvatar(currentTestimonial.id)}
                      alt={currentTestimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-foreground">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {currentTestimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <motion.button
                onClick={prev}
                className="p-3 rounded-full bg-card border border-border hover:border-accent/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              
              {/* Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-gradient-to-r from-accent to-accent-secondary"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
              
              <motion.button
                onClick={next}
                className="p-3 rounded-full bg-card border border-border hover:border-accent/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>

              {/* Add Button - Admin Only */}
              {isAdmin && (
                <motion.button
                  onClick={addNewTestimonial}
                  className="p-3 rounded-full bg-accent/10 border border-accent/30 hover:bg-accent/20 text-accent transition-colors ml-4"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Testimonial Modal */}
      {isEditing && editingTestimonial && (
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

            <h3 className="text-xl font-bold mb-6">Edit Testimonial</h3>
            
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <ImageUpload
                  imageUrl={getTestimonialAvatar(editingTestimonial.id)}
                  onUpload={(file) => handleAvatarUpload(editingTestimonial.id, file)}
                  onRemove={() => handleAvatarRemove(editingTestimonial.id)}
                  shape="circle"
                  size="lg"
                  placeholder={
                    <div className="flex flex-col items-center">
                      <span className="text-2xl">👤</span>
                      <span className="text-xs text-muted-foreground mt-1">Upload Photo</span>
                    </div>
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Name</label>
                <Input
                  value={editingTestimonial.name}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Role / Position</label>
                <Input
                  value={editingTestimonial.role}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Testimonial</label>
                <Textarea
                  value={editingTestimonial.content}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setEditingTestimonial({ ...editingTestimonial, rating })}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          rating <= editingTestimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => updateTestimonial(editingTestimonial)}
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
    </section>
  );
};
