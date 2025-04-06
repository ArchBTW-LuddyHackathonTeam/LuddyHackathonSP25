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
const API_BASE_URL = 'http://localhost:3000';
const NODE_ENDPOINT = `${API_BASE_URL}/nodes`;
const CLASS_ENDPOINT = `${API_BASE_URL}/classes`;
const CHAT_ENDPOINT = `${API_BASE_URL}/chat`;

/**
 * Get a single node by ID
 * @param id - The node ID
 * @returns Promise resolving to a Node object with preReqs as IDs
 */
export const getNodeById = async (id: number): Promise<Node> => {
  // Simple dummy implementation
  return {
    id: id,
    titleValue: `Node ${id}`,
    preRecs: [id - 1, id - 2].filter(n => n > 0)
  };
};

/**
 * Get root nodes (entry points for degree plans)
 * @returns Promise resolving to an array of root Node objects
 */
export const getRootNodes = async (): Promise<Node[]> => {
  // Simple dummy implementation
  return [
    {
      id: 1,
      titleValue: "Computer Science BS",
      preRecs: []
    },
    {
      id: 2,
      titleValue: "Mathematics BS",
      preRecs: []
    }
  ];
};

/**
 * Build the full degree tree starting from a root node ID
 * @param rootId - The ID of the root node
 * @returns Promise resolving to a fully populated Node tree
 */
export const buildDegreeTree = async (rootId: number): Promise<Node> => {
  // Simple dummy implementation
  const rootNode: Node = {
    id: rootId,
    titleValue: `Degree Plan ${rootId}`,
    preRecs: []
  };
  
  // Add some child nodes
  const childNode1: Node = {
    id: rootId * 10 + 1,
    titleValue: "Core Requirements",
    preRecs: []
  };
  
  const childNode2: Node = {
    id: rootId * 10 + 2,
    titleValue: "Electives",
    preRecs: []
  };
  
  // Set the root node's preRecs to be the populated Node objects
  rootNode.preRecs = [childNode1, childNode2];
  
  return rootNode;
};

/**
 * Get classes that have a specific attribute id
 * @param attribute - The attribute id
 * @returns Promise resolving to an array of Class objects with the specified attribute id
 */
export const getClassesByAttributeID = async (attributeID: string): Promise<Class[]> => {
    return new Promise((resolve, reject) => {
        fetch(`${CLASS_ENDPOINT}/attributeID/${attributeID}`)
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(e => reject(e))
    })
};

/**
 * Get classes that have a specific attribute
 * @param attribute - The attribute code (e.g., "AH", "SH")
 * @returns Promise resolving to an array of Class objects with the specified attribute
 */
export const getClassesByAttribute = async (attribute: string): Promise<Class[]> => {
    return new Promise((resolve, reject) => {
        fetch(`${CLASS_ENDPOINT}/attribute/${attribute}`)
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(e => reject(e))
    })
};

/**
 * Get classes by their course IDs
 * @param courseIds - Array of course IDs
 * @returns Promise resolving to an array of Class objects matching the course IDs
 */
export const getClassesByCourseIds = async (courseIds: number[]): Promise<Class[]> => {
    return new Promise((resolve, reject) => {
        fetch(`${CLASS_ENDPOINT}/ids`, {
            method: "POST",
            body: JSON.stringify({ ids: courseIds })
        })
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(e => reject(e))
    })
};


/**
 * Get classes for a specific department
 * @param department - Department code (e.g., "CSCI", "MATH")
 * @returns Promise resolving to an array of Class objects from the specified department
 */
export const getClassesByDepartment = async (department: string): Promise<Class[]> => {
    return new Promise((resolve, reject) => {
        fetch(`${CLASS_ENDPOINT}/department/${department}`)
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(e => reject(e))
    })
};

/**
 * Get a class for a specific id
 * @param id - An id corresponding to a given course
 * @returns Promise resolving to a single Class object
 */
export const getClass = async (id: string): Promise<Class[]> => {
    return new Promise((resolve, reject) => {
        fetch(`${CLASS_ENDPOINT}/id/${id}`)
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(e => reject(e))
    })
};

/**
 * Get all classes
 * @returns Promise resolving to an array of Class objects
 */
export const getClasses = async (): Promise<Class[]> => {
    return new Promise((resolve, reject) => {
        fetch(`${CLASS_ENDPOINT}`)
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(e => reject(e))
    })
};

/**
 * Interface for the assistant response
 */
export interface AssistantResponse {
  message: Message;
  timestamp: Date;
}

/**
 * Send messages to the AI assistant and get a response
 * @param messages - Array of Message objects containing the conversation history
 * @returns Promise resolving to an assistant response message
 */
export const sendMessageToAssistant = async (messages: Message[]): Promise<AssistantResponse> => {
  try {
    const response = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });
    
    if (!response.ok) {
      throw new Error(`Error communicating with assistant: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return {
      message: {
        role: 'assistant',
        content: data.response || 'I apologize, but I was unable to process your request.'
      },
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error sending message to assistant:', error);
    
    // Return a fallback response in case of errors
    return {
      message: {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again later.'
      },
      timestamp: new Date()
    };
  }
};
