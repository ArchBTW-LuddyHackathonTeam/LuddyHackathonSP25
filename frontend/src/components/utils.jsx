// Type definitions and utility functions
import { 
  BookOpen, Users, Award, AlertCircle, BarChart, Clock, Circle, CheckCircle
} from 'lucide-react';

// Type definitions
export const Attribute = {
  AH: "A&H",
  SH: "S&H",
  WC: "World Culture",
  WL: "World Language",
  NM: "N&M",
  IW: "Intensive Writing",
  EC: "English Composition",
  MM: "Mathematical Modeling",
};

// Color mapping for attributes
export const AttributeColors = {
  AH: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300", icon: <BookOpen size={14} /> },
  SH: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300", icon: <Users size={14} /> },
  WC: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300", icon: <Award size={14} /> },
  WL: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300", icon: <Award size={14} /> },
  NM: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300", icon: <AlertCircle size={14} /> },
  IW: { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-300", icon: <BookOpen size={14} /> },
  EC: { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-300", icon: <BookOpen size={14} /> },
  MM: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300", icon: <BarChart size={14} /> },
};

// Dummy class data generator
export const generateDummyClasses = (attribute = null, count = 15) => {
  const professors = ["Dr. Smith", "Dr. Johnson", "Dr. Williams", "Dr. Brown", "Dr. Jones", "Dr. Garcia", "Dr. Miller"];
  const days = [["Mon", "Wed", "Fri"], ["Tue", "Thu"], ["Mon", "Wed"], ["Tue", "Thu", "Fri"]];
  const startTimes = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];
  const departments = ["CSCI", "MATH", "PHYS", "CHEM", "BIOL", "HIST", "ENG"];
  const courseTypes = {
    "AH": ["Literature", "Philosophy", "Art History", "Music Theory", "Theater", "Religious Studies", "Art Appreciation", "Classics", "Mythology", "Film Studies"],
    "SH": ["Economics", "Psychology", "Sociology", "Political Science", "History", "Anthropology", "Geography", "Archaeology", "Linguistics", "Communication"],
    "WC": ["Global Studies", "Cultural Anthropology", "World Literature", "International Relations", "East Asian Studies", "African Studies", "Latin American Studies", "Middle Eastern Studies"],
    "WL": ["Spanish", "French", "German", "Mandarin", "Japanese", "Arabic", "Russian", "Italian", "Portuguese", "Korean"],
    "NM": ["Physics", "Chemistry", "Biology", "Astronomy", "Geology", "Environmental Science", "Mathematics", "Statistics", "Computer Science", "Oceanography"],
    "IW": ["Advanced Composition", "Technical Writing", "Research Methods", "Senior Thesis", "Critical Analysis", "Persuasive Writing", "Academic Writing", "Professional Communication"],
    "EC": ["Composition", "Rhetoric", "Academic Writing", "Professional Writing", "Business Communication", "Creative Writing", "Journalism", "Public Speaking"],
    "MM": ["Calculus", "Statistics", "Finite Math", "Discrete Math", "Linear Algebra", "Differential Equations", "Mathematical Modeling", "Applied Mathematics"]
  };

  let courseNames;
  if (attribute && courseTypes[attribute]) {
    courseNames = courseTypes[attribute];
  } else {
    // Flatten all course types into one array if no specific attribute
    courseNames = Object.values(courseTypes).flat();
  }

  return Array.from({ length: count }, (_, i) => {
    const dept = departments[Math.floor(Math.random() * departments.length)];
    const courseNum = Math.floor(Math.random() * 400) + 100;
    const courseName = courseNames[Math.floor(Math.random() * courseNames.length)];
    const credits = Math.floor(Math.random() * 3) + 1;
    
    // If attribute is specified, use that, otherwise assign random attributes (1-2)
    let courseAttributes = [];
    if (attribute) {
      courseAttributes = [attribute];
    } else {
      // Randomly assign 1-2 attributes
      const attrKeys = Object.keys(Attribute);
      const numAttrs = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numAttrs; j++) {
        const randomAttr = attrKeys[Math.floor(Math.random() * attrKeys.length)];
        if (!courseAttributes.includes(randomAttr)) {
          courseAttributes.push(randomAttr);
        }
      }
    }
    
    return {
      id: `${dept}-${courseNum}-${i}`,
      code: `${dept} ${courseNum}`,
      name: courseName,
      professor: professors[Math.floor(Math.random() * professors.length)],
      credits: credits,
      days: days[Math.floor(Math.random() * days.length)],
      time: `${startTimes[Math.floor(Math.random() * startTimes.length)]} - ${Math.floor(Math.random() * 3) + 1}:50 PM`,
      rating: (Math.random() * 4 + 1).toFixed(1),
      completed: false,
      capacity: Math.floor(Math.random() * 30) + 20,
      enrolled: Math.floor(Math.random() * 20),
      location: `Building ${Math.floor(Math.random() * 10) + 1}, Room ${Math.floor(Math.random() * 300) + 100}`,
      attributes: courseAttributes,
      description: `This course provides an introduction to ${courseName.toLowerCase()} concepts and methodologies. Students will explore theoretical frameworks and practical applications through a variety of assignments and projects.`
    };
  });
};

