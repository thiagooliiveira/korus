import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Globe } from 'lucide-react';
import { Destination } from '../../types';

const DEFAULT_DESTINATIONS: Destination[] = [
  {
    id: 1,
    agency_id: 0,
    name: 'Estados Unidos',
    code: 'US',
    flag: '🇺🇸',
    description: 'Oportunidades ilimitadas no maior mercado do mundo. Vistos de turismo, negócios e imigração.',
    image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80',
    highlight_points: ['Turismo', 'Negócios', 'Imigração'],
    is_active: true,
    order: 1,
    created_at: '',
  },
  {
    id: 2,
    agency_id: 0,
    name: 'Canadá',
    code: 'CA',
    flag: '🇨🇦',
    description: 'Qualidade de vida e acolhimento. Explore caminhos para estudo, trabalho e residência permanente.',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80',
    highlight_points: ['Estudo', 'Trabalho', 'Residência'],
    is_active: true,
    order: 2,
    created_at: '',
  },
  {
    id: 3,
    agency_id: 0,
    name: 'Austrália',
    code: 'AU',
    flag: '🇦🇺',
    description: 'Estilo de vida único e economia forte. Vistos de estudante, trabalho qualificado e turismo.',
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80',
    highlight_points: ['Estudante', 'Trabalho Qualificado', 'Turismo'],
    is_active: true,
    order: 3,
    created_at: '',
  },
];

interface Props {
  onSelect: (destination: Destination) => void;
  destinations?: Destination[];
}

export const ClientDestinationSelection: React.FC<Props> = ({ onSelect, destinations }) => {
  const displayDestinations = destinations && destinations.length > 0 ? destinations.filter(d => d.is_active) : DEFAULT_DESTINATIONS;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 sm:p-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
          <Globe size={14} />
          Sua Jornada Internacional Começa Aqui
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 leading-tight">
          Para onde você deseja <span className="brand-text-gradient">expandir seu mundo?</span>
        </h1>
        <p className="text-zinc-400 text-lg font-medium">
          Selecione seu destino e nossa equipe de especialistas cuidará de cada detalhe do seu processo.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {displayDestinations.map((dest, index) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="group relative h-[500px] rounded-[40px] overflow-hidden cursor-pointer border border-white/5 bg-zinc-900/50 backdrop-blur-sm"
            onClick={() => onSelect(dest)}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={dest.image} 
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-10">
              <div className="text-5xl mb-6">{dest.flag}</div>
              <h2 className="text-3xl font-black tracking-tighter mb-4">{dest.name}</h2>
              <p className="text-zinc-400 font-medium mb-8 line-clamp-3 group-hover:text-zinc-200 transition-colors">
                {dest.description}
              </p>
              
              <div className="flex items-center justify-between">
                <button className="brand-gradient text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all">
                  Iniciar Processo
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Subtle Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
};
