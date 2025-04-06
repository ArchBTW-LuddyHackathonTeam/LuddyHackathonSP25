/**
 * Service for interacting with the AI API
 * Replace the API_ENDPOINT with your actual endpoint when ready
 */

const API_ENDPOINT = 'https://your-ai-api-endpoint.com/chat';

/**
 * Send messages to the AI and get a response
 * @param {Array} messages - Array of message objects with {role, content}
 * @returns {Promise} - Promise resolving to response message
 */
export const sendToAI = async (messages) => {
  try {
    // For development, log the messages being sent
    console.log('Sending to AI:', messages);
    
    // In development mode or when API isn't available, return a simulated response
    if (process.env.NODE_ENV === 'development' || !API_ENDPOINT.includes('your-ai-api-endpoint')) {
      return simulateAIResponse(messages);
    }
    
    // When ready to integrate with a real endpoint:
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_API_KEY}` // Add your API key here
      },
      body: JSON.stringify({
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.message || data.choices[0].message;
  } catch (error) {
    console.error('Error communicating with AI:', error);
    return {
      role: 'assistant',
      content: 'I apologize, but I encountered an error processing your request. Please try again later.'
    };
  }
};

/**
 * Simulate AI responses for development/testing
 * @param {Array} messages - Array of message objects
 * @returns {Promise} - Promise resolving to a simulated response
 */
const simulateAIResponse = async (messages) => {
  // Extract the last user message
  const lastUserMessage = messages.findLast(msg => msg.role === 'user');
  const userQuery = lastUserMessage?.content || '';
  
  // Check for keywords to provide more relevant responses
  const lowerQuery = userQuery.toLowerCase();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Respond based on keywords in the query
  if (lowerQuery.includes('arts and humanities') || lowerQuery.includes('ah')) {
    return {
      role: 'assistant',
      content: "For Arts and Humanities requirements, I'd recommend HIST 210: World History or PHIL 240: Ethics. Both are highly rated by students and fulfill your A&H credits. Would you like more specific recommendations based on your interests?"
    };
  } else if (lowerQuery.includes('software engineering') && lowerQuery.includes('systems')) {
    return {
      role: 'assistant',
      content: "The Software Engineering specialization focuses on database systems, software development methodologies, and information systems. It's great for careers in application development and project management. The Systems specialization emphasizes computer architecture, operating systems, and low-level programming, preparing you for careers in systems administration, embedded systems, or performance optimization. Based on your current course selections, you seem to be leaning toward Software Engineering."
    };
  } else if (lowerQuery.includes('progress')) {
    return {
      role: 'assistant',
      content: "Based on your current progress, you've completed about 65% of your degree requirements. You're doing well on core CS courses, but still need to complete 6 more credits of Arts & Humanities and select a specialization. At your current pace, you should be able to graduate in 3 more semesters."
    };
  } else if (lowerQuery.includes('difficult') || lowerQuery.includes('challenging')) {
    return {
      role: 'assistant',
      content: "Among your remaining requirements, CSCI-C 343 Data Structures is typically considered the most challenging. Students report spending 10-15 hours per week on assignments. I'd recommend taking this course in a semester when your other course load is lighter. Would you like some study resources for this class?"
    };
  } else {
    // Generic response
    return {
      role: 'assistant',
      content: "Thank you for your question. I've analyzed your degree progress and can see you're making good progress. Is there a specific aspect of your degree plan you'd like more information about? I can help with course recommendations, specialization choices, or graduation requirements."
    };
  }
};