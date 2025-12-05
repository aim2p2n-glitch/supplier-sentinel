import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  ShieldAlert,
  Zap,
  Target,
  BookOpen,
  DollarSign,
  MessageSquare,
  Calendar,
  BarChart3,
  Send,
  Clock,
  CheckCheck,
  XCircle,
  Loader2
} from 'lucide-react';
import { suppliers, alerts } from '@/data/mockData';

interface Intervention {
  id: string;
  type: 'automated' | 'manual' | 'ai_suggested';
  category: 'risk_mitigation' | 'performance_boost' | 'cost_optimization' | 'relationship_building';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  targetSuppliers: string[];
  actions: Action[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  impact: {
    risk_reduction: number;
    cost_savings: number;
    performance_improvement: number;
  };
  createdAt: Date;
  estimatedDuration: string;
}

interface Action {
  id: string;
  name: string;
  type: 'email' | 'meeting' | 'audit' | 'contract_review' | 'payment_terms' | 'training';
  status: 'pending' | 'executing' | 'completed' | 'failed';
  automated: boolean;
}

const generateInterventions = (): Intervention[] => {
  const interventions: Intervention[] = [];
  
  // Critical Risk Mitigation
  const highRiskSuppliers = suppliers.filter(s => s.risk_level === 'High');
  if (highRiskSuppliers.length > 0) {
    interventions.push({
      id: 'int-001',
      type: 'ai_suggested',
      category: 'risk_mitigation',
      priority: 'critical',
      title: 'Emergency Risk Mitigation Protocol',
      description: `${highRiskSuppliers.length} suppliers showing critical risk levels. Immediate intervention required to prevent supply chain disruption.`,
      targetSuppliers: highRiskSuppliers.map(s => s.name),
      actions: [
        { id: 'a1', name: 'Send Risk Assessment Questionnaire', type: 'email', status: 'pending', automated: true },
        { id: 'a2', name: 'Schedule Emergency Review Meeting', type: 'meeting', status: 'pending', automated: true },
        { id: 'a3', name: 'Initiate Compliance Audit', type: 'audit', status: 'pending', automated: false },
        { id: 'a4', name: 'Review & Adjust Payment Terms', type: 'payment_terms', status: 'pending', automated: false },
      ],
      status: 'pending',
      impact: {
        risk_reduction: 65,
        cost_savings: 0,
        performance_improvement: 0,
      },
      createdAt: new Date(),
      estimatedDuration: '7-14 days',
    });
  }

  // Performance Optimization
  const lowPerformers = suppliers.filter(s => s.overall_score < 75);
  if (lowPerformers.length > 0) {
    interventions.push({
      id: 'int-002',
      type: 'automated',
      category: 'performance_boost',
      priority: 'high',
      title: 'Performance Enhancement Program',
      description: `${lowPerformers.length} suppliers below performance threshold. Launch improvement initiative to boost operational efficiency.`,
      targetSuppliers: lowPerformers.slice(0, 5).map(s => s.name),
      actions: [
        { id: 'a5', name: 'Deploy Performance Metrics Dashboard', type: 'email', status: 'pending', automated: true },
        { id: 'a6', name: 'Schedule Training Session', type: 'training', status: 'pending', automated: true },
        { id: 'a7', name: 'Establish Weekly Check-ins', type: 'meeting', status: 'pending', automated: true },
        { id: 'a8', name: 'Create Improvement Action Plan', type: 'email', status: 'pending', automated: false },
      ],
      status: 'pending',
      impact: {
        risk_reduction: 30,
        cost_savings: 0,
        performance_improvement: 45,
      },
      createdAt: new Date(Date.now() - 86400000),
      estimatedDuration: '30-45 days',
    });
  }

  // Cost Optimization
  interventions.push({
    id: 'int-003',
    type: 'ai_suggested',
    category: 'cost_optimization',
    priority: 'medium',
    title: 'Strategic Cost Reduction Initiative',
    description: 'AI analysis identified $250K potential savings through contract renegotiation and volume consolidation.',
    targetSuppliers: suppliers.slice(0, 3).map(s => s.name),
    actions: [
      { id: 'a9', name: 'Analyze Spending Patterns', type: 'email', status: 'completed', automated: true },
      { id: 'a10', name: 'Identify Consolidation Opportunities', type: 'email', status: 'executing', automated: true },
      { id: 'a11', name: 'Negotiate Volume Discounts', type: 'contract_review', status: 'pending', automated: false },
      { id: 'a12', name: 'Review Payment Terms for Early Pay Discounts', type: 'payment_terms', status: 'pending', automated: false },
    ],
    status: 'in_progress',
    impact: {
      risk_reduction: 0,
      cost_savings: 250000,
      performance_improvement: 0,
    },
    createdAt: new Date(Date.now() - 172800000),
    estimatedDuration: '60-90 days',
  });

  // Relationship Building
  const topPerformers = suppliers.filter(s => s.overall_score >= 85).slice(0, 3);
  interventions.push({
    id: 'int-004',
    type: 'manual',
    category: 'relationship_building',
    priority: 'low',
    title: 'Strategic Partnership Development',
    description: `Strengthen relationships with top ${topPerformers.length} performers to create long-term strategic partnerships.`,
    targetSuppliers: topPerformers.map(s => s.name),
    actions: [
      { id: 'a13', name: 'Schedule Executive Business Review', type: 'meeting', status: 'pending', automated: false },
      { id: 'a14', name: 'Send Partnership Proposal', type: 'email', status: 'pending', automated: true },
      { id: 'a15', name: 'Offer Extended Payment Terms', type: 'payment_terms', status: 'pending', automated: false },
      { id: 'a16', name: 'Co-Innovation Workshop', type: 'training', status: 'pending', automated: false },
    ],
    status: 'pending',
    impact: {
      risk_reduction: 0,
      cost_savings: 0,
      performance_improvement: 25,
    },
    createdAt: new Date(Date.now() - 259200000),
    estimatedDuration: '90+ days',
  });

  // Alert Response
  const criticalAlerts = alerts.filter(a => a.severity === 'Critical' && a.status === 'New');
  if (criticalAlerts.length > 0) {
    interventions.push({
      id: 'int-005',
      type: 'automated',
      category: 'risk_mitigation',
      priority: 'critical',
      title: 'Critical Alert Response Protocol',
      description: `${criticalAlerts.length} critical alerts detected. Automated response system activated.`,
      targetSuppliers: criticalAlerts.slice(0, 3).map(a => a.supplier),
      actions: [
        { id: 'a17', name: 'Send Incident Notification', type: 'email', status: 'completed', automated: true },
        { id: 'a18', name: 'Escalate to Management', type: 'email', status: 'executing', automated: true },
        { id: 'a19', name: 'Schedule Root Cause Analysis', type: 'meeting', status: 'pending', automated: true },
        { id: 'a20', name: 'Implement Corrective Actions', type: 'audit', status: 'pending', automated: false },
      ],
      status: 'in_progress',
      impact: {
        risk_reduction: 80,
        cost_savings: 0,
        performance_improvement: 0,
      },
      createdAt: new Date(Date.now() - 3600000),
      estimatedDuration: '24-48 hours',
    });
  }

  return interventions;
};

export default function Interventions() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [executingActions, setExecutingActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    setInterventions(generateInterventions());
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'risk_mitigation':
        return <ShieldAlert className="w-5 h-5" />;
      case 'performance_boost':
        return <TrendingUp className="w-5 h-5" />;
      case 'cost_optimization':
        return <DollarSign className="w-5 h-5" />;
      case 'relationship_building':
        return <Users className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'risk_mitigation':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      case 'performance_boost':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'cost_optimization':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'relationship_building':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: any = {
      critical: 'destructive',
      high: 'outline',
      medium: 'secondary',
      low: 'default',
    };
    return variants[priority] || 'default';
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Send className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'audit':
        return <BarChart3 className="w-4 h-4" />;
      case 'contract_review':
        return <BookOpen className="w-4 h-4" />;
      case 'payment_terms':
        return <DollarSign className="w-4 h-4" />;
      case 'training':
        return <Users className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getActionStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCheck className="w-4 h-4 text-green-500" />;
      case 'executing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const executeAction = (interventionId: string, actionId: string) => {
    setExecutingActions(prev => new Set([...prev, actionId]));
    
    // Simulate action execution
    setTimeout(() => {
      setInterventions(prev => prev.map(int => {
        if (int.id === interventionId) {
          return {
            ...int,
            actions: int.actions.map(action => 
              action.id === actionId 
                ? { ...action, status: 'executing' as const }
                : action
            ),
          };
        }
        return int;
      }));

      // Complete action after 2 seconds
      setTimeout(() => {
        setInterventions(prev => prev.map(int => {
          if (int.id === interventionId) {
            const updatedActions = int.actions.map(action => 
              action.id === actionId 
                ? { ...action, status: 'completed' as const }
                : action
            );
            const allCompleted = updatedActions.every(a => a.status === 'completed');
            return {
              ...int,
              actions: updatedActions,
              status: allCompleted ? 'completed' as const : int.status,
            };
          }
          return int;
        }));
        setExecutingActions(prev => {
          const newSet = new Set(prev);
          newSet.delete(actionId);
          return newSet;
        });
      }, 2000);
    }, 500);
  };

