import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Printer, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

export default function App() {
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
  const [diasAutonomia, setDiasAutonomia] = useState<number>(2);
  const [dod, setDod] = useState<number>(30);
  const [eficienciaCoulombica, setEficienciaCoulombica] = useState<number>(90);
  const [fatorTemperatura, setFatorTemperatura] = useState<number>(1);
  const [capacidadeBateriaIndividual, setCapacidadeBateriaIndividual] = useState<number>(220);
  const [tensaoBateriaIndividual, setTensaoBateriaIndividual] = useState<number>(12);

  const [clienteNome, setClienteNome] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [clienteCidade, setClienteCidade] = useState('');

  useEffect(() => {
    if (tipoBateria === 'Lítio') {
      setDod(85);
    } else {
      setDod(30);
    }
  }, [tipoBateria]);

  const adicionarLinha = () => {
    setItens([...itens, { id: Date.now().toString(), nome: "Novo Item", qtd: 1, w: 0, h: 0, fatorPartida: 1 }]);
  };

  const updateItem = (id: string, campo: keyof LoadItem, valor: string | number) => {
    setItens(itens.map(item => {
      if (item.id === id) {
        return { ...item, [campo]: campo === 'nome' ? valor : (parseFloat(valor as string) || 0) };
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
    bit,
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
    totalBaterias
  } = useMemo(() => {
    let totalWh = 0;
    let totalWNominal = 0;
    let maiorPicoExtra = 0;
    const hsp = 5;

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
    const Ed = consumoCorrigido / efi;

    const nP = Math.ceil((Ed * 1.25) / (hsp * potPainel));
    const geracaoEstimada = nP * potPainel * hsp;
    
    const Kp = dod / 100;
    const Kc = eficienciaCoulombica / 100;
    const bat = (Ed * fatorTemperatura * diasAutonomia) / (Kp * Kc * tensao);
    
    const bateriasEmParalelo = Math.round(bat / capacidadeBateriaIndividual);
    const bateriasEmSerie = Math.ceil(tensao / tensaoBateriaIndividual);
    const totalBaterias = bateriasEmParalelo * bateriasEmSerie;
    
    const amp = (nP * potPainel) / tensao;
    
    let bit = amp > 50 ? 16 : (amp > 30 ? 10 : 6);

    const inv = (nP * potPainel) * 5.8;
    const eco = (totalWh / 1000) * 30 * 0.95;
    const man = (tipoBateria === 'Lítio') ? (bat * tensao * 1.2) : (bat * tensao * 3.5);
    const lucro = ((eco * 12 * 10) - inv - man);

    const ampControlador = isNaN(amp) || !isFinite(amp) ? 0 : Math.ceil(amp * 1.1);
    const quedaTensao = bit > 0 ? (2 * comprimentoCabo * ampControlador * 0.0175) / bit : 0;
    const quedaPercentual = tensao > 0 ? (quedaTensao / tensao) * 100 : 0;

    return {
      maiorPico: Math.ceil(maiorPico),
      nP: isNaN(nP) || !isFinite(nP) ? 0 : nP,
      bat: isNaN(bat) || !isFinite(bat) ? 0 : Math.ceil(bat),
      amp: ampControlador,
      bit,
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
      totalBaterias: isNaN(totalBaterias) || !isFinite(totalBaterias) ? 0 : totalBaterias
    };
  }, [itens, potPainel, tensao, tipoBateria, comprimentoCabo, eficienciaInversor, fatorCorrecaoConsumo, diasAutonomia, dod, eficienciaCoulombica, fatorTemperatura, capacidadeBateriaIndividual, tensaoBateriaIndividual]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 print:hidden">
          <h1 className="text-3xl font-black text-slate-800">
            SOLAR<span className="text-yellow-500">PRO</span>
          </h1>
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 transition-colors text-black px-6 py-2 rounded-xl font-bold"
          >
            <StepBadge num={9} />
            <Printer size={20} />
            PDF Proposta
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-md">
              <h2 className="font-bold uppercase text-slate-500 mb-4 flex items-center">
                <StepBadge num={1} /> Dados do Cliente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block text-sm font-bold text-slate-700">
                  Nome do Cliente:
                  <input 
                    type="text" 
                    value={clienteNome} 
                    onChange={(e) => setClienteNome(e.target.value)} 
                    className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Ex: João da Silva"
                  />
                </label>
                <label className="block text-sm font-bold text-slate-700">
                  Telefone:
                  <input 
                    type="text" 
                    value={clienteTelefone} 
                    onChange={(e) => setClienteTelefone(e.target.value)} 
                    className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="(00) 00000-0000"
                  />
                </label>
                <label className="block text-sm font-bold text-slate-700">
                  Email:
                  <input 
                    type="email" 
                    value={clienteEmail} 
                    onChange={(e) => setClienteEmail(e.target.value)} 
                    className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="joao@email.com"
                  />
                </label>
                <label className="block text-sm font-bold text-slate-700">
                  Cidade/UF:
                  <input 
                    type="text" 
                    value={clienteCidade} 
                    onChange={(e) => setClienteCidade(e.target.value)} 
                    className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="São Paulo - SP"
                  />
                </label>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold uppercase text-slate-500 flex items-center"><StepBadge num={2} /> Cargas Solares</h2>
                <button 
                  onClick={adicionarLinha} 
                  className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-bold transition-colors"
                >
                  <Plus size={18} /> Adicionar
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-sm text-slate-400">
                      <th className="pb-2 font-medium">Equipamento</th>
                      <th className="pb-2 font-medium w-20">Qtd.</th>
                      <th className="pb-2 font-medium w-24">Potência (W)</th>
                      <th className="pb-2 font-medium w-24" title="Fator IP/In (Pico de Partida)">Fator Partida</th>
                      <th className="pb-2 font-medium w-24">Horas/Dia</th>
                      <th className="pb-2 font-medium w-32 text-right">Consumo Diário (Wh)</th>
                      <th className="pb-2 font-medium w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itens.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="py-2 pr-2">
                          <input 
                            type="text" 
                            value={item.nome} 
                            onChange={(e) => updateItem(item.id, 'nome', e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            placeholder="Nome do equipamento"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input 
                            type="number" 
                            value={item.qtd || ''} 
                            onChange={(e) => updateItem(item.id, 'qtd', e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            min="1"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input 
                            type="number" 
                            value={item.w || ''} 
                            onChange={(e) => updateItem(item.id, 'w', e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            min="0"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input 
                            type="number" 
                            value={item.fatorPartida || ''} 
                            onChange={(e) => updateItem(item.id, 'fatorPartida', e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            min="0"
                            max="24"
                          />
                        </td>
                        <td className="py-2 pr-4 text-right font-bold text-slate-600">
                          {((item.w || 0) * (item.h || 0) * (item.qtd || 1)).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-2 text-right">
                          <button 
                            onClick={() => removerItem(item.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                            title="Remover item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200">
                      <td colSpan={5} className="py-3 text-right font-bold text-slate-500 uppercase text-xs tracking-wider">
                        Consumo Base
                      </td>
                      <td className="py-3 pr-4 text-right font-black text-slate-800 text-lg">
                        {totalWh.toLocaleString('pt-BR')} Wh
                      </td>
                      <td></td>
                    </tr>
                    <tr className="border-t border-slate-100 bg-yellow-50/50">
                      <td colSpan={5} className="py-3 text-right font-bold text-yellow-600 uppercase text-xs tracking-wider">
                        Consumo Corrigido (+{fatorCorrecaoConsumo}%)
                      </td>
                      <td className="py-3 pr-4 text-right font-black text-yellow-600 text-lg">
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
                <div className="bg-white p-6 rounded-3xl shadow-md space-y-4">
                  <h3 className="font-bold text-xs uppercase text-slate-400 flex items-center"><StepBadge num={3} /> Configuração do Kit</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm font-bold text-slate-700">
                      Potência Painel (W): 
                      <input 
                        type="number" 
                        value={potPainel || ''} 
                        onChange={(e) => setPotPainel(parseFloat(e.target.value) || 0)} 
                        className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </label>
                    <label className="block text-sm font-bold text-slate-700">
                      Margem Seg. Consumo (%): 
                      <input 
                        type="number" 
                        value={fatorCorrecaoConsumo || ''} 
                        onChange={(e) => setFatorCorrecaoConsumo(parseFloat(e.target.value) || 0)} 
                        className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        min="0"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm font-bold text-slate-700">
                      Efic. Inversor (%): 
                      <input 
                        type="number" 
                        value={eficienciaInversor || ''} 
                        onChange={(e) => setEficienciaInversor(parseFloat(e.target.value) || 0)} 
                        className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        min="1"
                        max="100"
                      />
                    </label>
                    <label className="block text-sm font-bold text-slate-700">
                      Tensão do Sistema:
                      <select 
                        value={tensao} 
                        onChange={(e) => setTensao(parseFloat(e.target.value))} 
                        className="mt-1 w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="12">12V</option>
                        <option value="24">24V</option>
                        <option value="48">48V</option>
                      </select>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm font-bold text-slate-700">
                      Tipo de Bateria:
                      <select 
                        value={tipoBateria} 
                        onChange={(e) => setTipoBateria(e.target.value)} 
                        className="mt-1 w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="Lítio">Lítio</option>
                        <option value="Chumbo">Chumbo</option>
                      </select>
                    </label>
                    <label className="block text-sm font-bold text-slate-700">
                      Dias de Autonomia (Qd):
                      <input 
                        type="number" 
                        value={diasAutonomia || ''} 
                        onChange={(e) => setDiasAutonomia(parseFloat(e.target.value) || 0)} 
                        className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        min="1"
                        step="1"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm font-bold text-slate-700">
                      DoD Máximo (%):
                      <input 
                        type="number" 
                        value={dod || ''} 
                        onChange={(e) => setDod(parseFloat(e.target.value) || 0)} 
                        className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </label>
                    <label className="block text-sm font-bold text-slate-700">
                      Efic. Coulômbica (%):
                      <input 
                        type="number" 
                        value={eficienciaCoulombica || ''} 
                        onChange={(e) => setEficienciaCoulombica(parseFloat(e.target.value) || 0)} 
                        className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm font-bold text-slate-700">
                      Fator Temp. (Kt):
                      <input 
                        type="number" 
                        value={fatorTemperatura || ''} 
                        onChange={(e) => setFatorTemperatura(parseFloat(e.target.value) || 0)} 
                        className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        step="0.1"
                      />
                    </label>
                    <label className="block text-sm font-bold text-slate-700">
                      Capacidade Bat. (Ah):
                      <input 
                        type="number" 
                        value={capacidadeBateriaIndividual || ''} 
                        onChange={(e) => setCapacidadeBateriaIndividual(parseFloat(e.target.value) || 0)} 
                        className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm font-bold text-slate-700">
                      Tensão Bat. (V):
                      <select 
                        value={tensaoBateriaIndividual} 
                        onChange={(e) => setTensaoBateriaIndividual(parseFloat(e.target.value))} 
                        className="mt-1 w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="2">2V</option>
                        <option value="12">12V</option>
                        <option value="24">24V</option>
                        <option value="48">48V</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-md space-y-4 border-l-4 border-blue-500">
                  <h3 className="font-bold text-xs uppercase text-slate-400 flex items-center"><StepBadge num={4} /> Detalhes da Bateria</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Tipo</p>
                      <div className="font-bold text-slate-700">{tipoBateria === 'Lítio' ? 'Lítio (LiFePO4)' : 'Chumbo-Ácido'}</div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Capacidade C20</p>
                      <div className="font-bold text-slate-700">{bat} Ah</div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">DoD / Autonomia</p>
                      <div className="font-bold text-slate-700">{dod}% / {diasAutonomia} dias</div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Vida Útil Estimada</p>
                      <div className="font-bold text-slate-700">{tipoBateria === 'Lítio' ? '+4.000 ciclos (~10 anos)' : '~500 ciclos (~5 anos)'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl text-white shadow-xl flex flex-col justify-between">
                  <div>
                    <p className="text-yellow-500 text-[10px] font-bold uppercase tracking-wider flex items-center mb-1"><StepBadge num={5} /> Inversor Mínimo (Pico)</p>
                    <div className="text-4xl font-black mt-1">{maiorPico}W</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Cabo Bat.</p>
                      <div className="font-bold text-lg">{bit}mm²</div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Controlador</p>
                      <div className="font-bold text-lg">{amp}A</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-md space-y-4 border-l-4 border-orange-500">
                  <h3 className="font-bold text-xs uppercase text-slate-400 flex items-center mb-4"><StepBadge num={6} /> Queda de Tensão (CC)</h3>
                  <label className="block text-sm font-bold text-slate-700">
                    Comprimento do Cabo (m):
                    <input 
                      type="number" 
                      value={comprimentoCabo || ''} 
                      onChange={(e) => setComprimentoCabo(parseFloat(e.target.value) || 0)} 
                      className="mt-1 w-full bg-slate-50 p-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      min="0.5"
                      step="0.5"
                    />
                  </label>
                  <div className="pt-2">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Perda Estimada</span>
                      <span className={`font-bold ${quedaPercentual <= 3 ? 'text-green-500' : quedaPercentual <= 5 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {quedaPercentual.toFixed(2)}% ({quedaTensao.toFixed(2)}V)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${quedaPercentual <= 3 ? 'bg-green-500' : quedaPercentual <= 5 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                        style={{ width: `${Math.min(quedaPercentual, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 font-medium">
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
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl text-white shadow-2xl flex flex-col justify-center">
              <h3 className="text-yellow-500 font-bold uppercase text-xs tracking-wider mb-8 flex items-center"><StepBadge num={7} /> Kit Solar Fotovoltaico</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Painéis ({potPainel}W)</p>
                  <div className="text-6xl font-black">{nP} <span className="text-2xl">unidades</span></div>
                  <div className="mt-2 text-sm text-slate-400 font-medium">
                    Potência Total: {(nP * potPainel).toLocaleString('pt-BR')} Wp
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Baterias ({tensaoBateriaIndividual}V / {capacidadeBateriaIndividual}Ah)</p>
                  <div className="text-4xl font-black text-yellow-500">{totalBaterias} <span className="text-2xl">unidades</span></div>
                  <div className="mt-2 text-sm text-slate-400 font-medium">
                    {bateriasEmParalelo} em paralelo × {bateriasEmSerie} em série
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md space-y-4">
              <h3 className="font-bold text-xs uppercase text-slate-400 flex items-center"><StepBadge num={8} /> Balanço Energético Diário</h3>
              <div className="h-64 w-full">
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
                    margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`${value.toLocaleString('pt-BR')} Wh`, '']}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Consumo Diário Total" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Consumo Corrigido" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Geração Solar Estimada" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white p-8 rounded-3xl shadow-xl border-t-4 border-green-500 print:break-inside-avoid">
            <h2 className="text-xl font-black mb-6 italic text-slate-800">Análise de ROI (10 Anos)</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Investimento</p>
                <div className="text-2xl font-bold text-slate-700">{formatCurrency(inv)}</div>
              </div>
              <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Manutenção</p>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(man)}</div>
              </div>
              <div className="p-5 bg-green-50 rounded-2xl border border-green-200 text-center flex flex-col justify-center">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Lucro Líquido</p>
                <div className="text-4xl font-black text-green-700">{formatCurrency(lucro)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
