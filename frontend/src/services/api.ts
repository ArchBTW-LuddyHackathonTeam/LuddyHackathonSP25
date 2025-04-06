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
