import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  Search, 
  ChevronRight, 
  Upload, 
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Link as LinkIcon,
  Copy,
  Trash2,
  MapPin,
  Globe,
  Check,
  DollarSign,
  ShieldCheck,
  ClipboardList,
  UserPlus,
  Sun,
  Moon,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Calendar,
  CreditCard,
  Pencil,
  Settings,
  Target,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Process, Agency, Message, Document, VisaType, Financial, FormResponse, AuditLog, Expense, Revenue, Task, UserRole, Form, Destination, Plan, FormField } from './types';
import { ClientJourneyFlow } from './features/clientJourney/ClientJourneyFlow';

// Korus Logo Component
const KorusLogo = ({ size = 40, className = "" }: { size?: number, className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="korusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ff88" />
          <stop offset="100%" stopColor="#00d4ff" />
        </linearGradient>
      </defs>
      <path 
        d="M50 5 L15 20 V45 C15 70 50 95 50 95 C50 95 85 70 85 45 V20 L50 5Z" 
        fill="none" 
        stroke="url(#korusGradient)" 
        strokeWidth="4"
      />
      <ellipse 
        cx="50" cy="55" rx="45" ry="15" 
        fill="none" 
        stroke="url(#korusGradient)" 
        strokeWidth="2" 
        transform="rotate(-15 50 55)"
        strokeDasharray="4 2"
      />
      <path 
        d="M40 30 V70 M40 50 L60 30 M40 50 L60 70" 
        stroke="url(#korusGradient)" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M75 50 C75 45 80 40 85 40 C90 40 95 45 95 50 C95 55 85 65 85 65 C85 65 75 55 75 50Z" 
        fill="url(#korusGradient)"
      />
    </svg>
  </div>
);

// Components
const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    data-testid={`sidebar-item-${label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
      active 
        ? 'brand-gradient text-black font-bold shadow-lg brand-shadow' 
        : 'text-[var(--text-muted)] hover:bg-[var(--bg-input)] hover:text-[var(--text-main)]'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const STATUS_LABELS: Record<string, string> = {
  started: 'Iniciado',
  waiting_payment: 'Aguardando Pagamento',
  payment_confirmed: 'Pago Confirmado',
  analyzing: 'Em Análise',
  final_phase: 'Fase Final',
  completed: 'Concluído',
  pending: 'Pendente',
  proof_received: 'Comprovante Enviado',
  confirmed: 'Confirmado',
  documents_requested: 'Documentos Solicitados',
  reviewing: 'Em Revisão',
  submitted: 'Submetido',
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    started: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    waiting_payment: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    payment_confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    analyzing: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    final_phase: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-[var(--bg-input)] text-[var(--text-muted)] border-[var(--border-color)]',
    proof_received: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  
  return (
    <span
      data-testid={`status-badge-${status}`}
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
};

const ProgressBar = ({ status }: { status: Process['status'] }) => {
  const steps = [
    { id: 'started', label: 'Iniciado' },
    { id: 'payment_confirmed', label: 'Pagamento' },
    { id: 'analyzing', label: 'Análise' },
    { id: 'final_phase', label: 'Fase Final' },
    { id: 'completed', label: 'Concluído' }
  ];

  let currentStatus = status;
  if (currentStatus === 'waiting_payment') currentStatus = 'payment_confirmed';
  const currentIndex = steps.findIndex(s => s.id === currentStatus);

  return (
    <div className="w-full py-12">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[var(--border-color)] -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 brand-gradient -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, index) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              index <= currentIndex 
                ? 'brand-gradient border-transparent text-black' 
                : 'bg-[var(--bg-input)] border-[var(--border-color)] text-[var(--text-muted)]'
            }`}>
              {index < currentIndex ? <Check size={20} strokeWidth={3} /> : <span className="text-xs font-black">{index + 1}</span>}
            </div>
            <span className={`absolute top-12 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
              index <= currentIndex ? 'text-emerald-400' : 'text-[var(--text-muted)]'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

type ToastType = 'success' | 'error' | 'info';
type AppToast = {
  id: number;
  message: string;
  type: ToastType;
};

type ConfirmDialogState = {
  open: boolean;
  message: string;
  onConfirm: (() => Promise<void> | void) | null;
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [view, setView] = useState<'dashboard' | 'clients' | 'agencies' | 'process_detail' | 'finance' | 'audit' | 'settings' | 'leads' | 'team' | 'agency_panel'>('dashboard');
  const [processes, setProcesses] = useState<Process[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [clientResetHistory, setClientResetHistory] = useState<any[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isProcessingAgency, setIsProcessingAgency] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('korus-theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('korus-theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [destinationForm, setDestinationForm] = useState({
    name: '',
    code: '',
    flag: '',
    description: '',
    image: '',
    highlight_points: [] as string[],
    is_active: true,
    order: 0
  });
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [publicRegisterForm, setPublicRegisterForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    price: 0,
    features: [] as string[],
    is_recommended: false,
    icon: 'Star'
  });

  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [showFormFieldModal, setShowFormFieldModal] = useState(false);
  const [editingFormField, setEditingFormField] = useState<FormField | null>(null);
  const [formFieldForm, setFormFieldForm] = useState({
    label: '',
    type: 'text' as FormField['type'],
    required: false,
    options: [] as string[],
    order: 0,
    destination_id: null as number | null
  });

  const fetchPlans = async () => {
    const agencyId = user?.agency_id || (view === 'agency_panel' && agencySettings.id);
    if (!agencyId) return;
    const res = await fetch(`/api/plans?agency_id=${agencyId}`);
    const data = await res.json();
    setPlans(data);
  };

  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const agencyId = user?.agency_id || (view === 'agency_panel' && agencySettings.id);
    if (!agencyId) return;

    const url = editingPlan ? `/api/plans/${editingPlan.id}` : '/api/plans';
    const method = editingPlan ? 'PUT' : 'POST';
    const body = editingPlan ? planForm : { ...planForm, agency_id: agencyId };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      setShowPlanModal(false);
      fetchPlans();
      notify('Plano salvo com sucesso!', 'success');
    }
  };

  const deletePlan = async (id: number) => {
    requestConfirmation('Tem certeza que deseja excluir este plano?', async () => {
      const res = await fetch(`/api/plans/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPlans();
        notify('Plano excluído!', 'success');
      }
    });
  };

  const fetchFormFields = async () => {
    const agencyId = user?.agency_id || (view === 'agency_panel' && agencySettings.id);
    if (!agencyId) return;
    const res = await fetch(`/api/form-fields?agency_id=${agencyId}`);
    const data = await res.json();
    setFormFields(data);
  };

  const saveFormField = async (e: React.FormEvent) => {
    e.preventDefault();
    const agencyId = user?.agency_id || (view === 'agency_panel' && agencySettings.id);
    if (!agencyId) return;

    const url = editingFormField ? `/api/form-fields/${editingFormField.id}` : '/api/form-fields';
    const method = editingFormField ? 'PUT' : 'POST';
    const body = editingFormField ? formFieldForm : { ...formFieldForm, agency_id: agencyId };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      setShowFormFieldModal(false);
      fetchFormFields();
      notify('Campo de formulário salvo com sucesso!', 'success');
    }
  };

  const deleteFormField = async (id: number) => {
    requestConfirmation('Tem certeza que deseja excluir este campo de formulário?', async () => {
      const res = await fetch(`/api/form-fields/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchFormFields();
        notify('Campo excluído!', 'success');
      }
    });
  };
  
  // Agency CRUD State
  const [showAgencyModal, setShowAgencyModal] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [newAgency, setNewAgency] = useState({ 
    name: '', 
    slug: '', 
    has_finance: true, 
    admin_name: '', 
    admin_email: '', 
    admin_password: '' 
  });

  // Client Start Process State
  const [showStartModal, setShowStartModal] = useState(false);
  const [startProcessData, setStartProcessData] = useState({ visa_type_id: 0, is_dependent: false });

  // Finance Module State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [financeTab, setFinanceTab] = useState<'receivable' | 'payable'>('receivable');
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [editingFinance, setEditingFinance] = useState<Expense | Revenue | null>(null);
  const [financeForm, setFinanceForm] = useState({
    description: '',
    amount: 0,
    due_date: new Date().toISOString().split('T')[0],
    status: 'pending',
    category: '',
    agency_id: '' as string | number
  });

  // Agency Users & Tasks State
  const [agencyUsers, setAgencyUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [globalUsers, setGlobalUsers] = useState<any[]>([]);
  const [agencySettings, setAgencySettings] = useState<{ 
    id?: number,
    name: string, 
    logo_url: string, 
    slug: string, 
    admin_email: string,
    destinations?: any[],
    pre_form_questions?: any[]
  }>({
    name: '',
    logo_url: '',
    slug: '',
    admin_email: '',
    destinations: [],
    pre_form_questions: []
  });
  const [agencyTab, setAgencyTab] = useState<'geral' | 'configuracoes' | 'clientes'>('geral');
  const [configSubTab, setConfigSubTab] = useState<'destinos' | 'objetivos' | 'tasks' | 'vistos' | 'formularios' | 'planos'>('destinos');
  const [forms, setForms] = useState<Form[]>([]);
  const [showVisaTypeModal, setShowVisaTypeModal] = useState(false);
  const [editingVisaType, setEditingVisaType] = useState<VisaType | null>(null);
  const [visaTypeForm, setVisaTypeForm] = useState({ name: '', description: '', base_price: 0, required_docs: [] as string[] });
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [formForm, setFormForm] = useState({ visa_type_id: 0, title: '', fields: [] as any[] });

  const fetchForms = async (visaTypeId: number) => {
    const res = await fetch(`/api/forms/${visaTypeId}`);
    const data = await res.json();
    setForms(data);
  };

  const saveVisaType = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingVisaType ? `/api/visa-types/${editingVisaType.id}` : '/api/visa-types';
    const method = editingVisaType ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...visaTypeForm, agency_id: user?.agency_id })
    });
    if (res.ok) {
      setShowVisaTypeModal(false);
      fetchVisaTypes();
      notify('Tipo de visto salvo com sucesso!', 'success');
    }
  };

  const deleteVisaType = async (id: number) => {
    requestConfirmation('Tem certeza que deseja excluir este tipo de visto? Isso excluirá todos os formulários vinculados.', async () => {
      const res = await fetch(`/api/visa-types/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchVisaTypes();
        notify('Tipo de visto excluído!', 'success');
      }
    });
  };

  const fetchDestinations = async () => {
    const agencyId = user?.agency_id || (view === 'agency_panel' && agencySettings.id);
    if (!agencyId) return;
    const res = await fetch(`/api/destinations?agency_id=${agencyId}`);
    const data = await res.json();
    setDestinations(data);
  };

  const saveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    const agencyId = user?.agency_id || (view === 'agency_panel' && agencySettings.id);
    if (!agencyId) return;

    const url = editingDestination ? `/api/destinations/${editingDestination.id}` : '/api/destinations';
    const method = editingDestination ? 'PUT' : 'POST';
    const body = editingDestination ? destinationForm : { ...destinationForm, agency_id: agencyId };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      setShowDestinationModal(false);
      fetchDestinations();
      notify('Destino salvo com sucesso!', 'success');
    }
  };

  const deleteDestination = async (id: number) => {
    requestConfirmation('Tem certeza que deseja excluir este destino?', async () => {
      const res = await fetch(`/api/destinations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchDestinations();
        notify('Destino excluído!', 'success');
      }
    });
  };

  const saveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingForm ? `/api/forms/${editingForm.id}` : '/api/forms';
    const method = editingForm ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formForm)
    });
    if (res.ok) {
      setShowFormModal(false);
      if (formForm.visa_type_id) fetchForms(formForm.visa_type_id);
      notify('Formulário salvo com sucesso!', 'success');
    }
  };

  const handleDeleteForm = async (id: number) => {
    requestConfirmation('Tem certeza que deseja excluir este formulário?', async () => {
      const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (formForm.visa_type_id) fetchForms(formForm.visa_type_id);
        notify('Formulário excluído!', 'success');
      }
    });
  };

  const validateFinancial = async (processId: number, status: 'confirmed' | 'pending') => {
    requestConfirmation(
      status === 'confirmed' 
        ? 'Deseja confirmar o recebimento deste pagamento? O processo avançará para a próxima etapa.' 
        : 'Deseja recusar este comprovante? O cliente precisará enviar um novo.',
      async () => {
        const res = await fetch('/api/financials/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ process_id: processId, status })
        });
        if (res.ok) {
          notify(status === 'confirmed' ? 'Pagamento confirmado!' : 'Comprovante recusado.', 'success');
          // Refresh process details
          const updatedProcessRes = await fetch(`/api/processes/${processId}`);
          const updatedProcess = await updatedProcessRes.json();
          setSelectedProcess(updatedProcess);
          fetchProcesses();
        }
      }
    );
  };

  const [agencyModules, setAgencyModules] = useState<{ finance: boolean; chat: boolean }>({ finance: true, chat: true });
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'consultant' as UserRole });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', is_active: true });
  const [chatMessage, setChatMessage] = useState('');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [editingProcess, setEditingProcess] = useState<any>(null);
  const [processForm, setProcessForm] = useState({
    client_id: '',
    visa_type_id: '',
    consultant_id: '',
    analyst_id: '',
    status: 'started',
    internal_status: 'pending'
  });
  const [toasts, setToasts] = useState<AppToast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    message: '',
    onConfirm: null,
  });
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [agencyToResetPassword, setAgencyToResetPassword] = useState<number | null>(null);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showClientResetPasswordModal, setShowClientResetPasswordModal] = useState(false);
  const [clientToResetPassword, setClientToResetPassword] = useState<{ id: number; name: string; email: string } | null>(null);
  const [newClientPassword, setNewClientPassword] = useState('');
  const [showTeamResetPasswordModal, setShowTeamResetPasswordModal] = useState(false);
  const [teamToResetPassword, setTeamToResetPassword] = useState<{ id: number; name: string; email: string } | null>(null);
  const [newTeamPassword, setNewTeamPassword] = useState('');

  const [showFormEditModal, setShowFormEditModal] = useState(false);
  const [editingFormResponse, setEditingFormResponse] = useState<any>(null);
  const [formEditData, setFormEditData] = useState<any>({});

  const canAccessFinance = user?.role === 'master' || user?.role === 'supervisor' || user?.role === 'gerente_financeiro';
  const isFinanceModuleEnabled = user?.role === 'master' ? true : agencyModules.finance;

  const notify = (message: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.floor(Math.random() * 10000);
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const requestConfirmation = (message: string, onConfirm: () => Promise<void> | void) => {
    setConfirmDialog({ open: true, message, onConfirm });
  };

  const handleConfirmAction = async () => {
    if (confirmDialog.onConfirm) {
      await confirmDialog.onConfirm();
    }
    setConfirmDialog({ open: false, message: '', onConfirm: null });
  };

  useEffect(() => {
    const buildTestId = (element: HTMLElement, index: number) => {
      const baseText = (
        element.getAttribute('aria-label') ||
        element.getAttribute('name') ||
        element.getAttribute('placeholder') ||
        element.textContent ||
        `${element.tagName.toLowerCase()}-${index}`
      )
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 36);

      return `auto-${element.tagName.toLowerCase()}-${baseText || index}`;
    };

    const applyAutoTestIds = () => {
      const elements = document.querySelectorAll<HTMLElement>('button, a, input, select, textarea, [role="button"]');
      const seen = new Set<string>();

      elements.forEach((element, index) => {
        let testId = element.getAttribute('data-testid') || buildTestId(element, index);
        let suffix = 1;
        while (seen.has(testId)) {
          testId = `${buildTestId(element, index)}-${suffix}`;
          suffix += 1;
        }
        seen.add(testId);
        element.setAttribute('data-testid', testId);
      });
    };

    applyAutoTestIds();
    const observer = new MutationObserver(() => applyAutoTestIds());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Tentando login com:', loginForm.email);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      if (res.ok) {
        const userData = await res.json();
        console.log('Login bem-sucedido:', userData);
        setUser(userData);
      } else {
        const errorData = await res.json();
        console.error('Erro no login:', errorData);
        setError('Credenciais inválidas');
      }
    } catch (err) {
      console.error('Erro de conexão:', err);
      setError('Erro ao conectar com o servidor');
    }
  };

  const fetchProcesses = async () => {
    if (!user) return;
    const res = await fetch(`/api/processes?agency_id=${user.agency_id || ''}&role=${user.role}&user_id=${user.id}`);
    const data = await res.json();
    setProcesses(data);
  };

  const fetchAgencies = async () => {
    if (user?.role !== 'master') return;
    const res = await fetch('/api/agencies');
    const data = await res.json();
    setAgencies(data);
  };

  const fetchExpenses = async () => {
    const url = user?.role === 'master' ? '/api/expenses' : `/api/expenses?agency_id=${user?.agency_id}`;
    const res = await fetch(url);
    const data = await res.json();
    setExpenses(data);
  };

  const fetchRevenues = async () => {
    const url = user?.role === 'master' ? '/api/revenues' : `/api/revenues?agency_id=${user?.agency_id}`;
    const res = await fetch(url);
    const data = await res.json();
    setRevenues(data);
  };

  const fetchAuditLogs = async () => {
    if (user?.role !== 'master') return;
    const res = await fetch('/api/audit-logs');
    const data = await res.json();
    setAuditLogs(data);
  };

  const fetchGlobalUsers = async () => {
    if (user?.role !== 'master') return;
    const res = await fetch('/api/global-users');
    const data = await res.json();
    setGlobalUsers(data);
  };

  const fetchAgencyUsers = async () => {
    if (!user?.agency_id) return;
    const res = await fetch(`/api/agency-users?agency_id=${user.agency_id}`);
    const data = await res.json();
    setAgencyUsers(data);
  };

  const fetchAgencySettings = async () => {
    if (!user?.agency_id) return;
    const res = await fetch(`/api/agencies/${user.agency_id}`);
    if (!res.ok) return;
    const data = await res.json();
    let parsedModules = { finance: true, chat: true };
    try {
      parsedModules = { ...parsedModules, ...(JSON.parse(data.modules || '{}') || {}) };
    } catch {
      parsedModules = { finance: true, chat: true };
    }

    setAgencyModules({
      finance: Boolean(parsedModules.finance),
      chat: parsedModules.chat !== false,
    });

    let destinations = [];
    let pre_form_questions = [];
    try {
      destinations = data.destinations ? (typeof data.destinations === 'string' ? JSON.parse(data.destinations) : data.destinations) : [];
      pre_form_questions = data.pre_form_questions ? (typeof data.pre_form_questions === 'string' ? JSON.parse(data.pre_form_questions) : data.pre_form_questions) : [];
    } catch (e) {
      console.error('Error parsing agency settings:', e);
    }

    setAgencySettings({
      id: data.id,
      name: data.name || '',
      logo_url: data.logo_url || '',
      slug: data.slug || '',
      admin_email: data.admin_email || user.email,
      destinations,
      pre_form_questions,
    });
  };

  const fetchTasks = async () => {
    if (!user?.agency_id) return;
    const res = await fetch(`/api/tasks?agency_id=${user.agency_id}`);
    const data = await res.json();
    setTasks(data);
  };

  const fetchVisaTypes = async () => {
    if (!user?.agency_id && user?.role !== 'master') return;
    const res = await fetch(`/api/visa-types?agency_id=${user?.agency_id || ''}`);
    const data = await res.json();
    setVisaTypes(data);
  };

  const handleStartProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const res = await fetch('/api/processes/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: user.id,
        agency_id: user.agency_id,
        visa_type_id: startProcessData.visa_type_id,
        is_dependent: startProcessData.is_dependent
      })
    });
    if (res.ok) {
      setShowStartModal(false);
      fetchProcesses();
    }
  };

  const createAgency = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log('createAgency function called');
    setIsProcessingAgency(true);
    const url = editingAgency ? `/api/agencies/${editingAgency.id}` : '/api/agencies';
    const method = editingAgency ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAgency),
      });
      if (res.ok) {
        fetchAgencies();
        setShowAgencyModal(false);
        setEditingAgency(null);
        setNewAgency({ 
          name: '', 
          slug: '', 
          has_finance: true, 
          admin_name: '', 
          admin_email: '', 
          admin_password: '' 
        });
        notify(editingAgency ? 'Agência atualizada com sucesso!' : 'Agência criada com sucesso!', 'success');
      } else {
        const data = await res.json();
        notify(data.error || 'Erro ao processar agência', 'error');
      }
    } catch (err) {
      notify('Erro de conexão ao processar agência', 'error');
    } finally {
      setIsProcessingAgency(false);
    }
  };

  const deleteAgency = async (id: number) => {
    requestConfirmation('Tem certeza que deseja excluir esta agência?', async () => {
      const res = await fetch(`/api/agencies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAgencies();
        notify('Agência excluída com sucesso!', 'success');
      } else {
        notify('Não foi possível excluir a agência.', 'error');
      }
    });
  };

  const copyAgencyLink = (slug: string) => {
    const link = `${window.location.origin}/?agency=${encodeURIComponent(slug)}`;
    navigator.clipboard.writeText(link);
    notify('Link de acesso copiado!', 'success');
  };

  const copyAgencyPanelClientLink = () => {
    if (!agencySettings.slug) {
      notify('Slug da agência não encontrado para gerar o link de clientes.', 'error');
      return;
    }
    const link = `${window.location.origin}/?agency=${encodeURIComponent(agencySettings.slug)}`;
    navigator.clipboard.writeText(link);
    notify('Link de cadastro/login de cliente copiado!', 'success');
  };

  const copyAgencyPanelTeamLoginLink = () => {
    const link = `${window.location.origin}/`;
    navigator.clipboard.writeText(link);
    notify('Link de login da equipe copiado!', 'success');
  };

  const copyAdminAccess = (agency: Agency) => {
    if (!agency.admin_email) {
      notify('Esta agência ainda não possui administrador configurado.', 'error');
      return;
    }

    const accessText = [
      `Agência: ${agency.name}`,
      `Link de login: ${window.location.origin}/`,
      `E-mail admin: ${agency.admin_email}`,
      `Perfil: ${agency.admin_role || 'não identificado'}`,
    ].join('\n');

    navigator.clipboard.writeText(accessText);
    notify('Acesso do administrador copiado!', 'success');
  };

  const handleMasterAgencyLogoUpload = async (agency: Agency, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('logo', file);

      const uploadResponse = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadData.url) {
        notify(uploadData.error || 'Falha no upload da logo.', 'error');
        return;
      }

      const updateResponse = await fetch(`/api/agencies/${agency.id}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: agency.name,
          logo_url: uploadData.url,
        }),
      });

      if (updateResponse.ok) {
        notify('Logo da agência atualizada com sucesso!', 'success');
        fetchAgencies();
      } else {
        const updateData = await updateResponse.json();
        notify(updateData.error || 'Falha ao salvar logo da agência.', 'error');
      }
    } catch (error) {
      notify('Erro de conexão ao atualizar a logo da agência.', 'error');
    } finally {
      event.target.value = '';
    }
  };

  const resetAgencyPassword = async (agencyId: number) => {
    setAgencyToResetPassword(agencyId);
    setNewAdminPassword('');
    setShowResetPasswordModal(true);
  };

  const submitAgencyPasswordReset = async () => {
    if (!agencyToResetPassword || !newAdminPassword.trim()) {
      notify('Digite a nova senha para continuar.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/agencies/${agencyToResetPassword}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newAdminPassword }),
      });
      
      if (res.ok) {
        notify('Senha resetada com sucesso!', 'success');
        setShowResetPasswordModal(false);
        setNewAdminPassword('');
        setAgencyToResetPassword(null);
      } else {
        const data = await res.json();
        notify(data.error || 'Erro ao resetar senha', 'error');
      }
    } catch (err) {
      notify('Erro de conexão ao resetar senha', 'error');
    }
  };

  const openClientPasswordResetModal = (client: { id: number; name: string; email: string }) => {
    setClientToResetPassword(client);
    setNewClientPassword('');
    setShowClientResetPasswordModal(true);
  };

  const submitClientPasswordReset = async () => {
    if (!clientToResetPassword || newClientPassword.trim().length < 6) {
      notify('A nova senha do cliente deve ter no mínimo 6 caracteres.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/clients/${clientToResetPassword.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_password: newClientPassword.trim(),
          reset_by_user_id: user?.id,
        }),
      });

      if (res.ok) {
        notify('Senha do cliente resetada com sucesso!', 'success');
        setShowClientResetPasswordModal(false);
        setClientToResetPassword(null);
        setNewClientPassword('');
        fetchClientResetHistory();
      } else {
        const data = await res.json();
        notify(data.error || 'Erro ao resetar senha do cliente.', 'error');
      }
    } catch (error) {
      notify('Erro de conexão ao resetar senha do cliente.', 'error');
    }
  };

  const openTeamPasswordResetModal = (teamMember: { id: number; name: string; email: string }) => {
    setTeamToResetPassword(teamMember);
    setNewTeamPassword('');
    setShowTeamResetPasswordModal(true);
  };

  const submitTeamPasswordReset = async () => {
    if (!teamToResetPassword || newTeamPassword.trim().length < 6) {
      notify('A nova senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/users/${teamToResetPassword.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_password: newTeamPassword.trim(),
        }),
      });

      if (res.ok) {
        notify('Senha da equipe resetada com sucesso!', 'success');
        setShowTeamResetPasswordModal(false);
        setTeamToResetPassword(null);
        setNewTeamPassword('');
      } else {
        const data = await res.json();
        notify(data.error || 'Erro ao resetar senha da equipe.', 'error');
      }
    } catch (error) {
      notify('Erro de conexão ao resetar senha da equipe.', 'error');
    }
  };

  const handleFormEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFormResponse || !selectedProcess) return;

    try {
      const res = await fetch('/api/form-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          process_id: selectedProcess.id,
          form_id: editingFormResponse.form_id,
          data: formEditData
        })
      });

      if (res.ok) {
        notify('Formulário atualizado com sucesso!', 'success');
        setShowFormEditModal(false);
        fetchProcessDetail(selectedProcess.id);
      } else {
        const data = await res.json();
        notify(data.error || 'Erro ao atualizar formulário', 'error');
      }
    } catch (err) {
      notify('Erro de conexão ao atualizar formulário', 'error');
    }
  };

  const openProcessEditModal = (process: Process) => {
    if (process.status === 'completed') {
      notify('Somente processos abertos podem ser editados.', 'error');
      return;
    }

    setEditingProcess(process);
    setProcessForm({
      client_id: String(process.client_id || ''),
      visa_type_id: String(process.visa_type_id || ''),
      consultant_id: process.consultant_id ? String(process.consultant_id) : '',
      analyst_id: process.analyst_id ? String(process.analyst_id) : '',
      status: process.status || 'started',
      internal_status: process.internal_status || 'pending',
    });
    setShowProcessModal(true);
  };

  const handleFinanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFinanceModuleEnabled && user?.role !== 'master') {
      notify('Módulo financeiro desativado para esta agência. Lançamentos estão bloqueados.', 'error');
      return;
    }

    const endpoint = financeTab === 'payable' ? '/api/expenses' : '/api/revenues';
    const url = editingFinance ? `${endpoint}/${editingFinance.id}` : endpoint;
    const method = editingFinance ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...financeForm,
          agency_id: user?.role === 'master' ? (financeForm.agency_id || null) : user?.agency_id
        }),
      });

      if (res.ok) {
        setShowFinanceModal(false);
        setEditingFinance(null);
        setFinanceForm({
          description: '',
          amount: 0,
          due_date: new Date().toISOString().split('T')[0],
          status: 'pending',
          category: '',
          agency_id: ''
        });
        fetchExpenses();
        fetchRevenues();
        notify(editingFinance ? 'Lançamento atualizado com sucesso!' : 'Lançamento criado com sucesso!', 'success');
      } else {
        const data = await res.json();
        notify(data.error || 'Falha ao salvar lançamento financeiro.', 'error');
      }
    } catch (err) {
      console.error('Erro ao salvar transação financeira:', err);
      notify('Erro de conexão ao salvar lançamento financeiro.', 'error');
    }
  };

  const deleteFinance = async (id: number, type: 'payable' | 'receivable') => {
    if (!isFinanceModuleEnabled && user?.role !== 'master') {
      notify('Módulo financeiro desativado para esta agência. Exclusão de lançamentos bloqueada.', 'error');
      return;
    }

    requestConfirmation('Tem certeza que deseja excluir este registro?', async () => {
      const endpoint = type === 'payable' ? '/api/expenses' : '/api/revenues';
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchExpenses();
        fetchRevenues();
        notify('Registro excluído com sucesso!', 'success');
      } else {
        notify('Não foi possível excluir o registro.', 'error');
      }
    });
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingUser ? `/api/agency-users/${editingUser.id}` : '/api/agency-users';
    const method = editingUser ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userForm, agency_id: user?.agency_id }),
      });

      if (res.ok) {
        setShowUserModal(false);
        setEditingUser(null);
        setUserForm({ name: '', email: '', password: '', role: 'consultant' });
        fetchAgencyUsers();
        notify(editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!', 'success');
      } else {
        const data = await res.json();
        notify(data.error || 'Erro ao salvar usuário', 'error');
      }
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      notify('Erro de conexão ao salvar usuário.', 'error');
    }
  };

  const deleteUser = async (id: number) => {
    requestConfirmation('Tem certeza que deseja excluir este usuário?', async () => {
      const res = await fetch(`/api/agency-users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAgencyUsers();
        notify('Usuário excluído com sucesso!', 'success');
      } else {
        notify('Não foi possível excluir o usuário.', 'error');
      }
    });
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingTask ? `/api/tasks/${editingTask.id}` : '/api/tasks';
    const method = editingTask ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskForm, agency_id: user?.agency_id }),
      });

      if (res.ok) {
        setShowTaskModal(false);
        setEditingTask(null);
        setTaskForm({ title: '', description: '', is_active: true });
        fetchTasks();
        notify(editingTask ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!', 'success');
      }
    } catch (err) {
      console.error('Erro ao salvar task:', err);
      notify('Erro de conexão ao salvar tarefa.', 'error');
    }
  };

  const deleteTask = async (id: number) => {
    requestConfirmation('Tem certeza que deseja excluir esta tarefa?', async () => {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTasks();
        notify('Tarefa excluída com sucesso!', 'success');
      } else {
        notify('Não foi possível excluir a tarefa.', 'error');
      }
    });
  };

  const sendMessage = async () => {
    if (!chatMessage.trim() || !selectedProcess) return;

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          process_id: selectedProcess.id,
          sender_id: user?.id,
          content: chatMessage,
          is_proof: false
        }),
      });

      if (res.ok) {
        setChatMessage('');
        fetchProcessDetail(selectedProcess.id);
      }
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  const toggleTask = async (taskId: number, currentStatus: string) => {
    if (!selectedProcess) return;
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const res = await fetch(`/api/process-tasks/${taskId}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      fetchProcessDetail(selectedProcess.id);
    }
  };

  const fetchProcessDetail = async (id: number) => {
    setLoading(true);
    const res = await fetch(`/api/processes/${id}`);
    const data = await res.json();
    setSelectedProcess(data);
    setView('process_detail');
    setLoading(false);
  };

  const fetchLeads = async () => {
    if (!user || (user.role !== 'supervisor' && user.role !== 'master')) return;
    const agencyId = user.agency_id || '';
    const res = await fetch(`/api/leads?agency_id=${agencyId}`);
    const data = await res.json();
    setLeads(data);
  };

  const fetchClientResetHistory = async () => {
    if (!user || (user.role !== 'supervisor' && user.role !== 'master')) return;
    const agencyId = user.agency_id || '';
    const res = await fetch(`/api/clients/password-resets?agency_id=${agencyId}`);
    if (!res.ok) {
      setClientResetHistory([]);
      return;
    }
    const data = await res.json();
    setClientResetHistory(data);
  };

  useEffect(() => {
    if (user) {
      fetchProcesses();

      if (user.role === 'master') {
        fetchAgencies();
        fetchAuditLogs();
        fetchGlobalUsers();
      }

      if (user.role !== 'master') fetchVisaTypes();

      if (canAccessFinance) {
        fetchExpenses();
        fetchRevenues();
      }

      if (user.role === 'supervisor' || user.role === 'master') {
        fetchLeads();
        fetchClientResetHistory();
        fetchAgencyUsers();
        fetchTasks();
        fetchDestinations();
        fetchPlans();
        fetchFormFields();
      }

      if (user.role === 'supervisor' || user.role === 'gerente_financeiro' || user.role === 'client') {
        fetchAgencySettings();
        fetchDestinations();
        fetchPlans();
        fetchFormFields();
      }
    }
  }, [user, view, canAccessFinance]);

  const [publicAgency, setPublicAgency] = useState<Agency | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [publicMode, setPublicMode] = useState<'login' | 'register'>('register');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const slugFromPath = pathParts[0] === 'join' && pathParts[1] ? decodeURIComponent(pathParts[1]) : null;
    const agencySlug = params.get('agency') || slugFromPath;
    if (agencySlug) {
      fetch(`/api/agencies/by-slug/${agencySlug}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setPublicAgency(data);
            fetch(`/api/destinations?agency_id=${data.id}`)
              .then(res => res.json())
              .then(destData => setDestinations(destData));
          }
        });
    }
  }, []);

  const handleUpdateAgencySettings = async (e?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!user?.agency_id) return;

    try {
      const res = await fetch(`/api/agencies/${user.agency_id}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: agencySettings.name || '',
          logo_url: agencySettings.logo_url || '',
          pre_form_questions: agencySettings.pre_form_questions || []
        }),
      });
      if (res.ok) {
        notify('Configurações atualizadas com sucesso!', 'success');
        fetchAgencySettings();
      } else {
        const errorData = await res.json();
        notify(errorData.error || 'Falha ao atualizar configurações.', 'error');
      }
    } catch (error) {
      console.error('Error updating agency settings:', error);
      notify('Erro de conexão ao atualizar configurações.', 'error');
    }
  };

  const saveProcess = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProcess && editingProcess.status === 'completed') {
      notify('Somente processos abertos podem ser editados.', 'error');
      return;
    }

    const method = editingProcess ? 'PUT' : 'POST';
    const url = editingProcess ? `/api/processes/${editingProcess.id}` : '/api/processes';

    const payload = editingProcess
      ? {
          visa_type_id: Number(processForm.visa_type_id || editingProcess.visa_type_id),
          consultant_id: processForm.consultant_id ? Number(processForm.consultant_id) : null,
          analyst_id: processForm.analyst_id ? Number(processForm.analyst_id) : null,
          status: processForm.status,
          internal_status: processForm.internal_status,
        }
      : {
          client_id: Number(processForm.client_id),
          visa_type_id: Number(processForm.visa_type_id),
          consultant_id: processForm.consultant_id ? Number(processForm.consultant_id) : null,
          analyst_id: processForm.analyst_id ? Number(processForm.analyst_id) : null,
          status: processForm.status,
          internal_status: processForm.internal_status,
          agency_id: user?.agency_id,
        };
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (!editingProcess && data.tasks) {
        notify(`Processo criado com sucesso! ${data.tasks.length} tarefas foram geradas.`, 'success');
      } else {
        notify('Processo atualizado com sucesso!', 'success');
      }
      setShowProcessModal(false);
      setEditingProcess(null);
      fetchProcesses();
    } else {
      notify('Falha ao salvar o processo.', 'error');
    }
  };

  const deleteProcess = async (id: number) => {
    requestConfirmation('Tem certeza que deseja excluir este processo? Todos os documentos e mensagens serão removidos.', async () => {
      const res = await fetch(`/api/processes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProcesses();
        notify('Processo excluído com sucesso!', 'success');
      } else {
        notify('Não foi possível excluir o processo.', 'error');
      }
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setAgencySettings(prev => ({ ...prev, logo_url: data.url }));
        notify('Upload da logo concluído! Salve as alterações para publicar.', 'success');
      } else {
        notify(data.error || 'Falha ao enviar logo.', 'error');
      }
    } catch (err) {
      console.error('Erro no upload:', err);
      notify('Erro de conexão durante o upload da logo.', 'error');
    }
  };

  const handlePublicRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicAgency) return;

    if (publicRegisterForm.password.trim().length < 6) {
      notify('A senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }
    
    setIsRegistering(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: publicRegisterForm.name,
          email: publicRegisterForm.email,
          password: publicRegisterForm.password,
          phone: publicRegisterForm.phone || null,
          agency_id: publicAgency.id
        })
      });
      if (res.ok) {
        notify('Cadastro realizado com sucesso! Faça login com seu e-mail e senha.', 'success');
        setPublicRegisterForm({ name: '', email: '', password: '', phone: '' });
        setPublicMode('login');
        setLoginForm((prev) => ({ ...prev, email: publicRegisterForm.email, password: '' }));
      } else {
        const data = await res.json();
        notify(data.error || 'Falha no cadastro. Verifique os dados e tente novamente.', 'error');
      }
    } catch (error) {
      notify('Erro de conexão ao realizar cadastro.', 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  const renderGlobalOverlays = () => (
    <>
      <div
        data-testid="global-toast-container"
        className="fixed top-4 right-4 z-[120] w-full max-w-sm px-4 space-y-3 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            data-testid={`toast-${toast.type}-${toast.id}`}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md flex items-start gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} className="mt-0.5" />
            ) : toast.type === 'error' ? (
              <AlertCircle size={18} className="mt-0.5" />
            ) : (
              <Clock size={18} className="mt-0.5" />
            )}
            <p className="text-sm font-semibold leading-snug">{toast.message}</p>
          </div>
        ))}
      </div>

      {confirmDialog.open && (
        <div
          data-testid="confirm-dialog-overlay"
          className="fixed inset-0 z-[130] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            data-testid="confirm-dialog-card"
            className="w-full max-w-md rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-2xl"
          >
            <h3 className="text-lg font-black mb-3">Confirmar ação</h3>
            <p data-testid="confirm-dialog-message" className="text-sm text-[var(--text-muted)] leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                data-testid="confirm-dialog-cancel-button"
                type="button"
                onClick={() => setConfirmDialog({ open: false, message: '', onConfirm: null })}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-input)] transition-all"
              >
                Cancelar
              </button>
              <button
                data-testid="confirm-dialog-confirm-button"
                type="button"
                onClick={handleConfirmAction}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-black brand-gradient text-black"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDestinationModal && (
        <div className="fixed inset-0 z-[130] bg-[var(--bg-overlay)] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[32px] bg-[var(--bg-card)] border border-[var(--border-color)] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black tracking-tighter uppercase">{editingDestination ? 'Editar Destino' : 'Novo Destino'}</h3>
              <button 
                onClick={() => setShowDestinationModal(false)}
                className="p-2 hover:bg-[var(--bg-input)] rounded-xl text-[var(--text-muted)] transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>
            <form onSubmit={saveDestination} className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Emoji/Flag</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-center text-2xl"
                    value={destinationForm.flag}
                    onChange={(e) => setDestinationForm({ ...destinationForm, flag: e.target.value })}
                    placeholder="🌍"
                  />
                </div>
                <div className="col-span-3 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Nome do Destino</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-6 py-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                    value={destinationForm.name}
                    onChange={(e) => setDestinationForm({ ...destinationForm, name: e.target.value })}
                    placeholder="Ex: Estados Unidos"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Descrição</label>
                <textarea 
                  required
                  className="w-full px-6 py-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  value={destinationForm.description}
                  onChange={(e) => setDestinationForm({ ...destinationForm, description: e.target.value })}
                  placeholder="Breve descrição sobre o destino..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">URL da Imagem de Fundo</label>
                <input 
                  type="url" 
                  className="w-full px-6 py-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  value={destinationForm.image}
                  onChange={(e) => setDestinationForm({ ...destinationForm, image: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-[var(--bg-input)]/50 rounded-2xl border border-[var(--border-color)]">
                <input 
                  type="checkbox" 
                  id="dest-active"
                  className="w-5 h-5 rounded-lg border-[var(--border-color)] bg-[var(--bg-input)] text-emerald-500 focus:ring-emerald-500"
                  checked={destinationForm.is_active}
                  onChange={(e) => setDestinationForm({ ...destinationForm, is_active: e.target.checked })}
                />
                <label htmlFor="dest-active" className="text-sm font-bold text-[var(--text-muted)] cursor-pointer">Destino Ativo</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowDestinationModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl bg-[var(--bg-input)]/50 hover:bg-[var(--bg-input)] transition-all text-xs font-black uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 brand-gradient text-black font-black py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg uppercase tracking-widest text-xs"
                >
                  {editingDestination ? 'Salvar Alterações' : 'Criar Destino'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showResetPasswordModal && (
        <div
          data-testid="reset-password-dialog-overlay"
          className="fixed inset-0 z-[130] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            data-testid="reset-password-dialog-card"
            className="w-full max-w-md rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-2xl"
          >
            <h3 className="text-lg font-black mb-2">Resetar senha do administrador</h3>
            <p className="text-sm text-[var(--text-muted)] mb-5">Digite a nova senha para o admin da agência selecionada.</p>
            <input
              data-testid="reset-password-input"
              type="password"
              value={newAdminPassword}
              onChange={(e) => setNewAdminPassword(e.target.value)}
              placeholder="Nova senha"
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="mt-6 flex gap-3">
              <button
                data-testid="reset-password-cancel-button"
                type="button"
                onClick={() => {
                  setShowResetPasswordModal(false);
                  setAgencyToResetPassword(null);
                  setNewAdminPassword('');
                }}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-input)] transition-all"
              >
                Cancelar
              </button>
              <button
                data-testid="reset-password-submit-button"
                type="button"
                onClick={submitAgencyPasswordReset}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-black brand-gradient text-black"
              >
                Salvar nova senha
              </button>
            </div>
          </div>
        </div>
      )}

      {showClientResetPasswordModal && (
        <div
          data-testid="client-reset-password-dialog-overlay"
          className="fixed inset-0 z-[130] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            data-testid="client-reset-password-dialog-card"
            className="w-full max-w-md rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-2xl"
          >
            <h3 className="text-lg font-black mb-2">Resetar senha do cliente</h3>
            <p className="text-sm text-[var(--text-muted)] mb-2">
              Cliente: <span className="font-bold text-[var(--text-main)]">{clientToResetPassword?.name || '-'}</span>
            </p>
            <p className="text-xs text-[var(--text-muted)] mb-5">{clientToResetPassword?.email || ''}</p>
            <input
              data-testid="client-reset-password-input"
              type="password"
              value={newClientPassword}
              onChange={(e) => setNewClientPassword(e.target.value)}
              placeholder="Nova senha (mín. 6 caracteres)"
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="mt-6 flex gap-3">
              <button
                data-testid="client-reset-password-cancel-button"
                type="button"
                onClick={() => {
                  setShowClientResetPasswordModal(false);
                  setClientToResetPassword(null);
                  setNewClientPassword('');
                }}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-input)] transition-all"
              >
                Cancelar
              </button>
              <button
                data-testid="client-reset-password-submit-button"
                type="button"
                onClick={submitClientPasswordReset}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-black brand-gradient text-black"
              >
                Salvar nova senha
              </button>
            </div>
          </div>
        </div>
      )}

      {showTeamResetPasswordModal && (
        <div
          data-testid="team-reset-password-dialog-overlay"
          className="fixed inset-0 z-[130] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            data-testid="team-reset-password-dialog-card"
            className="w-full max-w-md rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-2xl"
          >
            <h3 className="text-lg font-black mb-2">Resetar senha da equipe</h3>
            <p className="text-sm text-[var(--text-muted)] mb-2">
              Usuário: <span className="font-bold text-[var(--text-main)]">{teamToResetPassword?.name || '-'}</span>
            </p>
            <p className="text-xs text-[var(--text-muted)] mb-5">{teamToResetPassword?.email || ''}</p>
            <input
              data-testid="team-reset-password-input"
              type="password"
              value={newTeamPassword}
              onChange={(e) => setNewTeamPassword(e.target.value)}
              placeholder="Nova senha (mín. 6 caracteres)"
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="mt-6 flex gap-3">
              <button
                data-testid="team-reset-password-cancel-button"
                type="button"
                onClick={() => {
                  setShowTeamResetPasswordModal(false);
                  setTeamToResetPassword(null);
                  setNewTeamPassword('');
                }}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-[var(--text-muted)] hover:bg-[var(--bg-input)] transition-all"
              >
                Cancelar
              </button>
              <button
                data-testid="team-reset-password-submit-button"
                type="button"
                onClick={submitTeamPasswordReset}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-black brand-gradient text-black"
              >
                Salvar nova senha
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (publicAgency && !user) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/30 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[var(--bg-card)]/50 p-10 rounded-[40px] border border-[var(--border-color)] shadow-2xl backdrop-blur-xl relative z-10"
        >
          <div className="flex justify-center mb-10">
            {publicAgency.logo_url ? (
              <img 
                src={publicAgency.logo_url} 
                alt={publicAgency.name} 
                className="h-16 object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center text-black font-black text-2xl">
                {publicAgency.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="text-center mb-10">
            <h1 data-testid="public-agency-title" className="text-3xl font-black tracking-tighter mb-2">Bem-vindo à {publicAgency.name}</h1>
            <p className="text-[var(--text-muted)] font-bold text-sm">
              {publicMode === 'register' ? 'Inicie seu processo de visto internacional agora.' : 'Acesse sua conta para continuar.'}
            </p>
          </div>

          <div className="flex bg-[var(--bg-input)] p-1 rounded-2xl mb-8">
            <button 
              data-testid="public-mode-register-button"
              onClick={() => setPublicMode('register')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                publicMode === 'register' ? 'bg-[var(--bg-card)] text-emerald-400 shadow-lg' : 'text-[var(--text-muted)]'
              }`}
            >
              Cadastro
            </button>
            <button 
              data-testid="public-mode-login-button"
              onClick={() => setPublicMode('login')}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                publicMode === 'login' ? 'bg-[var(--bg-card)] text-emerald-400 shadow-lg' : 'text-[var(--text-muted)]'
              }`}
            >
              Login
            </button>
          </div>

          {publicMode === 'register' ? (
            <form onSubmit={handlePublicRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Nome Completo</label>
                <input 
                  data-testid="public-register-name-input"
                  type="text" 
                  required
                  className="w-full px-6 py-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  placeholder="Seu nome"
                  value={publicRegisterForm.name}
                  onChange={(e) => setPublicRegisterForm({ ...publicRegisterForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">E-mail</label>
                <input 
                  data-testid="public-register-email-input"
                  type="email" 
                  required
                  className="w-full px-6 py-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  placeholder="seu@email.com"
                  value={publicRegisterForm.email}
                  onChange={(e) => setPublicRegisterForm({ ...publicRegisterForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Cadastrar Senha</label>
                <input
                  data-testid="public-register-password-input"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-6 py-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  placeholder="Mínimo 6 caracteres"
                  value={publicRegisterForm.password}
                  onChange={(e) => setPublicRegisterForm({ ...publicRegisterForm, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Telefone (Opcional)</label>
                <input
                  data-testid="public-register-phone-input"
                  type="tel"
                  className="w-full px-6 py-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                  placeholder="(00) 00000-0000"
                  value={publicRegisterForm.phone}
                  onChange={(e) => setPublicRegisterForm({ ...publicRegisterForm, phone: e.target.value })}
                />
              </div>
              <button 
                data-testid="public-register-submit-button"
                type="submit"
                disabled={isRegistering}
                className="w-full brand-gradient text-black font-black py-5 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                {isRegistering ? 'Processando...' : 'Criar minha conta'}
                <ChevronRight size={20} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">E-mail</label>
                <input 
                  data-testid="public-login-email-input"
                  type="email" 
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="seu@email.com"
                  value={loginForm.email}
                  onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Senha</label>
                <input 
                  data-testid="public-login-password-input"
                  type="password" 
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>
              {error && <p data-testid="public-login-error-message" className="text-red-400 text-sm">{error}</p>}
              <button 
                data-testid="public-login-submit-button"
                type="submit"
                className="w-full brand-gradient text-black py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg brand-shadow"
              >
                Entrar
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-[var(--border-color)] text-center">
            <button data-testid="public-back-home-button" onClick={() => window.location.href = '/'} className="text-xs text-[var(--text-muted)] font-bold hover:text-[var(--text-main)] transition-colors">
              Voltar para Home
            </button>
          </div>
        </motion.div>
        {renderGlobalOverlays()}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[var(--bg-card)]/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-[var(--border-color)] p-8 relative z-10"
        >
          <div className="flex justify-center mb-8">
            <KorusLogo size={80} />
          </div>
          <h1 data-testid="login-page-title" className="text-3xl font-bold text-center mb-2 brand-text-gradient">KORUS</h1>
          <p className="text-[var(--text-muted)] text-center mb-8">Gestão Inteligente de Vistos Internacionais</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">E-mail</label>
              <input
                data-testid="login-email-input"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="seu@email.com"
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Senha</label>
              <input
                data-testid="login-password-input"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-main)] focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>
            {error && <p data-testid="login-error-message" className="text-red-400 text-sm">{error}</p>}
            <button
              data-testid="login-submit-button"
              type="submit"
              className="w-full brand-gradient text-black py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg brand-shadow"
            >
              Acessar Plataforma
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
            <p className="text-[10px] text-[var(--text-muted)] text-center uppercase tracking-widest font-bold">
              Korus Visa Consulting • 2024
            </p>
          </div>
        </motion.div>
        {renderGlobalOverlays()}
      </div>
    );
  }

  // New Client Journey Flow
  if (user.role === 'client') {
    return (
      <ClientJourneyFlow 
        user={user} 
        onLogout={() => setUser(null)} 
        processes={processes}
        onRefreshProcesses={fetchProcesses}
        agencyName={agencySettings.name}
        agencyLogo={agencySettings.logo_url}
        destinations={destinations}
        preFormQuestions={agencySettings.pre_form_questions}
        plans={plans}
        formFields={formFields}
        visaTypes={visaTypes}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[var(--bg-card)]/50 backdrop-blur-xl border-r border-[var(--border-color)] p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 px-2">
          {user.role !== 'master' && agencySettings.logo_url ? (
            <img 
              src={agencySettings.logo_url} 
              alt={agencySettings.name} 
              className="h-8 object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <KorusLogo size={32} />
          )}
          <span className="font-black text-2xl tracking-tighter brand-text-gradient">
            {user.role !== 'master' && agencySettings.name ? agencySettings.name.toUpperCase() : 'KORUS'}
          </span>
        </div>

        <div className="mb-6 px-2">
          <button 
            data-testid="theme-toggle-button"
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] hover:bg-[var(--bg-input)]/80 transition-all text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-xs font-black uppercase tracking-widest">
              {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </span>
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')} 
          />
          
          {(user.role === 'master' || user.role === 'supervisor' || user.role === 'consultant' || user.role === 'analyst') && (
            <SidebarItem 
              icon={Users} 
              label="Processos" 
              active={view === 'clients'} 
              onClick={() => setView('clients')} 
            />
          )}

          {(user.role === 'master' || user.role === 'supervisor') && (
            <SidebarItem 
              icon={UserPlus} 
              label="Leads" 
              active={view === 'leads'} 
              onClick={() => setView('leads')} 
            />
          )}

          {user.role === 'master' && (
            <SidebarItem 
              icon={Building2} 
              label="Agências" 
              active={view === 'agencies'} 
              onClick={() => setView('agencies')} 
            />
          )}

          {(user.role === 'master' || user.role === 'supervisor') && (
            <SidebarItem 
              icon={Users} 
              label="Equipe" 
              active={view === 'team'} 
              onClick={() => setView('team')} 
            />
          )}

          {(user.role === 'master' || user.role === 'supervisor' || user.role === 'gerente_financeiro') && (
            <SidebarItem 
              icon={DollarSign} 
              label="Financeiro" 
              active={view === 'finance'} 
              onClick={() => setView('finance')} 
            />
          )}

          {user.role === 'supervisor' && (
            <SidebarItem
              icon={Building2}
              label="Painel Agência"
              active={view === 'agency_panel'}
              onClick={() => setView('agency_panel')}
            />
          )}

          {user.role === 'master' && (
            <SidebarItem 
              icon={ShieldCheck} 
              label="Auditoria" 
              active={view === 'audit'} 
              onClick={() => setView('audit')} 
            />
          )}

          {user.role === 'master' && (
            <SidebarItem 
              icon={ClipboardList} 
              label="Configurações" 
              active={view === 'settings'} 
              onClick={() => setView('settings')} 
            />
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 brand-gradient rounded-full flex items-center justify-center text-black font-black">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user.name}</p>
              <p className="text-[10px] text-emerald-400 uppercase font-black tracking-wider">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={() => setUser(null)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 relative bg-[var(--bg-main)]">
        <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        <header className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h2 className="text-4xl font-black tracking-tighter">
              {view === 'dashboard' && 'Dashboard'}
              {view === 'clients' && 'Gestão de Processos'}
              {view === 'agencies' && 'Gestão de Agências'}
              {view === 'process_detail' && 'Detalhes do Processo'}
              {view === 'finance' && 'Financeiro'}
              {view === 'audit' && 'Logs de Auditoria'}
              {view === 'settings' && 'Configurações'}
              {view === 'agency_panel' && 'Painel da Agência'}
            </h2>
            <div className="flex items-center gap-2 text-[var(--text-muted)] mt-1">
              <MapPin size={14} />
              <span className="text-sm font-medium">Korus Central • {new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input 
                data-testid="global-search-input"
                type="text" 
                placeholder="Buscar..." 
                className="pl-10 pr-4 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all w-64 text-sm"
              />
            </div>
            {(view === 'clients' || view === 'dashboard') && (user.role === 'supervisor' || user.role === 'master') && (
              <button 
                data-testid="new-process-button"
                onClick={() => {
                  setEditingProcess(null);
                  setProcessForm({
                    client_id: '',
                    visa_type_id: '',
                    consultant_id: '',
                    analyst_id: '',
                    status: 'started',
                    internal_status: 'pending'
                  });
                  setShowProcessModal(true);
                }}
                className="brand-gradient text-black px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:opacity-90 transition-all brand-shadow"
              >
                <Plus size={18} />
                <span>Novo Processo</span>
              </button>
            )}
            {view === 'agencies' && user.role === 'master' && (
              <button 
                data-testid="new-agency-button"
                onClick={() => setShowAgencyModal(true)}
                className="brand-gradient text-black px-4 py-2 rounded-xl flex items-center gap-2 font-bold hover:opacity-90 transition-all brand-shadow"
              >
                <Plus size={18} />
                <span>Nova Agência</span>
              </button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Processos Ativos', value: processes.length, icon: FileText, color: 'text-emerald-400' },
                  { label: 'Aguardando Docs', value: processes.filter(p => p.internal_status === 'documents_requested').length, icon: Clock, color: 'text-amber-400' },
                  { label: 'Em Análise', value: processes.filter(p => p.status === 'analyzing').length, icon: Search, color: 'text-blue-400' },
                  { label: 'Concluídos', value: processes.filter(p => p.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[var(--bg-card)]/50 p-6 rounded-3xl border border-[var(--border-color)] shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 bg-[var(--bg-input)] rounded-2xl ${stat.color}`}>
                        <stat.icon size={24} />
                      </div>
                    </div>
                    <p className="text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest">{stat.label}</p>
                    <h3 className="text-3xl font-black mt-1">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="bg-[var(--bg-card)]/50 border border-[var(--border-color)] p-6 rounded-3xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl">
                    <Clock size={24} />
                  </div>
                  <span className="text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest">Aguardando Docs</span>
                </div>
                <p className="text-5xl font-black">
                  {processes.filter(p => p.internal_status === 'documents_requested').length}
                </p>
              </div>

              <div className="bg-[var(--bg-card)]/50 border border-[var(--border-color)] p-6 rounded-3xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
                    <CheckCircle2 size={24} />
                  </div>
                  <span className="text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest">Concluídos</span>
                </div>
                <p className="text-5xl font-black">
                  {processes.filter(p => p.status === 'completed').length}
                </p>
              </div>

              {/* Recent Activity / Client View */}
              <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black tracking-tight">Processos Recentes</h3>
                    <button onClick={() => setView('clients')} className="text-xs font-black text-emerald-400 uppercase tracking-widest hover:underline">Ver todos</button>
                  </div>
                  
                  <div className="space-y-4">
                    {processes.slice(0, 5).map(process => (
                      <div 
                        key={process.id} 
                        onClick={() => fetchProcessDetail(process.id)}
                        className="bg-[var(--bg-card)]/50 p-6 rounded-3xl border border-[var(--border-color)] hover:border-emerald-500/30 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[var(--bg-input)] rounded-2xl flex items-center justify-center text-emerald-400 group-hover:brand-gradient group-hover:text-black transition-all">
                              <FileText size={24} />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-[var(--text-main)]">{process.visa_name || 'Visto em Processamento'}</h4>
                              <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">{process.client_name || 'Cliente'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <StatusBadge status={process.status} />
                            <p className="text-[10px] text-[var(--text-muted)] font-bold mt-2 uppercase tracking-widest">
                              Iniciado em {new Date(process.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {processes.length === 0 && (
                      <div className="text-center py-20 bg-[var(--bg-card)]/30 rounded-[40px] border border-dashed border-[var(--border-color)]">
                        <FileText className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" size={64} />
                        <h4 className="text-[var(--text-muted)] font-bold">Nenhum processo encontrado.</h4>
                        {/* Start modal button removed as clients are handled separately */}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black tracking-tight">Notificações</h3>
                  <div className="bg-[var(--bg-card)]/50 p-6 rounded-3xl border border-[var(--border-color)] space-y-6">
                    {[
                      { text: 'Seu documento "Passaporte" foi aprovado.', time: '2h atrás', icon: CheckCircle2, color: 'text-emerald-400' },
                      { text: 'Nova mensagem do seu consultor.', time: '5h atrás', icon: MessageSquare, color: 'text-blue-400' },
                      { text: 'Pagamento confirmado com sucesso.', time: '1d atrás', icon: DollarSign, color: 'text-emerald-500' },
                    ].map((notif, i) => (
                      <div key={i} className="flex gap-4 group cursor-pointer">
                        <div className={`mt-1 ${notif.color}`}>
                          <notif.icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[var(--text-main)] group-hover:text-emerald-500 transition-colors">{notif.text}</p>
                          <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'finance' && canAccessFinance && (
            <motion.div 
              key="finance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {!isFinanceModuleEnabled && user?.role !== 'master' && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-3" data-testid="finance-module-disabled-warning">
                  <p className="text-sm font-bold text-amber-300">
                    O módulo financeiro desta agência está desativado. Você pode visualizar os dados, mas não pode lançar novas contas.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--bg-card)]/50 p-6 rounded-3xl border border-[var(--border-color)]">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest">Total a Receber</p>
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mt-1">
                    ${revenues.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] mt-2 font-bold uppercase tracking-widest">
                    {revenues.filter(r => r.status === 'pending').length} pendentes
                  </p>
                </div>
                <div className="bg-[var(--bg-card)]/50 p-6 rounded-3xl border border-[var(--border-color)]">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest">Total a Pagar</p>
                    <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
                      <ArrowDownLeft size={16} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mt-1 text-red-400">
                    ${expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                  <p className="text-[10px] text-[var(--text-muted)] mt-2 font-bold uppercase tracking-widest">
                    {expenses.filter(e => e.status === 'pending').length} pendentes
                  </p>
                </div>
                <div className="bg-[var(--bg-card)]/50 p-6 rounded-3xl border border-[var(--border-color)]">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest">Saldo Previsto</p>
                    <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                      <DollarSign size={16} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mt-1 text-cyan-400">
                    ${(revenues.reduce((acc, curr) => acc + curr.amount, 0) - expenses.reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
              </div>

              <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setFinanceTab('receivable')}
                      className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${financeTab === 'receivable' ? 'border-emerald-500 text-[var(--text-main)]' : 'border-transparent text-[var(--text-muted)]'}`}
                    >
                      Contas a Receber
                    </button>
                    <button 
                      onClick={() => setFinanceTab('payable')}
                      className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${financeTab === 'payable' ? 'border-red-500 text-[var(--text-main)]' : 'border-transparent text-[var(--text-muted)]'}`}
                    >
                      Contas a Pagar
                    </button>
                  </div>
                  <button 
                    data-testid="finance-new-entry-button"
                    disabled={!isFinanceModuleEnabled && user?.role !== 'master'}
                    onClick={() => {
                      if (!isFinanceModuleEnabled && user?.role !== 'master') {
                        notify('Módulo financeiro desativado para esta agência.', 'error');
                        return;
                      }

                      setEditingFinance(null);
                      setFinanceForm({
                        description: '',
                        amount: 0,
                        due_date: new Date().toISOString().split('T')[0],
                        status: 'pending',
                        category: '',
                        agency_id: ''
                      });
                      setShowFinanceModal(true);
                    }}
                    className={`brand-gradient text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                      !isFinanceModuleEnabled && user?.role !== 'master' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Plus size={16} />
                    Novo Lançamento
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[var(--bg-input)] text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest">
                        <th className="px-6 py-4">Descrição</th>
                        <th className="px-6 py-4">Categoria</th>
                        <th className="px-6 py-4">Vencimento</th>
                        <th className="px-6 py-4">Valor</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {(financeTab === 'receivable' ? revenues : expenses).map((item) => (
                        <tr key={item.id} className="hover:bg-[var(--bg-input)] transition-colors group">
                          <td className="px-6 py-4">
                            <p className="font-bold text-sm">{item.description}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-[var(--bg-input)] rounded-lg text-[var(--text-muted)]">
                              {item.category || 'Geral'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs">
                              <Calendar size={14} />
                              {new Date(item.due_date).toLocaleDateString('pt-BR')}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className={`font-black ${financeTab === 'receivable' ? 'text-emerald-400' : 'text-red-400'}`}>
                              ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                              item.status === 'paid' || item.status === 'received' 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {item.status === 'paid' ? 'Pago' : item.status === 'received' ? 'Recebido' : 'Pendente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                disabled={!isFinanceModuleEnabled && user?.role !== 'master'}
                                onClick={() => {
                                  if (!isFinanceModuleEnabled && user?.role !== 'master') {
                                    notify('Módulo financeiro desativado para esta agência.', 'error');
                                    return;
                                  }

                                  setEditingFinance(item);
                                  setFinanceForm({
                                    description: item.description,
                                    amount: item.amount,
                                    due_date: item.due_date,
                                    status: item.status,
                                    category: item.category || '',
                                    agency_id: item.agency_id,
                                  });
                                  setShowFinanceModal(true);
                                }}
                                className={`p-2 hover:bg-[var(--bg-input)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all ${
                                  !isFinanceModuleEnabled && user?.role !== 'master' ? 'opacity-40 cursor-not-allowed' : ''
                                }`}
                              >
                                <Search size={14} />
                              </button>
                              <button 
                                disabled={!isFinanceModuleEnabled && user?.role !== 'master'}
                                onClick={() => deleteFinance(item.id, financeTab)}
                                className={`p-2 hover:bg-red-500/20 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-all ${
                                  !isFinanceModuleEnabled && user?.role !== 'master' ? 'opacity-40 cursor-not-allowed' : ''
                                }`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(financeTab === 'receivable' ? revenues : expenses).length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-20 text-center">
                            <DollarSign className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" size={48} />
                            <p className="text-[var(--text-muted)] font-bold">Nenhum lançamento encontrado.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'agencies' && user.role === 'master' && (
            <motion.div 
              key="agencies"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {agencies.map(agency => (
                <div key={agency.id} className="bg-[var(--bg-card)]/50 p-6 rounded-3xl border border-[var(--border-color)] hover:border-emerald-500/50 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:brand-gradient group-hover:text-black transition-all w-14 h-14 flex items-center justify-center overflow-hidden">
                      {agency.logo_url ? (
                        <img
                          src={agency.logo_url}
                          alt={`Logo ${agency.name}`}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                          data-testid={`agency-logo-preview-${agency.id}`}
                        />
                      ) : (
                        <Building2 size={24} />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        data-testid={`agency-edit-button-${agency.id}`}
                        onClick={() => {
                          setEditingAgency(agency);
                          setNewAgency({
                            name: agency.name,
                            slug: agency.slug,
                            has_finance: JSON.parse(agency.modules || '{}').finance,
                            admin_name: '',
                            admin_email: '',
                            admin_password: ''
                          });
                          setShowAgencyModal(true);
                        }}
                        className="p-2 hover:bg-[var(--bg-input)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                        title="Editar Agência"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        data-testid={`agency-copy-link-button-${agency.id}`}
                        onClick={() => copyAgencyLink(agency.slug)}
                        className="p-2 hover:bg-[var(--bg-input)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                        title="Copiar Link de Acesso"
                      >
                        <LinkIcon size={18} />
                      </button>
                      <button 
                        data-testid={`agency-reset-password-button-${agency.id}`}
                        onClick={() => resetAgencyPassword(agency.id)}
                        className="p-2 hover:bg-[var(--bg-input)] rounded-lg text-[var(--text-muted)] hover:text-orange-400 transition-all"
                        title="Resetar Senha Admin"
                      >
                        <ShieldCheck size={18} />
                      </button>
                      <button 
                        data-testid={`agency-delete-button-${agency.id}`}
                        onClick={() => deleteAgency(agency.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-black text-xl tracking-tight">{agency.name}</h4>
                  <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mt-1">/{agency.slug}</p>

                  <div className="mt-5 p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] space-y-3" data-testid={`agency-admin-access-card-${agency.id}`}>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest">Login do Administrador</p>
                    <p className="text-sm font-bold" data-testid={`agency-admin-email-${agency.id}`}>
                      {agency.admin_email || 'Administrador não configurado'}
                    </p>
                    {agency.admin_role && (
                      <p className="text-[10px] uppercase tracking-widest font-black text-[var(--text-muted)]" data-testid={`agency-admin-role-${agency.id}`}>
                        Perfil atual: {agency.admin_role}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        data-testid={`agency-copy-admin-access-button-${agency.id}`}
                        onClick={() => copyAdminAccess(agency)}
                        className="px-3 py-2 rounded-xl bg-[var(--bg-input)]/50 hover:bg-[var(--bg-input)] transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        <Copy size={14} />
                        Copiar acesso admin
                      </button>
                      <label
                        data-testid={`agency-upload-logo-button-${agency.id}`}
                        className="px-3 py-2 rounded-xl bg-[var(--bg-input)]/50 hover:bg-[var(--bg-input)] transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                      >
                        <Upload size={14} />
                        Upload logo
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(event) => handleMasterAgencyLogoUpload(agency, event)}
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col gap-2">
                    <a 
                      href={`/?agency=${encodeURIComponent(agency.slug)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 flex items-center gap-2 transition-colors"
                    >
                      <UserPlus size={14} />
                      Link de Cadastro/Login Cliente
                    </a>
                    <a 
                      href="/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-2 transition-colors"
                    >
                      <ShieldCheck size={14} />
                      Link de Login Agência
                    </a>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest">Processos</p>
                      <p className="font-black text-xl">24</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest">Status</p>
                      <span className="text-emerald-400 text-xs font-black uppercase">Ativa</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {view === 'clients' && (
            <motion.div 
              key="clients"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-zinc-500 text-[10px] uppercase font-black tracking-widest">
                      <th className="px-6 py-4">Cliente</th>
                      <th className="px-6 py-4">Visto</th>
                      <th className="px-6 py-4">Consultor</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Etapa</th>
                      <th className="px-6 py-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {processes.map(process => (
                      <tr key={process.id} className="hover:bg-[var(--bg-input)] transition-all">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[var(--bg-input)] rounded-full flex items-center justify-center text-emerald-400 text-xs font-black">
                              {process.client_name?.charAt(0) || '?'}
                            </div>
                            <span className="font-bold text-sm">{process.client_name || 'Desconhecido'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-[var(--text-muted)] font-medium">{process.visa_name || process.type}</td>
                        <td className="px-6 py-4 text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">{process.consultant_name || 'Não atribuído'}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={process.status} />
                        </td>
                        <td className="px-6 py-4 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                          {STATUS_LABELS[process.internal_status] || process.internal_status}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {(user.role === 'consultant' || user.role === 'supervisor' || user.role === 'master') && process.status !== 'completed' && (
                              <button
                                data-testid={`process-edit-button-${process.id}`}
                                onClick={() => openProcessEditModal(process)}
                                className="p-2 hover:bg-blue-500/20 rounded-lg transition-all text-blue-400"
                                title="Editar processo aberto"
                              >
                                <Pencil size={18} />
                              </button>
                            )}
                            <button 
                              data-testid={`process-details-button-${process.id}`}
                              onClick={() => fetchProcessDetail(process.id)}
                              className="p-2 hover:bg-emerald-500/20 rounded-lg transition-all text-emerald-400"
                              title="Ver detalhes"
                            >
                              <ChevronRight size={20} />
                            </button>
                            {(user.role === 'master' || user.role === 'supervisor') && (
                              <button 
                                data-testid={`process-delete-button-${process.id}`}
                                onClick={() => deleteProcess(process.id)}
                                className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-400"
                                title="Excluir processo"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {view === 'leads' && (user.role === 'master' || user.role === 'supervisor') && (
            <motion.div 
              key="leads"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                  <h3 className="font-black text-lg uppercase tracking-tighter">Leads da Agência</h3>
                  <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">Total: {leads.length}</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] border-b border-[var(--border-color)]">
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4">E-mail</th>
                        <th className="px-6 py-4">Telefone</th>
                        <th className="px-6 py-4">Data Cadastro</th>
                        <th className="px-6 py-4">Status Processo</th>
                        <th className="px-6 py-4">Status Interno</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {leads.map((lead, idx) => (
                        <tr key={`${lead.id}-${lead.process_id || idx}`} className="hover:bg-[var(--bg-input)] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 brand-gradient rounded-full flex items-center justify-center text-black font-black text-xs">
                                {lead.name.charAt(0)}
                              </div>
                              <span className="font-bold">{lead.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{lead.email}</td>
                          <td className="px-6 py-4 text-sm text-[var(--text-muted)]" data-testid={`lead-phone-${lead.id}`}>{lead.phone || '-'}</td>
                          <td className="px-6 py-4 text-sm text-[var(--text-muted)]">
                            {new Date(lead.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            {lead.process_status ? (
                              <StatusBadge status={lead.process_status} />
                            ) : (
                              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-400/10 px-2 py-1 rounded-md">Não Iniciado</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                              {lead.process_internal_status || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {!lead.process_id ? (
                                <button 
                                  onClick={() => {
                                    setProcessForm({ ...processForm, client_id: String(lead.id) });
                                    setEditingProcess(null);
                                    setShowProcessModal(true);
                                  }}
                                  className="p-2 hover:bg-emerald-500/20 rounded-lg transition-all text-emerald-400"
                                  title="Iniciar Processo"
                                >
                                  <Plus size={18} />
                                </button>
                              ) : (
                                <>
                                  <button 
                                    onClick={() => {
                                      const proc = processes.find(p => p.id === lead.process_id);
                                      if (proc) openProcessEditModal(proc);
                                    }}
                                    className="p-2 hover:bg-blue-500/20 rounded-lg transition-all text-blue-400"
                                    title="Editar Processo"
                                  >
                                    <Pencil size={18} />
                                  </button>
                                  <button 
                                    onClick={() => fetchProcessDetail(lead.process_id)}
                                    className="p-2 hover:bg-emerald-500/20 rounded-lg transition-all text-emerald-400"
                                    title="Ver Detalhes"
                                  >
                                    <ChevronRight size={20} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'audit' && user.role === 'master' && (
            <motion.div 
              key="audit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)]">
                  <h3 className="font-black text-lg uppercase tracking-tighter">Logs do Sistema</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[var(--bg-input)] text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest">
                        <th className="px-6 py-4">Data</th>
                        <th className="px-6 py-4">Agência</th>
                        <th className="px-6 py-4">Usuário</th>
                        <th className="px-6 py-4">Ação</th>
                        <th className="px-6 py-4">Detalhes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-[var(--bg-input)] transition-colors">
                          <td className="px-6 py-4 text-xs text-[var(--text-muted)]">
                            {new Date(log.created_at).toLocaleString('pt-BR')}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold text-emerald-400">{log.agency_name || 'Sistema'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold text-[var(--text-main)]">{log.user_name || 'Desconhecido'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-[var(--bg-input)] rounded-lg text-[var(--text-muted)]">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-[var(--text-muted)]">
                            {log.details}
                          </td>
                        </tr>
                      ))}
                      {auditLogs.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-20 text-center">
                            <ShieldCheck className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" size={48} />
                            <p className="text-[var(--text-muted)] font-bold">Nenhum log registrado.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'settings' && user.role === 'master' && (
            <motion.div 
              key="settings-master"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                  <h3 className="font-black text-lg uppercase tracking-tighter">Gestão Global de Usuários</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[var(--bg-input)] text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest">
                        <th className="px-6 py-4">Nome</th>
                        <th className="px-6 py-4">Agência</th>
                        <th className="px-6 py-4">Função</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {globalUsers.map(u => (
                        <tr key={u.id} className="hover:bg-[var(--bg-input)] transition-colors group">
                          <td className="px-6 py-4">
                            <p className="font-bold text-sm">{u.name}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">{u.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold text-emerald-400">{u.agency_name || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                              u.role === 'supervisor'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : u.role === 'gerente_financeiro'
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : 'bg-[var(--bg-input)] text-[var(--text-muted)]'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingUser(u);
                                  setUserForm({ name: u.name, email: u.email, password: '', role: u.role });
                                  setShowUserModal(true);
                                }}
                                className="p-2 hover:bg-[var(--bg-input)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                              >
                                <Search size={14} />
                              </button>
                              <button 
                                onClick={() => openTeamPasswordResetModal(u)}
                                className="p-2 hover:bg-orange-500/20 rounded-lg text-[var(--text-muted)] hover:text-orange-400 transition-all"
                                title="Resetar Senha"
                              >
                                <Key size={14} />
                              </button>
                              <button 
                                onClick={() => deleteUser(u.id)}
                                className="p-2 hover:bg-red-500/20 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden" data-testid="master-admin-access-table-card">
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                  <h3 className="font-black text-lg uppercase tracking-tighter">Login dos Administradores por Agência</h3>
                  <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">Total: {agencies.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[var(--bg-input)] text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest">
                        <th className="px-6 py-4">Agência</th>
                        <th className="px-6 py-4">E-mail Admin</th>
                        <th className="px-6 py-4">Link Cliente</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {agencies.map((agency) => (
                        <tr key={`master-access-${agency.id}`} className="hover:bg-[var(--bg-input)] transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-sm">{agency.name}</p>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">/{agency.slug}</p>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold" data-testid={`master-table-admin-email-${agency.id}`}>
                            <p>{agency.admin_email || 'Não configurado'}</p>
                            {agency.admin_role && (
                              <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-1">perfil: {agency.admin_role}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs text-emerald-400 font-bold">{`${window.location.origin}/?agency=${agency.slug}`}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                data-testid={`master-copy-admin-access-${agency.id}`}
                                onClick={() => copyAdminAccess(agency)}
                                className="px-3 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-input)] transition-colors text-xs font-black uppercase tracking-widest"
                              >
                                Copiar Acesso
                              </button>
                              <button
                                data-testid={`master-reset-admin-password-${agency.id}`}
                                onClick={() => resetAgencyPassword(agency.id)}
                                className="px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 transition-colors text-xs font-black uppercase tracking-widest"
                              >
                                Resetar senha
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'team' && (user.role === 'master' || user.role === 'supervisor') && (
            <motion.div 
              key="team"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                  <h3 className="font-black text-lg uppercase tracking-tighter">Equipe da Agência</h3>
                  <button 
                    onClick={() => {
                      setEditingUser(null);
                      setUserForm({ name: '', email: '', password: '', role: 'consultant' });
                      setShowUserModal(true);
                    }}
                    className="brand-gradient text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Novo Usuário
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[var(--bg-input)] text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest">
                        <th className="px-6 py-4">Nome</th>
                        <th className="px-6 py-4">Função</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {agencyUsers.map(u => (
                        <tr key={u.id} className="hover:bg-[var(--bg-input)] transition-colors group">
                          <td className="px-6 py-4">
                            <p className="font-bold text-sm">{u.name}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">{u.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                              u.role === 'supervisor'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : u.role === 'gerente_financeiro'
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : 'bg-[var(--bg-input)] text-[var(--text-muted)]'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingUser(u);
                                  setUserForm({ name: u.name, email: u.email, password: '', role: u.role });
                                  setShowUserModal(true);
                                }}
                                className="p-2 hover:bg-[var(--bg-input)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                              >
                                <Search size={14} />
                              </button>
                              <button 
                                onClick={() => openTeamPasswordResetModal(u)}
                                className="p-2 hover:bg-orange-500/20 rounded-lg text-[var(--text-muted)] hover:text-orange-400 transition-all"
                                title="Resetar Senha"
                              >
                                <Key size={14} />
                              </button>
                              <button 
                                onClick={() => deleteUser(u.id)}
                                className="p-2 hover:bg-red-500/20 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'agency_panel' && user.role === 'supervisor' && (
            <motion.div 
              key="agency-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Agency Panel Tabs */}
              <div className="flex bg-[var(--bg-card)]/50 p-1 rounded-2xl border border-[var(--border-color)] w-fit">
                <button
                  onClick={() => setAgencyTab('geral')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    agencyTab === 'geral' ? 'brand-gradient text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <LayoutDashboard size={14} />
                  Geral
                </button>
                <button
                  onClick={() => setAgencyTab('configuracoes')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    agencyTab === 'configuracoes' ? 'brand-gradient text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Settings size={14} />
                  Configurações
                </button>
                <button
                  onClick={() => setAgencyTab('clientes')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    agencyTab === 'clientes' ? 'brand-gradient text-black shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Users size={14} />
                  Clientes
                </button>
              </div>

              {agencyTab === 'geral' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-color)]">
                      <h3 className="font-black text-lg uppercase tracking-tighter">Resumo da Agência</h3>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden">
                          {agencySettings.logo_url ? (
                            <img
                              src={agencySettings.logo_url}
                              alt={agencySettings.name}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Building2 size={28} className="text-[var(--text-muted)]" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-xl text-[var(--text-main)]">{agencySettings.name || '-'}</p>
                          <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">/{agencySettings.slug || '-'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)]">
                          <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black mb-1">Administrador</p>
                          <p className="text-sm font-bold text-[var(--text-main)]">{agencySettings.admin_email || user.email}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)]">
                          <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black mb-1">Módulo Financeiro</p>
                          <p className={`text-sm font-black uppercase tracking-widest ${isFinanceModuleEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {isFinanceModuleEnabled ? 'Ativado' : 'Desativado'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-color)]">
                      <h3 className="font-black text-lg uppercase tracking-tighter">Links de Acesso</h3>
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] space-y-2">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black">Portal do Cliente</p>
                        <p className="text-sm font-bold break-all">
                          {agencySettings.slug ? `${window.location.origin}/?agency=${agencySettings.slug}` : `${window.location.origin}/?agency=`}
                        </p>
                        <button
                          onClick={copyAgencyPanelClientLink}
                          className="px-3 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-input)] transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2"
                        >
                          <Copy size={14} />
                          Copiar Link
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-color)] space-y-2">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black">Login da Equipe</p>
                        <p className="text-sm font-bold break-all">{window.location.origin}/</p>
                        <button
                          onClick={copyAgencyPanelTeamLoginLink}
                          className="px-3 py-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-input)] transition-colors text-xs font-black uppercase tracking-widest flex items-center gap-2"
                        >
                          <Copy size={14} />
                          Copiar Link
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden lg:col-span-2">
                    <div className="p-6 border-b border-[var(--border-color)]">
                      <h3 className="font-black text-lg uppercase tracking-tighter">Personalização</h3>
                    </div>
                    <form onSubmit={handleUpdateAgencySettings} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Nome da Agência</label>
                          <input 
                            type="text" 
                            required
                            className="w-full px-6 py-4 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                            value={agencySettings.name}
                            onChange={(e) => setAgencySettings({ ...agencySettings, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Logomarca</label>
                          <div className="flex items-center gap-4">
                            <label className="flex-1 flex flex-col items-center justify-center px-6 py-8 bg-[var(--bg-input)] border-2 border-dashed border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-all group">
                              <Upload className="text-[var(--text-muted)] group-hover:text-emerald-400 mb-2 transition-colors" size={24} />
                              <span className="text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--text-main)]">Upload Logo</span>
                              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            </label>
                            {agencySettings.logo_url && (
                              <div className="w-32 h-32 bg-[var(--bg-input)] rounded-2xl flex items-center justify-center p-4 border border-[var(--border-color)]">
                                <img src={agencySettings.logo_url} alt="Logo Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-end">
                        <button 
                          type="submit"
                          className="w-full brand-gradient text-black font-black py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg uppercase tracking-widest text-xs"
                        >
                          Salvar Alterações Gerais
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {agencyTab === 'configuracoes' && (
                <div className="space-y-8">
                  {/* Configuration Sub-tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                      { id: 'destinos', label: 'Destinos', icon: Globe },
                      { id: 'objetivos', label: 'Objetivos', icon: Target },
                      { id: 'tasks', label: 'Checklist', icon: ClipboardList },
                      { id: 'vistos', label: 'Tipos de Visto', icon: ShieldCheck },
                      { id: 'formularios', label: 'Form Builder', icon: FileText },
                      { id: 'planos', label: 'Planos', icon: DollarSign },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setConfigSubTab(tab.id as any)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap border ${
                          configSubTab === tab.id 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-[var(--bg-card)]/50 border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        <tab.icon size={12} />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {configSubTab === 'destinos' && (
                    <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                      <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                        <h3 className="font-black text-lg uppercase tracking-tighter">Gestão de Destinos</h3>
                        <button 
                          onClick={() => {
                            setEditingDestination(null);
                            setDestinationForm({ name: '', code: '', flag: '', description: '', image: '', highlight_points: [], is_active: true, order: 0 });
                            setShowDestinationModal(true);
                          }}
                          className="brand-gradient text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"
                        >
                          <Plus size={16} />
                          Novo Destino
                        </button>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                        {destinations.sort((a, b) => (a.order || 0) - (b.order || 0)).map((dest) => (
                          <div key={dest.id} className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] space-y-4 group relative hover:border-emerald-500/30 transition-all">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl flex items-center justify-center text-2xl shadow-inner">
                                  {dest.flag}
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg text-[var(--text-main)]">{dest.name}</h4>
                                  <div className="flex gap-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${dest.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                      {dest.is_active ? 'Ativo' : 'Inativo'}
                                    </span>
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[var(--bg-input)] text-[var(--text-muted)]">
                                      {dest.code}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => {
                                    setEditingDestination(dest);
                                    setDestinationForm({ 
                                      name: dest.name, 
                                      code: dest.code || '',
                                      flag: dest.flag, 
                                      description: dest.description, 
                                      image: dest.image, 
                                      highlight_points: Array.isArray(dest.highlight_points) ? dest.highlight_points : [],
                                      is_active: dest.is_active,
                                      order: dest.order || 0
                                    });
                                    setShowDestinationModal(true);
                                  }}
                                  className="p-2 hover:bg-[var(--bg-input)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button 
                                  onClick={() => deleteDestination(dest.id)}
                                  className="p-2 hover:bg-red-500/20 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] line-clamp-2">{dest.description}</p>
                            {dest.image && (
                              <div className="h-20 rounded-xl overflow-hidden border border-[var(--border-color)]">
                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>
                        ))}
                        {destinations.length === 0 && (
                          <div className="col-span-full text-center py-20 bg-[var(--bg-card)]/30 rounded-3xl border border-dashed border-[var(--border-color)]">
                            <Globe size={40} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                            <p className="text-[var(--text-muted)] text-sm font-bold">Nenhum destino cadastrado.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {configSubTab === 'objetivos' && (
                    <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                      <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                        <h3 className="font-black text-lg uppercase tracking-tighter">Objetivos da Viagem</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              const newGoal = { id: Date.now().toString(), label: 'Novo Objetivo', icon: 'Globe' };
                              setAgencySettings(prev => ({ ...prev, pre_form_questions: [...(prev.pre_form_questions || []), newGoal] }));
                            }}
                            className="bg-[var(--bg-input)] hover:bg-[var(--bg-card)] text-[var(--text-main)] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border border-[var(--border-color)]"
                          >
                            <Plus size={16} />
                            Adicionar
                          </button>
                          <button 
                            onClick={handleUpdateAgencySettings}
                            className="brand-gradient text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"
                          >
                            Salvar Objetivos
                          </button>
                        </div>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                        {(agencySettings.pre_form_questions || []).map((goal, idx) => (
                          <div key={goal.id} className="p-4 bg-[var(--bg-input)] rounded-2xl border border-[var(--border-color)] flex items-center gap-4">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Rótulo</label>
                                <input 
                                  type="text" 
                                  value={goal.label}
                                  onChange={(e) => {
                                    const newGoals = [...(agencySettings.pre_form_questions || [])];
                                    newGoals[idx].label = e.target.value;
                                    setAgencySettings(prev => ({ ...prev, pre_form_questions: newGoals }));
                                  }}
                                  className="w-full p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm font-bold outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Ícone</label>
                                <select 
                                  value={goal.icon}
                                  onChange={(e) => {
                                    const newGoals = [...(agencySettings.pre_form_questions || [])];
                                    newGoals[idx].icon = e.target.value;
                                    setAgencySettings(prev => ({ ...prev, pre_form_questions: newGoals }));
                                  }}
                                  className="w-full p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm font-bold outline-none focus:ring-1 focus:ring-emerald-500"
                                >
                                  <option value="Globe">Globe</option>
                                  <option value="Plane">Plane</option>
                                  <option value="Target">Target</option>
                                  <option value="Users">Users</option>
                                  <option value="Briefcase">Briefcase</option>
                                  <option value="Heart">Heart</option>
                                  <option value="GraduationCap">GraduationCap</option>
                                </select>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                const newGoals = (agencySettings.pre_form_questions || []).filter((_, i) => i !== idx);
                                setAgencySettings(prev => ({ ...prev, pre_form_questions: newGoals }));
                              }}
                              className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-500 hover:text-red-400 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {configSubTab === 'tasks' && (
                    <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                      <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                        <h3 className="font-black text-lg uppercase tracking-tighter">Checklist de Processos</h3>
                        <button 
                          onClick={() => {
                            setEditingTask(null);
                            setTaskForm({ title: '', description: '', is_active: true });
                            setShowTaskModal(true);
                          }}
                          className="brand-gradient text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Nova Task
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-[var(--bg-card)]/50 text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest">
                              <th className="px-6 py-4">Título</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-color)]">
                            {tasks.map(t => (
                              <tr key={t.id} className="hover:bg-[var(--bg-card)]/30 transition-colors group">
                                <td className="px-6 py-4">
                                  <p className="font-bold text-sm">{t.title}</p>
                                  <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[200px]">{t.description}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                                    t.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[var(--bg-card)]/50 text-[var(--text-muted)]'
                                  }`}>
                                    {t.is_active ? 'Ativa' : 'Inativa'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => {
                                        setEditingTask(t);
                                        setTaskForm({ title: t.title, description: t.description, is_active: t.is_active });
                                        setShowTaskModal(true);
                                      }}
                                      className="p-2 hover:bg-[var(--bg-card)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                                    >
                                      <Search size={14} />
                                    </button>
                                    <button 
                                      onClick={() => deleteTask(t.id)}
                                      className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-500 hover:text-red-400 transition-all"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {configSubTab === 'planos' && (
                    <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                      <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                        <h3 className="font-black text-lg uppercase tracking-tighter">Gestão de Planos</h3>
                        <button 
                          onClick={() => {
                            setEditingPlan(null);
                            setPlanForm({ name: '', description: '', price: 0, features: [], is_recommended: false, icon: 'Star' });
                            setShowPlanModal(true);
                          }}
                          className="brand-gradient text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"
                        >
                          <Plus size={16} />
                          Novo Plano
                        </button>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                        {plans.map((plan) => (
                          <div key={plan.id} className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] space-y-4 group relative hover:border-emerald-500/30 transition-all">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl flex items-center justify-center text-emerald-400 shadow-inner">
                                  <DollarSign size={24} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg text-[var(--text-main)]">{plan.name}</h4>
                                  <div className="flex gap-2">
                                    {plan.is_recommended && (
                                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                                        Recomendado
                                      </span>
                                    )}
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[var(--bg-input)] text-[var(--text-muted)]">
                                      R$ {plan.price.toLocaleString('pt-BR')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => {
                                    setEditingPlan(plan);
                                    setPlanForm({ 
                                      name: plan.name, 
                                      description: plan.description, 
                                      price: plan.price, 
                                      features: Array.isArray(plan.features) ? plan.features : [], 
                                      is_recommended: plan.is_recommended, 
                                      icon: plan.icon 
                                    });
                                    setShowPlanModal(true);
                                  }}
                                  className="p-2 hover:bg-[var(--bg-input)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button 
                                  onClick={() => deletePlan(plan.id)}
                                  className="p-2 hover:bg-red-500/20 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] line-clamp-2">{plan.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {(Array.isArray(plan.features) ? plan.features : []).slice(0, 3).map((f, i) => (
                                <span key={i} className="text-[9px] bg-[var(--bg-input)] text-[var(--text-muted)] px-2 py-0.5 rounded-full border border-[var(--border-color)]">
                                  {f}
                                </span>
                              ))}
                              {(Array.isArray(plan.features) ? plan.features : []).length > 3 && (
                                <span className="text-[9px] text-[var(--text-muted)] px-2 py-0.5">
                                  +{(Array.isArray(plan.features) ? plan.features : []).length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {plans.length === 0 && (
                          <div className="col-span-full text-center py-20 bg-[var(--bg-card)]/30 rounded-3xl border border-dashed border-[var(--border-color)]">
                            <DollarSign size={40} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                            <p className="text-[var(--text-muted)] text-sm font-bold">Nenhum plano cadastrado.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {configSubTab === 'formularios' && (
                    <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                      <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                        <h3 className="font-black text-lg uppercase tracking-tighter">Form Builder (Pré-Formulário)</h3>
                        <button 
                          onClick={() => {
                            setEditingFormField(null);
                            setFormFieldForm({ label: '', type: 'text', required: false, options: [], order: 0, destination_id: null });
                            setShowFormFieldModal(true);
                          }}
                          className="brand-gradient text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"
                        >
                          <Plus size={16} />
                          Novo Campo
                        </button>
                      </div>
                      <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                        {formFields.sort((a, b) => (a.order || 0) - (b.order || 0)).map((field) => (
                          <div key={field.id} className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl flex items-center justify-center text-[var(--text-muted)]">
                                {field.order}
                              </div>
                              <div>
                                <h4 className="font-bold text-[var(--text-main)]">{field.label}</h4>
                                <div className="flex gap-2 items-center">
                                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[var(--bg-input)] text-[var(--text-muted)]">
                                    {field.type}
                                  </span>
                                  {field.required && (
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-red-500/10 text-red-400">
                                      Obrigatório
                                    </span>
                                  )}
                                  {field.destination_id && (
                                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                                      Destino: {destinations.find(d => d.id === field.destination_id)?.name || field.destination_id}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => {
                                  setEditingFormField(field);
                                  setFormFieldForm({ 
                                    label: field.label, 
                                    type: field.type, 
                                    required: field.required, 
                                    options: Array.isArray(field.options) ? field.options : [], 
                                    order: field.order || 0,
                                    destination_id: field.destination_id || null
                                  });
                                  setShowFormFieldModal(true);
                                }}
                                className="p-2 hover:bg-[var(--bg-input)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                              >
                                <Pencil size={14} />
                              </button>
                              <button 
                                onClick={() => deleteFormField(field.id)}
                                className="p-2 hover:bg-red-500/20 rounded-lg text-[var(--text-muted)] hover:text-red-400 transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {formFields.length === 0 && (
                          <div className="text-center py-20 bg-[var(--bg-card)]/30 rounded-3xl border border-dashed border-[var(--border-color)]">
                            <ClipboardList size={40} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                            <p className="text-[var(--text-muted)] text-sm font-bold">Nenhum campo configurado.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {configSubTab === 'vistos' && (
                    <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                      <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                        <h3 className="font-black text-lg uppercase tracking-tighter">Tipos de Visto</h3>
                        <button 
                          onClick={() => {
                            setEditingVisaType(null);
                            setVisaTypeForm({ name: '', description: '', base_price: 0, required_docs: [] });
                            setShowVisaTypeModal(true);
                          }}
                          className="brand-gradient text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Novo Tipo
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-[var(--bg-card)]/50 text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest">
                              <th className="px-6 py-4">Nome</th>
                              <th className="px-6 py-4">Preço Base</th>
                              <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-color)]">
                            {visaTypes.map(vt => (
                              <tr key={vt.id} className="hover:bg-[var(--bg-card)]/30 transition-colors group">
                                <td className="px-6 py-4">
                                  <p className="font-bold text-sm">{vt.name}</p>
                                  <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[200px]">{vt.description}</p>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-emerald-400">
                                  R$ {vt.base_price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => {
                                        setEditingVisaType(vt);
                                        setVisaTypeForm({ 
                                          name: vt.name, 
                                          description: vt.description, 
                                          base_price: vt.base_price, 
                                          required_docs: vt.required_docs || [] 
                                        });
                                        setShowVisaTypeModal(true);
                                      }}
                                      className="p-2 hover:bg-[var(--bg-card)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                                    >
                                      <Search size={14} />
                                    </button>
                                    <button 
                                      onClick={() => deleteVisaType(vt.id)}
                                      className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-500 hover:text-red-400 transition-all"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {configSubTab === 'formularios' && (
                    <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                      <div className="p-6 border-b border-[var(--border-color)] flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-black text-lg uppercase tracking-tighter">Formulários Customizados</h3>
                          <button 
                            disabled={!formForm.visa_type_id}
                            onClick={() => {
                              setEditingForm(null);
                              setFormForm({ ...formForm, title: '', fields: [] });
                              setShowFormModal(true);
                            }}
                            className="brand-gradient text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50"
                          >
                            <Plus size={16} />
                            Novo Formulário
                          </button>
                        </div>
                        <div className="flex items-center gap-4 bg-[var(--bg-input)] p-4 rounded-2xl border border-[var(--border-color)]">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Filtrar por Visto:</label>
                          <select 
                            className="bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-500"
                            value={formForm.visa_type_id}
                            onChange={(e) => {
                              const id = Number(e.target.value);
                              setFormForm({ ...formForm, visa_type_id: id });
                              if (id) fetchForms(id);
                              else setForms([]);
                            }}
                          >
                            <option value={0}>Selecione um visto...</option>
                            {visaTypes.map(vt => (
                              <option key={vt.id} value={vt.id}>{vt.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-[var(--bg-card)]/50 text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest">
                              <th className="px-6 py-4">Título</th>
                              <th className="px-6 py-4">Campos</th>
                              <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-color)]">
                            {forms.map(f => (
                              <tr key={f.id} className="hover:bg-[var(--bg-card)]/30 transition-colors group">
                                <td className="px-6 py-4 font-bold text-sm">{f.title}</td>
                                <td className="px-6 py-4 text-xs text-[var(--text-muted)]">
                                  {(f.fields || []).length} campos configurados
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => {
                                        setEditingForm(f);
                                        setFormForm({ 
                                          visa_type_id: f.visa_type_id, 
                                          title: f.title, 
                                          fields: f.fields || [] 
                                        });
                                        setShowFormModal(true);
                                      }}
                                      className="p-2 hover:bg-[var(--bg-card)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
                                    >
                                      <Search size={14} />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteForm(f.id)}
                                      className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-500 hover:text-red-400 transition-all"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {forms.length === 0 && (
                              <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-[var(--text-muted)] text-xs font-bold">
                                  {formForm.visa_type_id ? 'Nenhum formulário para este visto.' : 'Selecione um visto para ver os formulários.'}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {agencyTab === 'clientes' && (
                <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] overflow-hidden">
                  <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-lg uppercase tracking-tighter">Gestão de Clientes</h3>
                      <p className="text-xs text-[var(--text-muted)] font-bold mt-1">Lista completa de leads e clientes da agência.</p>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">Total: {leads.length}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[var(--bg-card)]/50 text-[var(--text-muted)] text-[10px] uppercase font-black tracking-widest">
                          <th className="px-6 py-4">Cliente</th>
                          <th className="px-6 py-4">E-mail</th>
                          <th className="px-6 py-4">Status Processo</th>
                          <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-color)]">
                        {leads.map((client) => (
                          <tr key={client.id} className="hover:bg-[var(--bg-card)]/30 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="font-bold text-sm">{client.name}</p>
                              <p className="text-[10px] text-[var(--text-muted)]">{new Date(client.created_at).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-[var(--text-muted)]">{client.email}</td>
                            <td className="px-6 py-4">
                              {client.process_status ? (
                                <StatusBadge status={client.process_status} />
                              ) : (
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-card)]/50 px-2 py-1 rounded-md">Sem Processo</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                {client.process_id && (
                                  <button
                                    onClick={() => fetchProcessDetail(client.process_id)}
                                    className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                                  >
                                    Ver Processo
                                  </button>
                                )}
                                <button
                                  onClick={() => openClientPasswordResetModal({ id: client.id, name: client.name, email: client.email })}
                                  className="px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 transition-colors"
                                >
                                  Resetar Senha
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          <AnimatePresence>
            {showUserModal && (
              <div className="fixed inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[var(--bg-card)] w-full max-w-md rounded-3xl border border-[var(--border-color)] p-8 shadow-2xl"
                >
                  <h3 className="text-2xl font-black mb-6">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                  <form onSubmit={handleUserSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Nome Completo</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={userForm.name}
                        onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">E-mail</label>
                      <input 
                        type="email" 
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={userForm.email}
                        onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                      />
                    </div>
                    {!editingUser && (
                      <div>
                        <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Senha</label>
                        <input 
                          type="password" 
                          required
                          className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                          value={userForm.password}
                          onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Perfil</label>
                      <select 
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={userForm.role}
                        onChange={e => setUserForm({ ...userForm, role: e.target.value as UserRole })}
                      >
                        <option value="consultant">Consultor de Vendas</option>
                        <option value="analyst">Analista</option>
                        <option value="gerente_financeiro">Gerente Financeiro</option>
                      </select>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button 
                        type="button"
                        onClick={() => setShowUserModal(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-input)] transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 brand-gradient text-black py-3 rounded-xl font-black shadow-lg brand-shadow"
                      >
                        Confirmar
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {showTaskModal && (
              <div className="fixed inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[var(--bg-card)] w-full max-w-md rounded-3xl border border-[var(--border-color)] p-8 shadow-2xl"
                >
                  <h3 className="text-2xl font-black mb-6">{editingTask ? 'Editar Task' : 'Nova Task'}</h3>
                  <form onSubmit={handleTaskSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Título da Task</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Ex: Enviar Passaporte"
                        value={taskForm.title}
                        onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Descrição (Opcional)</label>
                      <textarea 
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                        value={taskForm.description}
                        onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-[var(--bg-input)]/50 rounded-2xl border border-[var(--border-color)]">
                      <input 
                        type="checkbox" 
                        id="task_active"
                        className="w-5 h-5 rounded border-[var(--border-color)] bg-[var(--bg-input)] text-emerald-500 focus:ring-emerald-500"
                        checked={taskForm.is_active}
                        onChange={e => setTaskForm({ ...taskForm, is_active: e.target.checked })}
                      />
                      <label htmlFor="task_active" className="text-sm font-bold text-[var(--text-muted)] cursor-pointer">
                        Task Ativa?
                      </label>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button 
                        type="button"
                        onClick={() => setShowTaskModal(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-input)] transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 brand-gradient text-black py-3 rounded-xl font-black shadow-lg brand-shadow"
                      >
                        Confirmar
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {showVisaTypeModal && (
              <div className="fixed inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[var(--bg-card)] w-full max-w-md rounded-3xl border border-[var(--border-color)] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
                >
                  <h3 className="text-2xl font-black mb-6">{editingVisaType ? 'Editar Tipo de Visto' : 'Novo Tipo de Visto'}</h3>
                  <form onSubmit={saveVisaType} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Nome</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={visaTypeForm.name}
                        onChange={e => setVisaTypeForm({ ...visaTypeForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Descrição</label>
                      <textarea 
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none"
                        value={visaTypeForm.description}
                        onChange={e => setVisaTypeForm({ ...visaTypeForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Preço Base (R$)</label>
                      <input 
                        type="number" 
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={visaTypeForm.base_price}
                        onChange={e => setVisaTypeForm({ ...visaTypeForm, base_price: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Documentos Necessários</label>
                      <div className="space-y-2">
                        {visaTypeForm.required_docs.map((doc, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input 
                              type="text" 
                              className="flex-1 px-4 py-2 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                              value={doc}
                              onChange={e => {
                                const newDocs = [...visaTypeForm.required_docs];
                                newDocs[idx] = e.target.value;
                                setVisaTypeForm({ ...visaTypeForm, required_docs: newDocs });
                              }}
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                const newDocs = visaTypeForm.required_docs.filter((_, i) => i !== idx);
                                setVisaTypeForm({ ...visaTypeForm, required_docs: newDocs });
                              }}
                              className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-500 hover:text-red-400 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => setVisaTypeForm({ ...visaTypeForm, required_docs: [...visaTypeForm.required_docs, ''] })}
                          className="w-full py-2 bg-[var(--bg-card)]/50 hover:bg-[var(--bg-card)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] transition-all flex items-center justify-center gap-2 border border-[var(--border-color)]"
                        >
                          <Plus size={12} />
                          Adicionar Documento
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button 
                        type="button"
                        onClick={() => setShowVisaTypeModal(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-card)] transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 brand-gradient text-black py-3 rounded-xl font-black shadow-lg"
                      >
                        Confirmar
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {showFormModal && (
              <div className="fixed inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[var(--bg-card)] w-full max-w-2xl rounded-3xl border border-[var(--border-color)] p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
                >
                  <h3 className="text-2xl font-black mb-6">{editingForm ? 'Editar Formulário' : 'Novo Formulário'}</h3>
                  <form onSubmit={saveForm} className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Título do Formulário</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={formForm.title}
                        onChange={e => setFormForm({ ...formForm, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Campos do Formulário</label>
                        <button 
                          type="button"
                          onClick={() => setFormForm({ ...formForm, fields: [...formForm.fields, { label: '', type: 'text', required: true }] })}
                          className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                        >
                          <Plus size={12} />
                          Novo Campo
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {formForm.fields.map((field, idx) => (
                          <div key={idx} className="p-4 bg-[var(--bg-input)] rounded-2xl border border-[var(--border-color)] grid grid-cols-1 md:grid-cols-3 gap-4 relative group">
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">Rótulo</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                                value={field.label}
                                onChange={e => {
                                  const newFields = [...formForm.fields];
                                  newFields[idx].label = e.target.value;
                                  setFormForm({ ...formForm, fields: newFields });
                                }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">Tipo</label>
                              <select 
                                className="w-full px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                                value={field.type}
                                onChange={e => {
                                  const newFields = [...formForm.fields];
                                  newFields[idx].type = e.target.value as any;
                                  setFormForm({ ...formForm, fields: newFields });
                                }}
                              >
                                <option value="text">Texto Curto</option>
                                <option value="textarea">Texto Longo</option>
                                <option value="number">Número</option>
                                <option value="date">Data</option>
                                <option value="email">E-mail</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  id={`req-${idx}`}
                                  className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-card)] text-emerald-500 focus:ring-emerald-500"
                                  checked={field.required}
                                  onChange={e => {
                                    const newFields = [...formForm.fields];
                                    newFields[idx].required = e.target.checked;
                                    setFormForm({ ...formForm, fields: newFields });
                                  }}
                                />
                                <label htmlFor={`req-${idx}`} className="text-[10px] font-bold text-[var(--text-muted)] cursor-pointer">Obrigatório</label>
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  const newFields = formForm.fields.filter((_, i) => i !== idx);
                                  setFormForm({ ...formForm, fields: newFields });
                                }}
                                className="p-2 hover:bg-red-500/20 rounded-lg text-zinc-500 hover:text-red-400 transition-all ml-auto"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button 
                        type="button"
                        onClick={() => setShowFormModal(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-card)] transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 brand-gradient text-black py-3 rounded-xl font-black shadow-lg"
                      >
                        Confirmar
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {showProcessModal && (
              <div className="fixed inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[var(--bg-card)] w-full max-w-md rounded-3xl border border-[var(--border-color)] p-8 shadow-2xl"
                >
                  <h3 className="text-2xl font-black mb-6">{editingProcess ? 'Editar Processo' : 'Novo Processo'}</h3>
                  <form onSubmit={saveProcess} className="space-y-4">
                    {!editingProcess && (
                      <>
                        <div>
                          <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Cliente</label>
                          <select 
                            required
                            className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                            value={processForm.client_id}
                            onChange={e => setProcessForm({ ...processForm, client_id: e.target.value })}
                            data-testid="process-client-select"
                          >
                            <option value="">Selecione um cliente</option>
                            {leads.map(lead => (
                              <option key={lead.id} value={lead.id}>{lead.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Tipo de Visto</label>
                          <select 
                            required
                            className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                            value={processForm.visa_type_id}
                            onChange={e => setProcessForm({ ...processForm, visa_type_id: e.target.value })}
                            data-testid="process-visa-type-select"
                          >
                            <option value="">Selecione um visto</option>
                            {visaTypes.map(v => (
                              <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {editingProcess && (
                      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30" data-testid="process-editing-open-warning">
                        <p className="text-xs font-bold text-blue-300">
                          Edição rápida de processo aberto: ajuste status e responsáveis.
                        </p>
                      </div>
                    )}

                    {editingProcess && (
                      <>
                        <div>
                          <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Status do Processo</label>
                          <select
                            className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                            value={processForm.status}
                            onChange={e => setProcessForm({ ...processForm, status: e.target.value as any })}
                            data-testid="process-status-select"
                          >
                            <option value="started">Iniciado</option>
                            <option value="payment_confirmed">Pagamento Confirmado</option>
                            <option value="analyzing">Analisando</option>
                            <option value="final_phase">Fase Final</option>
                            <option value="completed">Concluído</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Etapa Interna</label>
                          <select
                            className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                            value={processForm.internal_status}
                            onChange={e => setProcessForm({ ...processForm, internal_status: e.target.value })}
                            data-testid="process-internal-status-select"
                          >
                            <option value="pending">Pendente</option>
                            <option value="documents_requested">Documentos Solicitados</option>
                            <option value="reviewing">Em Revisão</option>
                            <option value="submitted">Submetido</option>
                            <option value="confirmed">Confirmado</option>
                            <option value="proof_received">Comprovante Enviado</option>
                          </select>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Consultor</label>
                      <select 
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={processForm.consultant_id}
                        onChange={e => setProcessForm({ ...processForm, consultant_id: e.target.value })}
                        data-testid="process-consultant-select"
                      >
                        <option value="">Automático (Round Robin)</option>
                        {agencyUsers.filter(u => u.role === 'consultant').map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Analista</label>
                      <select 
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={processForm.analyst_id}
                        onChange={e => setProcessForm({ ...processForm, analyst_id: e.target.value })}
                        data-testid="process-analyst-select"
                      >
                        <option value="">Nenhum</option>
                        {agencyUsers.filter(u => u.role === 'analyst').map(u => (
                          <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button 
                        type="button"
                        onClick={() => {
                          setShowProcessModal(false);
                          setEditingProcess(null);
                        }}
                        className="flex-1 py-3 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-input)] transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 brand-gradient text-black py-3 rounded-xl font-black shadow-lg brand-shadow"
                      >
                        {editingProcess ? 'Salvar' : 'Criar'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {showFinanceModal && (
              <div className="fixed inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[var(--bg-card)] w-full max-w-md rounded-3xl border border-[var(--border-color)] p-8 shadow-2xl"
                >
                  <h3 className="text-2xl font-black mb-6">
                    {editingFinance ? 'Editar Lançamento' : `Novo Lançamento (${financeTab === 'payable' ? 'Conta a Pagar' : 'Conta a Receber'})`}
                  </h3>
                  <form onSubmit={handleFinanceSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Descrição</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Ex: Aluguel Escritório"
                        value={financeForm.description}
                        onChange={e => setFinanceForm({ ...financeForm, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Valor</label>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                          value={financeForm.amount}
                          onChange={e => setFinanceForm({ ...financeForm, amount: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Vencimento</label>
                        <input 
                          type="date" 
                          required
                          className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                          value={financeForm.due_date}
                          onChange={e => setFinanceForm({ ...financeForm, due_date: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Categoria</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Ex: Operacional, Marketing..."
                        value={financeForm.category}
                        onChange={e => setFinanceForm({ ...financeForm, category: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Status</label>
                      <select 
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={financeForm.status}
                        onChange={e => setFinanceForm({ ...financeForm, status: e.target.value })}
                      >
                        <option value="pending">Pendente</option>
                        {financeTab === 'payable' ? (
                          <option value="paid">Pago</option>
                        ) : (
                          <option value="received">Recebido</option>
                        )}
                      </select>
                    </div>

                    {user?.role === 'master' && (
                      <div>
                        <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Agência</label>
                        <select 
                          className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                          value={financeForm.agency_id}
                          onChange={e => setFinanceForm({ ...financeForm, agency_id: e.target.value })}
                        >
                          <option value="">Plataforma (Global)</option>
                          {agencies.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex gap-3 mt-8">
                      <button 
                        type="button"
                        onClick={() => setShowFinanceModal(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-card)] transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 brand-gradient text-black py-3 rounded-xl font-black shadow-lg brand-shadow"
                      >
                        Confirmar
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {showAgencyModal && (
              <div className="fixed inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[var(--bg-card)] w-full max-w-md rounded-3xl border border-[var(--border-color)] p-8 shadow-2xl"
                >
                  <h3 className="text-2xl font-black mb-6">{editingAgency ? 'Editar Agência' : 'Cadastrar Nova Agência'}</h3>
                  <form 
                    id="agency-form"
                    onSubmit={(e) => e.preventDefault()} 
                    className="flex flex-col h-full max-h-[80vh]"
                  >
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                      <div className="space-y-4">
                        <div className="p-4 bg-[var(--bg-input)]/50 rounded-2xl border border-[var(--border-color)]">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">Informações da Agência</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Nome da Agência</label>
                              <input 
                                type="text" 
                                required
                                className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Ex: Korus Miami"
                                value={newAgency.name}
                                onChange={e => {
                                  const name = e.target.value;
                                  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                                  setNewAgency({ ...newAgency, name, slug });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Slug de Acesso</label>
                              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl">
                                <span className="text-[var(--text-muted)] text-sm">korus.com/</span>
                                <input 
                                  type="text" 
                                  required
                                  className="flex-1 bg-transparent outline-none text-emerald-400 font-bold"
                                  placeholder="slug-da-agencia"
                                  value={newAgency.slug}
                                  onChange={e => setNewAgency({ ...newAgency, slug: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-[var(--bg-input)]/50 rounded-xl border border-[var(--border-color)]">
                              <input 
                                type="checkbox" 
                                id="has_finance"
                                className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-input)] text-emerald-500 focus:ring-emerald-500"
                                checked={newAgency.has_finance}
                                onChange={e => setNewAgency({ ...newAgency, has_finance: e.target.checked })}
                              />
                              <label htmlFor="has_finance" className="text-xs font-bold text-[var(--text-muted)] cursor-pointer">
                                Financeiro Integrado
                              </label>
                            </div>
                          </div>
                        </div>
  
                        {!editingAgency && (
                          <div className="p-4 bg-[var(--bg-input)]/50 rounded-2xl border border-[var(--border-color)]">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">Administrador da Agência</h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Nome Completo</label>
                                <input 
                                  type="text" 
                                  required
                                  className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                  placeholder="Nome do Admin"
                                  value={newAgency.admin_name}
                                  onChange={e => setNewAgency({ ...newAgency, admin_name: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">E-mail de Login</label>
                                <input 
                                  type="email" 
                                  required
                                  className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                  placeholder="admin@agencia.com"
                                  value={newAgency.admin_email}
                                  onChange={e => setNewAgency({ ...newAgency, admin_email: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Senha Inicial</label>
                                <input 
                                  type="password" 
                                  required
                                  className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                                  placeholder="••••••••"
                                  value={newAgency.admin_password}
                                  onChange={e => setNewAgency({ ...newAgency, admin_password: e.target.value })}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8 pt-4 border-t border-[var(--border-color)]">
                      <button 
                        type="button"
                        onClick={() => setShowAgencyModal(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-card)] transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="button"
                        disabled={isProcessingAgency}
                        onClick={() => {
                          const form = document.getElementById('agency-form') as HTMLFormElement;
                          if (form.reportValidity()) {
                            createAgency();
                          }
                        }}
                        className="flex-1 brand-gradient text-black py-3 rounded-xl font-black shadow-lg brand-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessingAgency ? 'Processando...' : 'Confirmar'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {view === 'process_detail' && selectedProcess && (
            <motion.div 
              key="process_detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Left Column: Info & Documents */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-[var(--bg-card)]/50 p-8 rounded-3xl border border-[var(--border-color)] shadow-xl">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-3xl font-black tracking-tight">{selectedProcess.client_name}</h3>
                      <p className="text-[var(--text-muted)] font-bold uppercase text-[10px] tracking-widest mt-1">
                        {selectedProcess.visa_name} • ID: #{selectedProcess.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {(user.role === 'consultant' || user.role === 'supervisor' || user.role === 'master') && selectedProcess.status !== 'completed' && (
                        <button
                          onClick={() => openProcessEditModal(selectedProcess)}
                          className="p-3 bg-blue-500/10 hover:bg-blue-500/20 rounded-2xl transition-all text-blue-400 border border-blue-500/20"
                          title="Editar processo"
                        >
                          <Pencil size={20} />
                        </button>
                      )}
                      <StatusBadge status={selectedProcess.status} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 py-8 border-y border-[var(--border-color)]">
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mb-2">Etapa Atual</p>
                      <p className="font-bold text-xl text-emerald-400">{STATUS_LABELS[selectedProcess.internal_status] || selectedProcess.internal_status}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mb-2">Iniciado em</p>
                      <p className="font-bold text-xl">{new Date(selectedProcess.created_at).toLocaleDateString()}</p>
                    </div>
                    {selectedProcess.travel_date && (
                      <div>
                        <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mb-2">Data de Viagem</p>
                        <p className="font-bold text-xl text-cyan-400">{new Date(selectedProcess.travel_date).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Form Responses Section */}
                  {selectedProcess.responses && selectedProcess.responses.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-[var(--border-color)] space-y-8">
                      {selectedProcess.responses.map((resp: any) => {
                        let data: Record<string, any> = {};
                        let fields = [];
                        try {
                          data = JSON.parse(resp.data);
                          fields = JSON.parse(resp.form_fields || '[]');
                        } catch (e) {
                          return null;
                        }

                        return (
                          <div key={resp.id} className="space-y-6">
                            <div className="flex justify-between items-center">
                              <h4 className="font-black uppercase tracking-widest text-xs">{resp.form_title || 'Formulário'}</h4>
                              {(user.role === 'consultant' || user.role === 'supervisor' || user.role === 'master') && selectedProcess.status !== 'completed' && (
                                <button
                                  onClick={() => {
                                    setEditingFormResponse(resp);
                                    setFormEditData(data);
                                    setShowFormEditModal(true);
                                  }}
                                  className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                                >
                                  <Pencil size={12} />
                                  EDITAR RESPOSTAS
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--bg-input)]/30 p-6 rounded-3xl border border-[var(--border-color)]">
                              {fields.map((field: any) => (
                                <div key={field.id} className="space-y-1">
                                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest">{field.label}</p>
                                  <p className="text-sm font-bold text-[var(--text-main)]">{String(data[field.id] || '-')}</p>
                                </div>
                              ))}
                              {/* Fallback for fields not in definition but in data */}
                              {Object.entries(data).map(([key, value]) => {
                                if (fields.find((f: any) => f.id === key)) return null;
                                return (
                                  <div key={key} className="space-y-1">
                                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest">{key}</p>
                                    <p className="text-sm font-bold text-[var(--text-main)]">{String(value)}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-black uppercase tracking-widest text-xs">Documentação</h4>
                      <button className="text-xs text-emerald-400 font-black flex items-center gap-2 hover:underline">
                        <Upload size={14} />
                        SOLICITAR ARQUIVO
                      </button>
                    </div>
                    <div className="space-y-3">
                      {selectedProcess.documents.length > 0 ? (
                        selectedProcess.documents.map((doc: any) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 bg-[var(--bg-input)]/50 rounded-2xl border border-[var(--border-color)] hover:border-[var(--text-muted)]/30 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-[var(--bg-input)] rounded-lg">
                                <FileText className="text-[var(--text-muted)]" size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold">{doc.name}</p>
                                <p className="text-[10px] text-[var(--text-muted)] font-medium">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                                doc.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                              }`}>
                                {doc.status}
                              </span>
                              <button 
                                onClick={() => window.open(doc.url, '_blank')}
                                className="text-xs font-black hover:text-emerald-400 transition-colors"
                              >
                                ABRIR
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-[var(--bg-input)]/50 rounded-3xl border border-dashed border-[var(--border-color)]">
                          <AlertCircle className="mx-auto text-[var(--text-muted)]/30 mb-3" size={40} />
                          <p className="text-[var(--text-muted)] text-sm font-bold">Aguardando envio de documentos.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial Section */}
                  {(user.role === 'consultant' || user.role === 'supervisor' || user.role === 'master') && selectedProcess.financial && (
                    <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
                      <h4 className="font-black uppercase tracking-widest text-xs mb-6">Financeiro & Pagamento</h4>
                      <div className="p-6 bg-[var(--bg-input)]/50 rounded-3xl border border-[var(--border-color)]">
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mb-1">Valor do Plano</p>
                            <p className="text-2xl font-black text-emerald-400">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedProcess.financial.amount)}
                            </p>
                          </div>
                          <StatusBadge status={selectedProcess.financial.status} />
                        </div>

                        {selectedProcess.financial.status === 'proof_received' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                              <p className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                                <FileText size={16} />
                                Comprovante de Pagamento Anexado
                              </p>
                              <a 
                                href={selectedProcess.financial.proof_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-black text-white bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition-all"
                              >
                                Visualizar Comprovante
                                <ArrowUpRight size={14} />
                              </a>
                            </div>

                            <div className="flex gap-3">
                              <button 
                                onClick={() => validateFinancial(selectedProcess.id, 'confirmed')}
                                className="flex-1 bg-emerald-500 text-black py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all"
                              >
                                Confirmar Pagamento
                              </button>
                              <button 
                                onClick={() => validateFinancial(selectedProcess.id, 'pending')}
                                className="flex-1 bg-red-500/10 text-red-400 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] border border-red-500/20 hover:bg-red-500/20 transition-all"
                              >
                                Recusar
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {selectedProcess.financial.status === 'confirmed' && (
                          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                            <p className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                              <ShieldCheck size={16} />
                              Pagamento validado em {new Date(selectedProcess.financial.confirmed_at).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tasks Checklist */}
                  <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
                    <h4 className="font-black uppercase tracking-widest text-xs mb-6">Checklist do Processo</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProcess.tasks && selectedProcess.tasks.length > 0 ? (
                        selectedProcess.tasks.map((task: any) => (
                          <div 
                            key={task.id} 
                            onClick={() => toggleTask(task.id, task.status)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                              task.status === 'completed' 
                                ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' 
                                : 'bg-[var(--bg-input)] border-[var(--border-color)] hover:border-[var(--text-muted)]/30'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                              task.status === 'completed' 
                                ? 'bg-emerald-500 border-emerald-500 text-black' 
                                : 'border-[var(--border-color)]'
                            }`}>
                              {task.status === 'completed' && <Check size={14} strokeWidth={4} />}
                            </div>
                            <div>
                              <p className={`text-sm font-bold ${task.status === 'completed' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'}`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{task.description}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-[var(--text-muted)] text-xs font-bold col-span-2">Nenhuma task vinculada a este processo.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Chat */}
              <div className="bg-[var(--bg-card)]/50 rounded-3xl border border-[var(--border-color)] shadow-xl flex flex-col h-[500px] lg:h-[650px]">
                <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h4 className="font-black uppercase tracking-widest text-xs">Canal de Suporte</h4>
                  </div>
                  <Globe size={16} className="text-[var(--text-muted)]/30" />
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {selectedProcess.messages.map((msg: any) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender_id === user.id ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                        msg.sender_id === user.id 
                          ? 'brand-gradient text-black rounded-tr-none font-bold' 
                          : 'bg-[var(--bg-input)] text-[var(--text-main)] rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-2 mt-2 px-1">
                        <span className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-tighter">
                          {msg.sender_name} • {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-[var(--border-color)] bg-black/5">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage();
                    }}
                    className="flex gap-3"
                  >
                    <input 
                      type="text" 
                      placeholder="Escreva sua mensagem..." 
                      className="flex-1 px-5 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="brand-gradient text-black p-3 rounded-2xl hover:opacity-90 transition-all shadow-lg"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* Start Process Modal */}
          <AnimatePresence>
            {showFormEditModal && editingFormResponse && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[var(--bg-card)] w-full max-w-2xl rounded-3xl border border-[var(--border-color)] p-8 shadow-2xl my-8"
                >
                  <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Corrigir Informações: {editingFormResponse.form_title}</h3>
                  <form onSubmit={handleFormEditSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {JSON.parse(editingFormResponse.form_fields || '[]').map((field: any) => (
                        <div key={field.id}>
                          <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">{field.label}</label>
                          {field.type === 'textarea' ? (
                            <textarea
                              className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                              value={formEditData[field.id] || ''}
                              onChange={e => setFormEditData({ ...formEditData, [field.id]: e.target.value })}
                            />
                          ) : field.type === 'select' ? (
                            <select
                              className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                              value={formEditData[field.id] || ''}
                              onChange={e => setFormEditData({ ...formEditData, [field.id]: e.target.value })}
                            >
                              <option value="">Selecione...</option>
                              {field.options?.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type || 'text'}
                              className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                              value={formEditData[field.id] || ''}
                              onChange={e => setFormEditData({ ...formEditData, [field.id]: e.target.value })}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                        type="button"
                        onClick={() => setShowFormEditModal(false)}
                        className="flex-1 px-6 py-3 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-input)] transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}

            {showStartModal && (
              <div className="fixed inset-0 bg-[var(--bg-overlay)] backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[var(--bg-card)] w-full max-w-md rounded-3xl border border-[var(--border-color)] p-8 shadow-2xl"
                >
                  <h3 className="text-2xl font-black mb-6">Iniciar Novo Processo</h3>
                  <form onSubmit={handleStartProcess} className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Tipo de Visto</label>
                      <select 
                        required
                        className="w-full px-4 py-3 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                        value={startProcessData.visa_type_id}
                        onChange={e => setStartProcessData({ ...startProcessData, visa_type_id: parseInt(e.target.value) })}
                      >
                        <option value="">Selecione um visto</option>
                        {visaTypes.map(vt => (
                          <option key={vt.id} value={vt.id}>{vt.name} - ${vt.base_price}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[var(--bg-input)]/50 rounded-2xl border border-[var(--border-color)]">
                      <input 
                        type="checkbox" 
                        id="is_dependent"
                        className="w-5 h-5 rounded border-[var(--border-color)] bg-[var(--bg-input)] text-emerald-500 focus:ring-emerald-500"
                        checked={startProcessData.is_dependent}
                        onChange={e => setStartProcessData({ ...startProcessData, is_dependent: e.target.checked })}
                      />
                      <label htmlFor="is_dependent" className="text-sm font-bold text-[var(--text-muted)] cursor-pointer">
                        Este é um processo para dependente?
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button 
                        type="button"
                        onClick={() => setShowStartModal(false)}
                        className="flex-1 px-6 py-3 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--bg-input)] transition-all"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 brand-gradient text-black py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg brand-shadow"
                      >
                        Confirmar
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </AnimatePresence>
      </main>
      {renderGlobalOverlays()}
    </div>
  );
}
