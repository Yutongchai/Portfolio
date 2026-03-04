import React from 'react';
import {
  // Used directly via iconName prop on Button
  Mail, ExternalLink, ArrowRight, ArrowLeft, Calendar, Home, Send,
  // Navigation & UI
  Menu, X, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Plus, Minus, Search, Settings,
  // Communication
  Phone, Globe, Bell, MessageCircle,
  // Status & feedback
  Check, CheckCircle, HelpCircle, AlertCircle, Info,
  // People
  User, Users, UserCheck, Smile,
  // Business & work
  Briefcase, Layers, Filter, TrendingUp, Target, Award, Shield, Star,
  // Content
  Lightbulb, Zap, Heart, Gift, Clock, Camera, Mic, Music, Utensils, Trophy,
  // Education & nature
  GraduationCap, TreePine, Sparkles,
  type LucideProps,
} from 'lucide-react';

interface IconProps extends Omit<LucideProps, 'size'> {
    name: string;
    size?: number;
    color?: string;
    className?: string;
    strokeWidth?: number;
}

// Curated icon registry — add icons here as needed
const ICON_REGISTRY: Record<string, React.ComponentType<LucideProps>> = {
  Mail, ExternalLink, ArrowRight, ArrowLeft, Calendar, Home, Send,
  Menu, X, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, Plus, Minus, Search, Settings,
  Phone, Globe, Bell, MessageCircle,
  Check, CheckCircle, HelpCircle, AlertCircle, Info,
  User, Users, UserCheck, Smile,
  Briefcase, Layers, Filter, TrendingUp, Target, Award, Shield, Star,
  Lightbulb, Zap, Heart, Gift, Clock, Camera, Mic, Music, Utensils, Trophy,
  GraduationCap, TreePine, Sparkles,
};

function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}: IconProps) {
    const formattedName = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    const IconComponent = ICON_REGISTRY[formattedName] || ICON_REGISTRY[name];

    if (!IconComponent) {
        return (
            <HelpCircle
                size={size}
                color="gray"
                strokeWidth={strokeWidth}
                className={className}
                {...props}
            />
        );
    }

    return (
        <IconComponent
            size={size}
            color={color}
            strokeWidth={strokeWidth}
            className={className}
            {...props}
        />
    );
}

export default Icon;