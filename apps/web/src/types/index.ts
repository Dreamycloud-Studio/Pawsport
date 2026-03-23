// This file exports TypeScript types and interfaces used throughout the client application.

export interface Pet {
    id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    vaccinationStatus: boolean;
}

export interface TravelChecklistItem {
    id: string;
    description: string;
    completed: boolean;
}

export interface RegulationSummary {
    country: string;
    requirements: string[];
}

export interface CommunityPost {
    id: string;
    userId: string;
    authorName: string;
    content: string;
    route?: string;
    petTypes?: string[];
    likes: number;
    commentCount: number;
    isLikedByUser?: boolean;
    createdAt: Date;
}

export interface UserProfile {
    id: string;
    username: string;
    pets: Pet[];
    location: string;
}

export interface MatchingCriteria {
    origin: string;
    destination: string;
    travelDate: Date;
}

export interface CreatePostData {
    content: string;
    route?: string;
    petTypes?: string[];
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    authorName: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCommentData {
    content: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'comment' | 'like' | 'reply';
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: Date;
}

// Structured Travel Plan Types
export interface TimelineTask {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

export interface TimelineItem {
    id: string;
    title: string;
    date: string;
    daysBeforeTravel: number;
    tasks: TimelineTask[];
    category: 'veterinary' | 'documentation' | 'booking' | 'preparation';
}

export interface ChecklistTask {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
    category: 'veterinary' | 'documentation' | 'booking' | 'preparation';
    estimatedDuration?: string;
}

export interface StructuredTravelPlan {
    origin: string;
    destination: string;
    species: string;
    breed: string;
    travelDate: string;
    timeline: TimelineItem[];
    checklist: ChecklistTask[];
    regulationSummary: string;
    criticalAlerts: string[];
}

export interface PlanValidationResult {
    valid: boolean;
    warnings: string[];
    plan?: StructuredTravelPlan;
}