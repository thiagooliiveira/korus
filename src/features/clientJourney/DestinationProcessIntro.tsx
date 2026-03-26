import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, ClipboardList, Search, FileText, CreditCard, LayoutDashboard } from 'lucide-react';

interface Props {
  destination: {
    name: string;
  };
  onStart: () => void;
}

const STEPS = [
  { icon: ClipboardList, title: 'Pré-formulário', description: 'Coleta inicial de dados para análise de perfil.' },
  { icon: Search, title: 'Análise da Consultoria', description: 'Nossos especialistas avaliam suas chances e melhores caminhos.' },
  { icon: FileText, title: 'Preparação de Documentos', description: 'Orientação completa sobre toda a documentação necessária.' },
  { icon: CreditCard, title: 'Pagamento', description: 'Confirmação do plano escolhido para início imediato.' },
  { icon: LayoutDashboard, title: 'Acompanhamento', description: 'Acesso total ao status do seu processo em tempo real.' },
];

export const DestinationProcessIntro: React.FC<Props> = ({ destination, onStart }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-zinc-900/40 backdrop-blur-2xl rounded-[40px] border border-white/5 p-8 sm:p-16 relative z-10 shadow-2xl"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-6"
          >
            <CheckCircle2 size={14} />
            Destino Confirmado
          </motion.div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6">
            Seu processo para <span className="brand-text-gradient">{destination.name}</span> começa aqui.
          </h1>
          <p className="text-zinc-400 text-lg font-medium max-w-2xl mx-auto">
            Entenda como funciona nossa jornada de consultoria premium para garantir o sucesso do seu visto internacional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-3xl bg-zinc-800/30 border border-white/5 hover:border-emerald-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <step.icon size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-black mb-2">{step.title}</h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto brand-gradient text-black px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(0,255,136,0.4)] transition-all group"
          >
            Começar meu processo
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            Tempo estimado: 5 minutos
          </p>
        </div>
      </motion.div>
    </div>
  );
};
