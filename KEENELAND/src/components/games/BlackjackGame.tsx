import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { motion } from 'motion/react';

type CardType = {
  value: number;
  display: string;
  suit: string;
};

const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function BlackjackGame() {
  const { user, updateBalance } = useAuth();
  const [betAmount, setBetAmount] = useState('10');
  const [playerHand, setPlayerHand] = useState<CardType[]>([]);
  const [dealerHand, setDealerHand] = useState<CardType[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'finished'>('betting');
  const [result, setResult] = useState<string>('');

  const createCard = (): CardType => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const valueStr = values[Math.floor(Math.random() * values.length)];
    let value = parseInt(valueStr);
    
    if (valueStr === 'A') value = 11;
    else if (['J', 'Q', 'K'].includes(valueStr)) value = 10;
    
    return { value, display: valueStr, suit };
  };

  const calculateScore = (hand: CardType[]): number => {
    let score = hand.reduce((sum, card) => sum + card.value, 0);
    let aces = hand.filter(card => card.display === 'A').length;
    
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  const startGame = async () => {
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

    await updateBalance(bet, 'subtract');

    const newPlayerHand = [createCard(), createCard()];
    const newDealerHand = [createCard(), createCard()];
    
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameState('playing');
    setResult('');

    // Check for immediate blackjack
    if (calculateScore(newPlayerHand) === 21) {
      finishGame(newPlayerHand, newDealerHand);
    }
  };

  const hit = () => {
    const newHand = [...playerHand, createCard()];
    setPlayerHand(newHand);
    
    if (calculateScore(newHand) > 21) {
      finishGame(newHand, dealerHand);
    }
  };

  const stand = () => {
    let newDealerHand = [...dealerHand];
    
    while (calculateScore(newDealerHand) < 17) {
      newDealerHand.push(createCard());
    }
    
    setDealerHand(newDealerHand);
    finishGame(playerHand, newDealerHand);
  };

  const finishGame = async (finalPlayerHand: CardType[], finalDealerHand: CardType[]) => {
    const playerScore = calculateScore(finalPlayerHand);
    const dealerScore = calculateScore(finalDealerHand);
    
    const bet = parseFloat(betAmount);
    let resultText = '';
    let winAmount = 0;

    if (playerScore > 21) {
      resultText = '¡Te pasaste! Dealer gana.';
    } else if (dealerScore > 21) {
      resultText = '¡Dealer se pasó! ¡Ganaste!';
      winAmount = bet * 2;
    } else if (playerScore > dealerScore) {
      resultText = '¡Ganaste!';
      winAmount = bet * 2;
    } else if (playerScore < dealerScore) {
      resultText = 'Dealer gana.';
    } else {
      resultText = '¡Empate!';
      winAmount = bet;
    }

    if (winAmount > 0) {
      await updateBalance(winAmount, 'add');
      toast.success(`${resultText} Ganaste $${winAmount.toFixed(2)}`);
    } else {
      toast.error(resultText);
    }

    setResult(resultText);
    setGameState('finished');
  };

  const CardComponent = ({ card }: { card: CardType }) => (
    <motion.div
      initial={{ scale: 0, rotateY: 180 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg p-4 min-w-[60px] shadow-lg ${
        ['♥', '♦'].includes(card.suit) ? 'text-red-600' : 'text-slate-900'
      }`}
    >
      <div className="text-center">
        <div className="text-xl">{card.display}</div>
        <div className="text-2xl">{card.suit}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Interface */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Blackjack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dealer Hand */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Dealer ({gameState === 'betting' ? '-' : calculateScore(dealerHand)})</p>
              <div className="flex gap-2 flex-wrap min-h-[100px] bg-slate-700 rounded-lg p-4">
                {dealerHand.map((card, idx) => (
                  <CardComponent key={idx} card={card} />
                ))}
              </div>
            </div>

            {/* Player Hand */}
            <div>
              <p className="text-green-500 text-sm mb-2">Tu mano ({gameState === 'betting' ? '-' : calculateScore(playerHand)})</p>
              <div className="flex gap-2 flex-wrap min-h-[100px] bg-slate-700 rounded-lg p-4">
                {playerHand.map((card, idx) => (
                  <CardComponent key={idx} card={card} />
                ))}
              </div>
            </div>

            {result && (
              <div className="text-center bg-slate-700 rounded-lg p-4">
                <p className="text-white text-xl">{result}</p>
              </div>
            )}

            {/* Betting */}
            {gameState === 'betting' && (
              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Cantidad a Apostar</label>
                  <Input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button 
                  onClick={startGame}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={!user}
                >
                  Repartir Cartas
                </Button>
              </div>
            )}

            {/* Playing */}
            {gameState === 'playing' && (
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={hit}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Pedir Carta
                </Button>
                <Button 
                  onClick={stand}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Plantarse
                </Button>
              </div>
            )}

            {/* Finished */}
            {gameState === 'finished' && (
              <Button 
                onClick={() => setGameState('betting')}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Nueva Partida
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Info Panel */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Cómo Jugar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-green-500 mb-2">Reglas del Blackjack</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• El objetivo es llegar a 21 o acercarse sin pasarse</li>
                <li>• Las cartas numéricas valen su número</li>
                <li>• J, Q, K valen 10 puntos</li>
                <li>• El As vale 11 o 1 según convenga</li>
                <li>• El dealer debe pedir hasta llegar a 17 o más</li>
              </ul>
            </div>

            <div>
              <h4 className="text-green-500 mb-2">Acciones</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• <span className="text-white">Pedir Carta:</span> Recibir otra carta</li>
                <li>• <span className="text-white">Plantarse:</span> Mantener tu mano actual</li>
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