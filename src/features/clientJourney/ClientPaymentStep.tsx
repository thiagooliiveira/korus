import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, ShieldCheck, ArrowRight, CheckCircle2, Globe, Star, Zap, ShieldCheck as ShieldCheckIcon } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Star,
  ShieldCheck: ShieldCheckIcon,
  Zap
};

interface Props {
  destination: { name: string; flag: string };
  plan: { name: string; price: string; icon: any };
  onComplete: () => void;
}

export const ClientPaymentStep: React.FC<Props> = ({ destination, plan, onComplete }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      await onComplete();
    } finally {
      setIsProcessing(false);
    }
  };

  const PlanIcon = typeof plan.icon === 'string' ? (ICON_MAP[plan.icon] || Zap) : (plan.icon || Zap);

  if (!destination || !plan) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-zinc-900/40 backdrop-blur-2xl rounded-[40px] border border-white/5 p-8 sm:p-16 relative z-10 shadow-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: Summary */}
          <div className="space-y-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
                <ShieldCheck size={14} />
                Pagamento Seguro
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">
                Resumo da sua <span className="brand-text-gradient">consultoria.</span>
              </h1>
              <p className="text-zinc-400 text-lg font-medium">
                Confirme os detalhes do seu processo antes de prosseguir para o pagamento.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 rounded-3xl bg-zinc-800/30 border border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-2xl">
                  {destination.flag}
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Destino Escolhido</p>
                  <h3 className="text-xl font-black">{destination.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-4 p-6 rounded-3xl bg-zinc-800/30 border border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <PlanIcon size={24} />
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Plano Selecionado</p>
                  <h3 className="text-xl font-black">{plan.name}</h3>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-zinc-500 text-sm font-medium">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Garantia de satisfação Korus
            </div>
          </div>

          {/* Right: Payment Card */}
          <div className="bg-zinc-800/40 border border-white/5 rounded-[40px] p-10 flex flex-col">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <CreditCard className="text-zinc-500" />
                <span className="text-zinc-400 font-bold text-sm">Cartão de Crédito</span>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-zinc-700 rounded-sm" />
                <div className="w-8 h-5 bg-zinc-700 rounded-sm" />
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <div className="flex justify-between items-center text-zinc-400 font-medium">
                <span>Subtotal</span>
                <span>{typeof plan.price === 'number' ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price) : plan.price}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400 font-medium">
                <span>Taxas de Processamento</span>
                <span className="text-emerald-400">Grátis</span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex justify-between items-center">
                <span className="text-xl font-black tracking-tighter">Total</span>
                <span className="text-3xl font-black tracking-tighter brand-text-gradient">
                  {typeof plan.price === 'number' ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price) : plan.price}
                </span>
              </div>
            </div>

            <button 
              onClick={handleComplete}
              disabled={isProcessing}
              className="w-full brand-gradient text-black py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(0,255,136,0.4)] transition-all group mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Processando...
                </div>
              ) : (
                <>
                  Prosseguir para pagamento
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-6">
              Ambiente Seguro e Criptografado
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
