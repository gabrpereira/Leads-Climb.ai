
import React from 'react';
import { Lead } from '../types';
import { User, Building2, Phone, BadgeCheck, MessageCircle, ChevronRight, Sparkles } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onStatusToggle: (id: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onStatusToggle }) => {
  const handleWhatsAppClick = (e: React.MouseEvent) => {
    // Evita disparar o link se clicar no checkbox ou em botões específicos
    if ((e.target as HTMLElement).closest('.stop-propagation')) return;

    const cleanPhone = lead.telefone.replace(/\D/g, '');
    const ddi = cleanPhone.length <= 11 ? '55' : '';
    const whatsappUrl = `https://wa.me/${ddi}${cleanPhone}?text=Olá%20${encodeURIComponent(lead.nome)},%20falo%20do%20LeadGen.`;
    
    window.open(whatsappUrl, '_blank');
  };

  const isProspectado = lead.status === 'PROSPECTADO';

  return (
    <div 
      onClick={handleWhatsAppClick}
      className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 transition-all hover:shadow-xl dark:hover:shadow-indigo-900/10 hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:ring-1 hover:ring-indigo-50 dark:hover:ring-indigo-900/20 cursor-pointer group relative flex flex-col sm:flex-row items-start sm:items-center gap-4"
    >
      {/* Checkbox de Status */}
      <div className="stop-propagation flex-shrink-0 mr-1">
        <label className="relative flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={isProspectado}
            onChange={() => onStatusToggle(lead.id)}
            className="peer sr-only"
          />
          <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
            {isProspectado && <BadgeCheck size={14} className="text-white" />}
          </div>
        </label>
      </div>

      {/* Avatar / Icon */}
      <div className="flex-shrink-0">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isProspectado 
            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white' 
            : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 group-hover:text-white'
        }`}>
          <User size={24} />
        </div>
      </div>

      {/* Info Principal */}
      <div className="flex-grow min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {lead.nome}
          </h3>
          
          {isProspectado ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 uppercase tracking-tighter">
              <BadgeCheck size={10} className="mr-1" />
              Prospectado
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 uppercase tracking-tighter">
              <Sparkles size={10} className="mr-1" />
              Novo
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 dark:text-slate-400 text-sm">
          {lead.empresa && (
            <div className="flex items-center">
              <Building2 size={14} className="mr-1.5 opacity-60" />
              <span className="truncate max-w-[150px]">{lead.empresa}</span>
            </div>
          )}
          <div className="flex items-center group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors font-medium">
            <Phone size={14} className="mr-1.5 opacity-60" />
            {lead.telefone}
          </div>
        </div>
      </div>

      {/* Ação / Badge de WhatsApp */}
      <div className="sm:ml-auto flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end text-right mr-2">
          <span className="text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-wider">Nicho</span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{lead.nicho}</span>
        </div>
        <div className="flex items-center justify-center w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full group-hover:bg-emerald-500 group-hover:text-white transition-all">
          <MessageCircle size={18} />
        </div>
        <ChevronRight size={18} className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
      </div>

      {/* Linha de email discreta */}
      <div className="absolute bottom-2 right-5 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">{lead.email}</span>
      </div>
    </div>
  );
};

export default LeadCard;