// Get node type
export const getNodeType = (node) => {
  if (node.titleValue && !node.numberValue && !node.attributes && !node.chooseNClasses && !node.courseID && !node.dropdownChildren) {
    return "title";
  } else if (node.numberValue !== undefined && node.chooseNClasses) {
    return "choose";
  } else if (node.numberValue !== undefined && node.attributes) {
    return "attribute-with-number";
  } else if (node.numberValue !== undefined) {
    return "number";
  } else if (node.attributes && node.attributes.length > 0) {
    return "attribute";
  } else if (node.courseID !== undefined) {
    return "course";
  } else if (node.dropdownChildren === true) {
    return "dropdown";
  }
  return "unknown";
};

// Format course name from titleValue
export const formatCourseName = (titleValue) => {
  if (!titleValue) return "";
  
  // Extract course code pattern (e.g., "CSCI-B 461")
  const match = titleValue.match(/([A-Z]+-[A-Z]\s\d+)/);
  if (!match) return titleValue;
  
  const courseCode = match[0];
  const rest = titleValue.replace(courseCode, "").trim();
  
  return (
    <div>
      <span className="font-mono">{courseCode}</span>
      <span className="ml-1">{rest}</span>
    </div>
  );
};

// Get the completion status of a node
export const getNodeCompletion = (node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap) => {
  if (completedNodes[node.id]) {
    return "complete";
  }
  
  const type = getNodeType(node);
  
  if (type === "number" || type === "attribute-with-number") {
    const inputValue = parseInt(nodeInputValues[node.id]) || 0;
    if (inputValue >= (node.numberValue || 0)) {
      return "complete";
    } else if (inputValue > 0) {
      return "partial";
    }
  }
  
  if (type === "choose") {
    const selectedCount = selectedClasses[node.id]?.length || 0;
    if (selectedCount >= (node.numberValue || 0)) {
      return "complete";
    } else if (selectedCount > 0) {
      return "partial";
    }
  }
  
  if (type === "dropdown") {
    return selectedSpecialization[node.id] ? "partial" : "incomplete";
  }
  
  // For title nodes, check if all prerequisites are completed
  if (type === "title" && node.preRecs && node.preRecs.length > 0) {
    const allPrerecsCompleted = node.preRecs.every(preRecId => {
      const preRecNode = nodeMap[preRecId];
      if (!preRecNode) return false;
      
      const preRecCompletion = getNodeCompletion(preRecNode, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap);
      return preRecCompletion === "complete";
    });
    
    if (allPrerecsCompleted) {
      return "complete";
    }
  }
  
  return "incomplete";
};

// Get class for node status
export const getNodeStatusClass = (node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap) => {
  const status = getNodeCompletion(node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap);
  
  switch (status) {
    case "complete":
      return "bg-green-100 border-green-500 shadow-green-200/50";
    case "partial":
      return "bg-blue-50 border-blue-400 shadow-blue-200/50";
    default:
      return "bg-white border-gray-300 shadow-gray-100/50";
  }
};

// Get icon for node status
export const getNodeStatusIcon = (node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap) => {
  const status = getNodeCompletion(node, completedNodes, nodeInputValues, selectedClasses, selectedSpecialization, nodeMap);
  
  switch (status) {
    case "complete":
      return <CheckCircle className="text-green-500" size={20} />;
    case "partial":
      return <Clock className="text-blue-500" size={20} />;
    default:
      return <Circle className="text-gray-300" size={20} />;
  }
};

