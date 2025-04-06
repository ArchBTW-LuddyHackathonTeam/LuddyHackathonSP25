import React, { useState, useEffect } from 'react';
import { 
  getNodeCompletion, 
  getNodeStatusIcon, 
  getNodeType 
} from './utils';
import { Attribute } from '../services/api';

const ProgressView = ({
  nodeMap,
  completedNodes,
  nodeInputValues,
  selectedClasses,
  completedClasses,
  selectedSpecialization,
  totalCredits,
  completedCredits,
  setSelectedNode,
  setActiveTab,
  handleSpecializationChange
}) => {
  // State for tracked categories
  const [categories, setCategories] = useState({
    generalEducation: null,
    majorRequirements: [],
    specialization: null
  });

  // Find nodes dynamically by title or function
  useEffect(() => {
    const findCategories = () => {
      // Get all top-level nodes
      const rootNodes = Object.values(nodeMap).filter(node => 
        !Object.values(nodeMap).some(n => 
          n.preRecs && (
            (Array.isArray(n.preRecs) && n.preRecs.includes(node.id)) ||
            (Array.isArray(n.preRecs) && n.preRecs.some(p => typeof p === 'object' && p.id === node.id))
          )
        )
      );

      // Find nodes by their title patterns
      let generalEducation = null;
      let majorRequirements = [];
      let specialization = null;

      Object.values(nodeMap).forEach(node => {
        if (node.titleValue) {
          // Look for General Education
          if (node.titleValue.includes("General Education") || 
              node.titleValue.includes("Gen Ed") || 
              node.titleValue.includes("Requirements")) {
            generalEducation = node;
          }
          
          // Look for Major Requirements
          if (node.titleValue.includes("Computer Science") || 
              node.titleValue.includes("Mathematics") ||
              node.titleValue.includes("Major") ||
              node.titleValue.includes("Core") ||
              (node.numberValue && node.titleValue.includes("credits"))) {
            majorRequirements.push(node);
          }
          
          // Look for Specialization
          if (node.titleValue.includes("Specialization") || 
              node.dropdownChildren) {
            specialization = node;
          }
        }
      });

      setCategories({
        generalEducation,
        majorRequirements: majorRequirements.filter(Boolean),
        specialization
      });
    };

    if (Object.keys(nodeMap).length > 0) {
      findCategories();
    }
  }, [nodeMap]);

  // Get progress percentage
  const getProgressPercentage = () => {
    if (totalCredits === 0) return 0;
    return Math.min(100, Math.max(0, (completedCredits / totalCredits) * 100));
  };

  // Calculate credits completed for a specific attribute
  const getAttributeCompletedCredits = (attribute) => {
    const attrClasses = completedClasses[attribute] || [];
    let credits = 0;
    
    // Find node with the specified attribute
    const nodes = Object.values(nodeMap).filter(node => 
      node.attributes && node.attributes.includes(attribute)
    );
    
    if (nodes.length > 0 && attrClasses.length > 0) {
      // We would need to get the course data here, but as a fallback
      // we can estimate based on typical credit values
      const courseData = {};
      
      // Check if we have filtered course data for this attribute
      Object.values(nodeMap).forEach(node => {
        if (node.attributes && node.attributes.includes(attribute)) {
          // For nodes with known credit values, we use those
          if (node.numberValue) {
            credits += Math.min(
              attrClasses.length * 3, // Assuming 3 credits per course
              node.numberValue // Cap at the required credits
            );
          } else {
            credits += attrClasses.length * 3; // Default to 3 credits per course
          }
        }
      });
    }
    
    return credits;
  };
  
  const progressPercentage = getProgressPercentage();
  const { generalEducation, majorRequirements, specialization } = categories;
  
  return (
    <div className="space-y-8 p-6">
      {/* Overall Progress */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Degree Progress</h2>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Overall Completion</span>
          <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="mt-4 text-center text-lg">
          <span className="font-bold text-blue-600">{completedCredits}</span>
          <span className="mx-1 text-gray-600">of</span>
          <span className="font-bold text-gray-700">{totalCredits}</span>
          <span className="ml-1 text-gray-600">total credits completed</span>
        </div>
      </div>
      
      {/* General Education Requirements */}
      {generalEducation && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">{generalEducation.titleValue}</h2>
          
          <div className="space-y-4">
            {generalEducation.preRecs && generalEducation.preRecs.map(childIdOrNode => {
              // Handle both ID references and Node objects
              const childId = typeof childIdOrNode === 'object' ? childIdOrNode.id : childIdOrNode;
              const child = typeof childIdOrNode === 'object' ? childIdOrNode : nodeMap[childId];
              
              if (!child) return null;
              
              const completion = getNodeCompletion(child, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap);
              const nodeType = getNodeType(child);
              const statusIcon = getNodeStatusIcon(child, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap);
              let progressValue = 0;
              
              if (nodeType === "number" || nodeType === "attribute-with-number") {
                const inputValue = parseInt(nodeInputValues[child.id]) || 0;
                
                // Include completed classes for attribute nodes
                let attributeCredits = 0;
                if (child.attributes && child.attributes.length > 0) {
                  const attr = child.attributes[0];
                  attributeCredits = getAttributeCompletedCredits(attr);
                }
                
                progressValue = child.numberValue ? 
                  Math.min(100, ((inputValue + attributeCredits) / child.numberValue) * 100) : 0;
              } else if (nodeType === "choose") {
                const selectedCount = selectedClasses[child.id]?.length || 0;
                progressValue = child.numberValue ? (selectedCount / child.numberValue) * 100 : 0;
              } else if (nodeType === "dropdown") {
                progressValue = selectedSpecialization[child.id] ? 50 : 0;
              } else {
                progressValue = completion === "complete" ? 100 : 0;
              }
              
              return (
                <div 
                  key={child.id} 
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedNode(child.id);
                    setActiveTab("tree");
                  }}
                >
                  <div className="flex-shrink-0">
                    {statusIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {child.titleValue}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Math.round(progressValue)}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className={`h-1.5 rounded-full ${
                          completion === "complete" ? "bg-green-500" : 
                          completion === "partial" ? "bg-blue-500" : "bg-gray-300"
                        }`}
                        style={{ width: `${progressValue}%` }}
                      ></div>
                    </div>
                    
                    {/* Display completed courses count for attribute nodes */}
                    {child.attributes && child.attributes.length > 0 && 
                      completedClasses[child.attributes[0]]?.length > 0 && (
                        <div className="mt-1 text-xs text-green-600">
                          {completedClasses[child.attributes[0]].length} courses completed
                        </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Major Requirements */}
      {majorRequirements.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Major Requirements</h2>
          
          <div className="space-y-4">
            {majorRequirements.map(req => {
              if (!req) return null;
              
              const completion = getNodeCompletion(req, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap);
              const inputValue = parseInt(nodeInputValues[req.id]) || 0;
              const progressValue = req.numberValue ? (inputValue / req.numberValue) * 100 : 0;
              
              return (
                <div 
                  key={req.id} 
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedNode(req.id);
                    setActiveTab("tree");
                  }}
                >
                  <div className="flex-shrink-0">
                    {getNodeStatusIcon(req, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {req.titleValue}
                      </p>
                      <p className="text-sm text-gray-500">
                        {req.numberValue ? `${inputValue}/${req.numberValue}` : ""}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className={`h-1.5 rounded-full ${
                          completion === "complete" ? "bg-green-500" : 
                          completion === "partial" ? "bg-blue-500" : "bg-gray-300"
                        }`}
                        style={{ width: `${progressValue}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Specialization */}
      {specialization && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">{specialization.titleValue}</h2>
          
          <div className="mb-4">
            <select
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
              value={selectedSpecialization[specialization.id] || ''}
              onChange={(e) => handleSpecializationChange(specialization.id, parseInt(e.target.value))}
            >
              <option value="">Select a specialization</option>
              {specialization.preRecs && specialization.preRecs.map(childIdOrNode => {
                // Handle both ID references and Node objects
                const childId = typeof childIdOrNode === 'object' ? childIdOrNode.id : childIdOrNode;
                const childNode = typeof childIdOrNode === 'object' ? childIdOrNode : nodeMap[childId];
                
                return childNode ? (
                  <option key={childId} value={childId}>
                    {childNode.titleValue}
                  </option>
                ) : null;
              })}
            </select>
          </div>
          
          {selectedSpecialization[specialization.id] && specialization.preRecs && (
            <div className="space-y-3">
              {specialization.preRecs
                .filter(childIdOrNode => {
                  const childId = typeof childIdOrNode === 'object' ? childIdOrNode.id : childIdOrNode;
                  return childId === selectedSpecialization[specialization.id];
                })
                .map(childIdOrNode => {
                  const childId = typeof childIdOrNode === 'object' ? childIdOrNode.id : childIdOrNode;
                  const childNode = typeof childIdOrNode === 'object' ? childIdOrNode : nodeMap[childId];
                  
                  if (!childNode) return null;
                  
                  return (
                    <div key={childId} className="space-y-2">
                      <h3 className="font-medium text-lg">{childNode.titleValue} Requirements</h3>
                      
                      <div className="space-y-2 pl-4">
                        {childNode.preRecs && childNode.preRecs.map(reqIdOrNode => {
                          const reqId = typeof reqIdOrNode === 'object' ? reqIdOrNode.id : reqIdOrNode;
                          const req = typeof reqIdOrNode === 'object' ? reqIdOrNode : nodeMap[reqId];
                          
                          if (!req) return null;
                          
                          return (
                            <div 
                              key={reqId} 
                              className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                setSelectedNode(reqId);
                                setActiveTab("tree");
                              }}
                            >
                              <div className="flex-shrink-0">
                                {getNodeStatusIcon(req, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap)}
                              </div>
                              <div className="text-sm font-medium">
                                {req.titleValue}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressView;