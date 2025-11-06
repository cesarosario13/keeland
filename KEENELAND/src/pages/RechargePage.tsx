import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, DollarSign, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'card', name: 'Tarjeta de Crédito/Débito', icon: CreditCard, fee: '2.5%' },
  { id: 'transfer', name: 'Transferencia Bancaria', icon: DollarSign, fee: '0%' },
];

const quickAmounts = [10, 25, 50, 100, 250, 500];

const mockTransactions = [
  { id: 1, amount: 100, status: 'completed', method: 'Tarjeta', date: '2025-11-04 10:30' },
  { id: 2, amount: 50, status: 'pending', method: 'Transferencia', date: '2025-11-03 15:20' },
  { id: 3, amount: 200, status: 'completed', method: 'Tarjeta', date: '2025-11-02 09:15' },
  { id: 4, amount: 75, status: 'failed', method: 'Tarjeta', date: '2025-11-01 18:45' },
];

export default function RechargePage() {
  const { balance, updateBalance } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleRecharge = async () => {
    const rechargeAmount = parseFloat(amount);
    
    if (!rechargeAmount || rechargeAmount <= 0) {
      toast.error('Por favor ingresa un monto válido');
      return;
    }

    if (rechargeAmount < 10) {
      toast.error('El monto mínimo de recarga es $10');
      return;
    }

    if (paymentMethod === 'card' && !showCardForm) {
      setShowCardForm(true);
      return;
    }

    setIsProcessing(true);

    // Simular procesamiento de pago
    setTimeout(() => {
      updateBalance(balance + rechargeAmount);
      toast.success(`¡Recarga exitosa! Se agregaron $${rechargeAmount} a tu balance`);
      setAmount('');
      setShowCardForm(false);
      setCardData({ number: '', name: '', expiry: '', cvv: '' });
      setIsProcessing(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-primary" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallido';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Recargar Balance</h1>
          <p className="text-muted-foreground">Agrega fondos a tu cuenta de forma segura</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de Recarga */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Balance Actual</h2>
                <div className="text-right">
                  <p className="text-3xl text-primary">${balance.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Disponible</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Monto */}
                <div>
                  <Label htmlFor="amount" className="text-base mb-3 block">Monto a Recargar</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-8 text-2xl h-16 bg-input-background border-border"
                      min="10"
                      step="1"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Monto mínimo: $10</p>
                </div>

                {/* Montos Rápidos */}
                <div>
                  <Label className="text-base mb-3 block">Montos Rápidos</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {quickAmounts.map((value) => (
                      <Button
                        key={value}
                        onClick={() => handleQuickAmount(value)}
                        variant="outline"
                        className={`border-2 h-14 ${
                          amount === value.toString() 
                            ? 'border-primary bg-primary/10 text-primary' 
                            : 'border-border hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        ${value}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Método de Pago */}
                <div>
                  <Label className="text-base mb-3 block">Método de Pago</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            paymentMethod === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <div className="flex items-center gap-4">
                            <RadioGroupItem value={method.id} id={method.id} className="border-primary" />
                            <method.icon className="h-6 w-6 text-primary" />
                            <div>
                              <Label htmlFor={method.id} className="cursor-pointer">
                                {method.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">Comisión: {method.fee}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Formulario de Tarjeta */}
                {showCardForm && paymentMethod === 'card' && (
                  <Card className="p-6 bg-secondary border-primary">
                    <h3 className="text-lg mb-4">Información de la Tarjeta</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          className="bg-input-background border-border"
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input
                          id="cardName"
                          placeholder="Juan Pérez"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                          className="bg-input-background border-border"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Vencimiento</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/AA"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            className="bg-input-background border-border"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            className="bg-input-background border-border"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Botón de Recarga */}
                <Button
                  onClick={handleRecharge}
                  disabled={isProcessing || !amount || parseFloat(amount) < 10}
                  className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-lg"
                >
                  {isProcessing ? (
                    'Procesando...'
                  ) : showCardForm && paymentMethod === 'card' ? (
                    <>
                      Confirmar Pago de ${amount || '0'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Historial de Transacciones */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card border-border sticky top-6">
              <h2 className="text-xl mb-4">Historial de Recargas</h2>
              <div className="space-y-3">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 bg-secondary rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">${transaction.amount}</p>
                        <p className="text-sm text-muted-foreground">{transaction.method}</p>
                      </div>
                      {getStatusIcon(transaction.status)}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{transaction.date}</span>
                      <span className={`font-medium ${
                        transaction.status === 'completed' ? 'text-primary' :
                        transaction.status === 'pending' ? 'text-yellow-600' :
                        'text-destructive'
                      }`}>
                        {getStatusText(transaction.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
