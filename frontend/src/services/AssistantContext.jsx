import React, { createContext, useContext, useState } from 'react';

const AssistantContext = createContext();

export const useAssistant = () => useContext(AssistantContext);

export const AssistantProvider = ({ children, userData, messages, setMessages, isTyping, setIsTyping }) => {
  // Messages in the format [{role: "user", content: "..."}, {role: "assistant", content: "..."}]
  const [messageHistory, setMessageHistory] = useState([
    { role: "assistant", content: "Hello! I'm your degree planning assistant. I can help you with course recommendations, scheduling advice, and understanding your degree requirements. What can I help you with today?" }
  ]);

  // Function to get assistant responses based on user input
  const getAssistantResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
      return "Based on your progress, I'd recommend focusing on completing your General Education Requirements first, particularly the Arts and Humanities courses. HIST 101 (Introduction to History) has great reviews and fulfills the A&H requirement.";
    } else if (lowerMessage.includes('specialization') || lowerMessage.includes('focus')) {
      return "For Computer Science, you have two specialization options: Software Engineering and Systems. Software Engineering focuses more on development methodology and large-scale applications, while Systems delves deeper into hardware interactions and optimization. Based on your current courses, Software Engineering might align better with your interests.";
    } else if (lowerMessage.includes('progress') || lowerMessage.includes('how am i doing')) {
      return "You're making good progress! You've completed about 42% of your degree requirements. To stay on track for graduation in 4 years, try to complete at least 30 credits per academic year.";
    } else if (lowerMessage.includes('difficult') || lowerMessage.includes('hard') || lowerMessage.includes('challenging')) {
      return "Some of the more challenging courses in your upcoming requirements might be CSCI 403 (Advanced Algorithms) and MATH 375 (Linear Algebra). I'd recommend balancing your schedule by not taking both in the same semester.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! How can I assist with your degree planning today? I can help with course recommendations, requirement explanations, or scheduling advice.";
    } else {
      return "I understand you're asking about your degree plan. To give you more specific guidance, could you tell me what aspect you're interested in? For example, I can help with course recommendations, scheduling, or explaining specific requirements.";
    }
  };

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
      totalCredits,
      completedCredits
    } = userData;

    let summary = `# User Degree Progress Summary\n\n`;
    
    // OVERALL PROGRESS
    summary += `## Overall Progress\n`;
    summary += `- Completed ${completedCredits} of ${totalCredits} credits (${Math.round((completedCredits / totalCredits) * 100)}% complete)\n\n`;

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
    if (Object.keys(completedNodes || {}).length > 0) {
      Object.keys(completedNodes).sort().forEach(id => {
        const node = nodeMap[id];
        if (node) {
          summary += `- ${node.titleValue || `Node ID: ${id}`}`;
          
          // Add any additional information about the node
          if (node.numberValue) {
            summary += ` (${node.numberValue} credits)`;
          }
          
          if (node.attributes && node.attributes.length > 0) {
            summary += ` [${node.attributes.join(", ")}]`;
          }
          
          summary += `\n`;
        }
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

    // SELECTED COURSES WITH DETAILS
    summary += `## Detailed Selected Courses\n`;
    if (Object.entries(selectedClasses || {}).length > 0) {
      Object.entries(selectedClasses).forEach(([nodeId, courseIds]) => {
        const node = nodeMap[nodeId];
        if (node && courseIds.length > 0) {
          summary += `### For requirement: ${node.titleValue || `Node ID: ${nodeId}`}\n`;
          
          courseIds.forEach(courseId => {
            // Find the course data
            let course = null;
            
            // Check if this is an attribute-based requirement
            if (node.attributes && node.attributes.length > 0) {
              const attr = node.attributes[0];
              if (filteredCourseData[attr]) {
                course = filteredCourseData[attr].find(c => c.id === courseId);
              }
            }
            
            // Check if this is a choose-from-list requirement
            if (!course && filteredCourseData[`choose_${nodeId}`]) {
              course = filteredCourseData[`choose_${nodeId}`].find(c => c.id === courseId);
            }
            
            if (course) {
              summary += `- ${course.code}: ${course.name}`;
              summary += ` (${course.credits} credits, Professor: ${course.professor})`;
              if (course.attributes && course.attributes.length > 0) {
                summary += ` [${course.attributes.join(", ")}]`;
              }
              summary += `\n  Schedule: ${course.days.join(", ")} at ${course.time}, Location: ${course.location}\n`;
              
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
    } else {
      summary += `- No courses selected yet\n`;
    }
    summary += `\n`;

    // COMPLETED COURSES WITH DETAILS
    summary += `## Detailed Completed Courses\n`;
    if (Object.entries(completedClasses || {}).length > 0) {
      Object.entries(completedClasses).forEach(([attribute, courseIds]) => {
        if (courseIds.length > 0) {
          summary += `### Completed ${attribute} Courses\n`;
          
          courseIds.forEach(courseId => {
            // Find the course data
            let course = null;
            if (filteredCourseData[attribute]) {
              course = filteredCourseData[attribute].find(c => c.id === courseId);
            }
            
            if (course) {
              summary += `- ${course.code}: ${course.name}`;
              summary += ` (${course.credits} credits, Professor: ${course.professor})`;
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
    } else {
      summary += `- No courses marked as completed yet\n`;
    }
    summary += `\n`;

    // REMAINING REQUIREMENTS
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
            type: node.attributes ? 'attribute' : (node.chooseNClasses ? 'choose' : 'number')
          });
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
    remainingRequirements.forEach(req => {
      summary += `- ${req.title}: ${req.progress} of ${req.total} complete`;
      
      if (req.attributes && req.attributes.length > 0) {
        summary += ` [${req.attributes.join(", ")}]`;
      }
      
      const percent = Math.round((req.progress / req.total) * 100);
      summary += ` (${percent}% complete)\n`;
      
      // For "choose from" requirements, list all available options
      if (req.isChoose && req.chooseOptions && req.chooseOptions.length > 0) {
        summary += `  Available options:\n`;
        
        // Get the course data from filteredCourseData
        const courseData = filteredCourseData[`choose_${req.id}`] || [];
        
        if (courseData.length > 0) {
          courseData.forEach(course => {
            summary += `  * ${course.code}: ${course.name}`;
            summary += ` (${course.credits} credits, Professor: ${course.professor})`;
            if (course.attributes && course.attributes.length > 0) {
              summary += ` [${course.attributes.join(", ")}]`;
            }
            summary += `\n    Schedule: ${course.days.join(", ")} at ${course.time}, Location: ${course.location}\n`;
          });
        } else {
          // Fallback if course data isn't available
          req.chooseOptions.forEach(courseId => {
            summary += `  * Course ID: ${courseId}\n`;
          });
        }
        summary += `\n`;
      }
    });
    
    // Add a blank line at the end for readability
    if (remainingRequirements.length === 0) {
      summary += "- All key requirements satisfied.\n";
    }
    
    return summary;
  };

  // Send a message to the assistant and handle the entire conversation flow
  const sendMessageWithUserData = (messageText) => {
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
    
    // Log the conversation history that would be sent to the API
    console.log("Messages that would be sent to AI:", updatedHistory);
    
    // Simulate assistant response with delay
    setTimeout(() => {
      // Add assistant response to message history for API
      const assistantResponse = { role: "assistant", content: getAssistantResponse(messageText) };
      setMessageHistory(prev => [...prev, assistantResponse]);
      
      // Add assistant response to UI messages
      setMessages(prev => [...prev, {
        sender: 'assistant',
        content: assistantResponse.content,
        timestamp: new Date()
      }]);
      
      // Turn off typing indicator
      setIsTyping(false);
    }, 1500);
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