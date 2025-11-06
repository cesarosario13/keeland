import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { 
  Plus, 
  Users, 
  Trophy, 
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import TournamentBracket from '../components/TournamentBracket';

interface CustomBet {
  id: number;
  title: string;
  description: string;
  creator: string;
  participants: number;
  totalPool: number;
  deadline: string;
  status: 'open' | 'closed' | 'settled';
  category: 'event' | 'tournament' | 'prediction';
  outcome?: string;
}

const mockBets: CustomBet[] = [
  {
    id: 1,
    title: '¿Quién ganará el partido de fútbol?',
    description: 'Real Madrid vs Barcelona - Final de Copa',
    creator: 'Juan Pérez',
    participants: 12,
    totalPool: 600,
    deadline: '2025-11-10',
    status: 'open',
    category: 'event',
  },
  {
    id: 2,
    title: 'Torneo de Videojuegos - FIFA 24',
    description: 'Torneo entre amigos, 8 participantes',
    creator: 'María García',
    participants: 8,
    totalPool: 400,
    deadline: '2025-11-15',
    status: 'open',
    category: 'tournament',
  },
  {
    id: 3,
    title: '¿Superará Bitcoin los $100K este mes?',
    description: 'Predicción sobre el precio de BTC',
    creator: 'Carlos López',
    participants: 25,
    totalPool: 1250,
    deadline: '2025-11-30',
    status: 'open',
    category: 'prediction',
  },
  {
    id: 4,
    title: 'Torneo de Póker Mensual',
    description: 'Competencia eliminatoria entre 16 jugadores',
    creator: 'Ana Rodríguez',
    participants: 16,
    totalPool: 1600,
    deadline: '2025-11-08',
    status: 'closed',
    category: 'tournament',
  },
];

export default function CustomBetsPage() {
  const [activeTab, setActiveTab] = useState('browse');
  const [newBet, setNewBet] = useState({
    title: '',
    description: '',
    category: 'event' as 'event' | 'tournament' | 'prediction',
    entryFee: '',
    maxParticipants: '',
    deadline: '',
    options: ['', ''],
  });

  const handleCreateBet = () => {
    if (!newBet.title || !newBet.description || !newBet.entryFee || !newBet.deadline) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    toast.success('¡Apuesta creada exitosamente!');
    // Aquí iría la lógica para crear la apuesta en el backend
    setNewBet({
      title: '',
      description: '',
      category: 'event',
      entryFee: '',
      maxParticipants: '',
      deadline: '',
      options: ['', ''],
    });
  };

  const addOption = () => {
    setNewBet({
      ...newBet,
      options: [...newBet.options, ''],
    });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newBet.options];
    newOptions[index] = value;
    setNewBet({ ...newBet, options: newOptions });
  };

  const removeOption = (index: number) => {
    if (newBet.options.length > 2) {
      const newOptions = newBet.options.filter((_, i) => i !== index);
      setNewBet({ ...newBet, options: newOptions });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'event':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'tournament':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'prediction':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-secondary text-foreground border-border';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-primary/10 text-primary border-primary/30">Abierta</Badge>;
      case 'closed':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Cerrada</Badge>;
      case 'settled':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Finalizada</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-2">Apuestas Personalizadas</h1>
            <p className="text-muted-foreground">Crea y participa en apuestas únicas con tus amigos</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-5 w-5 mr-2" />
                Crear Apuesta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-card max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Crear Nueva Apuesta</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Tipo de Apuesta */}
                <div>
                  <Label className="text-base mb-3 block">Tipo de Apuesta</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className={`h-20 flex-col ${
                        newBet.category === 'event' 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-border hover:border-primary'
                      }`}
                      onClick={() => setNewBet({ ...newBet, category: 'event' })}
                    >
                      <Calendar className="h-6 w-6 mb-2" />
                      Evento
                    </Button>
                    <Button
                      variant="outline"
                      className={`h-20 flex-col ${
                        newBet.category === 'tournament' 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-border hover:border-primary'
                      }`}
                      onClick={() => setNewBet({ ...newBet, category: 'tournament' })}
                    >
                      <Trophy className="h-6 w-6 mb-2" />
                      Torneo
                    </Button>
                    <Button
                      variant="outline"
                      className={`h-20 flex-col ${
                        newBet.category === 'prediction' 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-border hover:border-primary'
                      }`}
                      onClick={() => setNewBet({ ...newBet, category: 'prediction' })}
                    >
                      <TrendingUp className="h-6 w-6 mb-2" />
                      Predicción
                    </Button>
                  </div>
                </div>

                {/* Título */}
                <div>
                  <Label htmlFor="title">Título de la Apuesta *</Label>
                  <Input
                    id="title"
                    placeholder="ej: ¿Quién ganará el partido?"
                    value={newBet.title}
                    onChange={(e) => setNewBet({ ...newBet, title: e.target.value })}
                    className="bg-input-background border-border"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe los detalles de la apuesta..."
                    value={newBet.description}
                    onChange={(e) => setNewBet({ ...newBet, description: e.target.value })}
                    className="bg-input-background border-border min-h-[100px]"
                  />
                </div>

                {/* Opciones (solo para event y prediction) */}
                {(newBet.category === 'event' || newBet.category === 'prediction') && (
                  <div>
                    <Label className="text-base mb-3 block">Opciones de Resultado *</Label>
                    <div className="space-y-2">
                      {newBet.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Opción ${index + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className="bg-input-background border-border"
                          />
                          {newBet.options.length > 2 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeOption(index)}
                              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        onClick={addOption}
                        className="w-full border-dashed border-primary text-primary hover:bg-primary/10"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Opción
                      </Button>
                    </div>
                  </div>
                )}

                {/* Configuración */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="entryFee">Cuota de Entrada ($) *</Label>
                    <Input
                      id="entryFee"
                      type="number"
                      placeholder="50"
                      value={newBet.entryFee}
                      onChange={(e) => setNewBet({ ...newBet, entryFee: e.target.value })}
                      className="bg-input-background border-border"
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxParticipants">Máx. Participantes</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      placeholder="Sin límite"
                      value={newBet.maxParticipants}
                      onChange={(e) => setNewBet({ ...newBet, maxParticipants: e.target.value })}
                      className="bg-input-background border-border"
                      min="2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="deadline">Fecha Límite *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newBet.deadline}
                    onChange={(e) => setNewBet({ ...newBet, deadline: e.target.value })}
                    className="bg-input-background border-border"
                  />
                </div>

                <Button
                  onClick={handleCreateBet}
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Crear Apuesta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="browse">Explorar</TabsTrigger>
            <TabsTrigger value="myBets">Mis Apuestas</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          {/* Explorar Apuestas */}
          <TabsContent value="browse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockBets.map((bet) => (
                <Card key={bet.id} className="p-6 bg-card border-border hover:border-primary transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className={getCategoryColor(bet.category)}>
                      {bet.category === 'event' && 'Evento'}
                      {bet.category === 'tournament' && 'Torneo'}
                      {bet.category === 'prediction' && 'Predicción'}
                    </Badge>
                    {getStatusBadge(bet.status)}
                  </div>

                  <h3 className="text-xl mb-2">{bet.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{bet.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Creador</span>
                      <span className="font-medium">{bet.creator}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Participantes
                      </span>
                      <span className="font-medium">{bet.participants}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Premio Total
                      </span>
                      <span className="font-medium text-primary">${bet.totalPool}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Fecha Límite
                      </span>
                      <span className="font-medium">{bet.deadline}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {bet.category === 'tournament' ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                            Ver Bracket
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-card">
                          <DialogHeader>
                            <DialogTitle className="text-2xl">{bet.title}</DialogTitle>
                          </DialogHeader>
                          <TournamentBracket participants={bet.participants} />
                        </DialogContent>
                      </Dialog>
                    ) : null}
                    <Button 
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={bet.status !== 'open'}
                    >
                      {bet.status === 'open' ? 'Participar' : 'Cerrada'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Mis Apuestas */}
          <TabsContent value="myBets">
            <Card className="p-8 bg-card border-border text-center">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2">Aún no has creado apuestas</h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primera apuesta personalizada y compite con tus amigos
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-5 w-5 mr-2" />
                    Crear Primera Apuesta
                  </Button>
                </DialogTrigger>
              </Dialog>
            </Card>
          </TabsContent>

          {/* Historial */}
          <TabsContent value="history">
            <Card className="p-8 bg-card border-border text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl mb-2">Sin historial</h3>
              <p className="text-muted-foreground">
                Aquí aparecerán tus apuestas finalizadas
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
