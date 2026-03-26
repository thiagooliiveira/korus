export type UserRole = 'master' | 'supervisor' | 'consultant' | 'analyst' | 'gerente_financeiro' | 'client';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  agency_id: number | null;
  created_at: string;
}

export interface Agency {
  id: number;
  name: string;
  slug: string;
  status: 'active' | 'suspended';
  modules: string; // JSON string: { finance: boolean, chat: boolean }
  logo_url?: string;
  admin_user_id?: number | null;
  admin_name?: string | null;
  admin_email?: string | null;
  admin_role?: UserRole | null;
  created_at: string;
}

export interface Destination {
  id: number;
  agency_id: number;
  name: string;
  code: string;
  description: string;
  image: string;
  flag: string;
  highlight_points: string[];
  is_active: boolean;
  order: number;
  created_at: string;
}

export interface FormField {
  id: number;
  agency_id: number;
  destination_id?: number | null;
  label: string;
  type: 'text' | 'select' | 'radio' | 'date';
  required: boolean;
  options: string[];
  order: number;
  created_at: string;
}

export interface Plan {
  id: number;
  agency_id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  is_recommended: boolean;
  icon: string;
  created_at: string;
}

export interface Dependent {
  id: number;
  process_id: number;
  name: string;
  relationship: string;
  age: number;
  passport?: string;
  created_at: string;
}

export interface VisaType {
  id: number;
  agency_id: number;
  name: string;
  description: string;
  base_price: number;
  required_docs: string[];
  created_at: string;
}

export interface Form {
  id: number;
  visa_type_id: number;
  title: string;
  fields: string[];
}

export interface Process {
  id: number;
  client_id: number;
  client_name?: string;
  agency_id: number;
  visa_type_id: number;
  destination_id?: number | null;
  plan_id?: number | null;
  visa_name?: string;
  destination_name?: string;
  destination_image?: string;
  plan_name?: string;
  type?: string;
  consultant_name?: string;
  analyst_name?: string;
  consultant_id: number | null;
  analyst_id: number | null;
  status: 'started' | 'waiting_payment' | 'payment_confirmed' | 'analyzing' | 'final_phase' | 'completed';
  internal_status: 'pending' | 'documents_requested' | 'reviewing' | 'submitted' | 'completed';
  payment_status?: string;
  is_dependent: boolean;
  parent_process_id: number | null;
  created_at: string;
  finished_at: string | null;
}

export interface Financial {
  id: number;
  process_id: number;
  amount: number;
  status: 'pending' | 'proof_received' | 'confirmed';
  payment_method: string | null;
  proof_url: string | null;
  confirmed_at: string | null;
  commission_amount: number | null;
  commission_status: 'pending' | 'approved' | 'paid' | null;
}

export interface FormResponse {
  id: number;
  process_id: number;
  form_id: number;
  data: string; // JSON object
  status: 'open' | 'submitted' | 'locked';
  updated_at: string;
}

export interface Document {
  id: number;
  process_id: number;
  name: string;
  url: string;
  status: 'uploaded' | 'approved' | 'rejected';
  rejection_reason: string | null;
  uploaded_at: string;
}

export interface Message {
  id: number;
  process_id: number;
  sender_id: number;
  sender_name: string;
  content: string;
  is_proof: boolean;
  sent_at: string;
}

export interface AuditLog {
  id: number;
  agency_id: number | null;
  user_id: number;
  action: string;
  agency_name?: string;
  user_name?: string;
  details: string | null;
  created_at: string;
}

export interface Expense {
  id: number;
  agency_id: number;
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid';
  category: string;
  created_at: string;
}

export interface Revenue {
  id: number;
  agency_id: number;
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'received';
  category: string;
  created_at: string;
}

export interface Task {
  id: number;
  agency_id: number;
  title: string;
  description: string;
  is_active: boolean;
  created_at: string;
}
