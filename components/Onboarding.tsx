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
  doctorLetter: string | null;
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
    },
    doctorLetter: null,
  });

  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<{type: 'question' | 'answer', content: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    setMessages([{
      type: 'question',
      content: "Please upload your doctor's letter confirming your ACM diagnosis. This helps us verify your condition."
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNext = () => {
    // Add the user's answer to messages
    if (currentMessage || step === 9 || step === 10) {
      setMessages(prev => [...prev, {
        type: 'answer',
        content: step === 9 
          ? formatSelectedSymptoms(data.symptoms)
          : step === 10
          ? formatSelectedMedications(data.medications)
          : step === 1
          ? `Uploaded: ${currentMessage}`
          : currentMessage
      }]);
    }

    // Store the data based on current step
    if (currentMessage || step === 9 || step === 10) {
      switch (step) {
        case 1:
          setData(prev => ({ ...prev, doctorLetter: currentMessage }));
          break;
        case 2:
          setData(prev => ({ ...prev, name: currentMessage }));
          break;
        case 3:
          setData(prev => ({ ...prev, dateOfBirth: currentMessage }));
          break;
        case 4:
          setData(prev => ({ ...prev, diagnosisDate: currentMessage }));
          break;
        case 5:
          setData(prev => ({ ...prev, hadCardiacArrest: currentMessage.toLowerCase() === 'yes' }));
          break;
        case 6:
          setData(prev => ({ ...prev, diagnosisTimeframe: currentMessage }));
          break;
        case 7:
          setData(prev => ({ ...prev, hadHighIntensitySports: currentMessage.toLowerCase() === 'yes' }));
          break;
        case 8:
          setData(prev => ({ ...prev, geneticMutation: currentMessage }));
          break;
        case 9:
          setData(prev => ({ ...prev, symptoms: [...prev.symptoms, { symptom: currentMessage, frequency: '' }] }));
          break;
        case 10:
          setData(prev => ({ ...prev, medications: [...prev.medications, { medication: currentMessage, frequency: '' }] }));
          break;
        case 11:
          setData(prev => ({ ...prev, exerciseRestrictions: currentMessage }));
          break;
        case 12:
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
        return "Hi! I'm here to help set up your ACM care profile. This will help us personalize your experience. What's your name?";
      case 3:
        return "What's your birthday?";
      case 4:
        return "When did you first notice symptoms?";
      case 5:
        return "Did you suffer a sudden cardiac death?";
      case 6:
        return "How long did it take from first symptoms to diagnosis?";
      case 7:
        return "Were you doing high intensity sports before you were diagnosed?";
      case 8:
        return "Do you know which genetic mutation you have? (It's okay if you don't)";
      case 9:
        return "Which of these symptoms do you experience? How often?";
      case 10:
        return "What medications are you currently taking?";
      case 11:
        return "Do you have any exercise restrictions from your doctor?";
      case 12:
        return "Do you have an ICD (Implantable Cardioverter Defibrillator)?";
      case 13:
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
    <div className="min-h-screen ">
      <Dialog open={true}>
        <DialogContent className="h-screen w-screen max-w-none m-0 bg-gradient-to-b from-[#E3D7F4] via-[#f0e9fa] to-[#f8f8fa] rounded-none flex flex-col [&>button]:hidden bg-transparent">
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
                      : 'bg-white/50 backdrop-blur-sm text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input and controls - fixed */}
          <div className={`max-h-[40%] ${step !== 13 ? 'border-t border-[#3a2a76]/20' : ''} bg-transparent p-6`}>
            <div className="space-y-6">
              {step === 3 && (
                <Input
                  type="date"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="w-full px-4 py-3 h-12 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#3a2a76]/50"
                />
              )}

              {(step === 5 || step === 7 || step === 12) && (
                <div className="flex justify-center gap-4">
                  <Button
                    variant={currentMessage.toLowerCase() === 'yes' ? 'default' : 'outline'}
                    onClick={() => setCurrentMessage('Yes')}
                    className={`flex-1 h-12 text-base font-medium rounded-xl ${
                      currentMessage.toLowerCase() === 'yes'
                        ? 'bg-[#3a2a76] hover:bg-[#a680db] text-white'
                        : 'bg-white hover:bg-[#3a2a76]/10 text-[#3a2a76]'
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
                        : 'bg-white hover:bg-[#3a2a76]/10 text-[#3a2a76]'
                    }`}
                  >
                    No
                  </Button>
                </div>
              )}

              {step === 8 && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-2 max-w-[80%] bg-white backdrop-blur-[2px] w-full">
                    <Select
                      value={currentMessage}
                      onValueChange={(value) => setCurrentMessage(value)}
                    >
                      <SelectTrigger className="w-full border-0 bg-white focus:ring-0">
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
              )}

              {(step === 2 || step === 4 || step === 6 || step === 11) && (
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 h-12 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#3a2a76]/50"
                />
              )}

              {(step === 9 || step === 10) && (
                <div className="flex justify-start w-full">
                  <div className="rounded-2xl w-full bg-transparent">
                    <div className="max-h-[25vh] overflow-y-auto">
                      <div className="space-y-2">
                        {[...(step === 9 ? commonSymptoms : commonMedications), 
                          ...(step === 9 
                            ? data.symptoms.filter(s => !commonSymptoms.includes(s.symptom)).map(s => s.symptom)
                            : data.medications.filter(m => !commonMedications.includes(m.medication)).map(m => m.medication)
                          )].map(item => {
                          const isSymptom = step === 9;
                          const itemData = isSymptom 
                            ? data.symptoms.find(s => s.symptom === item)
                            : data.medications.find(m => m.medication === item);
                          const isSelected = !!itemData;

                          return (
                            <div
                              key={item}
                              className={`relative rounded-xl p-3 transition-all ${
                                isSelected
                                  ? 'bg-[#3a2a76]/10 border '
                                  : 'bg-white/95 border border-transparent hover:border-[#3a2a76]/30 hover:bg-white'
                              }`}
                            >
                              <div className="flex flex-col gap-2">
                                <div 
                                  className={`text-sm font-medium cursor-pointer ${
                                    isSelected ? 'text-[#3a2a76]' : 'text-gray-600'
                                  }`}
                                  onClick={() => {
                                    if (isSymptom) {
                                      if (isSelected) {
                                        setData(prev => ({
                                          ...prev,
                                          symptoms: prev.symptoms.filter(s => s.symptom !== item)
                                        }));
                                      } else {
                                        setData(prev => ({
                                          ...prev,
                                          symptoms: [...prev.symptoms, { symptom: item, frequency: '' }]
                                        }));
                                      }
                                    } else {
                                      if (isSelected) {
                                        setData(prev => ({
                                          ...prev,
                                          medications: prev.medications.filter(m => m.medication !== item)
                                        }));
                                      } else {
                                        setData(prev => ({
                                          ...prev,
                                          medications: [...prev.medications, { medication: item, frequency: '' }]
                                        }));
                                      }
                                    }
                                  }}
                                >
                                  {item}
                                </div>
                                
                                {isSelected && (
                                  <div className="flex items-center gap-2 w-full">
                                    <Select
                                      value={itemData?.frequency || ''}
                                      onValueChange={(value: any) => {
                                        if (isSymptom) {
                                          setData(prev => ({
                                            ...prev,
                                            symptoms: prev.symptoms.map(s => 
                                              s.symptom === item 
                                                ? { ...s, frequency: value }
                                                : s
                                            )
                                          }));
                                        } else {
                                          setData(prev => ({
                                            ...prev,
                                            medications: prev.medications.map(m => 
                                              m.medication === item 
                                                ? { ...m, frequency: value }
                                                : m
                                            )
                                          }));
                                        }
                                      }}
                                    >
                                      <SelectTrigger className="h-9 flex-1 text-sm border-0 bg-white/50">
                                        <SelectValue placeholder="How often?" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {isSymptom ? (
                                          <>
                                            <SelectItem value="Daily">Daily</SelectItem>
                                            <SelectItem value="Weekly">Weekly</SelectItem>
                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                            <SelectItem value="Rarely">Rarely</SelectItem>
                                          </>
                                        ) : (
                                          <>
                                            <SelectItem value="Daily">Daily</SelectItem>
                                            <SelectItem value="Weekly">Weekly</SelectItem>
                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                            <SelectItem value="As needed">As needed</SelectItem>
                                          </>
                                        )}
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
                              placeholder={`Add other ${step === 9 ? 'symptom' : 'medication'}...`}
                              value={currentMessage}
                              onChange={(e) => setCurrentMessage(e.target.value)}
                              className="flex-1 px-4 py-3 h-9 rounded-xl border-0 bg-white focus:outline-none focus:ring-2 focus:ring-[#3a2a76]/50"
                            />
                            <Button
                              onClick={() => {
                                if (currentMessage.trim()) {
                                  if (step === 9) {
                                    setData(prev => ({
                                      ...prev,
                                      symptoms: [...prev.symptoms, { symptom: currentMessage.trim(), frequency: '' }]
                                    }));
                                  } else {
                                    setData(prev => ({
                                      ...prev,
                                      medications: [...prev.medications, { medication: currentMessage.trim(), frequency: '' }]
                                    }));
                                  }
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
              )}
            </div>
          </div>
          {step === 1 && (
            <div className="flex justify-start w-full">
              <div className="rounded-2xl w-full bg-white shadow-sm p-4">
                <div className="border-2 border-dashed border-[#3a2a76]/30 rounded-xl p-8 text-center hover:border-[#3a2a76] transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setCurrentMessage(e.target.files[0].name);
                        setData(prev => ({
                          ...prev,
                          doctorLetter: e.target.files?.[0]?.name || ''
                        }));
                      }
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#3a2a76]/10 flex items-center justify-center">
                      {currentMessage ? (
                        <Check className="w-6 h-6 text-[#3a2a76]" />
                      ) : (
                        <svg
                          className="w-6 h-6 text-[#3a2a76]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-[#3a2a76]">
                      {currentMessage || "Click to upload document"}
                    </span>
                    <span className="text-xs text-gray-500">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG
                    </span>
                  </label>
                </div>
                
                <button
                  onClick={() => {
                    setCurrentMessage('demo_letter.pdf');
                    setData(prev => ({
                      ...prev,
                      doctorLetter: 'demo_letter.pdf'
                    }));
                  }}
                  className="mt-4 text-sm text-[#3a2a76] hover:text-[#a680db] underline"
                >
                  Skip for demo
                </button>
              </div>
            </div>
          )}
          <div className={`sticky bottom-0 pt-4 bg-transparent ${step !== 13 ? 'border-t border-[#3a2a76]/20' : ''}`}>
            <Button
              onClick={step === 13 ? handleComplete : handleNext}
              className="w-full h-12 bg-[#3a2a76] hover:bg-[#a680db] text-white font-medium rounded-xl"
              disabled={step === 1 && !currentMessage}
            >
              {step === 13 ? 'Complete Setup' : 'Continue'}
            </Button>

            <div className="flex justify-between items-center px-2 mt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((s) => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full transition-all ${
                      s === step
                        ? 'bg-[#3a2a76] scale-125'
                        : s < step
                        ? 'bg-[#3a2a76]/50'
                        : 'bg-gray-200/50'
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
    </div>
  );
} 