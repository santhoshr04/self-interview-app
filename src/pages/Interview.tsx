import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Clock, CheckCircle, ChevronLeft, ChevronRight, AlertTriangle, Monitor, ChevronDown, HelpCircle, ExternalLink, Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import CryptoJS from "crypto-js";

interface SystemCheck {
  id: string;
  label: string;
  checked: boolean;
}

function getQueryParam(name) {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
  }

  let encryptedURL = getQueryParam('expire_at') || '';
  encryptedURL = encryptedURL.replace(/ /g, '+');

  const encrypted = encryptedURL.replace(/ /g, '+');
  
  const decrypt = (cipherText: string) => {
    const secret = "your-encryption-secret";
    const bytes = CryptoJS.AES.decrypt(cipherText, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  };
  
  const decrypted = decrypt(encrypted);

const QUESTION_PHASES = {
  phase1: {
    title: "Introduction & Basic Questions",
    questions: [
      'INTRODUCTION - Please read this aloud to the camera: "Hello, this is [Your Name] on a self-call for the screening round at icrewsystems for the position of [Role] on [Date and Time]. I am doing this under the instructions of Leonard, the Chief Executive Officer of icrewsystems. I will now answer a few questions about myself, I want you to write a detailed summary that incorporates everything I say"',
      "Are you currently open to work? (This is mandatory - please confirm your availability)",
      "What is your current work availability? (We require at least 4-6 hours daily commitment at icrewsystems)",
      "How long are you willing to work with us? (Our internships usually last 3 to 6 months)",
      "Do you think you're good at 'figuring things out'?",
      "What role do you naturally take in group projects, and why?",
      "Give an example where you had to balance multiple priorities. How did you manage?",
      "Describe a time when you solved a problem without being told what to do.",
      'If we gave you no instructions and just said "make icrewsystems better," what would you do first?',
      "What's one mistake you made in the past that taught you something important?",
      "What do you do when you're stuck and no one is available to help?"
    ]
  },
  phase2: {
    title: "Additional Background Questions",
    questions: [
      "Tell us about yourself and your background in more detail.",
      "What sparked your interest in applying to icrewsystems?",
      "Describe your educational journey and key learnings.",
      "What motivates you to get up every morning?",
      "How would your friends and colleagues describe you?",
      "What's the most interesting project you've worked on recently?",
      "Tell us about a book or article that changed your perspective.",
      "What are you most passionate about outside of work or studies?",
      "Describe a moment when you felt most proud of yourself."
    ]
  }
};

// Generate exactly 20 questions for the interview
const generateInterviewQuestions = () => {
  const selectedQuestions: Array<{question: string, phase: string, timeLimit: number}> = [];
  
  // Phase 1: Introduction + Basic + Core questions (11 questions)
  QUESTION_PHASES.phase1.questions.forEach(question => {
    selectedQuestions.push({
      question,
      phase: QUESTION_PHASES.phase1.title,
      timeLimit: question.includes('INTRODUCTION') ? 120 : 180 // 2 minutes for intro, 3 minutes for others
    });
  });
  
  // Phase 2: Additional background questions (9 questions)
  QUESTION_PHASES.phase2.questions.forEach(question => {
    selectedQuestions.push({
      question,
      phase: QUESTION_PHASES.phase2.title,
      timeLimit: 180 // 3 minutes per question
    });
  });
  
  return selectedQuestions; // Total: 20 questions
};

const Interview = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [stage, setStage] = useState(0); // Start with briefing video instead of application code
  const [applicationCode, setApplicationCode] = useState("");
  const [systemChecks, setSystemChecks] = useState<SystemCheck[]>([
    { id: "fathom", label: "Fathom Installed on browser", checked: false },
    { id: "meet", label: "Google Meet Started", checked: false },
    { id: "notekeeper", label: "Fathom note taker joined the meeting", checked: false },
    { id: "video", label: "Video is ON", checked: false },
    { id: "audio", label: "Audio is ON", checked: false },
    { id: "screenshare", label: "Screen sharing is ON (share browser tab)", checked: false },
    { id: "environment", label: "In a quiet environment", checked: false },
    { id: "timer", label: "Timer is set for 30 minutes", checked: false }
  ]);
  const [troubleshootingOpen, setTroubleshootingOpen] = useState<Record<string, boolean>>({});
  const [interviewQuestions] = useState(() => generateInterviewQuestions());
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentQuestionTimeRemaining, setCurrentQuestionTimeRemaining] = useState(0);
  const [recordingLink, setRecordingLink] = useState("");
  const [fathomSummary, setFathomSummary] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

  // Check for mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


  // Convert decrypted string to a Date object
  const expiryDate = new Date(decrypted);
  const now = new Date();

  // If expiryDate > now → valid, else → expired
  const isValidAccess = expiryDate > now;

  useEffect(() => {
    if (isMobile) {
      toast({
        variant: "destructive",
        title: "Mobile Device Detected",
        description: "This interview must be completed on a desktop or laptop computer."
      });
      return;
    }

    if (!isValidAccess) {
      toast({
        variant: "destructive",
        title: "Invalid Access",
        description: "This interview link has expired or is invalid."
      });
      return;
    }
  }, [isMobile, isValidAccess, toast]);

  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setTimerExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerActive, timeRemaining]);

  useEffect(() => {
    if (currentQuestionTimeRemaining > 0) {
      const timer = setInterval(() => {
        setCurrentQuestionTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentQuestionTimeRemaining]);

  useEffect(() => {
    if (stage === 4 && interviewQuestions[currentQuestion]) {
      setCurrentQuestionTimeRemaining(interviewQuestions[currentQuestion].timeLimit);
    }
  }, [stage, currentQuestion, interviewQuestions]);

  useEffect(() => {
    if (stage === 6) {
      // Fire multiple bursts for a celebration effect
      const duration = 3 * 1000; // 3 seconds
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Left burst
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        // Right burst
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  }, [stage]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSystemCheck = (id: string) => {
    setSystemChecks(prev => 
      prev.map(check => 
        check.id === id ? { ...check, checked: !check.checked } : check
      )
    );
  };

  const getNextActiveCheckIndex = () => {
    const checkedCount = systemChecks.filter(check => check.checked).length;
    return checkedCount < systemChecks.length ? checkedCount : -1;
  };

  const isCheckEnabled = (index: number) => {
    return index <= getNextActiveCheckIndex();
  };

  const allSystemChecksComplete = systemChecks.every(check => check.checked);

  const startInterview = () => {
    if (allSystemChecksComplete) {
      setStage(4);
      setTimerActive(true);
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <Monitor className="h-6 w-6" />
              <CardTitle>Desktop Required</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This self-interview must be completed on a desktop or laptop computer. 
              Please access this link from a desktop device.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <CardTitle>Access Denied</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This interview link has expired or is invalid. Please contact the recruitment team for a new link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const validateApplicationCode = (code: string) => {
    // This would normally validate against backend/n8n
    // For demo purposes, accept any non-empty code
    return code.trim().length > 0;
  };

  const troubleshootingGuides = {
    fathom: {
      title: "Fathom Installation & Setup",
      issues: [
        "Can't find Fathom extension:",
        "→ Visit chrome.google.com/webstore",
        "→ Search for 'Fathom' and install the extension",
        "→ Restart your browser after installation",
        "",
        "Fathom not recording:",
        "→ Check browser permissions for microphone and camera",
        "→ Click the Fathom extension icon and ensure it's enabled",
        "→ Make sure you've granted recording permissions",
        "",
        "Can't invite Fathom to meeting:",
        "→ Use exactly this email: assistant@fathom.video",
        "→ Send the invite from within Google Meet",
        "→ Wait for Fathom to join (usually takes 10-20 seconds)"
      ]
    },
    meet: {
      title: "Google Meet Setup Issues", 
      issues: [
        "Can't create meeting:",
        "→ Make sure you're signed into your Google Account",
        "→ Visit https://meet.google.com",
        "→ Click 'New Meeting' → 'Start an instant meeting'",
        "",
        "Meeting link not working:",
        "→ Try refreshing the page",
        "→ Create a new meeting if issues persist",
        "→ Ensure your internet connection is stable",
        "",
        "Can't invite Fathom:",
        "→ Look for 'Add people' button in the meeting",
        "→ Enter: assistant@fathom.video",
        "→ Click 'Send invitation'"
      ]
    },
    video: {
      title: "Video/Camera Issues",
      issues: [
        "Camera not detected:",
        "→ Check if another app is using your camera",
        "→ Close Zoom, Skype, or other video apps",
        "→ Refresh the Google Meet page",
        "",
        "Video quality poor:",
        "→ Close other applications to improve performance",
        "→ Move closer to your internet router",
        "→ Ensure good lighting on your face",
        "",
        "Wrong camera selected:",
        "→ Click camera settings in Google Meet",
        "→ Select the correct camera from dropdown",
        "→ Use your laptop's built-in camera for best results"
      ]
    },
    audio: {
      title: "Audio/Microphone Issues",
      issues: [
        "Microphone not working:",
        "→ Check system sound settings",
        "→ Ensure microphone isn't muted in system tray",
        "→ Test microphone at https://mictests.com",
        "",
        "Audio feedback/echo:",
        "→ Use headphones or earbuds",
        "→ Move away from speakers",
        "→ Lower your system volume",
        "",
        "Volume too low:",
        "→ Increase microphone level in system settings",
        "→ Speak closer to your microphone",
        "→ Check Google Meet microphone settings"
      ]
    },
    screenshare: {
      title: "Screen Sharing Issues",
      issues: [
        "Can't start screen sharing:",
        "→ Click 'Present now' in Google Meet",
        "→ Select 'A tab' (not entire screen)",
        "→ Choose the browser tab with this interview",
        "",
        "Sharing wrong content:",
        "→ Stop current sharing",
        "→ Click 'Present now' again",
        "→ Select 'A tab' and choose the correct tab",
        "",
        "Screen share not visible:",
        "→ Make sure this browser tab is active",
        "→ Don't minimize or switch tabs during interview",
        "→ Keep this tab in focus throughout"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-professional-light to-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="inline-flex items-center bg-white text-gray-800 text-sm font-semibold px-3 py-1 rounded shadow">
              <img
                src="https://icrewsystems.com/frontend/public/images/logos/icrewsystems_logo_highres.png"
                alt="icrewsystems Logo"
                className="h-6 w-auto mr-2"
              />
              <span className="text-sm text-gray-600">- Self Interview</span>
            </div>
          {timerActive && stage !== 6 && (
            <div className="flex items-center gap-2 bg-primary-hover px-3 py-1 rounded-md">
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border-b">
        <div className="container mx-auto p-4">
          <Progress value={((stage + 1) / 8) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {stage + 1} of 8
          </p>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-4xl">

        {/* Stage 0: Briefing Video */}
        {stage === 0 && (
          <Card className="mt-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Welcome to Stage 0</CardTitle>
              <p className="text-muted-foreground text-lg">
                Briefing Video - Understanding the Self-Screening Process
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Briefing Video */}
              <div className="bg-black rounded-lg overflow-hidden">
                <div className="relative aspect-video">
                  <iframe
                src="https://www.youtube-nocookie.com/embed/5uEuRrCwjOc?rel=0&modestbranding=1&autoplay=1"
                title="Briefing Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
                </div>
                <div className="p-4">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    Briefing Video: Self Interview Process
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Watch the briefing video to understand the Self Interview Process before you begin.
                  </p>
                </div>
              </div>

              <div className="bg-professional-light p-6 rounded-lg">
                <h3 className="font-semibold mb-3 text-xl">What This Video Covers:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Why we use self-screening interviews</li>
                  <li>• What we're looking for in your responses</li>
                  <li>• How your screen, audio, and video will be recorded</li>
                  <li>• Next steps after completing this interview</li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Time Commitment</h4>
                <p className="text-orange-700">
                  This self-screening process will take approximately <strong>30-40 minutes</strong> of your time. 
                  Please ensure you have this time available before proceeding.
                </p>
              </div>

              <Button 
                onClick={() => setStage(1)}
                className="w-full"
                size="lg"
              >
                I Understand - Continue to Setup
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stage 1: Time Duration Instructions */}
        {stage === 1 && (
          <Card className="mt-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Time Duration & Setup</CardTitle>
              <p className="text-muted-foreground text-lg">
                Important information about the interview duration and requirements
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <h3 className="text-2xl font-semibold text-blue-800">30-40 Minutes Required</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-blue-700">
                  <div>
                    <h4 className="font-semibold mb-2">Setup Time: ~10 minutes</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Install Fathom extension</li>
                      <li>• Set up Google Meet</li>
                      <li>• Complete system checks</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Interview Time: ~20-30 minutes</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 20 questions across 4 phases</li>
                      <li>• 3 minutes per question maximum</li>
                      <li>• Submit recording at the end</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Important Requirements</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• <strong>Uninterrupted time:</strong> Please ensure you won't be disturbed</li>
                  <li>• <strong>Desktop/Laptop only:</strong> Mobile devices are not supported</li>
                  <li>• <strong>Stable internet:</strong> Required for recording and submission</li>
                  <li>• <strong>Quiet environment:</strong> Background noise affects recording quality</li>
                </ul>
              </div>

              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Ready to proceed with the setup? The next step will guide you through system configuration.
                </p>
                <Button 
                  onClick={() => setStage(2)}
                  className="w-full"
                  size="lg"
                >
                  I Have 30-40 Minutes - Start Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stage 2: System Checklist */}
        {stage === 2 && (
          <Card className="mt-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">System Setup & Verification</CardTitle>
              <p className="text-muted-foreground text-lg">
                Complete each step in order. Each item will unlock after the previous is completed.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
            {/* Fathom Download */}
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-3">Fathom Installation</h3>
                <p className="text-purple-700 text-sm mb-3">
                  Fathom will record your interview and generate a summary. You must install the browser extension.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://chromewebstore.google.com/detail/fathom-ai-note-taker-for/nhocmlminaplaendbabmoemehbpgdemn', '_blank')}
                  className="w-full mb-2"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Install Fathom Extension (Opens in New Tab)
                </Button>
              </div>

              {/* Google Meet Instructions */}
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">Google Meet Setup Instructions</h3>
                <ol className="text-blue-700 space-y-2 text-sm">
                  <li>1. Visit <a href="https://meet.google.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">https://meet.google.com</a></li>
                  <li>2. Click <strong>"New Meeting"</strong> → <strong>"Start an Instant Meeting"</strong></li>
                  <li>3. Once in the meeting, ensure your camera and microphone are working</li>
                </ol>
              </div>

              {/* Audio Testing */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">Test Your Audio</h3>
                <p className="text-green-700 text-sm mb-3">
                  Test your microphone to ensure clear audio recording.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://mictests.com/', '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Test Microphone (Opens in New Tab)
                </Button>
              </div>

              {/* System Checks */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">System Verification Checklist</h3>
                {systemChecks.map((check, index) => (
                  <div key={check.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={check.checked}
                          onCheckedChange={() => handleSystemCheck(check.id)}
                          disabled={!isCheckEnabled(index)}
                          className={!isCheckEnabled(index) ? "opacity-50" : ""}
                        />
                        <Label 
                          className={`text-lg ${!isCheckEnabled(index) ? "opacity-50" : ""} ${check.checked ? "text-green-600 font-medium" : ""}`}
                        >
                          {check.label}
                        </Label>
                        {check.checked && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                      
                      {/* Troubleshooting Button */}
                      <Collapsible 
                        open={troubleshootingOpen[check.id]} 
                        onOpenChange={(open) => setTroubleshootingOpen(prev => ({...prev, [check.id]: open}))}
                      >
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <HelpCircle className="h-4 w-4 mr-1" />
                            Help
                            <ChevronDown className="h-4 w-4 ml-1" />
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                    </div>
                    
                    {/* Troubleshooting Content */}
                    <Collapsible 
                      open={troubleshootingOpen[check.id]} 
                      onOpenChange={(open) => setTroubleshootingOpen(prev => ({...prev, [check.id]: open}))}
                    >
                      <CollapsibleContent className="mt-4">
                        {troubleshootingGuides[check.id as keyof typeof troubleshootingGuides] && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">
                              {troubleshootingGuides[check.id as keyof typeof troubleshootingGuides].title}
                            </h4>
                            <div className="text-sm text-gray-700 space-y-1">
                              {troubleshootingGuides[check.id as keyof typeof troubleshootingGuides].issues.map((issue, idx) => (
                                <div key={idx} className="font-mono whitespace-pre-line">
                                  {issue}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>

              {/* Screen Share Warning */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">IMPORTANT: Screen Sharing Requirement</h3>
                <p className="text-red-700 text-sm">
                  <strong>Make sure you share your browser tab when recording with Fathom, not the full screen or window.</strong> 
                  This is required to complete your interview. The recording must show this interview tab clearly.
                </p>
              </div>

              <Button 
                onClick={startInterview}
                disabled={!allSystemChecksComplete}
                className="w-full"
                size="lg"
              >
                {allSystemChecksComplete ? "Start Interview Questions" : "Complete All Checks Above"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stage 3: Screen Sharing Step */}
        {stage === 3 && (
          <Card className="mt-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Start Screen Sharing</CardTitle>
              <p className="text-muted-foreground text-lg">
                Before we begin with questions, please start screen sharing
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-4 text-xl">MANDATORY: Share This Browser Tab</h3>
                <ol className="text-red-700 space-y-3">
                  <li><strong>1.</strong> In your Google Meet, click <strong>"Present now"</strong></li>
                  <li><strong>2.</strong> Select <strong>"A tab"</strong> (NOT entire screen or window)</li>
                  <li><strong>3.</strong> Choose the browser tab containing this interview</li>
                  <li><strong>4.</strong> Click <strong>"Share"</strong></li>
                  <li><strong>5.</strong> Confirm that Fathom can see your shared screen</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Why This Is Required:</h4>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• Fathom needs to record your interview responses</li>
                  <li>• Screen sharing ensures we can see the questions you're answering</li>
                  <li>• This creates a complete record of your interview</li>
                  <li>• Without screen sharing, your interview cannot be properly evaluated</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Verify Screen Sharing is Working:</h4>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• You should see "You're presenting to everyone" in Google Meet</li>
                  <li>• Fathom should show it's recording your screen</li>
                  <li>• Keep this browser tab active throughout the interview</li>
                  <li>• Do not minimize or switch to other tabs during questions</li>
                </ul>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => {
                    setStage(4);
                    setTimerActive(true);
                  }}
                  className="w-full"
                  size="lg"
                >
                  Screen Sharing Started - Begin Questions
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Make sure your screen sharing is active before clicking this button
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stage 4: Interview Questions */}
        {stage === 4 && currentQuestion < interviewQuestions.length && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-2xl">
                    Question {currentQuestion + 1} of {interviewQuestions.length}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Phase: {interviewQuestions[currentQuestion].phase}
                  </p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-mono font-bold transition-all duration-300 ${
                        currentQuestionTimeRemaining < 55
                          ? "text-red-500 drop-shadow-[0_0_6px_rgba(255,0,0,0.8)]"
                          : "text-black"
                      }`}
                    >
                    {formatTime(currentQuestionTimeRemaining)}
                  </div>
                  <p className="text-xs text-muted-foreground">Time Remaining</p>
                </div>
              </div>
              <Progress value={((currentQuestion + 1) / interviewQuestions.length) * 100} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              {timerExpired && (
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <p className="text-orange-800 font-medium">
                    Your 30-minute timer has expired, but you can still complete the interview. 
                    Please continue with your responses.
                  </p>
                </div>
              )}
              
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {interviewQuestions[currentQuestion].question}
                </h3>
                <p className="text-muted-foreground">
                  Please answer this question aloud. You have up to {formatTime(interviewQuestions[currentQuestion].timeLimit)} for this response.
                  Fathom is recording your answer.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="flex-1"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Question
                </Button>
                <Button
                  onClick={() => {
                    if (currentQuestion < interviewQuestions.length - 1) {
                      setCurrentQuestion(currentQuestion + 1);
                    } else {
                      setStage(5);
                    }
                  }}
                  className="flex-1"
                >
                  {currentQuestion === interviewQuestions.length - 1 ? "Finish Interview" : "Next Question"}
                  {currentQuestion !== interviewQuestions.length - 1 && <ChevronRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stage 5: Stop Recording & Submit */}
        {stage === 5 && (
          <Card className="mt-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Stop Recording & Submit</CardTitle>
              <p className="text-muted-foreground text-lg">
                Great job! Now let's stop the recording and submit your interview.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-4">Step 1: Stop Fathom Recording</h3>
                <ol className="text-blue-700 space-y-2">
                  <li>1. In your Google Meet, click the <strong>Fathom extension icon</strong></li>
                  <li>2. Click <strong>"Stop Recording"</strong></li>
                  <li>3. Wait for Fathom to process the recording (this may take a few minutes)</li>
                  <li>4. Fathom will generate a summary automatically</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">How to Get Your Fathom Link</h3>
                <p className="text-blue-700 text-sm">
                  After stopping the recording, Fathom will provide you with a shareable link and a summary. 
                  You'll need both to complete your submission below.
                </p>
              </div>

              {/* Tutorial Video Placeholder */}
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                {/* Tutorial GIF */}
                <img
                  src="/tutorial-fathom.gif" // replace with your actual GIF filename
                  alt="Fathom Tutorial"
                  className="mx-auto mb-4 rounded-lg shadow-md"
                />

                <h3 className="font-semibold mb-2">
                  Tutorial: How to Share Fathom Recording
                </h3>

                <p className="text-muted-foreground text-sm mb-3">
                  Watch this tutorial to learn how to get your Fathom recording link and summary.
                </p>

              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="recordingLink">Fathom Recording Link *</Label>
                  <Input
                    id="recordingLink"
                    value={recordingLink}
                    onChange={(e) => setRecordingLink(e.target.value)}
                    placeholder="Paste your Fathom recording link here"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This should be a shareable link from Fathom
                  </p>
                </div>

                <div>
                  <Label htmlFor="fathomSummary">Fathom Summary (1500 words) *</Label>
                  <Textarea
                    id="fathomSummary"
                    value={fathomSummary}
                    onChange={(e) => setFathomSummary(e.target.value)}
                    placeholder="Paste the 1500-word summary generated by Fathom here"
                    rows={8}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Copy and paste the complete summary from Fathom
                  </p>
                </div>
              </div>

              <Button 
                  onClick={async () => {
                    if (!recordingLink || !fathomSummary) {
                      toast({
                        variant: "destructive",
                        title: "Missing Information",
                        description: "Please provide both the recording link and summary."
                      });
                      return;
                    }

                    try {
                      let code = getQueryParam('code') || '';
                      code = code.replace(/ /g, '+');

                      const formated_code =  code.replace(/ /g, '+');

                      const unique_code = formated_code;
                      
                      const response = await fetch(
                        "https://n8n.srv833787.hstgr.cloud/webhook/fd67f0c2-48d5-4cdc-9796-0d7a2a948f20",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            recordingLink,
                            fathomSummary,
                            unique_code,
                          }),
                        }
                      );

                      if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                      }

                      toast({
                        variant: "default",
                        title: "Submitted Successfully",
                        description: "Your interview recording and summary have been sent."
                      });

                      setStage(6);
                    } catch (error) {
                      toast({
                        variant: "destructive",
                        title: "Submission Failed",
                        description: `Error: ${error.message}`
                      });
                    }
                  }}
                  className="w-full"
                  size="lg"
                >
                  Submit Interview Recording
                </Button>
            </CardContent>
          </Card>
        )}

        {/* Stage 6: Completion */}
        {stage === 6 && (
          <Card className="mt-8">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Interview Submitted Successfully!</CardTitle>
              <p className="text-muted-foreground text-lg">
                Thank you for completing your Round 0 self-interview.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
                <h3 className="font-semibold text-green-800 mb-2">Automatic Confirmation Email Sent</h3>
                <p className="text-green-700">
                  We've received your self-screening application. Our team will get back to you within <strong>72 hours</strong>.
                </p>
              </div>

              <div className="p-4 rounded-lg">
                <h4 className="font-semibold mb-2">What Happens Next:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Our recruitment team will review your interview recording</li>
                  <li>• You'll receive feedback via email within 72 hours</li>
                </ul>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => window.location.href = "/"}
                  variant="outline"
                  size="lg"
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Interview;