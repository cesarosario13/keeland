import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from "framer-motion";
import { Cherry, Gem, Crown, Star, Zap } from 'lucide-react';

const symbols = [
  { icon: Cherry, name: 'Cherry', color: 'text-red-500', multiplier: 2 },
  { icon: Star, name: 'Star', color: 'text-yellow-500', multiplier: 3 },
  { icon: Zap, name: 'Zap', color: 'text-blue-500', multiplier: 5 },
  { icon: Gem, name: 'Gem', color: 'text-purple-500', multiplier: 10 },
  { icon: Crown, name: 'Crown', color: 'text-green-500', multiplier: 20 },
];

export function SlotsGame() {
  const { user, updateBalance } = useAuth();
  const [betAmount, setBetAmount] = useState('10');
  const [reels, setReels] = useState([0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string>('');

  const spin = async () => {
    if (!user) return;

    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) {
      toast.error('Ingresa una cantidad válida');
      return;
    }

    if (bet > user.balance) {
      toast.error('Saldo insuficiente');
      return;
    }

    setIsSpinning(true);
    setResult('');
    await updateBalance(bet, 'subtract');

    // Animate spinning
    const spinDuration = 2000;
    const spinInterval = 100;
    const startTime = Date.now();

    const spinInterval_id = setInterval(() => {
      setReels([
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length),
        Math.floor(Math.random() * symbols.length)
      ]);
    }, spinInterval);

    await new Promise(resolve => setTimeout(resolve, spinDuration));
    clearInterval(spinInterval_id);

    // Final result
    const finalReels = [
      Math.floor(Math.random() * symbols.length),
      Math.floor(Math.random() * symbols.length),
      Math.floor(Math.random() * symbols.length)
    ];
    setReels(finalReels);

    // Check for wins
    let winAmount = 0;
    let resultText = '';

    // Three of a kind
    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      const symbol = symbols[finalReels[0]];
      winAmount = bet * symbol.multiplier;
      resultText = `¡JACKPOT! 3x ${symbol.name}`;
    }
    // Two of a kind
    else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
      winAmount = bet * 1.5;
      resultText = '¡Par! Mini ganancia';
    }
    else {
      resultText = 'Intenta de nuevo';
    }

    if (winAmount > 0) {
      await updateBalance(winAmount, 'add');
      toast.success(`${resultText} - $${winAmount.toFixed(2)}`);
    } else {
      toast.error(resultText);
    }

    setResult(resultText);
    setIsSpinning(false);
  };

  const Symbol = ({ index }: { index: number }) => {
    const SymbolIcon = symbols[reels[index]].icon;
    return (
      <motion.div
        key={`${index}-${reels[index]}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={`${symbols[reels[index]].color} bg-slate-700 rounded-lg p-8 flex items-center justify-center`}
      >
        <SymbolIcon className="h-20 w-20" />
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Interface */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Máquina Tragamonedas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Slots Display */}
            <div className="bg-gradient-to-b from-yellow-600 to-yellow-700 rounded-2xl p-6">
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => (
                  <Symbol key={index} index={index} />
                ))}
              </div>
            </div>

            {result && (
              <div className="text-center bg-slate-700 rounded-lg p-4">
                <p className="text-white text-xl">{result}</p>
              </div>
            )}

            {/* Bet Amount */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">Cantidad a Apostar</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                disabled={isSpinning}
              />
            </div>

            {/* Quick Bet Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  onClick={() => setBetAmount(amount.toString())}
                  variant="outline"
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  disabled={isSpinning}
                >
                  ${amount}
                </Button>
              ))}
            </div>

            {/* Spin Button */}
            <Button 
              onClick={spin}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xl py-6"
              disabled={isSpinning || !user}
            >
              {isSpinning ? 'GIRANDO...' : 'GIRAR'}
            </Button>
          </CardContent>
        </Card>

        {/* Info Panel */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Tabla de Pagos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-green-500 mb-3">Multiplicadores (3 símbolos iguales)</h4>
              <div className="space-y-3">
                {symbols.map((symbol, index) => {
                  const Icon = symbol.icon;
                  return (
                    <div key={index} className="flex items-center justify-between bg-slate-700 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-8 w-8 ${symbol.color}`} />
                        <span className="text-white">{symbol.name}</span>
                      </div>
                      <span className="text-green-500">{symbol.multiplier}x</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-3">
              <h4 className="text-blue-500 text-sm mb-1">Par (2 símbolos iguales)</h4>
              <p className="text-gray-400 text-xs">Ganas 1.5x tu apuesta</p>
            </div>

            <div>
              <h4 className="text-green-500 mb-2">Cómo Jugar</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Selecciona tu cantidad de apuesta</li>
                <li>• Presiona GIRAR</li>
                <li>• Consigue 3 símbolos iguales para grandes ganancias</li>
                <li>• ¡La Corona paga 20x!</li>
              </ul>
            </div>

            {user && (
              <div className="bg-green-500/10 border border-green-500 rounded-lg p-3">
                <p className="text-green-500 text-sm">Saldo actual</p>
                <p className="text-white text-2xl">${user.balance.toFixed(2)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}