// Render attribute tag
export const renderAttributeTag = (attr) => {
  const colors = AttributeColors[attr] || { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" };
  return (
    <span key={attr} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
      <span className="mr-1">{colors.icon}</span>
      {Attribute[attr]}
    </span>
  );
};

// Sample tree data
export const initialTreeData = [
  {
    "id": 1,
    "titleValue": "Computer Science BS",
    "preRecs": [3, 17, 18, 19]
  },
  {
    "id": 3,
    "titleValue": "Bachelors of Science",
    "preRecs": [4, 15, 16]
  },
  // Rest of the tree data...
  {
    "id": 4,
    "titleValue": "General Education Requirements",
    "preRecs": [5, 6, 7, 8, 9, 10]
  },
  {
    "id": 5,
    "titleValue": "Complete One English Composition Course",
    "numberValue": 1,
    "attributes": ["EC"],
    "preRecs": []
  },
  {
    "id": 6,
    "titleValue": "Complete One Mathematical Modeling Course",
    "numberValue": 1,
    "attributes": ["MM"],
    "preRecs": []
  },
  {
    "id": 7,
    "titleValue": "Complete 6 credits of Arts and Humanities courses",
    "numberValue": 6,
    "attributes": ["AH"],
    "preRecs": []
  },
  {
    "id": 8,
    "titleValue": "Complete 6 credits of Social and Historical Studies courses",
    "numberValue": 6,
    "attributes": ["SH"],
    "preRecs": []
  },
  {
    "id": 9,
    "titleValue": "Complete 5 credits of Natural and Mathematical Science courses",
    "numberValue": 5,
    "attributes": ["NM"],
    "preRecs": []
  },
  {
    "id": 10,
    "titleValue": "World Languages & Cultures Requirement",
    "dropdownChildren": true,
    "preRecs": [11, 12, 13]
  },
  {
    "id": 11,
    "titleValue": "Language Study",
    "attributes": ["WL"],
    "preRecs": []
  },
  {
    "id": 12,
    "titleValue": "Complete 6 credits of World Culture courses",
    "numberValue": 6,
    "attributes": ["WC"],
    "preRecs": []
  },
  {
    "id": 13,
    "titleValue": "Study Abroad Program",
    "preRecs": []
  },
  {
    "id": 15,
    "titleValue": "Complete 120 credit hours",
    "numberValue": 120,
    "preRecs": []
  },
  {
    "id": 16,
    "titleValue": "Complete 36 credits at 300-400 level",
    "preRecs": []
  },
  {
    "id": 17,
    "titleValue": "Complete 40 credits in Computer science core courses",
    "numberValue": 40,
    "preRecs": []
  },
  {
    "id": 18,
    "titleValue": "Complete 16 credits in Mathematics courses",
    "numberValue": 16,
    "preRecs": []
  },
  {
    "id": 19,
    "titleValue": "Computer Science Specialization",
    "dropdownChildren": true,
    "preRecs": [20, 28]
  },
  {
    "id": 20,
    "titleValue": "Software Engineering",
    "preRecs": [21, 22, 23, 25, 26, 27]
  },
  {
    "id": 21,
    "titleValue": "CSCI-B 461 Database Concepts",
    "courseID": 461,
    "preRecs": []
  },
  {
    "id": 22,
    "titleValue": "CSCI-P 465 Software Engineering for Information Systems",
    "courseID": 465,
    "preRecs": []
  },
  {
    "id": 23,
    "titleValue": "Select one course from the following:",
    "numberValue": 1,
    "chooseNClasses": [322, 466],
    "preRecs": []
  },
  {
    "id": 25,
    "titleValue": "Select one course from the following:",
    "numberValue": 1,
    "chooseNClasses": [323, 335],
    "preRecs": []
  },
  {
    "id": 26,
    "titleValue": "Select one course from the following:",
    "numberValue": 1,
    "chooseNClasses": [403, 414, 423, 436],
    "preRecs": []
  },
  {
    "id": 27,
    "titleValue": "Select one additional P course",
    "preRecs": []
  },
  {
    "id": 28,
    "titleValue": "Systems",
    "preRecs": [29, 30, 31, 33, 34]
  },
  {
    "id": 29,
    "titleValue": "CSCI-C 291 System Programming with C and Unix",
    "courseID": 291,
    "preRecs": []
  },
  {
    "id": 30,
    "titleValue": "CSCI-C 335 Computer Structures",
    "courseID": 335,
    "preRecs": []
  },
  {
    "id": 31,
    "titleValue": "Select one project course from the following:",
    "numberValue": 1,
    "chooseNClasses": [436, 438, 442, 545],
    "preRecs": []
  },
  {
    "id": 33,
    "titleValue": "Select one additional systems course from the following (Not used for project course):",
    "numberValue": 1,
    "chooseNClasses": [434, 436, 438, 441, 442, 443, 490, 545],
    "preRecs": []
  },
  {
    "id": 34,
    "titleValue": "Select one course from the following:",
    "numberValue": 1,
    "chooseNClasses": [401, 403, 405],
    "preRecs": []
  }
];

// Sample assistant messages
export const initialAssistantMessages = [
  {
    sender: 'assistant',
    content: "Hello! I'm your degree planning assistant. I can help you with course recommendations, scheduling advice, and understanding your degree requirements. What can I help you with today?",
    timestamp: new Date()
  }
];