import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Check } from "lucide-react"
import { X } from "lucide-react"

interface SymptomFrequency {
  symptom: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Rarely' | '';
}

interface MedicationFrequency {
  medication: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'As needed' | '';
}

interface OnboardingData {
  name: string;
  dateOfBirth: string;
  diagnosisDate: string;
  geneticMutation?: string;
  symptoms: SymptomFrequency[];
  medications: MedicationFrequency[];
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

const geneticMutations = [
  "DES",
  "DSC2",
  "DSG2",
  "DSP",
  "JUP",
  "PKP2",
  "TMEM43",
  "PLN",
  "I don't know",
  "No known mutation"
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
      content: "Hi! I'm here to help set up your ACM care profile. This will help us personalize your experience. What's your name?"
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNext = () => {
    // Add the user's answer to messages
    if (currentMessage || step === 8 || step === 9) {
      setMessages(prev => [...prev, {
        type: 'answer',
        content: step === 8 
          ? formatSelectedSymptoms(data.symptoms)
          : step === 9
          ? formatSelectedMedications(data.medications)
          : currentMessage
      }]);
    }

    // Store the data based on current step
    if (currentMessage || step === 8 || step === 9) {
      switch (step) {
        case 1:
          setData(prev => ({ ...prev, name: currentMessage }));
          break;
        case 2:
          setData(prev => ({ ...prev, dateOfBirth: currentMessage }));
          break;
        case 3:
          setData(prev => ({ ...prev, diagnosisDate: currentMessage }));
          break;
        case 4:
          setData(prev => ({ ...prev, hadCardiacArrest: currentMessage.toLowerCase() === 'yes' }));
          break;
        case 5:
          setData(prev => ({ ...prev, diagnosisTimeframe: currentMessage }));
          break;
        case 6:
          setData(prev => ({ ...prev, hadHighIntensitySports: currentMessage.toLowerCase() === 'yes' }));
          break;
        case 7:
          setData(prev => ({ ...prev, geneticMutation: currentMessage }));
          break;
        case 8:
          // Symptoms are handled by the checkbox grid
          break;
        case 9:
          // Medications are handled by the UI
          break;
        case 10:
          setData(prev => ({ ...prev, exerciseRestrictions: currentMessage }));
          break;
        case 11:
          setData(prev => ({ ...prev, hasICD: currentMessage.toLowerCase() === 'yes' }));
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
        return "What's your birthday?";
      case 3:
        return "When did you first notice symptoms?";
      case 4:
        return "Did you suffer a sudden cardiac death?";
      case 5:
        return "How long did it take from first symptoms to diagnosis?";
      case 6:
        return "Where you doing high intensity sports before you were diagnosed?";
      case 7:
        return "Do you know which genetic mutation you have? (It's okay if you don't)";
      case 8:
        return "Which of these symptoms do you experience? How often?";
      case 9:
        return "What medications are you currently taking?";
      case 10:
          return "Do you have any exercise restrictions from your doctor?";
      case 11:
        return "Do you have an ICD (Implantable Cardioverter Defibrillator)?";
      case 12:
        return "Thank you! Your profile is set up.";
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

  const formatSelectedSymptoms = (symptoms: SymptomFrequency[]) => {
    if (symptoms.length === 0) return "No symptoms selected";
    
    const formattedSymptoms = symptoms.map(s => 
      `${s.symptom} (${s.frequency})`
    ).join(", ");
    
    return `Selected symptoms: ${formattedSymptoms}`;
  };

  const formatSelectedMedications = (medications: MedicationFrequency[]) => {
    if (medications.length === 0) return "No medications selected";
    
    const formattedMedications = medications.map(m => 
      `${m.medication} (${m.frequency})`
    ).join(", ");
    
    return `Selected medications: ${formattedMedications}`;
  };

  return (
    <Dialog open={true}>
      <DialogContent className="h-screen w-screen max-w-none m-0 rounded-none flex flex-col [&>button]:hidden bg-white">
        {/* Message history - scrollable */}
        <div className="h-[60%] overflow-y-auto px-4 py-2 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'answer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  message.type === 'answer'
                    ? 'bg-[#3a2a76]/10 text-[#3a2a76]'
                    : 'bg-white shadow-sm text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input and controls - fixed */}
        <div className="max-h-[40%] border-t bg-white p-6">
          <div className="space-y-6">
            {step === 2 && (
              <Input
                type="date"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="w-full px-4 py-3 h-12 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#3a2a76]/50 focus:border-[#3a2a76]"
              />
            )}

            {(step === 4 || step === 6 || step === 11) && (
              <div className="flex justify-center gap-4">
                <Button
                  variant={currentMessage.toLowerCase() === 'yes' ? 'default' : 'outline'}
                  onClick={() => setCurrentMessage('Yes')}
                  className={`flex-1 h-12 text-base font-medium rounded-xl ${
                    currentMessage.toLowerCase() === 'yes'
                      ? 'bg-[#3a2a76] hover:bg-[#a680db] text-white'
                      : 'border-2 hover:bg-[#3a2a76]/10'
                  }`}
                >
                  Yes
                </Button>
                <Button
                  variant={currentMessage.toLowerCase() === 'no' ? 'default' : 'outline'}
                  onClick={() => setCurrentMessage('No')}
                  className={`flex-1 h-12 text-base font-medium rounded-xl ${
                    currentMessage.toLowerCase() === 'no'
                      ? 'bg-[#3a2a76] hover:bg-[#a680db] text-white'
                      : 'border-2 hover:bg-[#3a2a76]/10'
                  }`}
                >
                  No
                </Button>
              </div>
            )}

            {step === 8 && (
              <>
        
                <div className="flex justify-start w-full">
                  <div className="rounded-2xl w-full bg-white shadow-sm">
                    <div className="max-h-[300px] overflow-y-auto p-3 pb-20">
                      <div className="space-y-2">
                        {[...commonSymptoms, ...data.symptoms.filter(s => !commonSymptoms.includes(s.symptom)).map(s => s.symptom)].map(symptom => {
                          const symptomData = data.symptoms.find(s => s.symptom === symptom);
                          const isSelected = !!symptomData;

                          return (
                            <div
                              key={symptom}
                              className={`relative rounded-xl p-3 transition-all ${
                                isSelected
                                  ? 'bg-[#3a2a76]/10 border border-[#3a2a76]'
                                  : 'bg-white/80 border border-transparent hover:border-[#3a2a76]/30 hover:bg-white'
                              }`}
                            >
                              <div className="flex flex-col gap-2">
                                <div 
                                  className={`text-sm font-medium cursor-pointer ${
                                    isSelected ? 'text-[#3a2a76]' : 'text-gray-600'
                                  }`}
                                  onClick={() => {
                                    if (isSelected) {
                                      setData(prev => ({
                                        ...prev,
                                        symptoms: prev.symptoms.filter(s => s.symptom !== symptom)
                                      }));
                                    } else {
                                      setData(prev => ({
                                        ...prev,
                                        symptoms: [...prev.symptoms, { symptom, frequency: '' }]
                                      }));
                                    }
                                  }}
                                >
                                  {symptom}
                                </div>
                                
                                {isSelected && (
                                  <div className="flex items-center gap-2 w-full">
                                    <Select
                                      value={symptomData?.frequency || ''}
                                      onValueChange={(value: '' | 'Daily' | 'Weekly' | 'Monthly' | 'Rarely') => {
                                        if (value === '') {
                                          setData(prev => ({
                                            ...prev,
                                            symptoms: prev.symptoms.filter(s => s.symptom !== symptom)
                                          }));
                                        } else {
                                          setData(prev => ({
                                            ...prev,
                                            symptoms: prev.symptoms.map(s => 
                                              s.symptom === symptom 
                                                ? { ...s, frequency: value }
                                                : s
                                            )
                                          }));
                                        }
                                      }}
                                    >
                                      <SelectTrigger className="h-9 flex-1 text-sm">
                                        <SelectValue placeholder="How often?" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Daily">Daily</SelectItem>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="Rarely">Rarely</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        
                        <div className="relative rounded-xl p-3 border border-transparent">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add other symptom..."
                              value={currentMessage}
                              onChange={(e) => setCurrentMessage(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && currentMessage.trim() && !data.symptoms.some(s => s.symptom.toLowerCase() === currentMessage.toLowerCase().trim())) {
                                  setData(prev => ({
                                    ...prev,
                                    symptoms: [...prev.symptoms, { symptom: currentMessage.trim(), frequency: '' as const }]
                                  }));
                                  setCurrentMessage('');
                                }
                              }}
                              className="flex-1 px-4 py-3 h-9 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#3a2a76]/50 focus:border-[#3a2a76]"
                            />
                            <Button
                              onClick={() => {
                                console.log('Add button clicked');
                                console.log('Current message:', currentMessage);
                                console.log('Current symptoms:', data.symptoms);
                                
                                if (currentMessage.trim() && !data.symptoms.some(s => s.symptom.toLowerCase() === currentMessage.toLowerCase().trim())) {
                                  const newSymptom = { symptom: currentMessage.trim(), frequency: '' as const };
                                  console.log('Adding new symptom:', newSymptom);
                                  
                                  setData(prev => {
                                    const newData = {
                                      ...prev,
                                      symptoms: [...prev.symptoms, newSymptom]
                                    };
                                    console.log('New data:', newData);
                                    return newData;
                                  });
                                  setCurrentMessage('');
                                }
                              }}
                              className="h-9 px-3 bg-[#3a2a76] hover:bg-[#a680db] text-white"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 9 && (
              <>
              

                <div className="flex justify-start w-full">
                  <div className="rounded-2xl w-full bg-white shadow-sm">
                    <div className="max-h-[300px] overflow-y-auto p-3 pb-20">
                      <div className="space-y-2">
                        {[...commonMedications, ...data.medications.filter(m => !commonMedications.includes(m.medication)).map(m => m.medication)].map(medication => {
                          const medicationData = data.medications.find(m => m.medication === medication);
                          const isSelected = !!medicationData;

                          return (
                            <div
                              key={medication}
                              className={`relative rounded-xl p-3 transition-all ${
                                isSelected
                                  ? 'bg-[#3a2a76]/10 border border-[#3a2a76]'
                                  : 'bg-white/80 border border-transparent hover:border-[#3a2a76]/30 hover:bg-white'
                              }`}
                            >
                              <div className="flex flex-col gap-2">
                                <div 
                                  className={`text-sm font-medium cursor-pointer ${
                                    isSelected ? 'text-[#3a2a76]' : 'text-gray-600'
                                  }`}
                                  onClick={() => {
                                    if (isSelected) {
                                      setData(prev => ({
                                        ...prev,
                                        medications: prev.medications.filter(m => m.medication !== medication)
                                      }));
                                    } else {
                                      setData(prev => ({
                                        ...prev,
                                        medications: [...prev.medications, { medication, frequency: '' }]
                                      }));
                                    }
                                  }}
                                >
                                  {medication}
                                </div>
                                
                                {isSelected && (
                                  <div className="flex items-center gap-2 w-full">
                                    <Select
                                      value={medicationData?.frequency || ''}
                                      onValueChange={(value: '' | 'Daily' | 'Weekly' | 'Monthly' | 'As needed') => {
                                        if (value === '') {
                                          setData(prev => ({
                                            ...prev,
                                            medications: prev.medications.filter(m => m.medication !== medication)
                                          }));
                                        } else {
                                          setData(prev => ({
                                            ...prev,
                                            medications: prev.medications.map(m => 
                                              m.medication === medication 
                                                ? { ...m, frequency: value }
                                                : m
                                            )
                                          }));
                                        }
                                      }}
                                    >
                                      <SelectTrigger className="h-9 flex-1 text-sm">
                                        <SelectValue placeholder="How often?" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Daily">Daily</SelectItem>
                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                        <SelectItem value="As needed">As needed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        <div className="relative rounded-xl p-3 border border-transparent">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add other medication..."
                              value={currentMessage}
                              onChange={(e) => setCurrentMessage(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && currentMessage.trim() && !data.medications.some(m => m.medication.toLowerCase() === currentMessage.toLowerCase().trim())) {
                                  setData(prev => ({
                                    ...prev,
                                    medications: [...prev.medications, { medication: currentMessage.trim(), frequency: '' as const }]
                                  }));
                                  setCurrentMessage('');
                                }
                              }}
                              className="flex-1 px-4 py-3 h-9 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#3a2a76]/50 focus:border-[#3a2a76]"
                            />
                            <Button
                              onClick={() => {
                                if (currentMessage.trim() && !data.medications.some(m => m.medication.toLowerCase() === currentMessage.toLowerCase().trim())) {
                                  setData(prev => ({
                                    ...prev,
                                    medications: [...prev.medications, { medication: currentMessage.trim(), frequency: '' as const }]
                                  }));
                                  setCurrentMessage('');
                                }
                              }}
                              className="h-9 px-3 bg-[#3a2a76] hover:bg-[#a680db] text-white"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 7 && (
              <>
               
                
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-2 max-w-[80%] bg-white shadow-sm w-full">
                    <Select
                      value={currentMessage}
                      onValueChange={(value) => setCurrentMessage(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your mutation" />
                      </SelectTrigger>
                      <SelectContent>
                        {geneticMutations.map(mutation => (
                          <SelectItem 
                            key={mutation} 
                            value={mutation}
                            className="cursor-pointer"
                          >
                            {mutation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {(step === 1 || step === 3 || step === 5 || step === 10) && (
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 h-12 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#3a2a76]/50 focus:border-[#3a2a76]"
              />
            )}
          </div>
        </div>
        <div className="sticky bottom-0 pt-4 bg-white border-t">
            <Button
              onClick={step === 12 ? handleComplete : handleNext}
              className="w-full h-12 bg-[#3a2a76] hover:bg-[#a680db] text-white font-medium rounded-xl"
            >
              {step === 12 ? 'Complete Setup' : 'Continue'}
            </Button>

            <div className="flex justify-between items-center px-2 mt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((s) => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${
                      s === step
                        ? 'bg-[#3a2a76] scale-125'
                        : s < step
                        ? 'bg-[#3a2a76]/50'
                        : 'bg-gray-200'
                    }`}
                  />
                  <span className={`text-xs ${
                    s === step ? 'text-[#3a2a76] font-medium' : 'text-gray-400'
                  }`}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
} 