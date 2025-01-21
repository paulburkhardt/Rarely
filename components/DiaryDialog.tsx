import React, { useState, useEffect, cloneElement } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDiaryState } from '@/hooks/useDiaryState';
import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";


import {DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Slider } from "@/components/ui/slider";
import { Plus, Frown, Meh, Dumbbell, Footprints, Bike, Coffee, Bed } from 'lucide-react';
import { Calendar, MessageCircle, Activity, Check, Heart, Grid, Pill, Smile, Download, Info } from 'lucide-react';

// Replace the import line with these icons that are definitely available
import {Trash2} from 'lucide-react';

interface DiaryDialogProps {
    submitDiary: () => void;
}

export function DiaryDialog({ submitDiary }: DiaryDialogProps) {

    const { 
        symptoms,
            setSymptoms,
            updateSymptom,
            newSymptom,
            setNewSymptom,
            addSymptom, 
            medications,
            setMedications,
            newMedication,
            setNewMedication,
            activityData,
            setActivityData,
            savedActivities,
            setSavedActivities: updateSavedActivities,
            getCurrentDate,
            getCurrentTime,
            exerciseData,
            setExerciseData,
            showExerciseDetails,
            setShowExerciseDetails,
            getActivityIcon,
            getActivityLabel,
            currentStep,
            setCurrentStep,
            getStepTitle,
            selectedActivity, 
            setSelectedActivity,
            showSymptomInput,
            setShowSymptomInput,
            showMedicationInput,
            setShowMedicationInput,
            timeRange,
            setTimeRange,
            showActivitySummary,
            setShowActivitySummary,
            callSubmitDiary,
            hasDiaryEntry, 
            setHasDiaryEntry,
            showDiaryModal, 
            setShowDiaryModal,
            mood, 
            setMood,
      } = useDiaryState();


    return(
        <DialogContent className="max-w-md mx-auto max-h-[90vh] flex flex-col bg-white/95 backdrop-blur-sm rounded-3xl border-0">
            <DialogHeader className="flex-shrink-0 space-y-4 pb-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#3a2a76]/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#3a2a76]" />
                </div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                {getStepTitle(currentStep)}
                </DialogTitle>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                className="absolute top-0 left-0 h-full bg-[#3a2a76] transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
                />
            </div>
            </DialogHeader>
            
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {/* Step 1: Mood */}
            {currentStep === 1 && (
                <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    {[
                    { icon: <Frown />, value: 1, label: "Not Good", color: "bg-red-100", textColor: "text-red-500" },
                    { icon: <Meh />, value: 2, label: "Okay", color: "bg-yellow-100", textColor: "text-yellow-500" },
                    { icon: <Smile />, value: 3, label: "Good", color: "bg-green-100", textColor: "text-green-500" }
                    ].map((item) => (
                    <div 
                        key={item.value}
                        className={`flex flex-col items-center gap-3 cursor-pointer transition-all ${
                        mood === item.value ? 'scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                        onClick={() => setMood(item.value)}
                    >
                        <div className={`w-full aspect-square rounded-2xl flex items-center justify-center ${
                        mood === item.value 
                            ? `${item.color}` 
                            : 'bg-white/95 border border-gray-100'
                        }`}>
                        {cloneElement(item.icon, { 
                            className: `w-8 h-8 ${mood === item.value ? item.textColor : 'text-gray-400'}`
                        })}
                        </div>
                        <span className={`text-sm font-medium ${
                        mood === item.value ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                        {item.label}
                        </span>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Step 2: Activity */}
            {currentStep === 2 && (
                <div className="space-y-6">
                {!showActivitySummary ? (
                    // Activity Selection View
                    <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-center mb-8">What activities did you do?</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                        { icon: getActivityIcon("garden"), label: "Lawn & Garden", value: "garden" },
                        { icon: getActivityIcon("home"), label: "Home Activities", value: "home" },
                        { icon: getActivityIcon("cycling"), label: "Cycling", value: "cycling" },
                        { icon: getActivityIcon("walking"), label: "Walking", value: "walking" },
                        { icon: getActivityIcon("running"), label: "Running", value: "running" },
                        { icon: getActivityIcon("swimming"), label: "Swimming", value: "swimming" },
                        { icon: getActivityIcon("yoga"), label: "Yoga", value: "yoga" }
                        ].map((activity) => (
                        <div
                            key={activity.value}
                            onClick={() => {
                            setSelectedActivity(activity.value);
                            // Reset exercise data when opening new entry
                            setExerciseData({
                                description: "",
                                date: getCurrentDate(),
                                time: getCurrentTime(),
                                duration: {
                                hours: 0,
                                minutes: 0
                                },
                                distance: 0,
                                steps: 0,
                                intensity: 50
                            });
                            setShowExerciseDetails(true);
                            }}
                            className={`relative p-6 rounded-2xl border cursor-pointer transition-all flex flex-col items-center gap-4 ${
                            selectedActivity === activity.value
                                ? 'border-[#3a2a76] bg-white'
                                : 'border-gray-100 bg-white hover:border-[#3a2a76]/30'
                            }`}
                        >
                            <div className={`w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center ${
                            selectedActivity === activity.value ? 'bg-[#3a2a76]/10' : ''
                            }`}>
                            {activity.icon}
                            </div>
                            <span className={`text-lg font-medium text-center ${
                            selectedActivity === activity.value 
                                ? 'text-[#3a2a76]' 
                                : 'text-gray-600'
                            }`}>
                            {activity.label}
                            </span>
                        </div>
                        ))}
                    </div>
                    </div>
                ) : (
                    // Activity Summary View
                    <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Today's Activities</h2>
                        <Button
                        onClick={() => {
                            setShowActivitySummary(false);
                            setSelectedActivity("");
                        }}
                        className="bg-black hover:bg-gray-800 text-white rounded-xl px-4 py-2 flex items-center gap-2"
                        >
                        <Plus className="w-5 h-5" /> Add Activity
                        </Button>
                    </div>

                    <div className="space-y-4">
                    {savedActivities
                        .sort((a, b) => {
                        const timeA = a.datetime.split(' at ')[1];
                        const timeB = b.datetime.split(' at ')[1];
                        return timeA.localeCompare(timeB);
                        })
                        .map((activity, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 relative">
                            <button
                            onClick={() => {
                                const newActivities = savedActivities.filter((_, i) => i !== index);
                                updateSavedActivities(newActivities);
                            }}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                            <Trash2 className="w-4 h-4 text-gray-500" />
                            </button>
                        
                            <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#3a2a76]/10 flex items-center justify-center">
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold">{activity.description}</h3>
                                <div className="text-gray-600">
                                {getActivityLabel(activity.type)} • {activity.datetime.split(' at ')[1]}
                                </div>
                            </div>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                            <div>
                                <span className="font-medium">Intensity: </span>
                                <span>{activity.intensity}%</span>
                            </div>
                        
                            {/* Show duration if either hours or minutes exist */}
                            {activity.duration &&   (activity.duration.hours > 0 || activity.duration.minutes > 0) && (
                                <div>
                                <span className="font-medium">Duration: </span>
                                <span>
                                    { activity.duration && activity.duration.hours > 0 && `${activity.duration.hours}h `}
                                    { activity.duration && activity.duration.minutes > 0 && `${activity.duration.minutes}m`}
                                </span>
                                </div>
                            )}
                        
                            {/* Show steps if they exist */}
                            {activity.steps && activity.steps > 0 && (
                                <div>
                                <span className="font-medium">Distance: </span>
                                <span>{activity.steps} meters</span>
                                </div>
                            )}
                        
                            {/* Show distance if it exists */}
                            {activity.distance && activity.distance > 0 && (
                                <div>
                                <span className="font-medium">Distance: </span>
                                <span>{activity.distance} km</span>
                                </div>
                            )}
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                )}

                {/* Exercise Details Dialog */}
                <Dialog open={showExerciseDetails} onOpenChange={setShowExerciseDetails}>
                    <DialogContent className="sm:max-w-[600px] p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-bold">Describe your exercise</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                        {/* Description */}
                        <div className="space-y-4">
                        {selectedActivity && (
                            <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#3a2a76]/10 flex items-center justify-center">
                                {getActivityIcon(selectedActivity)}
                            </div>
                            <Label className="text-lg">
                                Category: {getActivityLabel(selectedActivity)}
                            </Label>
                            </div>
                        )}
                        <Input
                            placeholder={selectedActivity 
                            ? `Describe your ${getActivityLabel(selectedActivity).toLowerCase()}`
                            : 'Describe your activity'
                            }
                            value={exerciseData.description}
                            onChange={(e) => setExerciseData(prev => ({
                            ...prev,
                            description: e.target.value
                            }))}
                            className="w-full bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                        />
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>When did you exercise</Label>
                            <Input
                            type="date"
                            value={exerciseData.date}
                            onChange={(e) => setExerciseData(prev => ({
                                ...prev,
                                date: e.target.value
                            }))}
                            className="w-full bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input
                            type="time"
                            value={exerciseData.time}
                            onChange={(e) => setExerciseData(prev => ({
                                ...prev,
                                time: e.target.value
                            }))}
                            className="w-full bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                            />
                        </div>
                        </div>

                        {/* Time spent (optional) */}
                        <div className="space-y-2">
                        <Label>Time spent (optional)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                            <Input
                                type="number"
                                placeholder="Hours"
                                value={exerciseData.duration.hours}
                                onChange={(e) => setExerciseData(prev => ({
                                ...prev,
                                duration: {
                                    ...prev.duration,
                                    hours: Number(e.target.value)
                                }
                                }))}
                                className="w-full bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                            />
                            <span className="text-sm text-gray-500">hours</span>
                            </div>
                            <div className="space-y-1">
                            <Input
                                type="number"
                                placeholder="Minutes"
                                value={exerciseData.duration.minutes}
                                onChange={(e) => setExerciseData(prev => ({
                                ...prev,
                                duration: {
                                    ...prev.duration,
                                    minutes: Number(e.target.value)
                                }
                                }))}
                                className="w-full bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                            />
                            <span className="text-sm text-gray-500">minutes</span>
                            </div>
                        </div>
                        </div>

                        {/* Steps */}
                        <div className="space-y-2">
                        <Label>Distance (optional)</Label>
                        <div className="space-y-1">
                            <Input
                            type="number"
                            value={exerciseData.steps}
                            onChange={(e) => setExerciseData(prev => ({
                                ...prev,
                                steps: Number(e.target.value)
                            }))}
                            className="w-full bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                            />
                            <span className="text-sm text-gray-500">meters</span>
                        </div>
                        </div>

                        {/* Intensity */}
                        <div className="space-y-2">
                        <Label>Intensity Level</Label>
                        <div className="space-y-1">
                            <Slider
                            value={[exerciseData.intensity]}
                            onValueChange={(value) => setExerciseData(prev => ({
                                ...prev,
                                intensity: value[0]
                            }))}
                            max={100}
                            step={1}
                            className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                            <span>Low</span>
                            <span>High</span>
                            </div>
                        </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button 
                        variant="outline" 
                        onClick={() => {
                            setShowExerciseDetails(false);
                            setSelectedActivity("");
                        }}
                        className="border-[#3a2a76]/20 hover:bg-[#3a2a76]/10 text-[#3a2a76]"
                        >
                        Cancel
                        </Button>
                        <Button 
                        onClick={() => {
                            const newActivity = {
                                type: selectedActivity,
                                description: exerciseData.description,
                                datetime: `${exerciseData.date} at ${exerciseData.time}`,
                                intensity: exerciseData.intensity,
                                duration: exerciseData.duration,
                                distance: exerciseData.distance,
                                steps: exerciseData.steps
                            };
                            const updatedActivities = [...savedActivities, newActivity];
                            updateSavedActivities(updatedActivities);
                            setShowExerciseDetails(false);
                            setShowActivitySummary(true);
                        }}
                        className="bg-[#3a2a76] hover:bg-[#a680db] text-white"
                        >
                        Add Entry
                        </Button>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>                
                </div>
            )}

            {/* Step 3: Symptoms */}
            {currentStep === 3 && (
                <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {symptoms.map((symptom, index) => (
                    <div
                        key={symptom.label}
                        className={`relative rounded-xl p-4 transition-all ${
                        symptom.selected
                            ? 'bg-[#3a2a76]/10 border border-[#3a2a76]'
                            : 'bg-white/95 border border-gray-100 hover:border-[#3a2a76]/30'
                        }`}
                    >
                        <div 
                        className="flex items-start justify-between mb-2 cursor-pointer"
                        onClick={() => {
                            const newSymptoms = [...symptoms];
                            newSymptoms[index].selected = !newSymptoms[index].selected;
                            if (!newSymptoms[index].selected) {
                            newSymptoms[index].severity = 0;
                            }
                            setSymptoms(newSymptoms);
                        }}
                        >
                        <span className={`text-sm font-medium ${
                            symptom.selected ? 'text-[#3a2a76]' : 'text-gray-600'
                        }`}>
                            {symptom.label}
                        </span>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            symptom.selected 
                            ? 'bg-[#3a2a76] border-[#3a2a76]' 
                            : 'border-gray-300'
                        }`}>
                            {symptom.selected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        </div>

                        {symptom.selected && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                            <span>Mild</span>
                            <span>Severe</span>
                            </div>
                            <Slider
                            defaultValue={[symptom.severity]}
                            value={[symptom.severity]}
                            min={0}
                            max={10}
                            step={1}
                            onValueChange={(value) => {
                                const newSymptoms = [...symptoms];
                                newSymptoms[index].severity = value[0];
                                setSymptoms(newSymptoms);
                            }}
                            />
                            <div className="text-center text-sm font-medium text-[#3a2a76]">
                            {symptom.severity}/10
                            </div>
                        </div>
                        )}
                    </div>
                    ))}
                </div>
                
                {showSymptomInput ? (
                    <div className="mt-4 space-y-3">
                    <input
                        type="text"
                        value={newSymptom}
                        onChange={(e) => setNewSymptom(e.target.value)}
                        placeholder="Enter symptom name"
                        className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#3a2a76]/50 focus:border-[#3a2a76]"
                    />
                    <div className="flex gap-2">
                        <Button
                        onClick={() => {
                            if (newSymptom.trim()) {
                            setSymptoms([...symptoms, { 
                                label: newSymptom.trim(), 
                                selected: true,
                                severity: 0 
                            }]);
                            setNewSymptom("");
                            setShowSymptomInput(false);
                            }
                        }}
                        className="flex-1 bg-[#3a2a76] hover:bg-[#a680db]"
                        >
                        Add Symptom
                        </Button>
                        <Button
                        variant="outline"
                        onClick={() => {
                            setNewSymptom("");
                            setShowSymptomInput(false);
                        }}
                        className="border-2"
                        >
                        Cancel
                        </Button>
                    </div>
                    </div>
                ) : (
                    <Button 
                    variant="outline" 
                    className="w-full gap-2 border-2 border-dashed"
                    onClick={() => setShowSymptomInput(true)}
                    >
                    <Plus className="w-4 h-4" /> Add Custom Symptom
                    </Button>
                )}
                </div>
            )}

            {/* Step 4: Medications */}
            {currentStep === 4 && (
                <div className="space-y-6">
                {Array.from(new Set(medications.map(med => med.category))).map(category => (
                    <div key={category} className="space-y-2">
                    <h3 className="font-medium text-sm text-gray-500">{category}</h3>
                    <div className="space-y-2">
                        {medications
                        .filter(med => med.category === category)
                        .map((med, index) => (
                            <div
                            key={med.name}
                            onClick={() => {
                                const newMeds = [...medications];
                                const medIndex = medications.findIndex(m => m.name === med.name);
                                newMeds[medIndex].taken = !newMeds[medIndex].taken;
                                setMedications(newMeds);
                            }}
                            className={`relative rounded-xl p-4 transition-all cursor-pointer ${
                                med.taken
                                ? 'bg-[#3a2a76]/10 border border-[#3a2a76]'
                                : 'bg-white/95 border border-gray-100 hover:border-[#3a2a76]/30'
                            }`}
                            >
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                <span className="font-medium">{med.name}</span>
                                {med.dosage && (
                                    <span className="text-sm text-gray-500">
                                    {med.dosage.value} {med.dosage.unit}
                                    </span>
                                )}
                                </div>
                                <div className="flex items-center gap-2">
                                {med.prescribed && (
                                    <Badge variant="secondary" className="text-xs">Prescribed</Badge>
                                )}
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center border cursor-pointer ${
                                    med.taken 
                                        ? 'bg-[#3a2a76] border-[#3a2a76]' 
                                        : 'border-gray-300'
                                    }`}
                                >
                                    {med.taken && <Check className="w-3 h-3 text-white" />}
                                </div>
                                </div>
                            </div>
                            {med.taken && (
                                <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="number"
                                    value={med.dosage?.value || ""}
                                    onChange={(e) => {
                                    const newMeds = [...medications];
                                    const medIndex = medications.findIndex(m => m.name === med.name);
                                    newMeds[medIndex].dosage = {
                                        value: Number(e.target.value) || 0,
                                        unit: med.dosage?.unit || 'mg'
                                    };
                                    setMedications(newMeds);
                                    }}
                                    className="w-20 px-2 py-1 rounded-md border text-sm bg-white border-[#3a2a76]/20 focus-visible:ring-[#3a2a76]/50"
                                    placeholder="Dosage"
                                />
                                <Select
                                    value={med.dosage?.unit || "mg"}
                                    onValueChange={(value) => {
                                    const newMeds = [...medications];
                                    const medIndex = medications.findIndex(m => m.name === med.name);
                                    newMeds[medIndex].dosage = {
                                        value: med.dosage?.value || 0,
                                        unit: value
                                    };
                                    setMedications(newMeds);
                                    }}
                                >
                                    <SelectTrigger className="w-20 bg-white">
                                    <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                    <SelectItem value="mg">mg</SelectItem>
                                    <SelectItem value="g">g</SelectItem>
                                    <SelectItem value="ml">ml</SelectItem>
                                    <SelectItem value="mcg">mcg</SelectItem>
                                    </SelectContent>
                                </Select>
                                </div>
                            )}
                            </div>
                        ))}
                    </div>
                    </div>
                ))}
                
                {/* Add Custom Medication UI */}
                {showMedicationInput ? (
                    <div className="mt-4 space-y-2">
                    <input
                        type="text"
                        value={newMedication}
                        onChange={(e) => setNewMedication(e.target.value)}
                        placeholder="Enter medication name"
                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <div className="flex gap-2">
                        <input
                        type="number"
                        placeholder="Dosage"
                        className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <Select defaultValue="mg">
                        <SelectTrigger className="w-24">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mg">mg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="mcg">mcg</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <Button
                        onClick={() => {
                            if (newMedication.trim()) {
                            setMedications([
                                ...medications,
                                { 
                                name: newMedication.trim(), 
                                taken: true, 
                                prescribed: false,
                                category: "Other",
                                dosage: { value: 0, unit: 'mg' }
                                }
                            ]);
                            setNewMedication("");
                            setShowMedicationInput(false);
                            }
                        }}
                        className="flex-1"
                        >
                        Add Medication
                        </Button>
                        <Button
                        variant="outline"
                        onClick={() => {
                            setNewMedication("");
                            setShowMedicationInput(false);
                        }}
                        >
                        Cancel
                        </Button>
                    </div>
                    </div>
                ) : (
                    <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => setShowMedicationInput(true)}
                    >
                    <Plus className="w-4 h-4" /> Add Medication
                    </Button>
                )}
                </div>
            )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 pt-6 border-t border-gray-100 mt-6">
            <div className="flex gap-3">
                {currentStep > 1 && (
                <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="flex-1 border"
                >
                    Back
                </Button>
                )}
                <Button
                onClick={() => {
                    if (currentStep < 4) {
                    setCurrentStep(prev => prev + 1);
                    } else {
                    submitDiary();
                    }
                }}
                className="flex-1 bg-[#3a2a76] hover:bg-[#a680db]"
                >
                {currentStep < 4 ? 'Continue' : 'Complete'}
                </Button>
            </div>
            </div>
        </DialogContent>
    )
}


