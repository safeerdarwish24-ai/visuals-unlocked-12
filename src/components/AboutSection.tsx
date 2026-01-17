import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Download, MapPin, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const skills = [
  { name: "React / Next.js", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Node.js", level: 85 },
  { name: "UI/UX Design", level: 88 },
  { name: "Tailwind CSS", level: 92 },
  { name: "Python / Django", level: 75 },
];

const stats = [
  { label: "Years Experience", value: 8 },
  { label: "Projects Completed", value: 150 },
  { label: "Happy Clients", value: 80 },
  { label: "Awards Won", value: 12 },
];

const CountUp = ({ target, duration = 2 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = target;
      const incrementTime = (duration * 1000) / end;
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
};

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.03),transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            About Me
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-4">
            Get to Know Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-accent to-accent-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Image & Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Image Container */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent to-accent-secondary rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-secondary">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-accent-secondary/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl font-display font-bold gradient-text opacity-50">D</div>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <motion.div
              className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-lg border border-border"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">San Francisco, CA</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-6 -left-6 bg-card p-4 rounded-xl shadow-lg border border-border"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-secondary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="font-semibold text-green-500">Open to work</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold">
              Passionate about creating{" "}
              <span className="gradient-text">beautiful</span> digital experiences
            </h3>
            
            <p className="text-muted-foreground leading-relaxed">
              With over 8 years of experience in web development and design, I specialize
              in creating stunning, user-centric digital products that not only look
              amazing but also deliver exceptional performance and usability.
            </p>
            
            <p className="text-muted-foreground leading-relaxed">
              My approach combines technical excellence with creative vision, ensuring
              every project exceeds expectations. I believe in clean code, thoughtful
              design, and continuous learning.
            </p>

            {/* Contact Info */}
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="w-5 h-5 text-accent" />
              <span>hello@darwish.dev</span>
            </div>

            <Button className="bg-gradient-to-r from-accent to-accent-secondary hover:opacity-90 text-primary gap-2 mt-4">
              <Download className="w-4 h-4" />
              Download Resume
            </Button>
          </motion.div>
        </div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Technical Skills</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-colors"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                <CountUp target={stat.value} />+
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
