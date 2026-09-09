'use client';

import { motion } from 'framer-motion';
import { Briefcase, Building2, Stethoscope, GraduationCap, Video } from 'lucide-react';

const useCases = [
  {
    title: 'Founders',
    description: 'Handle investor and client queries while you focus on building.',
    icon: Briefcase
  },
  {
    title: 'Agencies',
    description: 'Manage multiple client conversations across your team.',
    icon: Building2
  },
  {
    title: 'Doctors',
    description: 'Triage patient inquiries and manage appointment requests.',
    icon: Stethoscope
  },
  {
    title: 'Freelancers',
    description: 'Never miss a lead while you\'re deep in project work.',
    icon: GraduationCap
  },
  {
    title: 'Creators',
    description: 'Engage your audience while creating content.',
    icon: Video
  }
];

export default function UseCases() {
  return (
    <section className="py-[120px]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#25D366]/60 mb-4">
            Built For
          </p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Works for every professional
          </h2>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-12">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            
            return (
              <motion.div
                key={index}
                className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-200 group text-center flex flex-col items-center"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-white/30 group-hover:text-[#25D366]/70 transition-colors" />
                </div>
                
                <h3 className="text-sm font-semibold text-white">
                  {useCase.title}
                </h3>
                <p className="text-xs text-white/35 mt-1.5 leading-relaxed">
                  {useCase.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
