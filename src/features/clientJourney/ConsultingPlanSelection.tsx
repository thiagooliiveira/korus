import React from 'react';
import { motion } from 'motion/react';
import { Check, Star, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  benefits: string[];
  icon: any;
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Consultoria Básica',
    description: 'Ideal para quem já tem experiência e precisa apenas de uma revisão final.',
    price: 'R$ 497',
    benefits: [
      'Revisão de formulários',
      'Checklist de documentos',
      'Suporte via e-mail',
      'Acesso à plataforma',
    ],
    icon: Zap,
  },
  {
    id: 'complete',
    name: 'Consultoria Completa',
    description: 'Acompanhamento total do início ao fim do seu processo de visto.',
    price: 'R$ 1.497',
    benefits: [
      'Tudo do plano Básico',
      'Preenchimento de formulários',
      'Simulado de entrevista',
      'Suporte via WhatsApp',
      'Análise de perfil detalhada',
    ],
    icon: Star,
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Consultoria Premium',
    description: 'Experiência exclusiva com atendimento prioritário e concierge.',
    price: 'R$ 2.997',
    benefits: [
      'Tudo do plano Completo',
      'Atendimento prioritário',
      'Concierge para agendamentos',
      'Tradução de documentos inclusa',
      'Consultoria de imigração personalizada',
    ],
    icon: ShieldCheck,
  },
];

interface Props {
  onSelect: (plan: any) => void;
  plans?: any[];
}

export const ConsultingPlanSelection: React.FC<Props> = ({ onSelect, plans }) => {
  const displayPlans = plans && plans.length > 0 ? plans : PLANS;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 max-w-2xl relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
          <Zap size={14} />
          Escolha seu Plano
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 leading-tight">
          A consultoria ideal para o <span className="brand-text-gradient">seu sucesso.</span>
        </h1>
        <p className="text-zinc-400 text-lg font-medium">
          Selecione o nível de suporte que você deseja para sua jornada internacional.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl relative z-10">
        {displayPlans.map((plan, index) => {
          const Icon = plan.icon === 'Star' ? Star : plan.icon === 'ShieldCheck' ? ShieldCheck : Zap;
          const features = Array.isArray(plan.features) ? plan.features : (plan.benefits || []);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative p-8 rounded-[40px] border transition-all flex flex-col ${
                plan.recommended || plan.is_recommended
                  ? 'bg-zinc-900/60 border-emerald-500/50 shadow-[0_0_50px_rgba(0,255,136,0.1)]' 
                  : 'bg-zinc-900/40 border-white/5 hover:border-white/10'
              }`}
            >
              {(plan.recommended || plan.is_recommended) && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest">
                  Recomendado
                </div>
              )}

              <div className="mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  plan.recommended || plan.is_recommended ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-emerald-400'
                }`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-2">{plan.name}</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black tracking-tighter">
                    {typeof plan.price === 'number' ? `R$ ${plan.price}` : plan.price}
                  </span>
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">/ processo</span>
                </div>
                
                <div className="space-y-4">
                  {features.map((benefit: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-emerald-400" />
                      </div>
                      <span className="text-zinc-400 text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onSelect(plan)}
                className={`mt-auto w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all group ${
                  plan.recommended || plan.is_recommended
                    ? 'brand-gradient text-black hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]' 
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                Selecionar Plano
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
