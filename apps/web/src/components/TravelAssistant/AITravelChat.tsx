import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Sparkles, Send, User } from 'lucide-react';
import { PlannerTrip, StructuredTravelPlan } from '../../types';
import PlanValidationWarning from './PlanValidationWarning';
import { useRegulationQuery } from '../../hooks/useRegulationQuery';

type ChatMode = 'general' | 'regulation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AITravelChatProps {
  onPlanGenerated?: (plan: StructuredTravelPlan | null) => void;
  activeTrip?: PlannerTrip | null;
  contextRevision?: number;
}

const SUGGESTIONS = [
  'Draft email to vet',
  'Check airline pet rules',
  'Pet-friendly hotels nearby',
  'Print plan as PDF',
];

const AITravelChat: React.FC<AITravelChatProps> = ({
  onPlanGenerated,
  activeTrip,
  contextRevision = 0,
}) => {
  const [chatMode, setChatMode] = useState<ChatMode>('general');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm your Pawsport AI. I can help you **plan your pet's trip**, understand regulations, and build a custom checklist.\n\nWhat's your destination and when are you travelling?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [planWarnings, setPlanWarnings] = useState<string[] | null>(null);
  const [showPlanError, setShowPlanError] = useState(false);
  const [regCountry, setRegCountry] = useState('');
  const [regPetType, setRegPetType] = useState<'dog' | 'cat'>('dog');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const systemContextRef = useRef('');
  const { ask: askRegulation, result: regResult, loading: regLoading, error: regError } =
    useRegulationQuery();

  useEffect(() => {
    if (!activeTrip) {
      systemContextRef.current = '';
      return;
    }

    systemContextRef.current = [
      'Active trip context for future planning responses:',
      `petName: ${activeTrip.petName}`,
      `species: ${activeTrip.species}`,
      `breed: ${activeTrip.breed}`,
      `origin: ${activeTrip.origin}`,
      `destination: ${activeTrip.destination}`,
      `travelDate: ${activeTrip.travelDate}`,
      `vaccinationStatus: ${activeTrip.vaccinationStatus}`,
      `status: ${activeTrip.status}`,
      'Use this trip as default context unless user explicitly overrides details.',
    ].join('\n');
  }, [activeTrip, contextRevision]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (regResult) {
      const sourcesText =
        regResult.sources.length > 0
          ? '\n\n**Sources:**\n' +
            regResult.sources.map((s) => `• [${s.name}](${s.url}) — ${s.topic}`).join('\n')
          : '';
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: regResult.answer + sourcesText,
          timestamp: new Date(),
        },
      ]);
    }
  }, [regResult]);

  useEffect(() => {
    if (regError) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `❌ Regulation query failed: ${regError}`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [regError]);

  const generateStructuredPlan = async (_userInput: string) => {
    try {
      const payload = {
        origin: activeTrip?.origin || 'New York',
        destination: activeTrip?.destination || 'London',
        species: activeTrip?.species || 'dog',
        breed: activeTrip?.breed || 'Labrador',
        vaccinationStatus: activeTrip?.vaccinationStatus || 'up-to-date',
        travelDate:
          activeTrip?.travelDate ||
          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const response = await fetch('/api/travel/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      if (data.success && data.plan) {
        onPlanGenerated?.(data.plan);
        setPlanWarnings(null);
        setShowPlanError(false);
        return true;
      }
      setPlanWarnings(data.warnings || ['Unknown error occurred']);
      setShowPlanError(true);
      return false;
    } catch {
      setPlanWarnings(['Failed to connect to the AI service. Please try again.']);
      setShowPlanError(true);
      return false;
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading || regLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    if (chatMode === 'regulation') {
      if (!regCountry) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '⚠️ Please select a destination country before asking a regulation question.',
            timestamp: new Date(),
          },
        ]);
        return;
      }
      await askRegulation(text.trim(), regCountry, regPetType);
      return;
    }

    setIsLoading(true);
    const isPlanRequest = /checklist|plan|timeline/i.test(text);

    if (isPlanRequest) {
      const success = await generateStructuredPlan(text);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: success
            ? "✅ I've built your travel checklist — check the panel on the right!"
            : "❌ Couldn't generate your plan. See the warning above and try again.",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
      return;
    }

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          tripContext: systemContextRef.current || undefined,
        }),
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || "Sorry, I couldn't generate a response.",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0">
      {/* Pinned trip header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-orange-50 to-pink-50 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-400 text-white flex items-center justify-center">
          <Sparkles size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900">
            {activeTrip
              ? `Planning ${activeTrip.petName}'s trip to ${activeTrip.destination}`
              : 'Plan your next pet trip'}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> AI online
            </span>
            <span>·</span>
            <span>
              {activeTrip
                ? `${activeTrip.origin} → ${activeTrip.destination} · ${activeTrip.species}`
                : 'Choose a trip on the left'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-white rounded-full border border-gray-200 p-1 text-xs">
          <button
            onClick={() => setChatMode('general')}
            className={`px-3 py-1 rounded-full font-semibold transition ${
              chatMode === 'general'
                ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setChatMode('regulation')}
            className={`px-3 py-1 rounded-full font-semibold transition ${
              chatMode === 'regulation'
                ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Regulations
          </button>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold">
          {activeTrip?.destination || 'No trip selected'}
        </span>
      </div>

      {/* Regulation controls */}
      {chatMode === 'regulation' && (
        <div className="px-6 py-3 border-b border-gray-100 bg-orange-50 flex items-center gap-4 flex-shrink-0">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 font-medium">Country</span>
            <input
              type="text"
              placeholder="e.g. JP, GB"
              value={regCountry}
              onChange={(e) => setRegCountry(e.target.value.toUpperCase().slice(0, 2))}
              maxLength={2}
              className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400 bg-white"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 font-medium">Pet</span>
            <select
              value={regPetType}
              onChange={(e) => setRegPetType(e.target.value as 'dog' | 'cat')}
              className="px-2 py-1 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-400 bg-white"
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>
          </label>
        </div>
      )}

      {/* Plan error */}
      {showPlanError && planWarnings && (
        <PlanValidationWarning
          warnings={planWarnings}
          onRetry={() => {
            setShowPlanError(false);
            setPlanWarnings(null);
            sendMessage('Create a travel checklist for my pet');
          }}
          onDismiss={() => setShowPlanError(false)}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div key={m.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center ${
                  isUser
                    ? 'bg-gray-200'
                    : 'bg-gradient-to-br from-orange-400 to-pink-400 text-white'
                }`}
              >
                {isUser ? <User size={15} /> : <Sparkles size={15} />}
              </div>
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-100 text-gray-800 shadow-sm'
                }`}
              >
                {isUser ? (
                  m.content
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none">
                    {m.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          );
        })}

        {(isLoading || regLoading) && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 text-white flex items-center justify-center flex-shrink-0">
              <Sparkles size={15} />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        )}

        {/* Inline suggestion chips */}
        <div className="ml-12 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 bg-white border-2 border-orange-100 hover:border-orange-300 px-3 py-1.5 rounded-full transition"
            >
              {s}
            </button>
          ))}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="px-6 py-4 border-t border-gray-100 bg-white flex-shrink-0"
      >
        <div className="flex gap-2 items-center bg-gray-50 rounded-full pr-1 pl-4 py-1 border-2 border-transparent focus-within:border-orange-300 focus-within:bg-white transition">
          <Sparkles size={16} className="text-orange-500 flex-shrink-0" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none placeholder-gray-400"
            placeholder={
              chatMode === 'regulation'
                ? 'Ask a regulation question…'
                : 'Ask anything about your trip…'
            }
            disabled={isLoading || regLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || regLoading}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 text-white flex items-center justify-center disabled:opacity-40 transition"
          >
            <Send size={15} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400">
          <span>Press ↵ to send</span>
          <span className="flex items-center gap-1">
            <Sparkles size={11} /> Pawsport AI
          </span>
        </div>
      </form>
    </div>
  );
};

export default AITravelChat;
