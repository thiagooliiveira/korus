import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle2, User, Phone, Mail, MapPin, Globe, Plane, Users, Target, ClipboardList, Briefcase, Heart, GraduationCap, Plus, Trash2 } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Globe,
  Plane,
  Users,
  Target,
  Briefcase,
  Heart,
  GraduationCap
};

interface Props {
  onComplete: (data: any) => void;
  preFormQuestions?: any[];
  formFields?: any[];
  destinationId?: number;
  visaTypes?: any[];
}

export const ClientPreForm: React.FC<Props> = ({ onComplete, preFormQuestions, formFields, destinationId, visaTypes }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    hasPassport: '',
    hasVisaDenied: '',
    travelDate: '',
    travelParty: 'Sozinho',
    travelGoal: '',
    visaTypeId: null,
    dependentLevel: 'Individual',
    dependents: [],
    dynamicResponses: {}
  });

  const dynamicFields = formFields?.filter(f => !f.destination_id || f.destination_id === destinationId) || [];
  
  // Steps: 1: Basic, 2: Travel, 3: Dependents, 4: Goal, 5: Dynamic
  const totalSteps = 4 + (dynamicFields.length > 0 ? 1 : 0);
  const progress = (step / totalSteps) * 100;

  const displayGoals = visaTypes && visaTypes.length > 0 && visaTypes.some(v => v.destination_id === destinationId)
    ? visaTypes.filter(v => v.destination_id === destinationId)
    : preFormQuestions && preFormQuestions.length > 0 
      ? preFormQuestions 
      : [
          { id: 'turismo', label: 'Turismo', icon: 'Globe' },
          { id: 'estudo', label: 'Estudo', icon: 'Plane' },
          { id: 'negocios', label: 'Negócios', icon: 'Target' },
          { id: 'imigracao', label: 'Imigração', icon: 'Users' },
        ];

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else onComplete(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleDynamicChange = (fieldId: number, value: any) => {
    setFormData({
      ...formData,
      dynamicResponses: {
        ...formData.dynamicResponses,
        [fieldId]: value
      }
    });
  };

  const addDependent = () => {
    setFormData({
      ...formData,
      dependents: [...formData.dependents, { name: '', relationship: '', age: '', passport: '' }]
    });
  };

  const removeDependent = (index: number) => {
    const newDeps = [...formData.dependents];
    newDeps.splice(index, 1);
    setFormData({ ...formData, dependents: newDeps });
  };

  const updateDependent = (index: number, field: string, value: string) => {
    const newDeps = [...formData.dependents];
    newDeps[index] = { ...newDeps[index], [field]: value };
    setFormData({ ...formData, dependents: newDeps });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Dados Pessoais</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Nome Completo"
                    className="w-full pl-12 pr-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-white"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input 
                    type="tel" 
                    placeholder="Telefone"
                    className="w-full pl-12 pr-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-white"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="E-mail"
                    className="w-full pl-12 pr-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-white"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Cidade"
                    className="w-full pl-12 pr-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-white"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Já possui passaporte?</label>
                <div className="flex gap-2">
                  {['Sim', 'Não'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData({ ...formData, hasPassport: opt })}
                      className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${
                        formData.hasPassport === opt ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:bg-zinc-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Já teve visto negado?</label>
                <div className="flex gap-2">
                  {['Sim', 'Não'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData({ ...formData, hasVisaDenied: opt })}
                      className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${
                        formData.hasVisaDenied === opt ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:bg-zinc-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Pretende viajar quando?</label>
                <input 
                  type="date"
                  className="w-full px-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-white"
                  value={formData.travelDate}
                  onChange={e => setFormData({ ...formData, travelDate: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Vai sozinho ou acompanhado?</label>
                <div className="flex gap-2">
                  {['Sozinho', 'Acompanhado'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData({ ...formData, travelParty: opt })}
                      className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${
                        formData.travelParty === opt ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:bg-zinc-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Nível de Dependentes</label>
                <div className="flex gap-2">
                  {['Individual', 'Casal', 'Família'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData({ ...formData, dependentLevel: opt })}
                      className={`flex-1 py-4 rounded-2xl font-bold transition-all border ${
                        formData.dependentLevel === opt ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:bg-zinc-800'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {(formData.dependentLevel === 'Família' || formData.dependentLevel === 'Casal') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Dependentes</label>
                    <button 
                      onClick={addDependent}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <Plus size={14} />
                      Adicionar
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.dependents.map((dep: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4 relative group">
                        <button 
                          onClick={() => removeDependent(idx)}
                          className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Nome do Dependente"
                            className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                            value={dep.name}
                            onChange={e => updateDependent(idx, 'name', e.target.value)}
                          />
                          <select 
                            className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm appearance-none"
                            value={dep.relationship}
                            onChange={e => updateDependent(idx, 'relationship', e.target.value)}
                          >
                            <option value="">Parentesco</option>
                            <option value="Cônjuge">Cônjuge</option>
                            <option value="Filho(a)">Filho(a)</option>
                            <option value="Pai/Mãe">Pai/Mãe</option>
                            <option value="Outro">Outro</option>
                          </select>
                          <input 
                            type="number" 
                            placeholder="Idade"
                            className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                            value={dep.age}
                            onChange={e => updateDependent(idx, 'age', e.target.value)}
                          />
                          <input 
                            type="text" 
                            placeholder="Passaporte"
                            className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                            value={dep.passport}
                            onChange={e => updateDependent(idx, 'passport', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    {formData.dependents.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-zinc-500 text-xs font-medium">Nenhum dependente adicionado.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 ml-1 text-center mb-4">Objetivo da Viagem</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {displayGoals.map(opt => {
                const Icon = ICON_MAP[opt.icon] || Globe;
                const isSelected = formData.visaTypeId === opt.id || formData.travelGoal === (opt.label || opt.name || opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFormData({ 
                      ...formData, 
                      travelGoal: opt.name || opt.label || opt.id,
                      visaTypeId: opt.id 
                    })}
                    className={`flex flex-col items-center justify-center p-6 rounded-3xl font-bold transition-all border gap-4 ${
                      isSelected ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:bg-zinc-800'
                    }`}
                  >
                    <Icon size={32} />
                    <span className="text-sm">{opt.name || opt.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
          >
            <div className="space-y-6">
              {dynamicFields.map(field => (
                <div key={field.id} className="space-y-3">
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">
                    {field.label} {field.required ? '*' : ''}
                  </label>
                  
                  {field.type === 'text' && (
                    <input 
                      type="text"
                      className="w-full px-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-white"
                      value={formData.dynamicResponses[field.id] || ''}
                      onChange={e => handleDynamicChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === 'date' && (
                    <input 
                      type="date"
                      className="w-full px-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-white"
                      value={formData.dynamicResponses[field.id] || ''}
                      onChange={e => handleDynamicChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === 'select' && (
                    <select 
                      className="w-full px-6 py-4 bg-zinc-900/50 border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-white appearance-none"
                      value={formData.dynamicResponses[field.id] || ''}
                      onChange={e => handleDynamicChange(field.id, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Selecione uma opção</option>
                      {Array.isArray(field.options) && field.options.map((opt: any, i: number) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}

                  {field.type === 'radio' && (
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(field.options) && field.options.map((opt: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleDynamicChange(field.id, opt)}
                          className={`px-6 py-3 rounded-xl font-bold transition-all border ${
                            formData.dynamicResponses[field.id] === opt ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:bg-zinc-800'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-zinc-900/40 backdrop-blur-2xl rounded-[40px] border border-white/5 p-8 sm:p-12 relative z-10 shadow-2xl"
      >
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <ClipboardList className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter">Pré-formulário</h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Etapa {step} de {totalSteps}</p>
            </div>
          </div>
          <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full brand-gradient"
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="min-h-[300px] mb-12">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-8 border-t border-white/5">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              step === 1 ? 'opacity-0 pointer-events-none' : 'text-zinc-500 hover:bg-white/5'
            }`}
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
          <button
            onClick={handleNext}
            className="brand-gradient text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all group"
          >
            {step === totalSteps ? 'Finalizar Análise' : 'Próxima Etapa'}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
