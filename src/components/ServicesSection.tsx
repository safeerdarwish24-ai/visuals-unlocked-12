import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Palette, Smartphone, Globe, Rocket, Database } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Building high-performance web applications with modern technologies like React, Next.js, and TypeScript.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Creating intuitive and beautiful user interfaces that prioritize user experience and accessibility.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description:
      "Developing cross-platform mobile applications using React Native for iOS and Android.",
    gradient: "from-green-500 to-teal-500",
  },
  {
    icon: Globe,
    title: "E-Commerce Solutions",
    description:
      "Building scalable online stores with secure payment integration and inventory management.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Rocket,
    title: "Performance Optimization",
    description:
      "Optimizing website speed, SEO, and Core Web Vitals for better user experience and rankings.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Database,
    title: "Backend Development",
    description:
      "Designing robust APIs and database architectures with Node.js, Python, and PostgreSQL.",
    gradient: "from-yellow-500 to-orange-500",
  },
];

export const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section id="services" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.05),transparent_50%)]" />

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-medium tracking-wider uppercase text-sm">
            What I Do
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-3 mb-4">
            Services & Expertise
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to elevate your brand and achieve
            your business goals
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-accent to-accent-secondary mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-accent-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-card p-8 rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 h-full">
                {/* Icon */}
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.gradient} p-3 mb-6`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <service.icon className="w-full h-full text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Hover Arrow */}
                <motion.div
                  className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
