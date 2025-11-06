import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export function DiceGame() {
  const { user, updateBalance } = useAuth();
  const [betAmount, setBetAmount] = useState('10');
  const [prediction, setPrediction] = useState<'over' | 'under'>('over');
  const [target, setTarget] = useState('50');
  const [result, setResult] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);

  const roll = async () => {
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

    setIsRolling(true);
    await updateBalance(bet, 'subtract');

    // Animate dice rolling
    const rollDuration = 1500;
    const rollInterval = 100;
    const rolls = rollDuration / rollInterval;
    
    for (let i = 0; i < rolls; i++) {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      await new Promise(resolve => setTimeout(resolve, rollInterval));
    }

    // Final result
    const finalResult = Math.floor(Math.random() * 100) + 1;
    setResult(finalResult);
    setDiceValue(Math.floor(Math.random() * 6) + 1);

    const targetNum = parseFloat(target);
    const won = (prediction === 'over' && finalResult > targetNum) || 
                 (prediction === 'under' && finalResult < targetNum);

    if (won) {
      const multiplier = prediction === 'over' 
        ? (100 / (100 - targetNum)) 
        : (100 / targetNum);
      const winAmount = bet * multiplier;
      await updateBalance(winAmount, 'add');
      toast.success(`¡Ganaste $${winAmount.toFixed(2)}!`);
    } else {
      toast.error(`Perdiste. Resultado: ${finalResult}`);
    }

    setIsRolling(false);
  };

  const DiceIcon = diceIcons[diceValue - 1];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Interface */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Juego de Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dice Display */}
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={isRolling ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
              >
                <DiceIcon className="h-32 w-32 text-green-500" />
              </motion.div>
            </div>

            {result !== null && (
              <div className="text-center">
                <p className="text-gray-400 text-sm">Resultado</p>
                <p className="text-white text-4xl">{result}</p>
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
                disabled={isRolling}
              />
            </div>

            {/* Prediction */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">Predicción</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setPrediction('over')}
                  className={prediction === 'over' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}
                  disabled={isRolling}
                >
                  Mayor que
                </Button>
                <Button
                  onClick={() => setPrediction('under')}
                  className={prediction === 'under' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-slate-700 hover:bg-slate-600 text-gray-300'}
                  disabled={isRolling}
                >
                  Menor que
                </Button>
              </div>
            </div>

            {/* Target Number */}
            <div>
              <label className="text-gray-300 text-sm block mb-2">Número Objetivo: {target}</label>
              <input
                type="range"
                min="1"
                max="99"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full"
                disabled={isRolling}
              />
            </div>

            {/* Roll Button */}
            <Button 
              onClick={roll}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isRolling || !user}
            >
              {isRolling ? 'Lanzando...' : 'Lanzar Dados'}
            </Button>
          </CardContent>
        </Card>

        {/* Info Panel */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Cómo Jugar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-green-500 mb-2">Reglas del Juego</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Elige tu cantidad de apuesta</li>
                <li>• Selecciona si el resultado será mayor o menor que tu número objetivo</li>
                <li>• Ajusta el número objetivo con el slider</li>
                <li>• Lanza los dados y gana si aciertas</li>
              </ul>
            </div>

            <div>
              <h4 className="text-green-500 mb-2">Multiplicadores</h4>
              <p className="text-gray-400 text-sm">
                Cuanto más difícil sea tu predicción, mayor será tu multiplicador de ganancias.
              </p>
              <div className="mt-3 bg-slate-700 rounded-lg p-3">
                <p className="text-white text-sm">
                  Multiplicador actual: <span className="text-green-500">
                    {prediction === 'over' 
                      ? (100 / (100 - parseFloat(target))).toFixed(2) 
                      : (100 / parseFloat(target)).toFixed(2)}x
                  </span>
                </p>
              </div>
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