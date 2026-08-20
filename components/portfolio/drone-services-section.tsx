import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/layout/reveal";
import { Building2, Video, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

export function DroneServicesSection() {
  const services = [
    {
      id: "property",
      title: "Property Aerial",
      icon: Building2,
      price: "From Rp X",
      features: ["Aerial photos", "High-res Video", "Real Estate & Construction"],
      cta: "Details",
      href: "/contact" // Or specific section if needed later
    },
    {
      id: "cinematic",
      title: "FPV Cinematic",
      icon: Video,
      price: "From Rp X",
      features: ["FPV cinematic runs", "Tourism & Events", "Dynamic tracking shots"],
      cta: "Details",
      href: "/contact"
    },
    {
      id: "custom",
      title: "Custom / Commercial",
      icon: Briefcase,
      price: "Let's discuss",
      features: ["Custom requirements", "Specific gear setup", "Complex maneuvers"],
      cta: "Contact",
      href: "/contact"
    }
  ];

  return (
    <Section space="xl" className="py-24 bg-white dark:bg-black border-y border-neutral-200 dark:border-neutral-800">
      <div className="container-wide">
        <Reveal>
          <div className="max-w-3xl mb-16 text-center mx-auto">
            <h2 className="text-sm font-semibold tracking-widest uppercase text-neutral-500 mb-4">Drone Services</h2>
            <h3 className="font-serif text-4xl md:text-5xl font-normal text-black dark:text-white tracking-tight mb-6">
              Need aerial footage for your project?
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              I provide aerial photography and FPV cinematic filming for commercial projects, properties, tourism, and events.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service) => (
              <div key={service.id} className="editorial-card p-8 flex flex-col h-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all hover:-translate-y-1 hover:shadow-lg rounded-2xl">
                <div className="mb-6 flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-black rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <service.icon className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-black dark:text-white">{service.title}</h4>
                    <p className="text-sm font-semibold text-neutral-500 mt-1 uppercase tracking-wider">{service.price}</p>
                  </div>
                </div>

                <ul className="flex-1 space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-neutral-600 dark:text-neutral-400 text-sm">
                      <span className="mr-2 text-neutral-300 dark:text-neutral-700">•</span> {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={service.href}
                  className="mt-auto group flex items-center justify-between text-sm font-medium text-black dark:text-white hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors pt-4 border-t border-neutral-200 dark:border-neutral-800"
                >
                  {service.cta}
                  <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}