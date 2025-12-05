import { MainLayout } from '@/components/layout/MainLayout';
import { aiAgent } from '@/data/mockData';

const Agent = () => {
  return (
    <MainLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <header className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Agent</h1>
          <p className="text-muted-foreground">
            Learn about the AI-powered analytics engine powering VendorVerse.
          </p>
        </header>

        {/* Agent Overview */}
        <div className="card-base p-8 animate-slide-in">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-foreground">{aiAgent.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  v{aiAgent.version}
                </span>
              </div>
              <p className="text-muted-foreground text-lg mb-4">{aiAgent.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Active
                </span>
                <span>•</span>
                <span>Refresh: {aiAgent.data_refresh_interval}</span>
                <span>•</span>
                <span>Last Updated: {aiAgent.last_model_update}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-base p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Capabilities
            </h3>
            <ul className="space-y-3">
              {aiAgent.capabilities.map((capability, index) => (
                <li 
                  key={index} 
                  className="flex items-center gap-3 text-muted-foreground animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {capability}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-base p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              AI Models
            </h3>
            <div className="space-y-4">
              {aiAgent.models_used.map((model, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-lg bg-muted animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{model.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                      {model.accuracy}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{model.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="card-base p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How It Works
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: 'Data Ingestion',
                description: 'Continuously collects data from purchase orders, quality reports, delivery logs, and contracts.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                ),
              },
              {
                step: 2,
                title: 'Analysis',
                description: 'AI models analyze patterns, detect anomalies, and calculate performance metrics.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                step: 3,
                title: 'Risk Detection',
                description: 'Predictive models identify at-risk suppliers and potential issues before they escalate.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ),
              },
              {
                step: 4,
                title: 'Insights Generation',
                description: 'Natural language summaries and actionable recommendations are generated for users.',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div 
                key={item.step} 
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-1/2">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                  </div>
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {item.icon}
                  </div>
                  <span className="text-xs text-primary font-medium mb-1">Step {item.step}</span>
                  <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="card-base p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gradient">15M+</p>
              <p className="text-sm text-muted-foreground">Data Points Processed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gradient">99.7%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gradient">&lt;2s</p>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gradient">250+</p>
              <p className="text-sm text-muted-foreground">Alerts Generated/Day</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Agent;
