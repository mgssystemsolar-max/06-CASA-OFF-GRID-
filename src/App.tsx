import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Printer, Trash2, LayoutDashboard, Users, FolderOpen, Settings, Calculator, FileText, Eye, EyeOff, Sun, Moon, LogOut, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface LoadItem {
  id: string;
  nome: string;
  qtd: number;
  w: number;
  h: number;
  fatorPartida: number;
}

const StepBadge = ({ num }: { num: number }) => (
  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white font-bold text-xs mr-2 shadow-sm shrink-0">
    {num}
  </span>
);

const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email.trim() && password.trim()) {
      onLogin();
    } else {
      setError('Por favor, preencha todos os campos.');
    }
  };

  const handleRecoverPassword = () => {
    alert('Instruções de recuperação de senha enviadas para o seu e-mail.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-2xl">SP</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">SOLARPRO</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Faça login para acessar o sistema</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm text-center font-medium border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className={`w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border ${error && !email.trim() ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'} focus:outline-none focus:ring-2 transition-all dark:text-white`}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Senha</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border ${error && !password.trim() ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'} focus:outline-none focus:ring-2 transition-all dark:text-white pr-10`}
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={handleRecoverPassword} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              Esqueceu a senha?
            </button>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-500/30">
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Não tem uma conta? <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold">Cadastre-se</button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-500">
        <p>Suporte e Contato:</p>
        <p className="font-medium">mgssystemsolarclientes@gmail.com</p>
        <p className="font-medium">Tel: +55 (88) 988360143</p>
      </div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const [activeTab, setActiveTab] = useState<'dimensionamento' | 'suporte'>('dimensionamento');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [itens, setItens] = useState<LoadItem[]>([
    { id: '1', nome: "Geladeira", qtd: 1, w: 150, h: 24, fatorPartida: 5 },
    { id: '2', nome: "Lâmpadas (10W)", qtd: 10, w: 10, h: 5, fatorPartida: 1 },
    { id: '3', nome: "Televisão", qtd: 1, w: 100, h: 4, fatorPartida: 1 },
    { id: '4', nome: "Computador", qtd: 1, w: 200, h: 3, fatorPartida: 1 },
    { id: '5', nome: "Outros", qtd: 1, w: 250, h: 3, fatorPartida: 1 }
  ]);
  const [potPainel, setPotPainel] = useState<number>(550);
  const [tensao, setTensao] = useState<number>(24);
  const [tipoBateria, setTipoBateria] = useState<string>('Chumbo');
  const [comprimentoCabo, setComprimentoCabo] = useState<number>(5);
  const [eficienciaInversor, setEficienciaInversor] = useState<number>(90);
  const [fatorCorrecaoConsumo, setFatorCorrecaoConsumo] = useState<number>(20);
  const [eficienciaSistema, setEficienciaSistema] = useState<number>(80);
  const [horasSolPleno, setHorasSolPleno] = useState<number>(5);
  const [diasAutonomia, setDiasAutonomia] = useState<number>(2);
  const [dod, setDod] = useState<number>(30);
  const [eficienciaCoulombica, setEficienciaCoulombica] = useState<number>(90);
  const [fatorTemperatura, setFatorTemperatura] = useState<number>(1);
  const [capacidadeBateriaIndividual, setCapacidadeBateriaIndividual] = useState<number>(220);
  const [tensaoBateriaIndividual, setTensaoBateriaIndividual] = useState<number>(12);
  const [custoWpPainel, setCustoWpPainel] = useState<number>(2.5);
  const [custoWpInversor, setCustoWpInversor] = useState<number>(1.5);
  const [ciclosVida, setCiclosVida] = useState<number>(500);
  const [limiteCorrenteCarga, setLimiteCorrenteCarga] = useState<number>(20);
  const [custoAhBateria, setCustoAhBateria] = useState<number>(10);

  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [clienteCidade, setClienteCidade] = useState('');

  useEffect(() => {
    if (tipoBateria === 'Lítio') {
      setDod(85);
      setCiclosVida(2000);
      setLimiteCorrenteCarga(50);
    } else if (tipoBateria === 'LiFePO4') {
      setDod(90);
      setCiclosVida(4000);
      setLimiteCorrenteCarga(100);
    } else {
      setDod(30);
      setCiclosVida(500);
      setLimiteCorrenteCarga(20);
    }
  }, [tipoBateria]);

  const adicionarLinha = () => {
    setItens([...itens, { id: Date.now().toString(), nome: "Novo Item", qtd: 1, w: 0, h: 0, fatorPartida: 1 }]);
  };

  const updateItem = (id: string, campo: keyof LoadItem, valor: string | number) => {
    setItens(itens.map(item => {
      if (item.id === id) {
        let parsedValue: string | number = campo === 'nome' ? valor : (parseFloat(valor as string) || 0);
        
        if (campo === 'h') {
          parsedValue = Math.min(Math.max(parsedValue as number, 0), 24);
        } else if (campo === 'w' || campo === 'qtd' || campo === 'fatorPartida') {
          parsedValue = Math.max(parsedValue as number, 0);
        }

        return { ...item, [campo]: parsedValue };
      }
      return item;
    }));
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };

    const {
      maiorPico,
      nP,
      bat,
      amp,
      bitola,
      inv,
      man,
      lucro,
      quedaTensao,
      quedaPercentual,
      totalWh,
      consumoCorrigido,
      geracaoEstimada,
      bateriasEmParalelo,
      bateriasEmSerie,
      totalBaterias,
      custoTotalBaterias
    } = useMemo(() => {
      let totalWh = 0;
      let totalWNominal = 0;
      let maiorPicoExtra = 0;
      const hsp = horasSolPleno > 0 ? horasSolPleno : 5;
  
      itens.forEach(it => {
        const qtd = it.qtd > 0 ? it.qtd : 1;
        totalWh += (it.w * it.h * qtd);
        totalWNominal += (it.w * qtd);
        
        // O pico extra é a potência que o equipamento exige ALÉM da sua potência nominal na partida
        const fator = it.fatorPartida > 0 ? it.fatorPartida : 1;
        const picoExtra = (it.w * qtd) * (fator - 1);
        
        if (picoExtra > maiorPicoExtra) maiorPicoExtra = picoExtra;
      });
  
      const consumoCorrigido = totalWh * (1 + (fatorCorrecaoConsumo / 100));
  
      // O inversor precisa suportar a soma de todas as potências nominais + o pior pico de partida extra
      const maiorPico = totalWNominal + maiorPicoExtra;
  
      const efi = (eficienciaInversor > 0 ? eficienciaInversor : 100) / 100;
      const efiSys = (eficienciaSistema > 0 ? eficienciaSistema : 100) / 100;
      const Ed = consumoCorrigido / efi;
  
      const nP = Math.ceil((Ed * 1.25) / (hsp * potPainel));
      const geracaoEstimada = nP * potPainel * hsp * efiSys;
      
      const Kp = dod / 100;
      const Kc = eficienciaCoulombica / 100;
      const bat = (Ed * fatorTemperatura * diasAutonomia) / (Kp * Kc * tensao);
      
      const bateriasEmParalelo = Math.round(bat / capacidadeBateriaIndividual);
      const bateriasEmSerie = Math.ceil(tensao / tensaoBateriaIndividual);
      const totalBaterias = bateriasEmParalelo * bateriasEmSerie;
      const custoTotalBaterias = totalBaterias * capacidadeBateriaIndividual * custoAhBateria;
      
      const amp = (nP * potPainel) / tensao;
      
      let bitola = amp > 50 ? 16 : (amp > 30 ? 10 : 6);
  
      const custoPaineis = (nP * potPainel) * custoWpPainel;
      const custoInversor = maiorPico * custoWpInversor;
      const inv = custoPaineis + custoInversor;
      const eco = (totalWh / 1000) * 30 * 0.95;
    const man = (tipoBateria === 'Lítio' || tipoBateria === 'LiFePO4') ? (bat * tensao * 1.2) : (bat * tensao * 3.5);
    const lucro = ((eco * 12 * 10) - inv - man);

      const ampControlador = isNaN(amp) || !isFinite(amp) ? 0 : Math.ceil(amp * 1.1);
      const quedaTensao = bitola > 0 ? (2 * comprimentoCabo * ampControlador * 0.0175) / bitola : 0;
      const quedaPercentual = tensao > 0 ? (quedaTensao / tensao) * 100 : 0;
  
      return {
        maiorPico: Math.ceil(maiorPico),
        nP: isNaN(nP) || !isFinite(nP) ? 0 : nP,
        bat: isNaN(bat) || !isFinite(bat) ? 0 : Math.ceil(bat),
        amp: ampControlador,
        bitola,
        inv: isNaN(inv) ? 0 : inv,
        man: isNaN(man) ? 0 : man,
        lucro: isNaN(lucro) ? 0 : lucro,
        quedaTensao,
        quedaPercentual,
        totalWh,
        consumoCorrigido,
        geracaoEstimada,
        bateriasEmParalelo: isNaN(bateriasEmParalelo) || !isFinite(bateriasEmParalelo) ? 0 : bateriasEmParalelo,
        bateriasEmSerie: isNaN(bateriasEmSerie) || !isFinite(bateriasEmSerie) ? 0 : bateriasEmSerie,
        totalBaterias: isNaN(totalBaterias) || !isFinite(totalBaterias) ? 0 : totalBaterias,
        custoTotalBaterias: isNaN(custoTotalBaterias) || !isFinite(custoTotalBaterias) ? 0 : custoTotalBaterias
      };
  }, [itens, potPainel, tensao, tipoBateria, comprimentoCabo, eficienciaInversor, fatorCorrecaoConsumo, eficienciaSistema, diasAutonomia, dod, eficienciaCoulombica, fatorTemperatura, capacidadeBateriaIndividual, tensaoBateriaIndividual, custoAhBateria, horasSolPleno]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-[#0f172a] dark:bg-slate-950 text-white hidden md:flex flex-col fixed h-full z-10 transition-all duration-300`}>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-8 bg-blue-600 text-white p-1 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-20"
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <div className={`p-6 flex items-center gap-3 border-b border-slate-800 ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}>
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="font-bold text-[#0f172a]">S</span>
          </div>
          {!isSidebarCollapsed && (
            <h1 className="text-xl font-black tracking-tight whitespace-nowrap">
              SOLAR<span className="text-yellow-500">PRO</span>
            </h1>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 font-medium transition-colors ${isSidebarCollapsed ? 'justify-center px-0' : ''}`} title="Dashboard">
            <LayoutDashboard size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
          </a>
          <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 font-medium transition-colors ${isSidebarCollapsed ? 'justify-center px-0' : ''}`} title="Clientes">
            <Users size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Clientes</span>}
          </a>
          <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 font-medium transition-colors ${isSidebarCollapsed ? 'justify-center px-0' : ''}`} title="Projetos">
            <FolderOpen size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Projetos</span>}
          </a>
          <button 
            onClick={() => setActiveTab('dimensionamento')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dimensionamento' ? 'bg-blue-900/30 text-blue-400' : 'hover:bg-slate-800 text-slate-400'} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
            title="Dimensionamento"
          >
            <Calculator size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Dimensionamento</span>}
          </button>
          <button 
            onClick={() => setActiveTab('suporte')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'suporte' ? 'bg-blue-900/30 text-blue-400' : 'hover:bg-slate-800 text-slate-400'} ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
            title="Manual e Suporte"
          >
            <HelpCircle size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Manual e Suporte</span>}
          </button>
          <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 font-medium transition-colors ${isSidebarCollapsed ? 'justify-center px-0' : ''}`} title="Relatórios">
            <FileText size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Relatórios</span>}
          </a>
          <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 font-medium transition-colors ${isSidebarCollapsed ? 'justify-center px-0' : ''}`} title="Configurações">
            <Settings size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Configurações</span>}
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-400 font-medium transition-colors ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
            title={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          >
            {theme === 'light' ? <Moon size={20} className="shrink-0" /> : <Sun size={20} className="shrink-0" />}
            {!isSidebarCollapsed && <span className="whitespace-nowrap">{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>}
          </button>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-900/30 text-red-400 font-medium transition-colors ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
            title="Sair"
          >
            <LogOut size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} p-4 md:p-8`}>
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dimensionamento' ? (
            <>
              <header className="flex justify-between items-center mb-8 print:hidden">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dimensionamento Solar</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Configure o sistema off-grid para seu cliente</p>
            </div>
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-2 bg-[#1e3a8a] hover:bg-blue-800 transition-colors text-white px-6 py-2.5 rounded-xl font-medium shadow-sm"
            >
              <Printer size={18} />
              Exportar Proposta
            </button>
          </header>

          <div className="grid xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h2 className="font-bold text-slate-800 dark:text-white mb-5 flex items-center text-lg">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">1</span>
                  Dados do Cliente
                </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nome do Cliente:
                  <input 
                    type="text" 
                    value={clienteNome} 
                    onChange={(e) => setClienteNome(e.target.value)} 
                    className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                    placeholder="Ex: João da Silva"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Telefone:
                  <input 
                    type="text" 
                    value={clienteTelefone} 
                    onChange={(e) => setClienteTelefone(e.target.value)} 
                    className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                    placeholder="(00) 00000-0000"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email:
                  <input 
                    type="email" 
                    value={clienteEmail} 
                    onChange={(e) => setClienteEmail(e.target.value)} 
                    className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                    placeholder="joao@email.com"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Cidade/UF:
                  <input 
                    type="text" 
                    value={clienteCidade} 
                    onChange={(e) => setClienteCidade(e.target.value)} 
                    className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                    placeholder="São Paulo - SP"
                  />
                </label>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-bold text-slate-800 dark:text-white flex items-center text-lg">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">2</span>
                  Cargas Solares
                </h2>
                <button 
                  onClick={adicionarLinha} 
                  className="flex items-center gap-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg font-medium transition-colors"
                >
                  <Plus size={16} /> Adicionar Carga
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b dark:border-slate-700 text-sm text-slate-400">
                      <th className="pb-2 font-medium">Equipamento</th>
                      <th className="pb-2 font-medium w-20">Qtd.</th>
                      <th className="pb-2 font-medium w-24">Pot. Unitária (W)</th>
                      <th className="pb-2 font-medium w-24">Pot. Total (W)</th>
                      <th className="pb-2 font-medium w-24" title="Fator IP/In (Pico de Partida)">Fator Partida</th>
                      <th className="pb-2 font-medium w-24">Horas/Dia</th>
                      <th className="pb-2 font-medium w-32 text-right">Consumo Diário (Wh)</th>
                      <th className="pb-2 font-medium w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((item) => (
                      <tr key={item.id} className="border-b dark:border-slate-700 last:border-0">
                        <td className="py-2 pr-2">
                          <input 
                            type="text" 
                            value={item.nome} 
                            onChange={(e) => updateItem(item.id, 'nome', e.target.value)} 
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder="Nome do equipamento"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input 
                            type="number" 
                            value={item.qtd || ''} 
                            onChange={(e) => updateItem(item.id, 'qtd', e.target.value)} 
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            min="0"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input 
                            type="number" 
                            value={item.w || ''} 
                            onChange={(e) => updateItem(item.id, 'w', e.target.value)} 
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            min="0"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <div className="w-full bg-slate-100/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {((item.w || 0) * (item.qtd || 0)).toLocaleString('pt-BR')}
                          </div>
                        </td>
                        <td className="py-2 pr-2">
                          <input 
                            type="number" 
                            value={item.fatorPartida || ''} 
                            onChange={(e) => updateItem(item.id, 'fatorPartida', e.target.value)} 
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            min="1"
                            step="0.1"
                            title="Multiplicador de pico de partida (ex: 5 para geladeiras)"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input 
                            type="number" 
                            value={item.h || ''} 
                            onChange={(e) => updateItem(item.id, 'h', e.target.value)} 
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            min="0"
                            max="24"
                          />
                        </td>
                        <td className="py-2 pr-4 text-right font-bold text-slate-700 dark:text-slate-300">
                          {((item.w || 0) * (item.h || 0) * (item.qtd || 0)).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-2 text-right">
                          <button 
                            onClick={() => removerItem(item.id)}
                            className="text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                            title="Remover item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 dark:border-slate-700">
                      <td colSpan={6} className="py-3 text-right font-medium text-slate-500 dark:text-slate-400 text-sm">
                        Consumo Base
                      </td>
                      <td className="py-3 pr-4 text-right font-bold text-slate-800 dark:text-white text-lg">
                        {totalWh.toLocaleString('pt-BR')} Wh
                      </td>
                      <td></td>
                    </tr>
                    <tr className="border-t border-slate-100 dark:border-slate-700 bg-[#f59e0b]/10">
                      <td colSpan={6} className="py-3 pr-4 text-right font-medium text-[#f59e0b] text-sm">
                        <div className="flex justify-end items-center gap-2">
                          Consumo Corrigido (+
                          <input 
                            type="number" 
                            value={fatorCorrecaoConsumo} 
                            onChange={(e) => setFatorCorrecaoConsumo(parseFloat(e.target.value) || 0)} 
                            className="w-14 bg-white dark:bg-slate-800 border border-[#f59e0b]/30 rounded-md px-2 py-1 text-center text-[#f59e0b] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                            min="0"
                          />
                          %)
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right font-bold text-[#f59e0b] text-lg">
                        {consumoCorrigido.toLocaleString('pt-BR')} Wh
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-5">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center text-lg">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">3</span>
                    Configuração do Kit
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Potência Painel (W): 
                      <input 
                        type="number" 
                        value={potPainel || ''} 
                        onChange={(e) => setPotPainel(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Horas de Sol Pleno (HSP): 
                      <input 
                        type="number" 
                        value={horasSolPleno || ''} 
                        onChange={(e) => setHorasSolPleno(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="1"
                        step="0.1"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Margem Seg. Consumo (%): 
                      <input 
                        type="number" 
                        value={fatorCorrecaoConsumo || ''} 
                        onChange={(e) => setFatorCorrecaoConsumo(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="0"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Efic. Inversor (%): 
                      <input 
                        type="number" 
                        value={eficienciaInversor || ''} 
                        onChange={(e) => setEficienciaInversor(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="1"
                        max="100"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Efic. Geral Sist. (%): 
                      <input 
                        type="number" 
                        value={eficienciaSistema || ''} 
                        onChange={(e) => setEficienciaSistema(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="1"
                        max="100"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Tensão do Sistema:
                      <select 
                        value={tensao} 
                        onChange={(e) => setTensao(Number(e.target.value))}
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                      >
                        <option value={12}>12V</option>
                        <option value={24}>24V</option>
                        <option value={48}>48V</option>
                      </select>
                    </label>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Comprimento Cabo (m):
                      <input 
                        type="number" 
                        value={comprimentoCabo || ''} 
                        onChange={(e) => setComprimentoCabo(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="1"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Custo Painel (R$/Wp):
                      <input 
                        type="number" 
                        value={custoWpPainel || ''} 
                        onChange={(e) => setCustoWpPainel(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="0"
                        step="0.1"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Custo Inversor (R$/W):
                      <input 
                        type="number" 
                        value={custoWpInversor || ''} 
                        onChange={(e) => setCustoWpInversor(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="0"
                        step="0.1"
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-5">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center text-lg">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">4</span>
                    Detalhes da Bateria
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Tipo de Bateria:
                      <select 
                        value={tipoBateria} 
                        onChange={(e) => setTipoBateria(e.target.value)}
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                      >
                        <option value="Chumbo">Chumbo-Ácido</option>
                        <option value="Lítio">Lítio</option>
                        <option value="LiFePO4">Lítio LiFePO4</option>
                      </select>
                    </label>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Dias de Autonomia:
                      <input 
                        type="number" 
                        value={diasAutonomia || ''} 
                        onChange={(e) => setDiasAutonomia(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="1"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Profund. Descarga (DoD %):
                      <input 
                        type="number" 
                        value={dod || ''} 
                        onChange={(e) => setDod(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="1"
                        max="100"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Efic. Coulombica (%):
                      <input 
                        type="number" 
                        value={eficienciaCoulombica || ''} 
                        onChange={(e) => setEficienciaCoulombica(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="1"
                        max="100"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Capacidade Individual (Ah):
                      <input 
                        type="number" 
                        value={capacidadeBateriaIndividual || ''} 
                        onChange={(e) => setCapacidadeBateriaIndividual(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="1"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Tensão Individual (V):
                      <input 
                        type="number" 
                        value={tensaoBateriaIndividual || ''} 
                        onChange={(e) => setTensaoBateriaIndividual(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="1"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Ciclos de Vida:
                      <input 
                        type="number" 
                        value={ciclosVida || ''} 
                        onChange={(e) => setCiclosVida(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="1"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Limite Corrente Carga (A):
                      <input 
                        type="number" 
                        value={limiteCorrenteCarga || ''} 
                        onChange={(e) => setLimiteCorrenteCarga(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="1"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Custo por Ah (R$):
                      <input 
                        type="number" 
                        value={custoAhBateria || ''} 
                        onChange={(e) => setCustoAhBateria(parseFloat(e.target.value) || 0)} 
                        className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                        min="0"
                        step="0.1"
                      />
                    </label>
                    <div className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Custo Total da Bateria:
                      <div className="mt-1.5 w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold">
                        R$ {custoTotalBaterias.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
                <div className="bg-[#0f172a] border border-slate-700 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between">
                  <div>
                    <p className="text-[#f59e0b] text-xs font-bold uppercase tracking-wider flex items-center mb-2">
                      <span className="w-6 h-6 rounded bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center mr-2">5</span>
                      Inversor Mínimo (Pico)
                    </p>
                    <div className="text-4xl font-black mt-2">{maiorPico}W</div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-slate-700/50 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Cabo Bat.</p>
                      <div className="font-bold text-lg">{bitola}mm²</div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Controlador</p>
                      <div className="font-bold text-lg">{amp}A</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-5 border-l-4 border-[#22c55e]">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center text-lg">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">6</span>
                    Queda de Tensão (CC)
                  </h3>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Comprimento do Cabo (m):
                    <input 
                      type="number" 
                      value={comprimentoCabo || ''} 
                      onChange={(e) => setComprimentoCabo(parseFloat(e.target.value) || 0)} 
                      className="mt-1.5 w-full bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white"
                      min="0.5"
                      step="0.5"
                    />
                  </label>
                  <div className="pt-2">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Perda Estimada</span>
                      <span className={`font-bold ${quedaPercentual <= 3 ? 'text-[#22c55e]' : quedaPercentual <= 5 ? 'text-[#f59e0b]' : 'text-red-500'}`}>
                        {quedaPercentual.toFixed(2)}% ({quedaTensao.toFixed(2)}V)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${quedaPercentual <= 3 ? 'bg-[#22c55e]' : quedaPercentual <= 5 ? 'bg-[#f59e0b]' : 'bg-red-500'}`} 
                        style={{ width: `${Math.min(quedaPercentual, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-medium">
                      {quedaPercentual <= 3 
                        ? 'Queda aceitável (≤ 3%).' 
                        : quedaPercentual <= 5 
                        ? 'Atenção: Queda marginal (3% - 5%).' 
                        : 'Inaceitável: Aumente a bitola ou reduza a distância (> 5%).'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#0f172a] p-8 rounded-2xl text-white shadow-lg flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1e3a8a] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
                <h3 className="text-[#f59e0b] font-bold uppercase text-xs tracking-wider mb-8 flex items-center relative z-10">
                  <span className="w-6 h-6 rounded bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center mr-2">7</span>
                  Kit Solar Fotovoltaico
                </h3>
                <div className="space-y-8 relative z-10">
                  <div>
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Painéis ({potPainel}W)</p>
                    <div className="text-5xl font-black">{nP} <span className="text-xl font-medium text-slate-300">unidades</span></div>
                    <div className="mt-2 text-sm text-slate-400 font-medium">
                      Potência Total: {(nP * potPainel).toLocaleString('pt-BR')} Wp
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-700/50">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Baterias ({tensaoBateriaIndividual}V / {capacidadeBateriaIndividual}Ah)</p>
                    <div className="text-4xl font-black text-[#f59e0b]">{totalBaterias} <span className="text-xl font-medium text-slate-300">unidades</span></div>
                    <div className="mt-2 text-sm text-slate-400 font-medium">
                      {bateriasEmParalelo} em paralelo × {bateriasEmSerie} em série
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-5">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center text-lg">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">8</span>
                  Balanço Energético Diário
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: 'Energia (Wh)',
                          'Consumo Diário Total': totalWh,
                          'Consumo Corrigido': consumoCorrigido,
                          'Geração Solar Estimada': geracaoEstimada,
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{ fill: theme === 'dark' ? '#1e293b' : '#f1f5f9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff', color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}
                        formatter={(value: number) => [`${value.toLocaleString('pt-BR')} Wh`, '']}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }} />
                      <Bar dataKey="Consumo Diário Total" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={60} />
                      <Bar dataKey="Consumo Corrigido" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={60} />
                      <Bar dataKey="Geração Solar Estimada" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 print:break-inside-avoid">
            <h2 className="font-bold text-slate-800 dark:text-white flex items-center text-lg mb-6">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-3">9</span>
              Análise de ROI (10 Anos)
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Investimento</p>
                <div className="text-2xl font-bold text-slate-800 dark:text-white">{formatCurrency(inv)}</div>
              </div>
              <div className="p-5 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                <p className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-1">Manutenção</p>
                <div className="text-2xl font-bold text-red-600 dark:text-red-500">{formatCurrency(man)}</div>
              </div>
              <div className="p-5 bg-[#22c55e]/10 dark:bg-[#22c55e]/5 rounded-xl border border-[#22c55e]/20 dark:border-[#22c55e]/10 text-center flex flex-col justify-center">
                <p className="text-[10px] font-bold text-[#22c55e] uppercase tracking-wider mb-1">Lucro Líquido</p>
                <div className="text-4xl font-black text-[#22c55e]">{formatCurrency(lucro)}</div>
              </div>
            </div>
          </div>
          </>
          ) : (
            <div className="space-y-8">
              <header className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Manual e Suporte</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Aprenda a usar o sistema e entre em contato</p>
              </header>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center text-lg border-b border-slate-100 dark:border-slate-700 pb-4">
                    <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                    Funções do Aplicativo
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm">1. Dados do Cliente</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Registre o nome e telefone do cliente. Estes dados serão utilizados no cabeçalho da proposta comercial exportada.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm">2. Levantamento de Cargas (Consumo)</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Adicione os equipamentos que serão alimentados. Insira a quantidade, potência (W), fator de partida (pico do motor) e horas de uso diário. O app calcula automaticamente o consumo total diário (Wh) e o consumo corrigido considerando as perdas.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm">3. Configuração do Kit Solar</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Defina os parâmetros de geração: Potência do painel solar (W), <strong>Horas de Sol Pleno (HSP)</strong> da região, margem de segurança de consumo, eficiência do inversor e do sistema geral. Também configure a tensão do sistema (12V, 24V, 48V) e o comprimento dos cabos para o cálculo de bitola.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm">4. Banco de Baterias (Armazenamento)</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Configure o armazenamento de energia: Escolha a tecnologia (Chumbo-Ácido ou Lítio), dias de autonomia desejados, Profundidade de Descarga (DoD) e eficiência. <strong>Novos recursos:</strong> Defina os <strong>Ciclos de Vida</strong>, <strong>Limite de Corrente de Carga</strong>, e o <strong>Custo por Ah</strong> para obter uma estimativa automática do <strong>Custo Total do Banco de Baterias</strong>.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm">5. Resultados do Dimensionamento</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">O motor de cálculo fornece instantaneamente: Quantidade total de painéis (e arranjo em série/paralelo), quantidade total de baterias (série/paralelo), dimensionamento do controlador de carga (A), bitola mínima do cabo (mm²) e a queda de tensão (%).</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm">6. Gráficos e Análise Financeira (ROI)</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Visualize o Balanço Energético Diário através de gráficos interativos (Consumo vs. Geração). Acompanhe a estimativa de Retorno sobre Investimento (ROI) em 10 anos, considerando custos de equipamento, manutenção e lucro líquido estimado.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white text-sm">7. Exportação de Proposta</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Clique em "Exportar Proposta" para gerar um documento limpo, formatado e pronto para ser salvo em PDF ou impresso para o cliente final, ocultando os menus de navegação.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-fit space-y-6">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center text-lg border-b border-slate-100 dark:border-slate-700 pb-4">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Suporte Técnico
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                        <span className="text-blue-600 font-bold">@</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">E-mail</p>
                        <p className="text-slate-800 dark:text-white font-medium mt-0.5">mgssystemsolar@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                        <span className="text-green-600 font-bold">W</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Telefone / WhatsApp</p>
                        <p className="text-slate-800 dark:text-white font-medium mt-0.5">+55 (88) 988360143</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center shrink-0">
                        <Sun className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Horário de Atendimento</p>
                        <p className="text-slate-800 dark:text-white font-medium mt-0.5">Horário Comercial</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Segunda a Sexta, 08:00 às 18:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
