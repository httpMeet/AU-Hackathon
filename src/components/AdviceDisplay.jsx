import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

const AdviceDisplay = ({ advice }) => {
  if (!advice) return null;

  const getActionIcon = (action) => {
    switch (action.toLowerCase()) {
      case 'buy':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'sell':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getActionColor = (action) => {
    switch (action.toLowerCase()) {
      case 'buy':
        return 'bg-green-100 text-green-800';
      case 'sell':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Investment Analysis</h3>
        <p className="text-muted-foreground mb-6">{advice.summary}</p>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Recommendations</h4>
            <div className="space-y-3">
              {advice.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className={`p-2 rounded ${getActionColor(rec.action)}`}>
                    {getActionIcon(rec.action)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{rec.action.toUpperCase()}</span>
                      {rec.symbol && (
                        <Badge variant="outline">{rec.symbol}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{rec.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Risk Assessment</h4>
            <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
              {advice.risk_assessment}
            </p>
          </div>

          {advice.additional_notes && (
            <div>
              <h4 className="font-medium mb-2">Additional Notes</h4>
              <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                {advice.additional_notes}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdviceDisplay; 