  const executeAllActions = (interventionId: string) => {
    const intervention = interventions.find(i => i.id === interventionId);
    if (!intervention) return;

    const pendingActions = intervention.actions.filter(a => a.status === 'pending' && a.automated);
    pendingActions.forEach((action, index) => {
      setTimeout(() => {
        executeAction(interventionId, action.id);
      }, index * 1000);
    });
  };

  const stats = {
    total: interventions.length,
    critical: interventions.filter(i => i.priority === 'critical').length,
    inProgress: interventions.filter(i => i.status === 'in_progress').length,
    totalRiskReduction: interventions.reduce((sum, i) => sum + i.impact.risk_reduction, 0),
    totalSavings: interventions.reduce((sum, i) => sum + i.impact.cost_savings, 0),
    performanceGain: interventions.reduce((sum, i) => sum + i.impact.performance_improvement, 0),
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary" />
              Strategic Interventions
            </h2>
            <p className="text-muted-foreground mt-1">AI-powered automated actions and strategic initiatives</p>
          </div>
          <Button className="gap-2">
            <Target className="w-4 h-4" />
            Create Custom Intervention
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-red-500/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{stats.critical}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Risk ↓</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{stats.totalRiskReduction}%</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">${(stats.totalSavings / 1000).toFixed(0)}K</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="border-blue-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Performance ↑</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">+{stats.performanceGain}%</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Interventions List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Interventions</TabsTrigger>
            <TabsTrigger value="risk_mitigation">Risk Mitigation</TabsTrigger>
            <TabsTrigger value="performance_boost">Performance</TabsTrigger>
            <TabsTrigger value="cost_optimization">Cost Optimization</TabsTrigger>
            <TabsTrigger value="relationship_building">Relationships</TabsTrigger>
          </TabsList>

          {['all', 'risk_mitigation', 'performance_boost', 'cost_optimization', 'relationship_building'].map(tab => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {interventions
                .filter(int => tab === 'all' || int.category === tab)
                .map((intervention, idx) => (
                  <motion.div
                    key={intervention.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-all cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-lg border ${getCategoryColor(intervention.category)}`}>
                              {getCategoryIcon(intervention.category)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <CardTitle className="text-lg">{intervention.title}</CardTitle>
                                <Badge variant={getPriorityBadge(intervention.priority)}>
                                  {intervention.priority.toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className="gap-1">
                                  {intervention.type === 'ai_suggested' && <Zap className="w-3 h-3" />}
                                  {intervention.type === 'automated' && <CheckCircle className="w-3 h-3" />}
                                  {intervention.type}
                                </Badge>
                              </div>
                              <CardDescription className="text-sm">{intervention.description}</CardDescription>
                              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {intervention.targetSuppliers.length} suppliers
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {intervention.estimatedDuration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {intervention.createdAt.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            onClick={() => executeAllActions(intervention.id)}
                            disabled={intervention.status === 'completed' || intervention.actions.every(a => !a.automated || a.status !== 'pending')}
                            className="gap-2"
                          >
                            <Zap className="w-4 h-4" />
                            Execute All Automated
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Impact Metrics */}
                        <div className="grid grid-cols-3 gap-3 p-4 bg-muted/50 rounded-lg">
                          <div>
                            <p className="text-xs text-muted-foreground">Risk Reduction</p>
                            <p className="text-lg font-bold text-green-500">-{intervention.impact.risk_reduction}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Cost Savings</p>
                            <p className="text-lg font-bold text-green-500">
                              ${(intervention.impact.cost_savings / 1000).toFixed(0)}K
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Performance Gain</p>
                            <p className="text-lg font-bold text-blue-500">+{intervention.impact.performance_improvement}%</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Action Items ({intervention.actions.filter(a => a.status === 'completed').length}/{intervention.actions.length})</h4>
                          <div className="space-y-2">
                            {intervention.actions.map(action => (
                              <div
                                key={action.id}
                                className="flex items-center justify-between p-3 bg-background rounded-lg border hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {getActionStatusIcon(action.status)}
                                  <div className="flex items-center gap-2">
                                    {getActionIcon(action.type)}
                                    <span className="text-sm">{action.name}</span>
                                  </div>
                                  {action.automated && (
                                    <Badge variant="secondary" className="text-xs">
                                      Auto
                                    </Badge>
                                  )}
                                </div>
                                {action.automated && action.status === 'pending' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => executeAction(intervention.id, action.id)}
                                    disabled={executingActions.has(action.id)}
                                    className="gap-2"
                                  >
                                    {executingActions.has(action.id) ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Send className="w-3 h-3" />
                                    )}
                                    Execute
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Target Suppliers */}
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Target Suppliers</h4>
                          <div className="flex flex-wrap gap-2">
                            {intervention.targetSuppliers.map((supplier, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {supplier}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
}
