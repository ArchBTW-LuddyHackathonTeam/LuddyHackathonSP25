/**
 * API Service for the Degree Requirements Explorer
 * Contains functions for fetching nodes, classes, and interacting with the AI assistant
 */

// Type definitions
export interface Node {
  id: number;
  titleValue?: string;
  numberValue?: number;
  attributes?: Attribute[];
  chooseNClasses?: number[];
  courseID?: number;
  dropdownChildren?: boolean;
  department?: string;
  preRecs: number[] | Node[]; // Can be an array of IDs or Node objects depending on context
}

export enum Attribute {
  AH = "A&H",
  SH = "S&H",
  WC = "World Culture",
  WL = "World Language",
  NM = "N&M",
  IW = "Intensive Writing",
  EC = "English Composition",
  MM = "Mathematical Modeling",
}

export interface Class {
  id?: string;
  code: string;
  credits: number;
  description: string;
  instructionMode: string;
  attributes: string[];
  terms: string[];
  days?: string;
  time?: string;
  instructor: string;
  instructorAvg: number;
  name?: string; // Used in front-end but not required from API
  location?: string; // Used in front-end but not required from API
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// API Endpoints - TODO: Replace with actual endpoints
const API_BASE_URL = 'https://your-api-base-url.com/api';
const NODE_ENDPOINT = `${API_BASE_URL}/nodes`;
const CLASS_ENDPOINT = `${API_BASE_URL}/classes`;
const CHAT_ENDPOINT = `${API_BASE_URL}/chat`;

/**
 * Get a single node by ID
 * @param id - The node ID
 * @returns Promise resolving to a Node object with preReqs as IDs
 * 
 * TODO: 
 * - Make a GET request to `${NODE_ENDPOINT}/${id}`
 * - Handle error cases (404, etc.)
 * - Return the node data with preRecs as an array of IDs
 */
export const getNodeById = async (id: number): Promise<Node> => {
  // TODO: Implement this function
  throw new Error("Not implemented");
};

/**
 * Get root nodes (entry points for degree plans)
 * @returns Promise resolving to an array of root Node objects
 * 
 * TODO:
 * - Make a GET request to fetch root nodes (nodes that aren't prerequisites for any other node)
 * - Return them as an array of Node objects
 */
export const getRootNodes = async (): Promise<Node[]> => {
  // TODO: Implement this function
  throw new Error("Not implemented");
};

/**
 * Build the full degree tree starting from a root node ID
 * @param rootId - The ID of the root node
 * @returns Promise resolving to a fully populated Node tree
 * 
 * TODO:
 * - Create a recursive function that:
 *   1. Gets a node by ID
 *   2. For each prerequisite ID, recursively fetches that node
 *   3. Replaces the preRecs array of IDs with the fetched Node objects
 * - Handle circular references if they exist
 * - Make sure to handle errors gracefully
 */
export const buildDegreeTree = async (rootId: number): Promise<Node> => {
  // TODO: Implement this function
  throw new Error("Not implemented");
};

/**
 * Get classes that have a specific attribute
 * @param attribute - The attribute code (e.g., "AH", "SH")
 * @returns Promise resolving to an array of Class objects with the specified attribute
 * 
 * TODO:
 * - Make a GET request to get classes filtered by the specified attribute
 * - Return them as an array of Class objects
 */
export const getClassesByAttribute = async (attribute: string): Promise<Class[]> => {
  // TODO: Implement this function
  throw new Error("Not implemented");
};

/**
 * Get classes by their course IDs
 * @param courseIds - Array of course IDs
 * @returns Promise resolving to an array of Class objects matching the course IDs
 * 
 * TODO:
 * - Make a GET request with the course IDs as query parameters
 * - Format the request appropriately (e.g., ?ids=123&ids=456&ids=789)
 * - Return them as an array of Class objects
 */
export const getClassesByCourseIds = async (courseIds: number[]): Promise<Class[]> => {
  // TODO: Implement this function
  throw new Error("Not implemented");
};

/**
 * Search for classes across all attributes and departments
 * @param query - Search term
 * @returns Promise resolving to an array of Class objects matching the search term
 * 
 * TODO:
 * - Make a GET request to search for classes containing the query in their name, code, instructor, etc.
 * - URL encode the query parameter
 * - Return them as an array of Class objects
 */
export const searchClasses = async (query: string): Promise<Class[]> => {
  // TODO: Implement this function
  throw new Error("Not implemented");
};

/**
 * Get classes for a specific department
 * @param department - Department code (e.g., "CSCI", "MATH")
 * @returns Promise resolving to an array of Class objects from the specified department
 * 
 * TODO:
 * - Make a GET request to fetch classes from the specified department
 * - Return them as an array of Class objects
 */
export const getClassesByDepartment = async (department: string): Promise<Class[]> => {
  // TODO: Implement this function
  throw new Error("Not implemented");
};

/**
 * Send messages to the AI assistant and get a response
 * @param messages - Array of message objects with {role, content}
 * @param userData - Optional user data context to provide to the assistant
 * @returns Promise resolving to response message
 * 
 * TODO:
 * - Make a POST request to the chat endpoint
 * - Include messages and userData in the request body
 * - Set the appropriate headers (Content-Type, Authorization)
 * - Handle different response formats (data.message vs data.choices[0].message)
 * - For development, use the simulateAIResponse function
 */
export const sendToAI = async (
  messages: Message[], 
  userData?: object
): Promise<Message> => {
  try {
    // For development, log the messages being sent
    console.log('Sending to AI:', messages);
    
    // In development mode or when API isn't available, return a simulated response
    if (process.env.NODE_ENV === 'development' || !CHAT_ENDPOINT.includes('your-api-base-url')) {
      return simulateAIResponse(messages);
    }
    
    // TODO: Implement the actual API call
    throw new Error("Not implemented");
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
 * @param messages - Array of message objects
 * @returns Promise resolving to a simulated response
 */
const simulateAIResponse = async (messages: Message[]): Promise<Message> => {
  // Extract the last user message
  const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
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