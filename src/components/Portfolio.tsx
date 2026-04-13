'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLanguage } from '@/contexts/LanguageContext';

interface Client {
  _id: string;
  name: string;
  logo?: string;
  category: string;
  description?: string;
  blogText?: string;
  workImages?: string[];
  services?: string[];
  slug?: string;
}

const categories = [
  'Automotive',
  'Communication',
  'Corporate',
  'Food & Beverages',
  'Construction & Real Estate',
  'Health',
  'Governmental',
  'Fashion & Beauty',
  'Home & Furniture',
  'Hospitality & Entertainment',
  'Sports',
];

export default function Portfolio() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { t, isRTL } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/clients');
        const data = await res.json();
        console.log('[Portfolio] Fetched clients:', data.clients?.length || 0); // Debug log
        setClients(data.clients || []);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setClients([]);
      }
    };
    
    fetchClients();
  }, []);

  const filteredClients =
    selectedCategory === 'All'
      ? clients
      : clients.filter((client) => client.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section id="clients" className="py-24 bg-gradient-to-br from-gray-50 via-white to-secondary/20 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(122, 30, 46, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 
              className="text-5xl sm:text-6xl lg:text-7xl font-heading text-gray-900 mb-6 uppercase tracking-tighter"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              {t.portfolio.title}
            </h2>
            <p 
              className="text-xl text-gray-600 max-w-3xl mx-auto  mb-6"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              {t.portfolio.description}
            </p>
            {/* View 3D Portfolio Button */}
            <motion.a
              href="/portfolio"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-[#9a2d45] text-white px-8 py-4 rounded-lg font-heading uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all duration-300"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 7.414V9a1 1 0 01-2 0V5zM15 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L17.586 5H16a1 1 0 01-1-1zM4 15a1 1 0 011 1v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 19H9a1 1 0 010 2H5a1 1 0 01-1-1v-4a1 1 0 011-1zM19 15a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h2.586l-2.293-2.293a1 1 0 111.414-1.414L19 17.586V16a1 1 0 011-1z" />
              </svg>
              {isRTL ? 'عرض محفظة 3D التفاعلية' : 'View 3D Portfolio'}
            </motion.a>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-2 rounded-full font-heading transition-all uppercase tracking-wider ${
                selectedCategory === 'All'
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              {t.portfolio.all}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-heading transition-all uppercase tracking-wider ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Clients Grid */}
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
          >
            {filteredClients.map((client) => (
              <motion.a
                key={client._id}
                href={client.slug ? `/portfolio/${client.slug}` : `/portfolio?client=${client._id}`}
                layout
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl hover:shadow-2xl transition-all hover:scale-105 cursor-pointer flex items-center justify-center aspect-square border-2 border-gray-200 dark:border-gray-700 hover:border-primary group relative overflow-hidden"
              >
                {/* Enhanced logo visibility */}
                <div className="text-center relative z-10 w-full h-full flex items-center justify-center">
                  {client.logo ? (
                    <>
                      {/* Background overlay for better contrast */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                      <img
                        src={client.logo}
                        alt={client.name}
                        className="relative z-10 w-full h-full max-w-[90%] max-h-[90%] object-contain transition-all duration-300 drop-shadow-2xl group-hover:scale-110"
                        style={{
                          filter: 'brightness(1.1) contrast(1.3) saturate(1.2)',
                          WebkitFilter: 'brightness(1.1) contrast(1.3) saturate(1.2)',
                        }}
                      />
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="text-gray-600 dark:text-gray-300 font-semibold text-sm group-hover:text-primary transition-colors">
                      {client.name}
                    </div>
                  )}
                </div>
                {/* Share icon */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <div className="bg-primary/90 text-white p-1.5 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {clients.length === 0
                  ? 'Loading clients...'
                  : 'No clients found in this category.'}
              </p>
            </div>
          )}
        </motion.div>

        {/* Join Our Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-3xl p-12 border-2 border-primary/30 dark:border-primary/40">
            <motion.h3
              className="text-4xl sm:text-5xl font-heading text-gray-900 dark:text-white mb-4 uppercase tracking-tighter"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {t.portfolio.joinTeam}
            </motion.h3>
            <p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 "
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
            >
              {t.portfolio.joinTeamDesc}
            </p>
            <motion.a
              href="/join-team"
              className="inline-block bg-primary text-white px-12 py-5 rounded-lg font-heading uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all duration-300"
              style={{ fontFamily: isRTL ? 'IBM Plex Sans Arabic, sans-serif' : 'IBM Plex Sans, sans-serif' }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              {t.portfolio.joinTeam}
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block ml-2"
              >
                →
              </motion.span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

