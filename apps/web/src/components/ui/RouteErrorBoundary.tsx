import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export const RouteErrorBoundary: React.FC = () => {
  const error: any = useRouteError();
  const navigate = useNavigate();

  console.error('Captured Route Error:', error);

  return (
    <div className="min-h-screen bg-warm-ivory flex items-center justify-center p-6 text-navy">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl border border-soft-grey shadow-2xl rounded-2xl p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-coral-soft text-coral-deep mx-auto flex items-center justify-center shadow-md">
          <AlertTriangle className="w-8 h-8 text-coral animate-bounce" />
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-navy">Clinical Workspace Refresh Needed</h2>
          <p className="text-xs text-slate mt-1.5 leading-relaxed">
            {error?.message || 'A transient application cache update occurred while syncing real-time clinical state.'}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => {
              navigate('/');
              window.location.reload();
            }}
          >
            <Home className="w-4 h-4 mr-1.5" />
            <span>Return to Gateway</span>
          </Button>
          <Button
            variant="primary"
            className="w-full sm:w-auto"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            <span>Reload Portal</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

