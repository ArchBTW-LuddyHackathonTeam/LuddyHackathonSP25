import React, { createContext, useContext, useState } from 'react';
import { sendMessageToAssistant } from '../services/api';

const AssistantContext = createContext();

export const useAssistant = () => useContext(AssistantContext);

export const AssistantProvider = ({ children, userData, messages, setMessages, isTyping, setIsTyping }) => {
  // Messages in the format [{role: "user", content: "..."}, {role: "assistant", content: "..."}]
  const [messageHistory, setMessageHistory] = useState([
    { 
      role: "assistant", 
      content: "Hello! I'm your degree planning assistant. I can help you with course recommendations, scheduling advice, and understanding your degree requirements. What can I help you with today?" 
    }
  ]);

  // Function to prepare a comprehensive summary of user progress data
  const prepareUserDataSummary = () => {
    if (!userData) return "No user data available";
    
    const {
      completedNodes,
      selectedClasses,
      completedClasses,
      nodeInputValues,
      selectedSpecialization,
      nodeMap,
      filteredCourseData,
      totalCredits
    } = userData;
  
    // Calculate actual completed credits (including selected courses)
    let actualCompletedCredits = 0;
    
    // Add credits from completed classes
    Object.entries(completedClasses || {}).forEach(([attribute, courseIds]) => {
      courseIds.forEach(courseId => {
        if (filteredCourseData[attribute]) {
          const course = filteredCourseData[attribute].find(c => c.id === courseId);
          if (course) {
            actualCompletedCredits += course.credits;
          }
        }
      });
    });
    
    // Add credits from selected classes
    Object.entries(selectedClasses || {}).forEach(([nodeId, courseIds]) => {
      courseIds.forEach(courseId => {
        // Find the node to determine the attribute or list type
        const node = nodeMap[nodeId];
        if (!node) return;
        
        let course = null;
        
        // For attribute nodes, look in the attribute data
        if (node.attributes && node.attributes.length > 0) {
          const attr = node.attributes[0];
          if (filteredCourseData[attr]) {
            course = filteredCourseData[attr].find(c => c.id === courseId);
          }
        }
        
        // For choose nodes, look in the choose data
        if (!course && filteredCourseData[`choose_${nodeId}`]) {
          course = filteredCourseData[`choose_${nodeId}`].find(c => c.id === courseId);
        }
        
        if (course) {
          actualCompletedCredits += course.credits;
        }
      });
    });
    
    // Add credits from manual inputs
    Object.entries(nodeInputValues || {}).forEach(([nodeId, valueStr]) => {
      const value = parseInt(valueStr) || 0;
      actualCompletedCredits += value;
    });
  
    // Begin building the summary
    let summary = `# User Degree Progress Summary\n\n`;
    
    // OVERALL PROGRESS with corrected credit count
    summary += `## Overall Progress\n`;
    const progressPercentage = Math.round((actualCompletedCredits / totalCredits) * 100);
    summary += `- Completed ${actualCompletedCredits} of ${totalCredits} credits (${progressPercentage}% complete)\n\n`;
  
    // SPECIALIZATION CHOICE
    summary += `## Selected Specialization\n`;
    if (Object.entries(selectedSpecialization || {}).length > 0) {
      Object.entries(selectedSpecialization).forEach(([nodeId, selectedId]) => {
        const node = nodeMap[nodeId];
        const selected = nodeMap[selectedId];
        if (node && selected) {
          summary += `- For ${node.titleValue || `Node ID: ${nodeId}`}: Selected "${selected.titleValue || `Node ID: ${selectedId}`}"\n`;
        }
      });
    } else {
      summary += `- No specialization selected yet\n`;
    }
    summary += `\n`;
  
    // COMPLETED REQUIREMENTS (with details)
    summary += `## Completed Degree Requirements\n`;
    let completedRequirementsList = [];
    
    // Add explicitly completed nodes
    if (Object.keys(completedNodes || {}).length > 0) {
      Object.keys(completedNodes).forEach(id => {
        const node = nodeMap[id];
        if (node) {
          completedRequirementsList.push({
            title: node.titleValue || `Node ID: ${id}`,
            credits: node.numberValue,
            attributes: node.attributes
          });
        }
      });
    }
    
    // Add nodes that are effectively completed via selected courses
    Object.entries(selectedClasses || {}).forEach(([nodeId, courseIds]) => {
      // Skip if already marked as completed
      if (completedNodes[nodeId]) return;
      
      const node = nodeMap[nodeId];
      if (!node) return;
      
      // For nodes with a specific number of required courses
      if (node.chooseNClasses && courseIds.length >= (node.numberValue || node.chooseNClasses.length)) {
        completedRequirementsList.push({
          title: node.titleValue || `Node ID: ${nodeId}`,
          credits: null,
          attributes: node.attributes,
          source: "Selected all required courses"
        });
      }
    });
    
    // Sort completed requirements alphabetically
    completedRequirementsList.sort((a, b) => a.title.localeCompare(b.title));
    
    // Output completed requirements
    if (completedRequirementsList.length > 0) {
      completedRequirementsList.forEach(req => {
        summary += `- ${req.title}`;
        
        if (req.credits) {
          summary += ` (${req.credits} credits)`;
        }
        
        if (req.attributes && req.attributes.length > 0) {
          summary += ` [${req.attributes.join(", ")}]`;
        }
        
        if (req.source) {
          summary += ` - ${req.source}`;
        }
        
        summary += `\n`;
      });
    } else {
      summary += `- No requirements marked as completed\n`;
    }
    summary += `\n`;
  
    // CREDITS COMPLETED BY REQUIREMENT
    summary += `## Credits Completed By Requirement\n`;
    Object.entries(nodeInputValues || {}).forEach(([nodeId, value]) => {
      const node = nodeMap[nodeId];
      if (node) {
        summary += `- ${node.titleValue}: ${value} of ${node.numberValue || 'unknown'} credits`;
        
        // Add attribute info if available
        if (node.attributes && node.attributes.length > 0) {
          summary += ` [${node.attributes.join(", ")}]`;
        }
        
        summary += `\n`;
      }
    });
    summary += `\n`;
  
    // SELECTED COURSES - More clearly labeled
    summary += `## Courses Completed:\n`;
    let hasSelectedCourses = false;
    
    if (Object.entries(selectedClasses || {}).length > 0) {
      Object.entries(selectedClasses).forEach(([nodeId, courseIds]) => {
        const node = nodeMap[nodeId];
        if (node && courseIds.length > 0) {
          hasSelectedCourses = true;
          summary += `### For requirement: ${node.titleValue || `Node ID: ${nodeId}`}\n`;
          
          courseIds.forEach(courseId => {
            // Find the course data
            let course = null;
            let courseLocation = "";
            
            // Check if this is an attribute-based requirement
            if (node.attributes && node.attributes.length > 0) {
              const attr = node.attributes[0];
              if (filteredCourseData[attr]) {
                course = filteredCourseData[attr].find(c => c.id === courseId);
                if (course) courseLocation = attr;
              }
            }
            
            // Check if this is a choose-from-list requirement
            if (!course && filteredCourseData[`choose_${nodeId}`]) {
              course = filteredCourseData[`choose_${nodeId}`].find(c => c.id === courseId);
              if (course) courseLocation = `choose_${nodeId}`;
            }
            
            if (course) {
              const isCompleted = completedClasses[courseLocation]?.includes(courseId);
              
              summary += `- ${course.code}: ${course.name || 'Unnamed Course'}`;
              summary += ` (${course.credits} credits, Instructor: ${course.instructor})`;
              
              if (course.attributes && course.attributes.length > 0) {
                summary += ` [${course.attributes.join(", ")}]`;
              }
              
              if (isCompleted) {
                summary += ` ✓ COMPLETED`;
              }
              
              if (course.days) {
                summary += `\n  Schedule: ${course.days} at ${course.time || 'TBD'}, Location: ${course.location || 'TBD'}\n`;
              }
              
              // Add a condensed description if available
              if (course.description) {
                const shortDesc = course.description.length > 100 
                  ? course.description.substring(0, 100) + '...' 
                  : course.description;
                summary += `  Description: ${shortDesc}\n`;
              }
            } else {
              summary += `- Course ID: ${courseId} (details not available)\n`;
            }
          });
          summary += `\n`;
        }
      });
    }
    
    if (!hasSelectedCourses) {
      summary += `- No courses selected yet\n`;
    }
    summary += `\n`;
  
    // COMPLETED COURSES WITH DETAILS
    summary += `## Completed Courses (Fully Finished)\n`;
    let hasCompletedCourses = false;
    
    if (Object.entries(completedClasses || {}).length > 0) {
      Object.entries(completedClasses).forEach(([attribute, courseIds]) => {
        if (courseIds.length > 0) {
          hasCompletedCourses = true;
          summary += `### Completed ${attribute} Courses\n`;
          
          courseIds.forEach(courseId => {
            // Find the course data
            let course = null;
            if (filteredCourseData[attribute]) {
              course = filteredCourseData[attribute].find(c => c.id === courseId);
            }
            
            if (course) {
              summary += `- ${course.code}: ${course.name || 'Unnamed Course'}`;
              summary += ` (${course.credits} credits, Instructor: ${course.instructor})`;
              if (course.attributes && course.attributes.length > 0) {
                summary += ` [${course.attributes.join(", ")}]`;
              }
              summary += `\n`;
            } else {
              summary += `- Course ID: ${courseId} (details not available)\n`;
            }
          });
          summary += `\n`;
        }
      });
    }
    
    if (!hasCompletedCourses) {
      summary += `- No courses marked as completed yet\n`;
    }
    summary += `\n`;
  
    // REMAINING REQUIREMENTS with clearer structure
    summary += `## Key Remaining Requirements\n`;
    let remainingRequirements = [];
    
    // Find key nodes that aren't completed
    Object.values(nodeMap).forEach(node => {
      // Skip nodes that are already completed
      if (completedNodes[node.id]) return;
      
      // Focus on important nodes (those with numberValue, attributes, or are course selections)
      if (node.numberValue || (node.attributes && node.attributes.length) || node.chooseNClasses) {
        // Calculate progress for this node
        let progress = 0;
        let total = 0;
        
        if (node.numberValue) {
          total = node.numberValue;
          progress = parseInt(nodeInputValues[node.id] || 0);
          
          // Add progress from selected/completed courses for attribute nodes
          if (node.attributes && node.attributes.length > 0) {
            const attr = node.attributes[0];
            
            // Add credits from selected courses
            if (selectedClasses[node.id]) {
              selectedClasses[node.id].forEach(courseId => {
                const course = filteredCourseData[attr]?.find(c => c.id === courseId);
                if (course) progress += course.credits;
              });
            }
            
            // Add credits from completed courses
            if (completedClasses[attr]) {
              completedClasses[attr].forEach(courseId => {
                const course = filteredCourseData[attr]?.find(c => c.id === courseId);
                if (course) progress += course.credits;
              });
            }
          }
        } else if (node.chooseNClasses) {
          total = node.numberValue || node.chooseNClasses.length;
          progress = (selectedClasses[node.id] || []).length;
        }
        
        // If there's still progress to be made, add to the remaining requirements
        if (total > 0 && progress < total) {
          const remaining = total - progress;
          remainingRequirements.push({
            id: node.id,
            title: node.titleValue,
            remaining,
            total,
            progress,
            attributes: node.attributes,
            isChoose: !!node.chooseNClasses,
            chooseOptions: node.chooseNClasses,
            type: node.attributes ? 'attribute' : (node.chooseNClasses ? 'choose' : 'number'),
            selectedCourses: selectedClasses[node.id] || []
          });
        } 
        // If progress equals or exceeds total, consider this requirement met
        else if (progress >= total) {
          return; // Skip this requirement as it's effectively complete
        }
      }
    });
    
    // Sort by progress percentage (ascending) so most lacking requirements come first
    remainingRequirements.sort((a, b) => {
      const pctA = a.progress / a.total;
      const pctB = b.progress / b.total;
      return pctA - pctB;
    });
    
    // Output the remaining requirements
    if (remainingRequirements.length > 0) {
      remainingRequirements.forEach(req => {
        summary += `- ${req.title}: ${req.progress} of ${req.total} complete`;
        
        if (req.attributes && req.attributes.length > 0) {
          summary += ` [${req.attributes.join(", ")}]`;
        }
        
        const percent = Math.round((req.progress / req.total) * 100);
        summary += ` (${percent}% complete)\n`;
        
        // For "choose from" requirements, list selected and available options separately
        if (req.isChoose && req.chooseOptions && req.chooseOptions.length > 0) {
          // Show already selected courses first
          if (req.selectedCourses && req.selectedCourses.length > 0) {
            summary += `  Already selected courses (${req.selectedCourses.length} of ${req.total}):\n`;
            
            // Get the course data from filteredCourseData
            const courseData = filteredCourseData[`choose_${req.id}`] || [];
            req.selectedCourses.forEach(selectedId => {
              const selectedCourse = courseData.find(c => c.id === selectedId);
              if (selectedCourse) {
                summary += `  * ✓ ${selectedCourse.code}: ${selectedCourse.name || 'Unnamed Course'}`;
                summary += ` (${selectedCourse.credits} credits, Instructor: ${selectedCourse.instructor})`;
                if (selectedCourse.attributes && selectedCourse.attributes.length > 0) {
                  summary += ` [${selectedCourse.attributes.join(", ")}]`;
                }
                if (selectedCourse.days) {
                  summary += `\n    Schedule: ${selectedCourse.days} at ${selectedCourse.time || 'TBD'}, Location: ${selectedCourse.location || 'TBD'}\n`;
                }
              } else {
                summary += `  * ✓ Course ID: ${selectedId} (details not available)\n`;
              }
            });
          }
          
          // Only show remaining options if we need more courses
          if (req.selectedCourses.length < req.total) {
            // Then show remaining available options
            summary += `  Additional options needed (${req.total - req.selectedCourses.length} more):\n`;
            
            // Get the course data from filteredCourseData
            const courseData = filteredCourseData[`choose_${req.id}`] || [];
            
            if (courseData.length > 0) {
              // Filter out already selected courses
              const availableCourses = courseData.filter(course => 
                !req.selectedCourses.includes(course.id)
              );
              
              if (availableCourses.length > 0) {
                availableCourses.forEach(course => {
                  summary += `  * ${course.code}: ${course.name || 'Unnamed Course'}`;
                  summary += ` (${course.credits} credits, Instructor: ${course.instructor})`;
                  if (course.attributes && course.attributes.length > 0) {
                    summary += ` [${course.attributes.join(", ")}]`;
                  }
                  if (course.days) {
                    summary += `\n    Schedule: ${course.days} at ${course.time || 'TBD'}, Location: ${course.location || 'TBD'}\n`;
                  }
                });
              } else {
                summary += `  * No additional options available\n`;
              }
            } else {
              // Fallback if course data isn't available
              summary += `  * Course options not available\n`;
            }
          }
          summary += `\n`;
        }
      });
    } else {
      summary += "- All key requirements satisfied.\n";
    }
    
    return summary;
  };

  // Send a message to the assistant and handle the entire conversation flow
  const sendMessageWithUserData = async (messageText) => {
    if (!messageText.trim()) return;
    
    // Create new user message
    let userContent = messageText;
    
    // Special handling for first user message - include user data
    if (messageHistory.length === 1) { // Only the initial assistant message exists
      const userDataSummary = prepareUserDataSummary();
      userContent = `${userDataSummary}\n\nUser query: ${messageText}`;
    }
    
    const userMessage = { role: "user", content: userContent };
    
    // Add user message to API message history
    const updatedHistory = [...messageHistory, userMessage];
    setMessageHistory(updatedHistory);
    
    // Add user message to UI in the original format
    setMessages(prev => [...prev, {
      sender: 'user',
      content: messageText,
      timestamp: new Date()
    }]);

    // Set typing indicator
    setIsTyping(true);
    
    try {
      // Send the message to the assistant API
      console.log(updatedHistory);
      const response = await sendMessageToAssistant(updatedHistory);
      
      // Add assistant response to message history for API
      const assistantResponse = response.message;
      setMessageHistory(prev => [...prev, assistantResponse]);
      
      // Add assistant response to UI messages
      setMessages(prev => [...prev, {
        sender: 'assistant',
        content: assistantResponse.content,
        timestamp: response.timestamp
      }]);
    } catch (error) {
      console.error('Error communicating with assistant API:', error);
      
      // Add a fallback error message
      setMessages(prev => [...prev, {
        sender: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again later.',
        timestamp: new Date()
      }]);
    } finally {
      // Turn off typing indicator
      setIsTyping(false);
    }
  };

  return (
    <AssistantContext.Provider value={{
      messageHistory,
      sendMessageWithUserData
    }}>
      {children}
    </AssistantContext.Provider>
  );
};