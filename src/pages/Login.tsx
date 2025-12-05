import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LogisticsAnimation from '@/components/auth/LogisticsAnimation';

// Mock users database
const MOCK_USERS = [
  { email: 'admin@supplier.com', password: 'admin123', name: 'Admin User', role: 'Administrator' },
  { email: 'manager@supplier.com', password: 'manager123', name: 'Supply Manager', role: 'Manager' },
  { email: 'user@supplier.com', password: 'user123', name: 'Regular User', role: 'User' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        toast({
          title: 'Login Successful!',
          description: `Welcome back, ${user.name}`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 1000);
  };



  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Three.js Animation Background */}
      <div className="absolute inset-0">
        <LogisticsAnimation />
      </div>
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
      
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 right-0 z-20 border-b border-white/10 bg-slate-900/30 backdrop-blur-md"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">VendorVerse</h1>
              <p className="text-primary text-xs tracking-wider">Supply Chain Intelligence</p>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Login Card - Centered */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="border-2">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@supplier.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>

                {/* <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
                  </div>
                </div> */}

                {/* <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Quick Login:</p>
                  {MOCK_USERS.map((user, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setEmail(user.email);
                        setPassword(user.password);
                      }}
                      className="w-full text-left p-2 rounded hover:bg-background transition-colors text-sm"
                    >
                      <div className="font-medium">{user.role}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </button>
                  ))}
                </div> */}

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
