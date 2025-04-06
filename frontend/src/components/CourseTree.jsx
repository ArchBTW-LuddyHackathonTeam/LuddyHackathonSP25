import React, { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, ZoomOut, Home, CheckCircle, Circle, ChevronDown, ChevronRight, 
  BookOpen, Calendar, Award, Users, AlertCircle, BarChart, Clock, Search,
  MessageSquare, Send, Bot, Layers, User, FileText, PenTool, Info, Filter
} from 'lucide-react';
import _ from 'lodash';

// Import refactored components
import TreeView from './TreeView';
import ProgressView from './ProgressView';
import Assistant from './Assistant';

// Import utilities
import { 
  initialTreeData, 
  initialAssistantMessages, 
  generateDummyClasses, 
  Attribute, 
  AttributeColors, 
  getNodeType, 
  getNodeCompletion, 
  getNodeStatusIcon 
} from './utils';

// Import Assistant context
import { AssistantProvider } from '../services/AssistantContext';

// Main component
const CourseTree = () => {
  // State variables
  const [treeData, setTreeData] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [completedNodes, setCompletedNodes] = useState({});
  const [selectedClasses, setSelectedClasses] = useState({});
  const [nodeInputValues, setNodeInputValues] = useState({});
  const [expandedCourses, setExpandedCourses] = useState({});
  const [dummyClassData, setDummyClassData] = useState({});
  const [selectedSpecialization, setSelectedSpecialization] = useState({});
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("tree"); // "tree", "progress", "assistant"
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState("modern"); // "modern", "compact", "detailed"
  const [hoveredNode, setHoveredNode] = useState(null);
  const [totalCredits, setTotalCredits] = useState(0);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [nodeMap, setNodeMap] = useState({});
  const [assistantMessages, setAssistantMessages] = useState(initialAssistantMessages);
  const [userMessage, setUserMessage] = useState("");
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [courseSearchTerms, setCourseSearchTerms] = useState({});
  const [filteredCourseData, setFilteredCourseData] = useState({});
  // New state for completed classes
  const [completedClasses, setCompletedClasses] = useState({});
  const containerRef = useRef(null);
  const nodeRefs = useRef({});

  // Process tree data to create a proper hierarchy
  useEffect(() => {
    // Convert the flat array into a map for easier access
    const nodeMap = {};
    initialTreeData.forEach(node => {
      nodeMap[node.id] = { ...node, children: [] };
    });
    
    // Connect parent-child relationships
    initialTreeData.forEach(node => {
      if (node.preRecs && node.preRecs.length > 0) {
        node.preRecs.forEach(childId => {
          if (nodeMap[childId]) {
            nodeMap[node.id].children.push(nodeMap[childId]);
          }
        });
      }
    });
    
    // Find root nodes (those that aren't children of any other node)
    const roots = initialTreeData.filter(node => {
      return !initialTreeData.some(parent => 
        parent.preRecs && parent.preRecs.includes(node.id)
      );
    });
    
    setTreeData(roots.map(root => nodeMap[root.id]));
    setNodeMap(nodeMap);
    
    // Initialize expanded state (root nodes are expanded by default)
    const initialExpanded = {};
    roots.forEach(root => {
      initialExpanded[root.id] = true;
    });
    setExpandedNodes(initialExpanded);

    // Calculate total credits
    let total = 0;
    initialTreeData.forEach(node => {
      if (node.numberValue && !node.chooseNClasses) {
        total += node.numberValue;
      }
    });
    setTotalCredits(total);
  }, []);

  // Generate dummy class data for attributes
  useEffect(() => {
    const dummyData = {};
    
    // For attribute-based nodes
    Object.keys(Attribute).forEach(attr => {
      dummyData[attr] = generateDummyClasses(attr, 15);
    });
    
    // For course selection nodes
    initialTreeData.forEach(node => {
      if (node.chooseNClasses && node.chooseNClasses.length) {
        dummyData[`choose_${node.id}`] = node.chooseNClasses.map(courseId => {
          // Randomly assign 1-2 attributes for variety
          const attrKeys = Object.keys(Attribute);
          const numAttrs = Math.floor(Math.random() * 2) + 1;
          const courseAttributes = [];
          for (let j = 0; j < numAttrs; j++) {
            const randomAttr = attrKeys[Math.floor(Math.random() * attrKeys.length)];
            if (!courseAttributes.includes(randomAttr)) {
              courseAttributes.push(randomAttr);
            }
          }
          
          return {
            id: `course-${courseId}`,
            code: `CSCI ${courseId}`,
            name: `Advanced Course ${courseId}`,
            professor: "Dr. Smith",
            credits: 3,
            days: ["Mon", "Wed", "Fri"],
            time: "10:00 AM - 11:15 AM",
            rating: (Math.random() * 4 + 1).toFixed(1),
            completed: false,
            capacity: Math.floor(Math.random() * 30) + 20,
            enrolled: Math.floor(Math.random() * 20),
            attributes: courseAttributes,
            location: `Building ${Math.floor(Math.random() * 10) + 1}, Room ${Math.floor(Math.random() * 300) + 100}`,
            description: `This course covers advanced topics in computer science focusing on specific algorithms, data structures, and programming paradigms relevant to this domain.`
          };
        });
      }
    });
    
    setDummyClassData(dummyData);
    setFilteredCourseData(dummyData); // Initialize filtered data with full data
  }, []);

  // Calculate completed credits when relevant state changes
  useEffect(() => {
    let completed = 0;
    
    initialTreeData.forEach(node => {
      if (completedNodes[node.id] && node.numberValue && !node.chooseNClasses) {
        completed += node.numberValue;
      } else if (node.numberValue && nodeInputValues[node.id]) {
        completed += Math.min(parseInt(nodeInputValues[node.id]) || 0, node.numberValue);
      }
      
      // Add credits from completed classes for attribute nodes
      if (node.attributes && node.attributes.length > 0) {
        const attr = node.attributes[0];
        const attrCompletedClasses = completedClasses[attr] || [];
        
        if (attrCompletedClasses.length > 0 && filteredCourseData[attr]) {
          const attrCredits = attrCompletedClasses.reduce((total, classId) => {
            const course = filteredCourseData[attr].find(c => c.id === classId);
            return total + (course ? course.credits : 0);
          }, 0);
          
          // If this node has a numberValue, only count up to that value
          if (node.numberValue) {
            const inputValue = parseInt(nodeInputValues[node.id]) || 0;
            const remainingNeeded = Math.max(0, node.numberValue - inputValue);
            completed += Math.min(attrCredits, remainingNeeded);
          } else {
            completed += attrCredits;
          }
        }
      }
    });
    
    setCompletedCredits(completed);
  }, [completedNodes, nodeInputValues, completedClasses, filteredCourseData]);

  // Scroll to selected node
  useEffect(() => {
    if (selectedNode && nodeRefs.current[selectedNode]) {
      nodeRefs.current[selectedNode].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [selectedNode]);

  // Filter course data when search terms change
  useEffect(() => {
    const newFilteredData = { ...dummyClassData };
    
    Object.keys(courseSearchTerms).forEach(key => {
      const searchTerm = courseSearchTerms[key].toLowerCase().trim();
      if (searchTerm && dummyClassData[key]) {
        newFilteredData[key] = dummyClassData[key].filter(course => 
          course.name.toLowerCase().includes(searchTerm) || 
          course.code.toLowerCase().includes(searchTerm) ||
          course.professor.toLowerCase().includes(searchTerm)
        );
      }
    });
    
    setFilteredCourseData(newFilteredData);
  }, [courseSearchTerms, dummyClassData]);

  // Handle node expansion toggle
  const toggleExpand = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Handle course expansion toggle
  const toggleCourseExpand = (courseKey) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseKey]: !prev[courseKey]
    }));
  };

  // Handle node completion toggle
  const toggleComplete = (nodeId) => {
    setCompletedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Handle class selection for "choose N" nodes
  const toggleClassSelection = (nodeId, classId, attribute = null) => {
    setSelectedClasses(prev => {
      const currentSelected = prev[nodeId] || [];
      if (currentSelected.includes(classId)) {
        return {
          ...prev,
          [nodeId]: currentSelected.filter(id => id !== classId)
        };
      } else {
        // Check if we've already selected the max number
        const node = initialTreeData.find(n => n.id === nodeId);
        if (node && node.numberValue && currentSelected.length >= node.numberValue) {
          // Replace the oldest selection
          return {
            ...prev,
            [nodeId]: [...currentSelected.slice(1), classId]
          };
        } else {
          return {
            ...prev,
            [nodeId]: [...currentSelected, classId]
          };
        }
      }
    });
  };

  // New function to toggle class completion status
  const toggleClassCompletion = (attribute, classId) => {
    setCompletedClasses(prev => {
      const currentCompleted = prev[attribute] || [];
      if (currentCompleted.includes(classId)) {
        return {
          ...prev,
          [attribute]: currentCompleted.filter(id => id !== classId)
        };
      } else {
        return {
          ...prev,
          [attribute]: [...currentCompleted, classId]
        };
      }
    });
    
    // Update node input values for related attribute nodes
    initialTreeData.forEach(node => {
      if (node.attributes && node.attributes.includes(attribute)) {
        // We'll update these values in the useEffect for credits calculation
        // This ensures we're reflecting completed classes in the progress UI
      }
    });
  };

  // Handle input change for number value nodes
  const handleInputChange = (nodeId, value) => {
    const node = initialTreeData.find(n => n.id === nodeId);
    let numValue = parseInt(value) || 0;
    
    // Ensure the value is not negative
    numValue = Math.max(0, numValue);
    
    // Clamp value to the node's numberValue
    const clampedValue = node && node.numberValue 
      ? Math.min(numValue, node.numberValue)
      : numValue;
    
    setNodeInputValues(prev => ({
      ...prev,
      [nodeId]: clampedValue.toString()
    }));
  };

  // Handle specialization selection
  const handleSpecializationChange = (nodeId, childId) => {
    setSelectedSpecialization(prev => ({
      ...prev,
      [nodeId]: childId
    }));
    
    // Automatically expand the selected specialization
    setExpandedNodes(prev => ({
      ...prev,
      [childId]: true
    }));
  };

  // Handle course search term change
  const handleCourseSearchChange = (key, value) => {
    setCourseSearchTerms(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset view
  const resetView = () => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  };

  // Zoom in
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  // Zoom out
  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  // Handle node click to select
  const handleNodeClick = (nodeId) => {
    setSelectedNode(nodeId);
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    if (totalCredits === 0) return 0;
    return Math.min(100, Math.max(0, (completedCredits / totalCredits) * 100));
  };
  
  // User data for context
  const userData = {
    completedNodes,
    selectedClasses,
    completedClasses,
    nodeInputValues,
    selectedSpecialization,
    nodeMap,
    filteredCourseData,
    totalCredits,
    completedCredits
  };
  
  // Main render function
  return (
    <AssistantProvider 
      userData={userData} 
      messages={assistantMessages} 
      setMessages={setAssistantMessages}
      isTyping={isAssistantTyping}
      setIsTyping={setIsAssistantTyping}
    >
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Degree Requirements Explorer</h1>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={zoomOut}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={20} />
              </button>
              <span className="text-gray-600">{Math.round(zoom * 100)}%</span>
              <button 
                onClick={zoomIn}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={20} />
              </button>
              <button 
                onClick={resetView}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors ml-2"
                title="Reset View"
              >
                <Home size={20} />
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Navigation Tabs */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex space-x-1">
                <button 
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "tree" 
                      ? "bg-blue-500 text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("tree")}
                >
                  <Layers size={16} className="inline-block mr-1 mb-0.5" />
                  Tree View
                </button>
                <button 
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "progress" 
                      ? "bg-blue-500 text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("progress")}
                >
                  <BarChart size={16} className="inline-block mr-1 mb-0.5" />
                  Progress
                </button>
                <button 
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "assistant" 
                      ? "bg-blue-500 text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab("assistant")}
                >
                  <Bot size={16} className="inline-block mr-1 mb-0.5" />
                  Assistant
                </button>
              </div>
            </div>
            
            {/* Progress Summary */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-sm font-medium text-gray-600 mb-2">Degree Progress</h2>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex justify-between">
                <span>{completedCredits} of {totalCredits} credits</span>
                <span>{Math.round(getProgressPercentage())}% complete</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-sm font-medium text-gray-600 mb-3">Legend</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span className="text-sm">Completed</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="text-blue-500 mr-2" />
                  <span className="text-sm">In Progress</span>
                </div>
                <div className="flex items-center">
                  <Circle size={16} className="text-gray-300 mr-2" />
                  <span className="text-sm">Not Started</span>
                </div>
              </div>
            </div>
            
            {/* Attribute Legend */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-sm font-medium text-gray-600 mb-3">Attribute Types</h2>
              <div className="space-y-2">
                {Object.keys(AttributeColors).map(attr => (
                  <div key={attr} className="flex items-center text-xs">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${AttributeColors[attr].bg}`}></span>
                    <span>{Attribute[attr]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* View Options */}
            <div className="p-4 mt-auto border-t border-gray-200">
              <h2 className="text-sm font-medium text-gray-600 mb-3">View Options</h2>
              <div className="space-y-2">
                <div 
                  className={`p-2 rounded cursor-pointer ${viewMode === "modern" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => setViewMode("modern")}
                >
                  <span className="text-sm font-medium">Modern View</span>
                </div>
                <div 
                  className={`p-2 rounded cursor-pointer ${viewMode === "compact" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => setViewMode("compact")}
                >
                  <span className="text-sm font-medium">Compact View</span>
                </div>
                <div 
                  className={`p-2 rounded cursor-pointer ${viewMode === "detailed" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => setViewMode("detailed")}
                >
                  <span className="text-sm font-medium">Detailed View</span>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Main View Area */}
          <main 
            className="flex-1 overflow-auto relative"
            ref={containerRef}
          >
            <div className={activeTab === "tree" ? "block" : "hidden"}>
              <TreeView 
                treeData={treeData}
                expandedNodes={expandedNodes}
                expandedCourses={expandedCourses}
                completedNodes={completedNodes}
                selectedClasses={selectedClasses}
                completedClasses={completedClasses}
                nodeInputValues={nodeInputValues}
                selectedSpecialization={selectedSpecialization}
                selectedNode={selectedNode}
                hoveredNode={hoveredNode}
                courseSearchTerms={courseSearchTerms}
                filteredCourseData={filteredCourseData}
                nodeMap={nodeMap}
                zoom={zoom}
                toggleExpand={toggleExpand}
                toggleCourseExpand={toggleCourseExpand}
                toggleComplete={toggleComplete}
                toggleClassSelection={toggleClassSelection}
                toggleClassCompletion={toggleClassCompletion}
                handleInputChange={handleInputChange}
                handleSpecializationChange={handleSpecializationChange}
                handleCourseSearchChange={handleCourseSearchChange}
                handleNodeClick={handleNodeClick}
                setHoveredNode={setHoveredNode}
                nodeRefs={nodeRefs}
              />
            </div>
            
            <div className={`${activeTab === "progress" ? "block" : "hidden"} h-full`}>
              <ProgressView 
                nodeMap={nodeMap}
                completedNodes={completedNodes}
                nodeInputValues={nodeInputValues}
                selectedClasses={selectedClasses}
                completedClasses={completedClasses}
                selectedSpecialization={selectedSpecialization}
                totalCredits={totalCredits}
                completedCredits={completedCredits}
                setSelectedNode={setSelectedNode}
                setActiveTab={setActiveTab}
                handleSpecializationChange={handleSpecializationChange}
              />
            </div>
            
            <div className={`${activeTab === "assistant" ? "block" : "hidden"} h-full`}>
              <Assistant 
                assistantMessages={assistantMessages}
                isAssistantTyping={isAssistantTyping}
                userMessage={userMessage}
                setUserMessage={setUserMessage}
              />
            </div>
          </main>
        </div>
      </div>
    </AssistantProvider>
  );
};

export default CourseTree;