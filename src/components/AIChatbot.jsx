import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [generatedReports, setGeneratedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sample welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: 'Hello! I\'m your financial assistant. I can help answer questions about your accounts, transactions, or generate custom financial reports. How can I assist you today?',
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      handleAIResponse(currentMessage);
      setIsTyping(false);
    }, 1000);
  };

  const handleAIResponse = (query) => {
    // Basic response logic - in a real app, this would connect to an actual AI API
    let response = '';
    
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('report') || lowerQuery.includes('generate')) {
      response = "I'll generate that report for you. What specific financial information would you like to include?";
      
      // If it seems like a complete report request, generate a mock report
      if (lowerQuery.includes('expense') || lowerQuery.includes('income') || lowerQuery.includes('investment')) {
        generateMockReport(query);
      }
    } else if (lowerQuery.includes('account') || lowerQuery.includes('balance')) {
      response = "Your total account balance across all accounts is $156,732.45. Your checking account has $12,458.90, and your savings account has $34,273.55. Your investment accounts total $110,000.";
    } else if (lowerQuery.includes('transaction') || lowerQuery.includes('payment')) {
      response = "Your most recent transactions include a $34.99 payment to Netflix on June 15th, a $125.30 grocery purchase on June 14th, and a $1,500 rent payment on June 1st.";
    } else if (lowerQuery.includes('credit') || lowerQuery.includes('score')) {
      response = "Your current credit score is 745, which is considered 'Very Good'. It has increased by 15 points in the last 3 months.";
    } else {
      response = "I'm here to help with your financial questions. You can ask about your accounts, transactions, credit score, or request a custom financial report.";
    }
    
    // Add AI response to messages
    const aiMessage = {
      id: Date.now().toString(),
      content: response,
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const generateMockReport = (query) => {
    // Create a mock report based on the query
    const newReport = {
      id: Date.now().toString(),
      title: `Report: ${query.slice(0, 30)}${query.length > 30 ? '...' : ''}`,
      content: `
## Financial Report

### Summary
This report provides an analysis of your financial data based on your request: "${query}".

### Account Balances
- Total Assets: $156,732.45
- Checking: $12,458.90
- Savings: $34,273.55
- Investments: $110,000.00

### Recent Performance
Your investments have grown by 8.2% in the past quarter, outperforming the market average of 6.5%.

### Recommendations
Based on your spending patterns and financial goals, consider increasing your monthly contributions to your retirement account by $200.

### Next Steps
Schedule a review with a financial advisor to optimize your investment portfolio for long-term growth.
      `,
      date: new Date(),
    };
    
    setGeneratedReports(prev => [...prev, newReport]);
    
    // Notify the user
    toast({
      title: "Report Generated",
      description: "Your custom financial report is ready to view",
      duration: 3000,
    });
    
    // Add a specific message about the report
    setTimeout(() => {
      const reportMessage = {
        id: Date.now().toString(),
        content: `I've generated a custom financial report based on your request. You can view it in the Reports section.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, reportMessage]);
    }, 1000);
  };

  const viewReport = (report) => {
    setSelectedReport(report);
    setIsReportDialogOpen(true);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg hover:shadow-xl bg-primary text-white flex items-center justify-center"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[350px] sm:w-[450px] p-0 flex flex-col" side="right">
          <SheetHeader className="bg-primary p-4 text-white rounded-t-lg">
            <SheetTitle className="flex items-center">
              <Bot className="mr-2 h-5 w-5" />
              Financial Assistant
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.sender === 'user' 
                      ? "bg-primary text-white self-end" 
                      : "bg-secondary text-secondary-foreground self-start"
                  )}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
              {isTyping && (
                <div className="bg-secondary text-secondary-foreground self-start max-w-[80%] rounded-lg p-3">
                  <div className="flex space-x-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce delay-75">•</span>
                    <span className="animate-bounce delay-150">•</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="p-4 border-t">
            {generatedReports.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="mb-2 w-full flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> 
                    View Generated Reports ({generatedReports.length})
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Generated Reports</h4>
                    {generatedReports.map(report => (
                      <div 
                        key={report.id} 
                        className="p-2 border rounded-md cursor-pointer hover:bg-muted"
                        onClick={() => viewReport(report)}
                      >
                        <p className="font-medium text-sm">{report.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {report.date.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask about your finances..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Textarea 
              readOnly 
              value={selectedReport?.content || ''} 
              className="min-h-[300px] font-mono"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIChatbot; 