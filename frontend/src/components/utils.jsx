// Type definitions and utility functions
import { 
  BookOpen, Users, Award, AlertCircle, BarChart, Clock, Circle, CheckCircle
} from 'lucide-react';
import { Attribute } from '../services/api';

// Color mapping for attributes
export const AttributeColors = {
  AH: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300", icon: <BookOpen size={14} /> },
  SH: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300", icon: <Users size={14} /> },
  WC: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300", icon: <Award size={14} /> },
  WL: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300", icon: <Award size={14} /> },
  NM: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300", icon: <AlertCircle size={14} /> },
  IW: { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-300", icon: <BookOpen size={14} /> },
  EC: { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-300", icon: <BookOpen size={14} /> },
  MM: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300", icon: <BarChart size={14} /> },
};

// Get node type
export const getNodeType = (node) => {
  if (node.titleValue && !node.numberValue && !node.attributes && !node.chooseNClasses && !node.courseID && !node.dropdownChildren) {
    return "title";
  } else if (node.numberValue !== undefined && node.chooseNClasses) {
    return "choose";
  } else if (node.numberValue !== undefined && node.attributes) {
    return "attribute-with-number";
  } else if (node.numberValue !== undefined) {
    return "number";
  } else if (node.attributes && node.attributes.length > 0) {
    return "attribute";
  } else if (node.courseID !== undefined) {
    return "course";
  } else if (node.dropdownChildren === true) {
    return "dropdown";
  }
  return "unknown";
};

// Format course name from titleValue
export const formatCourseName = (titleValue) => {
  if (!titleValue) return "";
  
  // Extract course code pattern (e.g., "CSCI-B 461")
  const match = titleValue.match(/([A-Z]+-[A-Z]\s\d+)/);
  if (!match) return titleValue;
  
  const courseCode = match[0];
  const rest = titleValue.replace(courseCode, "").trim();
  
  return (
    <div>
      <span className="font-mono">{courseCode}</span>
      <span className="ml-1">{rest}</span>
    </div>
  );
};

// Get the completion status of a node
export const getNodeCompletion = (node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap) => {
  if (completedNodes[node.id]) {
    return "complete";
  }
  
  const type = getNodeType(node);
  
  if (type === "number" || type === "attribute-with-number") {
    const inputValue = parseInt(nodeInputValues[node.id]) || 0;
    if (inputValue >= (node.numberValue || 0)) {
      return "complete";
    } else if (inputValue > 0) {
      return "partial";
    }
  }
  
  if (type === "choose") {
    const selectedCount = selectedClasses[node.id]?.length || 0;
    if (selectedCount >= (node.numberValue || 0)) {
      return "complete";
    } else if (selectedCount > 0) {
      return "partial";
    }
  }
  
  if (type === "dropdown") {
    return selectedSpecialization[node.id] ? "partial" : "incomplete";
  }
  
  // For title nodes, check if all prerequisites are completed
  if (type === "title" && node.preRecs && node.preRecs.length > 0) {
    const allPrerecsCompleted = node.preRecs.every(preRecId => {
      const preRecNode = nodeMap[preRecId];
      if (!preRecNode) return false;
      
      const preRecCompletion = getNodeCompletion(preRecNode, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap);
      return preRecCompletion === "complete";
    });
    
    if (allPrerecsCompleted) {
      return "complete";
    }
  }
  
  return "incomplete";
};

// Get class for node status
export const getNodeStatusClass = (node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap) => {
  const status = getNodeCompletion(node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap);
  
  switch (status) {
    case "complete":
      return "bg-green-100 border-green-500 shadow-green-200/50";
    case "partial":
      return "bg-blue-50 border-blue-400 shadow-blue-200/50";
    default:
      return "bg-white border-gray-300 shadow-gray-100/50";
  }
};

// Get icon for node status
export const getNodeStatusIcon = (node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap) => {
  const status = getNodeCompletion(node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap);
  
  switch (status) {
    case "complete":
      return <CheckCircle className="text-green-500" size={20} />;
    case "partial":
      return <Clock className="text-blue-500" size={20} />;
    default:
      return <Circle className="text-gray-300" size={20} />;
  }
};

// Render attribute tag
export const renderAttributeTag = (attr) => {
  const colors = AttributeColors[attr] || { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" };
  return (
    <span key={attr} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
      <span className="mr-1">{colors.icon}</span>
      {Attribute[attr]}
    </span>
  );
};

// Initial assistant messages - this could be moved to an API call in the future
export const initialAssistantMessages = [
  {
    sender: 'assistant',
    content: "Hello! I'm your degree planning assistant. I can help you with course recommendations, scheduling advice, and understanding your degree requirements. What can I help you with today?",
    timestamp: new Date()
  }
];