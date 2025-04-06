import React, { useEffect, useRef } from 'react';
import { 
  ChevronDown, ChevronRight, CheckCircle, Users, Calendar, 
  Clock, Search, Info, Check, BookOpen
} from 'lucide-react';
import { 
  getNodeType, 
  formatCourseName, 
  getNodeStatusClass, 
  getNodeStatusIcon, 
  renderAttributeTag, 
  AttributeColors
} from './utils';

// Import the Attribute enum from the API
import { Attribute } from '../services/api';

const TreeView = ({
  treeData,
  expandedNodes,
  expandedCourses,
  completedNodes,
  selectedClasses,
  completedClasses,
  nodeInputValues,
  selectedSpecialization,
  selectedNode,
  hoveredNode,
  courseSearchTerms,
  filteredCourseData,
  nodeMap,
  zoom,
  toggleExpand,
  toggleCourseExpand,
  toggleComplete,
  toggleClassSelection,
  toggleClassCompletion,
  handleInputChange,
  handleSpecializationChange,
  handleCourseSearchChange,
  handleNodeClick,
  setHoveredNode,
  nodeRefs,
  viewMode
}) => {
  // Render attribute-based course browser
  const renderAttributeCourseBrowser = (node, attribute) => {
    const courseKey = `attr_${node.id}`;
    const isExpanded = expandedCourses[courseKey];
    const searchTerm = courseSearchTerms[attribute] || "";
    const courses = filteredCourseData[attribute] || [];
    
    return (
      <div className="mt-3">
        <button 
          onClick={(e) => { e.stopPropagation(); toggleCourseExpand(courseKey); }}
          className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex justify-between items-center border border-gray-200 transition-colors duration-150"
        >
          <span className="font-medium">Browse compatible courses</span>
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>
        
        {isExpanded && (
          <div className="mt-3 border rounded-lg overflow-hidden bg-white shadow-sm p-3">
            <div className="mb-3 flex items-center bg-gray-50 rounded-md border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <Search className="ml-2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search courses by name, code, or instructor..."
                className="w-full py-2 px-3 border-none bg-transparent focus:outline-none"
                value={searchTerm}
                onChange={(e) => handleCourseSearchChange(attribute, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {courses.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No courses found matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {courses.map(course => {
                  // Check if this course is selected for this node
                  const isSelected = selectedClasses[node.id]?.includes(course.id);
                  // Check if course is completed
                  const isCompleted = completedClasses[attribute]?.includes(course.id);
                  
                  return (
                    <div 
                      key={course.id} 
                      className={`border rounded-lg p-3 bg-white hover:shadow-md transition-shadow duration-200 ${
                        isSelected ? 'border-blue-500 bg-blue-50' : ''
                      } ${
                        isCompleted ? 'border-green-500 bg-green-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{course.code}: {course.name}</div>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                            {course.credits} credits
                          </div>
                          {course.instructorAvg && (
                            <div className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {course.instructorAvg.toFixed(1)}
                            </div>
                          )}
                          {course.attributes && course.attributes.map(attr => {
                            // Convert API attribute format (e.g., "A&H") to internal key (e.g., "AH")
                            const attrKey = Object.keys(Attribute).find(key => Attribute[key] === attr);
                            return attrKey && AttributeColors[attrKey] && (
                              <div key={attr} className={`px-2 py-1 text-xs rounded-full flex items-center ${AttributeColors[attrKey].bg} ${AttributeColors[attrKey].text} ${AttributeColors[attrKey].border}`}>
                                {AttributeColors[attrKey].icon}
                                <span className="ml-1">{attr}</span>
                              </div>
                            )
                          })}
                          
                          {/* Action buttons */}
                          <div className="flex gap-2">
                            {/* Selection button for adding to plan */}
                            <button
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                isSelected 
                                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                  : 'bg-gray-200 hover:bg-gray-300'
                              }`}
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                toggleClassSelection(node.id, course.id, attribute);
                              }}
                              title="Select for degree plan"
                            >
                              {isSelected ? <Check size={16} /> : <BookOpen size={16} />}
                            </button>
                            
                            {/* Completion button for marking as completed */}
                            <button
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                isCompleted 
                                  ? 'bg-green-500 text-white hover:bg-green-600' 
                                  : 'bg-gray-200 hover:bg-gray-300'
                              }`}
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                toggleClassCompletion(attribute, course.id);
                              }}
                              title="Mark as completed"
                            >
                              <CheckCircle size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2 grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <Users size={14} className="mr-1 flex-shrink-0" /> 
                          <span className="truncate">{course.instructor}</span>
                        </div>
                        {course.days && (
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1 flex-shrink-0" /> 
                            <span className="truncate">{course.days}</span>
                          </div>
                        )}
                        {course.time && (
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1 flex-shrink-0" /> 
                            <span className="truncate">{course.time}</span>
                          </div>
                        )}
                        {course.location && (
                          <div className="flex items-center">
                            <Info size={14} className="mr-1 flex-shrink-0" /> 
                            <span className="truncate">{course.location}</span>
                          </div>
                        )}
                      </div>
                      {course.description && (
                        <div className="mt-3 text-sm text-gray-600 line-clamp-2">{course.description}</div>
                      )}
                      
                      {/* Completion status indicator */}
                      {isCompleted && (
                        <div className="mt-2 flex items-center text-green-600 text-sm">
                          <CheckCircle size={14} className="mr-1" />
                          <span>Completed</span>
                        </div>
                      )}
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

  // Render modern view of a node
  const renderModernNode = (node, level = 0) => {
    if (!node) return null;
    
    // Determine if this node is a specialization option
    const isSpecializationOption = Object.values(nodeMap).some(n => 
      n.dropdownChildren && n.preRecs && n.preRecs.includes(node.id)
    );

    // If this is a specialization option that's not selected, don't render it
    const parentNode = Object.values(nodeMap).find(n => 
      n.dropdownChildren && n.preRecs && n.preRecs.includes(node.id)
    );
    
    if (isSpecializationOption && parentNode && 
        selectedSpecialization[parentNode.id] && 
        selectedSpecialization[parentNode.id] !== node.id) {
      return null;
    }

    // Node type determination
    const nodeType = getNodeType(node);
    const isExpanded = expandedNodes[node.id];
    const hasChildren = node.preRecs && node.preRecs.length > 0;
    const statusClass = getNodeStatusClass(node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap);
    const statusIcon = getNodeStatusIcon(node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap);
    const isCompleted = getNodeStatusIcon(node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap).props.className.includes("green");
    const isSelected = selectedNode === node.id;
    const isHovered = hoveredNode === node.id;
    
    // Status determination for specific node types
    const selectedCount = nodeType === "choose" ? (selectedClasses[node.id]?.length || 0) : 0;
    const inputValue = parseInt(nodeInputValues[node.id] || '0');
    
    // For attribute nodes, calculate completed credits from selected classes and completed classes
    let attributeCreditsFromClasses = 0;
    let attributeCreditsFromCompleted = 0;
    
    if ((nodeType === "attribute" || nodeType === "attribute-with-number") && node.attributes) {
      const attr = node.attributes[0];
      const courses = filteredCourseData[attr] || [];
      
      // Credits from selected classes
      if (selectedClasses[node.id]) {
        attributeCreditsFromClasses = selectedClasses[node.id].reduce((total, classId) => {
          const course = courses.find(c => c.id === classId);
          return total + (course ? course.credits : 0);
        }, 0);
      }
      
      // Credits from completed classes
      if (completedClasses[attr]) {
        attributeCreditsFromCompleted = completedClasses[attr].reduce((total, classId) => {
          const course = courses.find(c => c.id === classId);
          return total + (course ? course.credits : 0);
        }, 0);
      }
    }
    
    // Combined progress calculation
    const totalValue = nodeType === "number" || nodeType === "attribute-with-number" ? node.numberValue : 0;
    const progress = totalValue 
      ? Math.min(100, Math.max(0, ((inputValue + attributeCreditsFromClasses + attributeCreditsFromCompleted) / totalValue) * 100))
      : 0;

    // Class data for attribute or choose nodes
    let classData = [];
    let courseKey = "";
    
    if (nodeType === "attribute" || nodeType === "attribute-with-number") {
      const attr = node.attributes[0];
      classData = filteredCourseData[attr] || [];
      courseKey = attr;
    } else if (nodeType === "choose") {
      classData = filteredCourseData[`choose_${node.id}`] || [];
      courseKey = `choose_${node.id}`;
    }

    // Base card classes
    let cardClasses = `relative transition-all duration-200 rounded-xl border-2 p-4 mb-4 ${statusClass} `;
    
    // Add selection and hover effects
    if (isSelected) {
      cardClasses += "ring-2 ring-offset-2 ring-blue-500 ";
    } else if (isHovered) {
      cardClasses += "border-blue-400 ";
    }
    
    // Add completion effect
    if (isCompleted) {
      cardClasses += "border-green-500 ";
    }

    return (
      <div 
        key={node.id} 
        className="relative"
        style={{ 
          marginLeft: `${level * 40}px`, 
          transitionProperty: "margin, opacity, transform",
          transitionDuration: "300ms",
          transitionTimingFunction: "ease",
        }}
        ref={el => {
          if (nodeRefs.current) {
            nodeRefs.current[node.id] = el;
          }
        }}
      >
        <div 
          className={cardClasses}
          onClick={() => handleNodeClick(node.id)}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          {/* Connection lines for children */}
          {hasChildren && isExpanded && (
            <div className="absolute left-6 top-full w-0.5 bg-gray-300 rounded" 
              style={{ height: `${node.preRecs.length * 20}px` }}>
            </div>
          )}
          
          {/* Node header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center">
                {/* Expand/collapse button */}
                {hasChildren && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
                    className="mr-2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none"
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}
                
                {/* Node title with appropriate formatting */}
                <h3 className={`text-lg font-medium flex-1 ${isCompleted ? 'text-green-700' : ''}`}>
                  {nodeType === "course" ? formatCourseName(node.titleValue) : node.titleValue}
                </h3>
              </div>

              {/* Attribute tags */}
              {(nodeType === "attribute" || nodeType === "attribute-with-number") && node.attributes && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {node.attributes.map(attr => renderAttributeTag(attr))}
                </div>
              )}
            </div>
            
            {/* Status icon */}
            <div 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (nodeType === "title" && !hasChildren || nodeType === "course") {
                  toggleComplete(node.id);
                }
              }}
              className={`ml-2 ${(nodeType === "title" && !hasChildren) || nodeType === "course" ? 'cursor-pointer' : ''}`}
            >
              {statusIcon}
            </div>
          </div>
          
          {/* Node content based on type */}
          <div className="mt-3">
            {/* Number value node with progress */}
            {(nodeType === "number" || nodeType === "attribute-with-number") && node.numberValue !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      value={nodeInputValues[node.id] || "0"} 
                      onChange={(e) => handleInputChange(node.id, e.target.value)} 
                      className="w-16 border rounded px-2 py-1 mr-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      max={node.numberValue}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>of {node.numberValue} credits completed</span>
                  </div>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                
                {/* Display credit total from selected and completed courses if applicable */}
                {(nodeType === "attribute-with-number") && (
                  <div className="text-sm text-gray-600 space-y-1">
                    {selectedClasses[node.id]?.length > 0 && (
                      <div>
                        <span>+ {attributeCreditsFromClasses} credits from selected courses</span>
                      </div>
                    )}
                    {node.attributes && completedClasses[node.attributes[0]]?.length > 0 && (
                      <div className="text-green-600">
                        <span>+ {attributeCreditsFromCompleted} credits from completed courses</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Animated progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Dropdown for specialization selection */}
            {nodeType === "dropdown" && (
              <div className="mt-3">
                <select
                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedSpecialization[node.id] || ''}
                  onChange={(e) => handleSpecializationChange(node.id, parseInt(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">Select an option</option>
                  {node.preRecs && node.preRecs.map(childId => {
                    const childNode = nodeMap[childId];
                    return childNode ? (
                      <option key={childId} value={childId}>
                        {childNode.titleValue}
                      </option>
                    ) : null;
                  })}
                </select>
              </div>
            )}
            
            {/* Course selection for chooseN nodes */}
            {nodeType === "choose" && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                  <span>Select {node.numberValue} course{node.numberValue > 1 ? 's' : ''}</span>
                  <span className={selectedCount >= node.numberValue ? "text-green-600 font-medium" : ""}>
                    {selectedCount} / {node.numberValue} selected
                  </span>
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleCourseExpand(`choose_${node.id}`); }}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg flex justify-between items-center border border-gray-200 transition-colors duration-150"
                >
                  <span className="font-medium">View available courses</span>
                  {expandedCourses[`choose_${node.id}`] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                
                {expandedCourses[`choose_${node.id}`] && (
                  <div className="mt-3 border rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="p-3 border-b">
                      <div className="flex items-center bg-gray-50 rounded-md border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                        <Search className="ml-2 text-gray-400" size={18} />
                        <input
                          type="text"
                          placeholder="Search courses..."
                          className="w-full py-2 px-3 border-none bg-transparent focus:outline-none"
                          value={courseSearchTerms[`choose_${node.id}`] || ""}
                          onChange={(e) => handleCourseSearchChange(`choose_${node.id}`, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    {classData.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No courses found matching your search.</div>
                    ) : (
                      classData.map(course => (
                        <div key={course.id} className="border-b last:border-b-0">
                          <div 
                            className={`p-3 hover:bg-gray-50 flex justify-between items-center cursor-pointer transition-colors ${
                              selectedClasses[node.id]?.includes(course.id) ? 'bg-blue-50' : ''
                            }`}
                            onClick={(e) => { e.stopPropagation(); toggleClassSelection(node.id, course.id); }}
                          >
                            <div>
                              <div className="font-medium">{course.code}: {course.name || ''}</div>
                              <div className="text-sm text-gray-600 mt-1 flex items-center flex-wrap gap-2">
                                <span className="flex items-center">
                                  <Users size={14} className="mr-1" /> {course.instructor}
                                </span>
                                {course.days && (
                                  <span className="flex items-center">
                                    <Calendar size={14} className="mr-1" /> {course.days}
                                  </span>
                                )}
                                {course.time && (
                                  <span className="flex items-center">
                                    <Clock size={14} className="mr-1" /> {course.time}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="px-2 py-1 rounded bg-gray-100 text-sm">
                                <span className="font-medium">{course.credits}</span> credits
                              </div>
                              {course.attributes && course.attributes.map(attr => {
                                // Convert API attribute format to internal key
                                const attrKey = Object.keys(Attribute).find(key => Attribute[key] === attr);
                                return attrKey && AttributeColors[attrKey] && (
                                  <div key={attr} className={`px-2 py-1 text-xs rounded-full flex items-center ${AttributeColors[attrKey].bg} ${AttributeColors[attrKey].text} ${AttributeColors[attrKey].border}`}>
                                    {AttributeColors[attrKey].icon}
                                    <span className="ml-1">{attr}</span>
                                  </div>
                                )
                              })}
                              <div className={`w-6 h-6 rounded-full transition-colors ${
                                selectedClasses[node.id]?.includes(course.id) 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-200'
                              } flex items-center justify-center`}>
                                {selectedClasses[node.id]?.includes(course.id) && <CheckCircle size={16} />}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Attribute-based course selection */}
            {(nodeType === "attribute" || nodeType === "attribute-with-number") && node.attributes && (
              renderAttributeCourseBrowser(node, node.attributes[0])
            )}
            
            {/* Course node */}
            {nodeType === "course" && (
              <div className="mt-2 flex items-center">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Course ID: {node.courseID}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Children nodes */}
        {isExpanded && hasChildren && (
          <div className="pl-10 mt-2 space-y-2">
            {node.preRecs.map(childIdOrNode => {
              // Handle both ID references and Node objects
              const childId = typeof childIdOrNode === 'object' ? childIdOrNode.id : childIdOrNode;
              const childNode = typeof childIdOrNode === 'object' ? childIdOrNode : nodeMap[childId];
              
              if (!childNode) return null;
              
              // For dropdown nodes, only show children if a selection has been made
              if (nodeType === "dropdown") {
                // Only render the selected child
                if (selectedSpecialization[node.id] === childId) {
                  return renderModernNode(childNode, level + 1);
                }
                return null;
              }
              return renderModernNode(childNode, level + 1);
            })}
          </div>
        )}
      </div>
    );
  };

  // Render compact view of nodes
  const renderCompactNode = (node, level = 0) => {
    if (!node) return null;
    
    // The compact view logic would go here, similar to renderModernNode but more condensed
    // For now we're just using the modern view for all modes
    return renderModernNode(node, level);
  };

  // Render detailed view of nodes
  const renderDetailedNode = (node, level = 0) => {
    if (!node) return null;
    
    // The detailed view logic would go here, similar to renderModernNode but with more details
    // For now we're just using the modern view for all modes
    return renderModernNode(node, level);
  };

  // Choose the appropriate render function based on view mode
  const renderNode = (node, level = 0) => {
    switch (viewMode) {
      case "compact":
        return renderCompactNode(node, level);
      case "detailed":
        return renderDetailedNode(node, level);
      case "modern":
      default:
        return renderModernNode(node, level);
    }
  };

  return (
    <div 
      className="min-h-full p-6"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
        transition: 'transform 0.3s ease',
      }}
    >
      {treeData.map(node => renderNode(node))}
    </div>
  );
};

export default TreeView;