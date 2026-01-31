
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, Loader2, Sparkles, Database, Filter, AlertCircle, MessageSquare, Layers, ChevronLeft, ChevronRight, Zap, Target, TrendingUp, Check, ListFilter, BadgeCheck } from 'lucide-react';
import { Lead, LeadStatus } from './types';
import LeadCard from './components/LeadCard';
import Sidebar from './components/Sidebar';
import { generateLeadsForNiche } from './services/geminiService';

type FilterType = 'ALL' | 'NOVO' | 'PROSPECTADO';

const App: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterType>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenerateLeads = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const generated = await generateLeadsForNiche(niche);
      
      const newLeads: Lead[] = generated.map((l) => ({
        ...l,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString()
      } as Lead));

      setLeads(prev => [...newLeads, ...prev]);
      setNiche('');
      setCurrentPage(1);
    } catch (err) {
      setError('Falha ao gerar leads. Verifique sua chave de API ou tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLeadStatus = (id: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === id) {
        return {
          ...lead,
          status: lead.status === 'NOVO' ? 'PROSPECTADO' : 'NOVO'
        };
      }
      return lead;
    }));
  };

  const selectFilter = (status: FilterType) => {
    setFilterStatus(status);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const filteredLeads = useMemo(() => {
    if (filterStatus === 'ALL') return leads;
    return leads.filter(l => l.status === filterStatus);
  }, [leads, filterStatus]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  
  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const filterLabel = {
    'ALL': 'Todos',
    'NOVO': 'Novos',
    'PROSPECTADO': 'Prospectados'
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300 relative">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow pb-32">
        {/* Header Fixo */}
        <header className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40 py-4 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-start px-8 pl-24 md:pl-32">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 md:hidden">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">Leads <span className="text-indigo-600 dark:text-indigo-400">Climb.ai</span></h1>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Encontre seus Leads</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-8 mt-12 pl-24 md:pl-32">
          {/* Seção de Pesquisa */}
          <section className="mb-12">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Expandir sua prospecção</h2>
                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-1">Digite um nicho de mercado e nossa IA irá minerar leads qualificados para você.</p>
              </div>
              
              <form onSubmit={handleGenerateLeads} className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="Ex: Tecnologia, Imobiliária, Marketing Digital..."
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-all text-base text-slate-700 dark:text-slate-200 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !niche}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-400 dark:hover:bg-indigo-300 disabled:bg-indigo-300 dark:disabled:bg-indigo-900/50 text-white font-black px-10 py-4 rounded-3xl flex items-center justify-center gap-3 transition-all text-base whitespace-nowrap shadow-xl shadow-indigo-100 dark:shadow-[0_0_30px_rgba(129,140,248,0.3)] active:scale-95 group"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
                  Gerar Leads
                </button>
              </form>
            </div>
          </section>

          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-700 dark:text-red-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                 <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                 <h2 className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Pilha de Resultados Ativos</h2>
              </div>
              
              <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                {/* Botão de Filtro */}
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center justify-center w-8 h-8 rounded-xl border transition-all active:scale-90 ${
                    filterStatus !== 'ALL' || isFilterOpen
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:text-indigo-600 hover:border-indigo-100'
                  }`}
                >
                  <Filter size={16} />
                </button>

                {/* Dropdown Menu */}
                {isFilterOpen && (
                  <div className="absolute right-0 top-10 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-200 dark:shadow-none z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                    <button 
                      onClick={() => selectFilter('ALL')}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${filterStatus === 'ALL' ? 'bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      <span className="flex items-center gap-2">
                        <ListFilter size={14} />
                        Todos os Leads
                      </span>
                      {filterStatus === 'ALL' && <Check size={14} strokeWidth={3} />}
                    </button>
                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-2"></div>
                    <button 
                      onClick={() => selectFilter('NOVO')}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${filterStatus === 'NOVO' ? 'bg-slate-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles size={14} />
                        Novos
                      </span>
                      {filterStatus === 'NOVO' && <Check size={14} strokeWidth={3} />}
                    </button>
                    <button 
                      onClick={() => selectFilter('PROSPECTADO')}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${filterStatus === 'PROSPECTADO' ? 'bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      <span className="flex items-center gap-2">
                        <BadgeCheck size={14} />
                        Prospectados
                      </span>
                      {filterStatus === 'PROSPECTADO' && <Check size={14} strokeWidth={3} />}
                    </button>
                  </div>
                )}

                <div className="bg-white dark:bg-slate-900 px-5 py-2 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest shadow-sm min-w-[120px] text-center transition-colors">
                  {filterStatus !== 'ALL' ? `${filterStatus}: ` : 'TOTAL: '} {filteredLeads.length}
                </div>
              </div>
            </div>

            {paginatedLeads.length > 0 ? (
              <div className="flex flex-col space-y-5">
                {paginatedLeads.map((lead, index) => (
                  <div 
                    key={lead.id} 
                    className="transform transition-all duration-700 animate-in fade-in slide-in-from-bottom-12 fill-mode-backwards"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <LeadCard 
                      lead={lead} 
                      onStatusToggle={handleToggleLeadStatus}
                    />
                  </div>
                ))}

                {/* Paginação Inline */}
                {totalPages > 1 && (
                  <div className="pt-8 flex justify-end animate-in fade-in slide-in-from-bottom-8">
                    <div className="bg-indigo-600 p-2 rounded-[28px] shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-3 border border-indigo-500">
                      <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="p-3 rounded-2xl text-indigo-100 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all active:scale-90"
                      >
                        <ChevronLeft size={20} strokeWidth={3} />
                      </button>
                      
                      <div className="flex flex-col items-center px-1 min-w-[40px]">
                        <span className="text-sm font-black text-white leading-none">{currentPage}</span>
                        <span className="text-[9px] font-black text-indigo-200 uppercase tracking-tighter">DE {totalPages}</span>
                      </div>

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-2xl text-indigo-100 hover:bg-white/10 hover:text-white disabled:opacity-20 transition-all active:scale-90"
                      >
                        <ChevronRight size={20} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white dark:bg-slate-900 rounded-[56px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center text-slate-200 dark:text-slate-700 mb-6 border border-slate-100 dark:border-slate-800 shadow-inner">
                  <Layers size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  {filterStatus !== 'ALL' ? `Nenhum lead ${filterStatus.toLowerCase()}` : 'Pilha de leads vazia'}
                </h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm mx-auto leading-relaxed font-medium">
                  {filterStatus !== 'ALL' 
                    ? `Não encontramos leads com o status selecionado nesta lista.`
                    : 'Utilize a busca inteligente acima para minerar leads qualificados.'}
                </p>
                {filterStatus !== 'ALL' && (
                  <button 
                    onClick={() => selectFilter('ALL')}
                    className="mt-6 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
                  >
                    Limpar Filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
