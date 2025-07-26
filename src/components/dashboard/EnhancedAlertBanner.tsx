import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, CheckCircle, Info } from 'lucide-react';
import { useKycStatus } from '@/hooks/useKycStatus';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

const AlertIcon: React.FC<{ type: Alert['type'] }> = ({ type }) => {
  const iconProps = { className: "w-5 h-5" };
  
  switch (type) {
    case 'warning':
      return <AlertTriangle {...iconProps} className="w-5 h-5 text-orange-400" />;
    case 'error':
      return <AlertTriangle {...iconProps} className="w-5 h-5 text-red-400" />;
    case 'success':
      return <CheckCircle {...iconProps} className="w-5 h-5 text-green-400" />;
    case 'info':
    default:
      return <Info {...iconProps} className="w-5 h-5 text-blue-400" />;
  }
};

const AlertBanner: React.FC<{ alert: Alert; onDismiss: (id: string) => void }> = ({ alert, onDismiss }) => {
  const getBgColor = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-gradient-to-r from-orange-900/20 to-orange-800/20 border-orange-500/30';
      case 'error':
        return 'bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-500/30';
      case 'success':
        return 'bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-500/30';
      case 'info':
      default:
        return 'bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-blue-500/30';
    }
  };

  return (
    <div className={`rounded-lg border p-4 mb-4 ${getBgColor(alert.type)}`}>
      <div className="flex items-start space-x-3">
        <AlertIcon type={alert.type} />
        <div className="flex-1 space-y-1">
          <h4 className="text-sm font-semibold text-foreground">{alert.title}</h4>
          <p className="text-sm text-muted-foreground">{alert.message}</p>
        </div>
        <div className="flex items-center space-x-2">
          {alert.action && (
            <Button
              size="sm"
              variant="outline"
              onClick={alert.action.onClick}
              className="text-xs"
            >
              {alert.action.label}
            </Button>
          )}
          {alert.dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(alert.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const EnhancedAlertBanner: React.FC = () => {
  const { kycStatus } = useKycStatus();
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Generate alerts based on various conditions
  const getAlerts = (): Alert[] => {
    const alerts: Alert[] = [];

    // KYC Alert
    if (kycStatus !== 'verified') {
      alerts.push({
        id: 'kyc-verification',
        type: 'warning',
        title: 'Complete KYC Verification',
        message: 'Complete KYC verification to unlock full trading features and higher limits.',
        action: {
          label: 'Verify Now',
          onClick: () => {
            // Navigate to KYC verification
            window.location.href = '/kyc';
          }
        },
        dismissible: false
      });
    }

    // Demo account alert (example)
    alerts.push({
      id: 'demo-account',
      type: 'info',
      title: 'Demo Account Active',
      message: 'You are currently using a demo account with virtual funds. Switch to live trading when ready.',
      action: {
        label: 'Go Live',
        onClick: () => {
          // Handle live account switch
          console.log('Switch to live account');
        }
      },
      dismissible: true
    });

    // Market hours alert (example)
    const currentHour = new Date().getUTCHours();
    const isWeekend = [0, 6].includes(new Date().getUTCDay());
    
    if (isWeekend || currentHour < 8 || currentHour > 22) {
      alerts.push({
        id: 'market-hours',
        type: 'info',
        title: 'Market Hours',
        message: 'Some markets are currently closed. Trading may be limited for certain instruments.',
        dismissible: true
      });
    }

    // Filter out dismissed alerts
    return alerts.filter(alert => !dismissedAlerts.has(alert.id));
  };

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertId));
  };

  const alerts = getAlerts();

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {alerts.map(alert => (
        <AlertBanner
          key={alert.id}
          alert={alert}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
};

export default EnhancedAlertBanner;