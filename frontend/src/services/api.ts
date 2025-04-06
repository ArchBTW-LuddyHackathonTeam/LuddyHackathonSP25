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
  id: string;
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
const NODE_ENDPOINT = `${API_BASE_URL}/node`;
const CLASS_ENDPOINT = `${API_BASE_URL}/classes`;
const SCHED_ENDPOINT = `${API_BASE_URL}/scheduler`;

// Debug logging prefix to make logs easily identifiable
const LOG_PREFIX = '[DegreeExplorer API]';

/**
 * Get a single node by ID
 * @param id - The node ID
 * @returns Promise resolving to a Node object with preReqs as IDs
 */
export const getNodeById = async (id: number): Promise<Node> => {
  console.log(`${LOG_PREFIX} getNodeById: Fetching node with ID: ${id}`);
  try {
    const response = await fetch(`${NODE_ENDPOINT}/${id}`);
    console.log(`${LOG_PREFIX} getNodeById: Received response with status ${response.status}`);
    
    if (!response.ok) {
      console.error(`${LOG_PREFIX} getNodeById: HTTP error ${response.status}: ${response.statusText}`);
      throw new Error(`Error fetching node with ID ${id}: ${response.statusText}`);
    }
    
    const node: Node = await response.json();
    console.log(`${LOG_PREFIX} getNodeById: Successfully retrieved node:`, node);
    return node;
  } catch (error) {
    console.error(`${LOG_PREFIX} getNodeById: Error fetching node with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get root nodes (entry points for degree plans)
 * @returns Promise resolving to an array of root Node objects
 */
export const getRootNodes = async (): Promise<Node[]> => {
  console.log(`${LOG_PREFIX} getRootNodes: Fetching root nodes`);
  try {
    // Assuming node with ID 1 is the root node
    const rootNode = await getNodeById(1);
    console.log(`${LOG_PREFIX} getRootNodes: Successfully retrieved root nodes:`, [rootNode]);
    return [rootNode];
  } catch (error) {
    console.error(`${LOG_PREFIX} getRootNodes: Error fetching root nodes:`, error);
    throw error;
  }
};

/**
 * Build the full degree tree starting from a root node ID
 * @param rootId - The ID of the root node
 * @returns Promise resolving to a fully populated Node tree
 */
export const buildDegreeTree = async (rootId: number): Promise<Node> => {
  console.log(`${LOG_PREFIX} buildDegreeTree: Building tree from root node ${rootId}`);
  // Node cache to avoid refetching the same node multiple times
  const nodeCache: Record<number, Node> = {};
  
  /**
   * Recursive helper function to fetch and build a subtree
   * @param nodeId - The ID of the current node
   * @returns Promise resolving to a fully populated Node object
   */
  const buildSubtree = async (nodeId: number, depth = 0): Promise<Node> => {
    const indent = '  '.repeat(depth);
    console.log(`${LOG_PREFIX} ${indent}buildSubtree: Processing node ${nodeId} at depth ${depth}`);
    
    // Check if node is already in cache
    if (nodeCache[nodeId]) {
      console.log(`${LOG_PREFIX} ${indent}buildSubtree: Cache hit for node ${nodeId}`);
      return nodeCache[nodeId];
    }
    
    console.log(`${LOG_PREFIX} ${indent}buildSubtree: Cache miss for node ${nodeId}, fetching...`);
    // Fetch the current node
    const node = await getNodeById(nodeId);
    nodeCache[nodeId] = node;
    
    // Process preReqs if they are IDs (numbers)
    if (node.preRecs && Array.isArray(node.preRecs)) {
      const preRecsAsNumbers = node.preRecs.map(preReq => 
        typeof preReq === 'number' ? preReq : parseInt(preReq.toString(), 10)
      ).filter(id => !isNaN(id)) as number[];
      
      if (preRecsAsNumbers.length > 0) {
        console.log(`${LOG_PREFIX} ${indent}buildSubtree: Node ${nodeId} has ${preRecsAsNumbers.length} prerequisites: ${preRecsAsNumbers.join(', ')}`);
        // Recursively fetch all child nodes (preReqs)
        const childNodes = await Promise.all(
          preRecsAsNumbers.map(preReqId => buildSubtree(preReqId, depth + 1))
        );
        
        // Replace the IDs with the actual node objects
        node.preRecs = childNodes;
        console.log(`${LOG_PREFIX} ${indent}buildSubtree: Successfully populated prerequisites for node ${nodeId}`);
      } else {
        console.log(`${LOG_PREFIX} ${indent}buildSubtree: Node ${nodeId} has no numeric prerequisites`);
      }
    } else {
      console.log(`${LOG_PREFIX} ${indent}buildSubtree: Node ${nodeId} has no prerequisites or they are already resolved`);
    }
    
    return node;
  };

  try {
    // Call the helper function with the rootId and return the result
    const result = await buildSubtree(rootId);
    console.log(`${LOG_PREFIX} buildDegreeTree: Successfully built tree from root ${rootId}`);
    console.log(`${LOG_PREFIX} buildDegreeTree: Cache contains ${Object.keys(nodeCache).length} nodes`);
    return result;
  } catch (error) {
    console.error(`${LOG_PREFIX} buildDegreeTree: Error building tree from root ${rootId}:`, error);
    throw error;
  }
};

/**
 * Get classes that have a specific attribute id
 * @param attribute - The attribute id
 * @returns Promise resolving to an array of Class objects with the specified attribute id
 */
export const getClassesByAttributeID = async (attributeID: string): Promise<Class[]> => {
    console.log(`${LOG_PREFIX} getClassesByAttributeID: Fetching classes with attribute ID: ${attributeID}`);
    return new Promise((resolve, reject) => {
        fetch(`${CLASS_ENDPOINT}/attributeID/${attributeID}`)
            .then(res => {
                console.log(`${LOG_PREFIX} getClassesByAttributeID: Received response with status ${res.status}`);
                return res.json();
            })
            .then(res => {
                console.log(`${LOG_PREFIX} getClassesByAttributeID: Successfully retrieved ${res.length} classes`);
                resolve(res);
            })
            .catch(e => {
                console.error(`${LOG_PREFIX} getClassesByAttributeID: Error fetching classes:`, e);
                reject(e);
            });
    });
};

/**
 * Get classes that have a specific attribute
 * @param attribute - The attribute code (e.g., "AH", "SH")
 * @returns Promise resolving to an array of Class objects with the specified attribute
 */
export const getClassesByAttribute = async (attribute: string): Promise<Class[]> => {
    console.log(`${LOG_PREFIX} getClassesByAttribute: Fetching classes with attribute: ${attribute}`);
    return new Promise((resolve, reject) => {
        fetch(`${CLASS_ENDPOINT}/attribute/${attribute}`)
            .then(res => {
                console.log(`${LOG_PREFIX} getClassesByAttribute: Received response with status ${res.status}`);
                return res.json();
            })
            .then(res => {
                console.log(`${LOG_PREFIX} getClassesByAttribute: Successfully retrieved ${res.length} classes`);
                resolve(res);
            })
            .catch(e => {
                console.error(`${LOG_PREFIX} getClassesByAttribute: Error fetching classes:`, e);
                reject(e);
            });
    });
};

/**
 * Get classes by their course IDs
 * @param courseIds - Array of course IDs
 * @returns Promise resolving to an array of Class objects matching the course IDs
 */
export const getClassesByCourseIds = async (courseIds: number[]): Promise<Class[]> => {
  console.log(`${LOG_PREFIX} getClassesByCourseIds: Fetching classes for ${courseIds.length} course IDs:`, courseIds);
  return Promise.all(
    courseIds.map(async (courseId) => {
      try {
        const response = await fetch(`${CLASS_ENDPOINT}/id/${courseId}`);
        console.log(`${LOG_PREFIX} getClassesByCourseIds: Received response for course ID ${courseId} with status ${response.status}`);
        
        if (!response.ok) {
          console.error(`${LOG_PREFIX} getClassesByCourseIds: HTTP error ${response.status} for course ID ${courseId}: ${response.statusText}`);
          throw new Error(`Error fetching class with ID ${courseId}: ${response.statusText}`);
        }
        
        const classData: Class = await response.json();
        console.log(`${LOG_PREFIX} getClassesByCourseIds: Successfully retrieved class for course ID ${courseId}:`, classData);
        return classData;
      } catch (error) {
        console.error(`${LOG_PREFIX} getClassesByCourseIds: Error fetching class for course ID ${courseId}:`, error);
        throw error;
      }
    })
  );
};


/**
 * Get classes for a specific department
 * @param department - Department code (e.g., "CSCI", "MATH")
 * @returns Promise resolving to an array of Class objects from the specified department
 */
export const getClassesByDepartment = async (department: string): Promise<Class[]> => {
    console.log(`${LOG_PREFIX} getClassesByDepartment: Fetching classes for department: ${department}`);
    return new Promise((resolve, reject) => {
        fetch(`${CLASS_ENDPOINT}/department/${department}`)
            .then(res => {
                console.log(`${LOG_PREFIX} getClassesByDepartment: Received response with status ${res.status}`);
                return res.json();
            })
            .then(res => {
                console.log(`${LOG_PREFIX} getClassesByDepartment: Successfully retrieved ${res.length} classes`);
                resolve(res);
            })
            .catch(e => {
                console.error(`${LOG_PREFIX} getClassesByDepartment: Error fetching classes:`, e);
                reject(e);
            });
    });
};

/**
 * Get a class for a specific id
 * @param id - An id corresponding to a given course
 * @returns Promise resolving to a single Class object
 */
export const getClass = async (id: string): Promise<Class[]> => {
    console.log(`${LOG_PREFIX} getClass: Fetching class with ID: ${id}`);
    return new Promise((resolve, reject) => {
        fetch(`${CLASS_ENDPOINT}/id/${id}`)
            .then(res => {
                console.log(`${LOG_PREFIX} getClass: Received response with status ${res.status}`);
                return res.json();
            })
            .then(res => {
                console.log(`${LOG_PREFIX} getClass: Successfully retrieved class:`, res);
                resolve(res);
            })
            .catch(e => {
                console.error(`${LOG_PREFIX} getClass: Error fetching class:`, e);
                reject(e);
            });
    });
};

/**
 * Get all classes
 * @returns Promise resolving to an array of Class objects
 */
export const getClasses = async (): Promise<Class[]> => {
    console.log(`${LOG_PREFIX} getClasses: Fetching all classes`);
    return new Promise((resolve, reject) => {
        fetch(`${CLASS_ENDPOINT}`)
            .then(res => {
                console.log(`${LOG_PREFIX} getClasses: Received response with status ${res.status}`);
                return res.json();
            })
            .then(res => {
                console.log(`${LOG_PREFIX} getClasses: Successfully retrieved ${res.length} classes`);
                resolve(res);
            })
            .catch(e => {
                console.error(`${LOG_PREFIX} getClasses: Error fetching classes:`, e);
                reject(e);
            });
    });
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
 * @param input - Array of Message objects containing the conversation history
 * @returns Promise resolving to an assistant response message
 */
export const sendMessageToAssistant = async (input: Message[]): Promise<AssistantResponse> => {
    return new Promise((resolve, reject) => {

      fetch(`${SCHED_ENDPOINT}/prompt`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ input })
      })
        .then(res => res.json())
        .then(data => resolve({
            message: {
              role: 'assistant' as 'assistant',
              content: data.message || 'I apologize, but I was unable to process your request.'
            },
            timestamp: new Date()
          }))
        .catch(_ => reject({
            message: {
              role: 'assistant',
              content: 'I apologize, but I encountered an error while processing your request. Please try again later.'
            },
            timestamp: new Date()
          }))
    })
}
