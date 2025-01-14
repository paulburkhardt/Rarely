import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Check } from "lucide-react"

interface OnboardingData {
  name: string;
  dateOfBirth: string;
  diagnosisDate: string;
  geneticMutation?: string;
  symptoms: string[];
  medications: string[];
  hasICD: boolean;
  icdImplantDate?: string;
  exerciseRestrictions: string;
  familyHistory: boolean;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

const commonSymptoms = [
  "Palpitations",
  "Fatigue",
  "Shortness of breath",
  "Chest pain",
  "Dizziness",
  "Fainting",
  "Exercise intolerance"
];

const commonMedications = [
  "Beta blockers",
  "ACE inhibitors",
  "Antiarrhythmic medications",
  "Blood thinners"
];

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    dateOfBirth: '',
    diagnosisDate: '',
    symptoms: [],
    medications: [],
    hasICD: false,
    exerciseRestrictions: '',
    familyHistory: false,
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<{type: 'question' | 'answer', content: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([{
      type: 'question',
      content: "Hi! I'm here to help set up your ACM care profile. This will help us personalize your experience. Shall we begin?"
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNext = () => {
    // Add the user's answer to messages
    if (currentMessage || step === 5) { // Allow empty message for symptom step
      setMessages(prev => [...prev, {
        type: 'answer',
        content: step === 5 
          ? `Selected symptoms: ${data.symptoms.join(', ')}`
          : currentMessage
      }]);
    }

    // Store the data based on current step
    if (currentMessage || step === 5) {
      switch (step) {
        case 2:
          setData(prev => ({ ...prev, name: currentMessage }));
          break;
        case 3:
          setData(prev => ({ ...prev, diagnosisDate: currentMessage }));
          break;
        case 4:
          setData(prev => ({ ...prev, geneticMutation: currentMessage }));
          break;
        case 6:
          setData(prev => ({ ...prev, hasICD: currentMessage.toLowerCase().includes('yes') }));
          break;
        case 7:
          setData(prev => ({ ...prev, medications: currentMessage.split(',').map(m => m.trim()) }));
          break;
        case 8:
          setData(prev => ({ ...prev, exerciseRestrictions: currentMessage }));
          break;
        case 9:
          // Parse emergency contact info
          const [name, relationship, phone] = currentMessage.split(',').map(s => s.trim());
          setData(prev => ({
            ...prev,
            emergencyContact: { name, relationship, phone }
          }));
          break;
      }
    }

    // Add the next question
    const nextQuestion = getNextQuestion(step + 1);
    setMessages(prev => [...prev, {
      type: 'question',
      content: nextQuestion
    }]);

    setStep(prev => prev + 1);
    setCurrentMessage('');
  };

  const getNextQuestion = (currentStep: number) => {
    switch (currentStep) {
      case 2:
        return "What's your name?";
      case 3:
        return "When were you diagnosed with ACM?";
      case 4:
        return "Do you know which genetic mutation you have? (It's okay if you don't)";
      case 5:
        return "Which symptoms do you experience? Select all that apply.";
      case 6:
        return "Do you have an ICD (Implantable Cardioverter Defibrillator)?";
      case 7:
        return "What medications are you currently taking?";
      case 8:
        return "Do you have any exercise restrictions from your doctor?";
      case 9:
        return "Let's add an emergency contact. Who should we contact in case of emergency?";
      case 10:
        return "Thank you! Your profile is set up. Would you like to review your information?";
      default:
        return "";
    }
  };

  const handleComplete = () => {
    // Save data to localStorage or your backend
    localStorage.setItem('onboardingComplete', 'true');
    localStorage.setItem('patientData', JSON.stringify(data));
    window.location.href = '/';
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col [&>button]:hidden">
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'answer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  message.type === 'answer'
                    ? 'bg-[#E6E3FD] text-[#473F63]'
                    : 'bg-[#DEEAE5] text-[#1E4D57]'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 space-y-4">
          {step === 5 && (
            <div className="grid grid-cols-2 gap-2">
              {commonSymptoms.map(symptom => (
                <div
                  key={symptom}
                  className={`relative rounded-xl p-3 cursor-pointer transition-all ${
                    data.symptoms.includes(symptom)
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-gray-50 border-2 border-transparent hover:border-primary/30'
                  }`}
                  onClick={() => {
                    setData(prev => ({
                      ...prev,
                      symptoms: prev.symptoms.includes(symptom)
                        ? prev.symptoms.filter(s => s !== symptom)
                        : [...prev.symptoms, symptom]
                    }));
                  }}
                >
                  {data.symptoms.includes(symptom) && (
                    <div className="absolute top-2 right-2">
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                  <span className="text-sm font-medium">{symptom}</span>
                </div>
              ))}
            </div>
          )}

          {step === 6 && (
            <div className="flex justify-center gap-4">
              <Button
                variant={currentMessage.toLowerCase() === 'yes' ? 'default' : 'outline'}
                onClick={() => setCurrentMessage('Yes')}
              >
                Yes
              </Button>
              <Button
                variant={currentMessage.toLowerCase() === 'no' ? 'default' : 'outline'}
                onClick={() => setCurrentMessage('No')}
              >
                No
              </Button>
            </div>
          )}

          {step !== 5 && step !== 6 && (
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your answer..."
              className="flex-1"
            />
          )}

          <Button
            onClick={step === 10 ? handleComplete : handleNext}
            className="w-full bg-[#473F63] text-white"
          >
            {step === 10 ? 'Complete Setup' : 'Continue'}
          </Button>

          {/* Progress indicator */}
          <div className="flex justify-between items-center px-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    s === step
                      ? 'bg-primary scale-125'
                      : s < step
                      ? 'bg-primary/50'
                      : 'bg-gray-200'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 