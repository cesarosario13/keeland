import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const rouletteNumbers = [
  { num: 0, color: 'green' },
  ...Array.from({ length: 36 }, (_, i) => ({
    num: i + 1,
    color: [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(i + 1) ? 'red' : 'black'
  }))
];

export function RouletteGame() {
  const { user, updateBalance } = useAuth();
  const [betAmount, setBetAmount] = useState('10');
  const [selectedBets, setSelectedBets] = useState<{ type: string; value: any; amount: number }[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const addBet = (type: string, value: any) => {
    const bet = parseFloat(betAmount);
    if (isNaN(bet) || bet <= 0) {
      toast.error('Ingresa una cantidad válida');
      return;
    }

    setSelectedBets([...selectedBets, { type, value, amount: bet }]);
    toast.success(`Apuesta añadida: ${type}`);
  };

  const clearBets = () => {
    setSelectedBets([]);
  };

  const spin = async () => {
    if (!user) return;
    
    if (selectedBets.length === 0) {
      toast.error('Añade al menos una apuesta');
      return;
    }

    const totalBet = selectedBets.reduce((sum, bet) => sum + bet.amount, 0);
    if (totalBet > user.balance) {
      toast.error('Saldo insuficiente');
      return;
    }

    setIsSpinning(true);
    await updateBalance(totalBet, 'subtract');

    // Spin animation
    const spins = 5;
    const newRotation = rotation + (360 * spins) + Math.random() * 360;
    setRotation(newRotation);

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Get result
    const winningNumber = Math.floor(Math.random() * 37);
    setResult(winningNumber);

    const winning = rouletteNumbers.find(n => n.num === winningNumber);
    
    // Check winning bets
    let totalWin = 0;
    selectedBets.forEach(bet => {
      let won = false;
      let multiplier = 0;

      if (bet.type === 'number' && bet.value === winningNumber) {
        won = true;
        multiplier = 35;
      } else if (bet.type === 'color' && bet.value === winning?.color) {
        won = true;
        multiplier = 1;
      } else if (bet.type === 'even' && winningNumber > 0 && winningNumber % 2 === 0) {
        won = true;
        multiplier = 1;
      } else if (bet.type === 'odd' && winningNumber % 2 === 1) {
        won = true;
        multiplier = 1;
      } else if (bet.type === 'low' && winningNumber >= 1 && winningNumber <= 18) {
        won = true;
        multiplier = 1;
      } else if (bet.type === 'high' && winningNumber >= 19 && winningNumber <= 36) {
        won = true;
        multiplier = 1;
      }

      if (won) {
        totalWin += bet.amount * (multiplier + 1);
      }
    });

    if (totalWin > 0) {
      await updateBalance(totalWin, 'add');
      toast.success(`¡Ganaste $${totalWin.toFixed(2)}! Número: ${winningNumber} ${winning?.color}`);
    } else {
      toast.error(`Perdiste. Número ganador: ${winningNumber} ${winning?.color}`);
    }

    setIsSpinning(false);
    setSelectedBets([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Interface */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Ruleta Europea</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Roulette Wheel */}
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{ rotate: rotation }}
                transition={{ duration: 3, ease: "easeOut" }}
                className="relative"
              >
                <div className="w-48 h-48 rounded-full border-8 border-yellow-600 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  {result !== null && !isSpinning && (
                    <div className="text-center">
                      <div className={`text-4xl mb-1 ${
                        rouletteNumbers.find(n => n.num === result)?.color === 'red' 
                          ? 'text-red-500' 
                          : rouletteNumbers.find(n => n.num === result)?.color === 'black'
                          ? 'text-white'
                          : 'text-green-500'
                      }`}>
                        {result}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {rouletteNumbers.find(n => n.num === result)?.color}
                      </div>
                    </div>
                  )}
                  {isSpinning && (
                    <div className="text-white text-xl">Girando...</div>
                  )}
                  {result === null && !isSpinning && (
                    <div className="text-gray-400 text-xl">Listo</div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Bet Amount */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">Cantidad por Apuesta</label>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                disabled={isSpinning}
              />
            </div>

            {/* Quick Bets */}
            <div className="space-y-3">
              <p className="text-gray-300 text-sm">Apuestas Rápidas</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => addBet('color', 'red')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={isSpinning}
                >
                  Rojo
                </Button>
                <Button
                  onClick={() => addBet('color', 'black')}
                  className="bg-slate-900 hover:bg-slate-950 text-white border border-slate-600"
                  disabled={isSpinning}
                >
                  Negro
                </Button>
                <Button
                  onClick={() => addBet('even', null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSpinning}
                >
                  Par
                </Button>
                <Button
                  onClick={() => addBet('odd', null)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isSpinning}
                >
                  Impar
                </Button>
                <Button
                  onClick={() => addBet('low', null)}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={isSpinning}
                >
                  1-18
                </Button>
                <Button
                  onClick={() => addBet('high', null)}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={isSpinning}
                >
                  19-36
                </Button>
              </div>
            </div>

            {/* Current Bets */}
            {selectedBets.length > 0 && (
              <div className="bg-slate-700 rounded-lg p-3">
                <p className="text-white text-sm mb-2">Apuestas Activas ({selectedBets.length})</p>
                <p className="text-green-500">Total: ${selectedBets.reduce((sum, bet) => sum + bet.amount, 0).toFixed(2)}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={clearBets}
                variant="outline"
                className="border-slate-600 text-gray-300 hover:bg-slate-700"
                disabled={isSpinning || selectedBets.length === 0}
              >
                Limpiar
              </Button>
              <Button 
                onClick={spin}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isSpinning || !user || selectedBets.length === 0}
              >
                {isSpinning ? 'Girando...' : 'Girar'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Panel */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Cómo Jugar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-green-500 mb-2">Reglas de la Ruleta</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Elige el monto de cada apuesta</li>
                <li>• Selecciona las apuestas que desees</li>
                <li>• Puedes hacer múltiples apuestas</li>
                <li>• Gira la ruleta y espera el resultado</li>
              </ul>
            </div>

            <div>
              <h4 className="text-green-500 mb-2">Pagos</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Número específico: 35:1</li>
                <li>• Rojo/Negro: 1:1</li>
                <li>• Par/Impar: 1:1</li>
                <li>• 1-18 / 19-36: 1:1</li>
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