import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic, MicOff, Image as ImageIcon, Paperclip, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { suppliers, alerts } from '@/data/mockData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string;
  file?: {
    name: string;
    content: string;
  };
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you with supplier data and analytics. Try asking me about supplier risks, performance metrics, or specific suppliers.',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; content: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // High risk suppliers
    if (lowerMessage.includes('high risk') || lowerMessage.includes('risky')) {
      const highRiskSuppliers = suppliers.filter(s => s.risk_level === 'High');
      if (highRiskSuppliers.length > 0) {
        return `I found ${highRiskSuppliers.length} high-risk suppliers: ${highRiskSuppliers.map(s => s.name).join(', ')}. These suppliers need immediate attention.`;
      }
      return 'Currently, there are no high-risk suppliers in the system.';
    }

    // Total suppliers
    if (lowerMessage.includes('how many suppliers') || lowerMessage.includes('total suppliers')) {
      return `There are ${suppliers.length} suppliers in the system. ${suppliers.filter(s => s.risk_level === 'Low').length} are low risk, ${suppliers.filter(s => s.risk_level === 'Medium').length} are medium risk, and ${suppliers.filter(s => s.risk_level === 'High').length} are high risk.`;
    }

    // Alerts
    if (lowerMessage.includes('alert') || lowerMessage.includes('issue')) {
      const newAlerts = alerts.filter(a => a.status === 'New');
      const criticalAlerts = alerts.filter(a => a.severity === 'Critical');
      return `There are ${newAlerts.length} new alerts and ${criticalAlerts.length} critical alerts requiring attention. The most recent alert is: "${alerts[0].message}"`;
    }

    // Best performers
    if (lowerMessage.includes('best') || lowerMessage.includes('top performer')) {
      const topSuppliers = suppliers
        .sort((a, b) => b.overall_score - a.overall_score)
        .slice(0, 3);
      return `Top 3 suppliers by performance: 1) ${topSuppliers[0].name} (${topSuppliers[0].overall_score}/100), 2) ${topSuppliers[1].name} (${topSuppliers[1].overall_score}/100), 3) ${topSuppliers[2].name} (${topSuppliers[2].overall_score}/100)`;
    }

    // Worst performers
    if (lowerMessage.includes('worst') || lowerMessage.includes('poor') || lowerMessage.includes('low performance')) {
      const worstSuppliers = suppliers
        .sort((a, b) => a.overall_score - b.overall_score)
        .slice(0, 3);
      return `Suppliers needing improvement: 1) ${worstSuppliers[0].name} (${worstSuppliers[0].overall_score}/100), 2) ${worstSuppliers[1].name} (${worstSuppliers[1].overall_score}/100), 3) ${worstSuppliers[2].name} (${worstSuppliers[2].overall_score}/100)`;
    }

    // Specific supplier lookup
    const supplierMatch = suppliers.find(s => 
      lowerMessage.includes(s.name.toLowerCase()) || 
      lowerMessage.includes(s.supplier_id.toLowerCase())
    );
    if (supplierMatch) {
      return `${supplierMatch.name} - Risk Level: ${supplierMatch.risk_level}, Overall Score: ${supplierMatch.overall_score}/100, On-Time Delivery: ${supplierMatch.otd_percentage}%, Defect Rate: ${supplierMatch.defect_rate}%, Region: ${supplierMatch.region}`;
    }

    // Region-based queries
    if (lowerMessage.includes('region') || lowerMessage.includes('asia') || lowerMessage.includes('europe') || lowerMessage.includes('north america')) {
      const regions = [...new Set(suppliers.map(s => s.region))];
      return `We have suppliers in ${regions.length} regions: ${regions.join(', ')}. Which region would you like to know more about?`;
    }

    // Delivery performance
    if (lowerMessage.includes('delivery') || lowerMessage.includes('otd') || lowerMessage.includes('on-time')) {
      const avgOTD = (suppliers.reduce((sum, s) => sum + s.otd_percentage, 0) / suppliers.length).toFixed(1);
      const poorDelivery = suppliers.filter(s => s.otd_percentage < 90);
      return `Average on-time delivery across all suppliers is ${avgOTD}%. ${poorDelivery.length} suppliers have OTD below 90% and need attention.`;
    }

    // Quality/defects
    if (lowerMessage.includes('quality') || lowerMessage.includes('defect')) {
      const avgDefect = (suppliers.reduce((sum, s) => sum + s.defect_rate, 0) / suppliers.length).toFixed(2);
      const highDefects = suppliers.filter(s => s.defect_rate > 3);
      return `Average defect rate is ${avgDefect}%. ${highDefects.length} suppliers have defect rates above 3% threshold.`;
    }

    // Default response
    return "I can help you with: supplier risk levels, performance metrics, alerts, delivery statistics, quality reports, and specific supplier information. What would you like to know?";
  };

  const handleSend = () => {
    if (!inputValue.trim() && !selectedImage && !selectedFile) return;

    let messageText = inputValue;
    
    // If file was uploaded, include its content in the message
    if (selectedFile) {
      messageText = `${inputValue ? inputValue + '\n\n' : ''}📄 File: ${selectedFile.name}\n\nContent:\n${selectedFile.content}`;
    } else if (!inputValue && selectedImage) {
      messageText = 'Sent an image';
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      image: selectedImage || undefined,
      file: selectedFile || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setSelectedImage(null);
    setSelectedFile(null);

    // Simulate bot response with slight delay
    setTimeout(() => {
      let responseText = generateResponse(messageText);
      
      // If image was sent, acknowledge it
      if (selectedImage) {
        responseText = "I can see you've shared an image. " + responseText;
      }
      
      // If file was sent, acknowledge it
      if (selectedFile) {
        responseText = `I've received and analyzed your file "${selectedFile.name}". ` + responseText;
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setInputValue('');
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDocumentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const content = reader.result as string;
        
        // Extract text based on file type
        let extractedText = '';
        
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
          extractedText = content;
        } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
          try {
            const jsonData = JSON.parse(content);
            extractedText = JSON.stringify(jsonData, null, 2);
          } catch {
            extractedText = content;
          }
        } else if (file.name.endsWith('.csv')) {
          extractedText = content;
        } else {
          extractedText = `File type: ${file.type}\nFile uploaded successfully. Text content may be limited for this file type.`;
        }
        
        setSelectedFile({
          name: file.name,
          content: extractedText.slice(0, 5000), // Limit to 5000 characters
        });
      };
      reader.readAsText(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Chat Icon Button - Bottom Right */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-shadow"
          size="icon"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </motion.div>

      {/* Chat Window - Small Modal Bottom Right */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-24 right-6 w-[90vw] md:w-[380px] h-[500px] bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
            {/* Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Supplier Assistant
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-primary/10 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-4 ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.image && (
                        <div className="mb-2">
                          <img 
                            src={message.image} 
                            alt="Uploaded" 
                            className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                          />
                        </div>
                      )}
                      {message.file && (
                        <div className="mb-2 p-3 bg-background/50 rounded border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4" />
                            <span className="font-medium text-xs">{message.file.name}</span>
                          </div>
                          <pre className="text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                            {message.file.content.slice(0, 300)}
                            {message.file.content.length > 300 && '...'}
                          </pre>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border bg-background">
              {/* Image Preview */}
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 relative inline-block"
                >
                  <img 
                    src={selectedImage} 
                    alt="Preview" 
                    className="rounded-lg max-h-32 object-cover border-2 border-primary"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              
              {/* File Preview */}
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 p-3 bg-muted rounded-lg border-2 border-primary relative"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedFile.content.length} characters
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
              
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <input
                  ref={documentInputRef}
                  type="file"
                  accept=".txt,.json,.csv,.md,text/plain,application/json"
                  onChange={handleDocumentSelect}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  size="icon" 
                  variant="outline"
                  className="h-10 w-10"
                  disabled={isRecording}
                  title="Upload image"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => documentInputRef.current?.click()} 
                  size="icon" 
                  variant="outline"
                  className="h-10 w-10"
                  disabled={isRecording}
                  title="Upload document"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isRecording ? "Listening..." : "Ask about suppliers..."}
                  className="flex-1 h-10"
                  disabled={isRecording}
                />
                <Button 
                  onClick={toggleRecording} 
                  size="icon" 
                  className={`h-10 w-10 ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : ''}`}
                  variant={isRecording ? "default" : "outline"}
                  title="Voice input"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button 
                  onClick={handleSend} 
                  size="icon" 
                  className="h-10 w-10" 
                  disabled={isRecording || (!inputValue.trim() && !selectedImage && !selectedFile)}
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {isRecording && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 mt-2 flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Recording... Speak now
                </motion.p>
              )}
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
