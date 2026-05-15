import React, { useState } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StructuredTravelPlan } from '../types';
import ChatSidebar from '../components/TravelAssistant/ChatSidebar';
import AITravelChat from '../components/TravelAssistant/AITravelChat';
import PlanPanel from '../components/TravelAssistant/PlanPanel';

const TravelPlanner: React.FC = () => {
  const { user } = useAuth();
  const [activeTrip, setActiveTrip] = useState('t1');
  const [plan, setPlan] = useState<StructuredTravelPlan | null>(null);

  const displayName: string = user?.user_metadata?.display_name || '';
  const initials = displayName
    ? displayName
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'SK';

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Top breadcrumb bar */}
      <div className="px-5 py-3 bg-white border-b border-gray-100 flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button className="hover:text-gray-900">My Trips</button>
          <ChevronRight size={12} />
          <span className="text-gray-900 font-semibold">Bella → Paris</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100">
            <Bell size={15} />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-pink-300 text-white flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
        </div>
      </div>

      {/* 3-panel body */}
      <div className="flex-1 flex min-h-0">
        <ChatSidebar
          activeId={activeTrip}
          onSelect={setActiveTrip}
          userName={displayName || 'Sara K.'}
          userSub="Free plan · 2 trips"
        />
        <AITravelChat onPlanGenerated={setPlan} />
        <PlanPanel plan={plan} />
      </div>
    </div>
  );
};

export default TravelPlanner;
