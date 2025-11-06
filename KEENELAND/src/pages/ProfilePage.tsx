import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  TrendingUp, 
  DollarSign, 
  Trophy, 
  Settings,
  Bell,
  Shield,
  CreditCard,
  Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockActivityData = [
  { date: 'Lun', balance: 1000 },
  { date: 'Mar', balance: 1200 },
  { date: 'Mié', balance: 950 },
  { date: 'Jue', balance: 1400 },
  { date: 'Vie', balance: 1600 },
  { date: 'Sáb', balance: 1450 },
  { date: 'Dom', balance: 1800 },
];

const mockBetHistory = [
  { id: 1, game: 'Ruleta', amount: 100, result: 'Ganaste', profit: 200, date: '2025-11-04' },
  { id: 2, game: 'Blackjack', amount: 50, result: 'Perdiste', profit: -50, date: '2025-11-03' },
  { id: 3, game: 'Dados', amount: 75, result: 'Ganaste', profit: 150, date: '2025-11-03' },
  { id: 4, game: 'Slots', amount: 25, result: 'Ganaste', profit: 125, date: '2025-11-02' },
  { id: 5, game: 'Apuesta Deportiva', amount: 200, result: 'Pendiente', profit: 0, date: '2025-11-02' },
];

export default function ProfilePage() {
  const { user, logout, balance } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || 'Cesar Rosario',
    email: user?.email || 'cesarrosario516@gmail.com',
    phone: '',
    notifications: true,
    twoFactor: false,
  });

  const totalBets = mockBetHistory.length;
  const totalWagered = mockBetHistory.reduce((sum, bet) => sum + bet.amount, 0);
  const totalProfit = mockBetHistory.reduce((sum, bet) => sum + bet.profit, 0);
  const winRate = ((mockBetHistory.filter(b => b.result === 'Ganaste').length / totalBets) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header del Perfil */}
        <Card className="p-6 mb-6 bg-card border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profileData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl mb-1">{profileData.name}</h1>
                <p className="text-muted-foreground mb-3">{profileData.email}</p>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span>Nivel 5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>{totalBets} apuestas</span>
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={logout} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Cerrar Sesión
            </Button>
          </div>
        </Card>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Balance Actual</span>
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl">${balance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Disponible para apostar</p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Total Apostado</span>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl">${totalWagered}</p>
            <p className="text-xs text-muted-foreground mt-1">En todas las apuestas</p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Ganancia Total</span>
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <p className={`text-2xl ${totalProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
              ${totalProfit >= 0 ? '+' : ''}{totalProfit}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Rendimiento acumulado</p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Tasa de Victoria</span>
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl">{winRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">De tus apuestas</p>
          </Card>
        </div>

        {/* Tabs del Dashboard */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl mb-4">Actividad de Balance - Últimos 7 días</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockActivityData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#800020" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#800020" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBE8E0" />
                  <XAxis dataKey="date" stroke="#6B5B4F" />
                  <YAxis stroke="#6B5B4F" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #800020',
                      borderRadius: '0.5rem'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#800020" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorBalance)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl mb-4">Últimas Apuestas</h3>
              <div className="space-y-3">
                {mockBetHistory.slice(0, 5).map((bet) => (
                  <div 
                    key={bet.id} 
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium">{bet.game}</p>
                      <p className="text-sm text-muted-foreground">{bet.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${bet.amount}</p>
                      <p className={`text-sm ${
                        bet.result === 'Ganaste' ? 'text-primary' : 
                        bet.result === 'Perdiste' ? 'text-destructive' : 
                        'text-muted-foreground'
                      }`}>
                        {bet.result}
                      </p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className={`font-medium ${bet.profit > 0 ? 'text-primary' : bet.profit < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {bet.profit > 0 ? '+' : ''}{bet.profit !== 0 ? `$${bet.profit}` : '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Historial */}
          <TabsContent value="history">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-xl mb-4">Historial Completo de Apuestas</h3>
              <div className="space-y-3">
                {mockBetHistory.map((bet) => (
                  <div 
                    key={bet.id} 
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{bet.game}</p>
                      <p className="text-sm text-muted-foreground">{bet.date}</p>
                    </div>
                    <div className="text-right flex-1">
                      <p className="font-medium">Apostado: ${bet.amount}</p>
                      <p className={`text-sm ${
                        bet.result === 'Ganaste' ? 'text-primary' : 
                        bet.result === 'Perdiste' ? 'text-destructive' : 
                        'text-muted-foreground'
                      }`}>
                        {bet.result}
                      </p>
                    </div>
                    <div className="text-right flex-1">
                      <p className={`font-medium ${bet.profit > 0 ? 'text-primary' : bet.profit < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {bet.profit > 0 ? '+' : ''}{bet.profit !== 0 ? `$${bet.profit}` : 'Pendiente'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Configuración */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-xl">Información Personal</h3>
                </div>
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "default" : "outline"}
                  className={isEditing ? "bg-primary text-primary-foreground" : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"}
                >
                  {isEditing ? 'Guardar' : 'Editar'}
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input 
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled={!isEditing}
                    className="bg-input-background border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="bg-input-background border-border"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input 
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                    placeholder="+58 xxx-xxx-xxxx"
                    className="bg-input-background border-border"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-xl">Seguridad</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium">Autenticación de Dos Factores</p>
                    <p className="text-sm text-muted-foreground">Protege tu cuenta con 2FA</p>
                  </div>
                  <Button 
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {profileData.twoFactor ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium">Cambiar Contraseña</p>
                    <p className="text-sm text-muted-foreground">Actualiza tu contraseña</p>
                  </div>
                  <Button 
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Cambiar
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="text-xl">Notificaciones</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <div>
                    <p className="font-medium">Notificaciones de Email</p>
                    <p className="text-sm text-muted-foreground">Recibe actualizaciones por correo</p>
                  </div>
                  <Button 
                    variant={profileData.notifications ? "default" : "outline"}
                    className={profileData.notifications ? "bg-primary text-primary-foreground" : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"}
                    onClick={() => setProfileData({...profileData, notifications: !profileData.notifications})}
                  >
                    {profileData.notifications ? 'Activado' : 'Desactivado'}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
