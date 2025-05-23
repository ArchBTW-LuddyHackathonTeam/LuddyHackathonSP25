# iGPS++
A modern course planner for universities featuring an AI Assistant for personalized course recommendations.

## 🚀 About

### Introduction
Traditional university course selectors have long been burdened by unintuitive designs and a lack of personalization. Students often find themselves mired in clunky interfaces that complicate rather than clarify the course planning process. Motivated by these challenges, we came together to create iGPS++.

### Inspiration and Concept
After exploring several existing systems, we identified key areas for improvement: usability, streamlined navigation, and personalized recommendations. We observed that many course planners suffer from cluttered interfaces, overly complex navigation, and generic suggestions that do not cater to individual needs. In response, iGPS++ brings together a home-based course selection interface with an intelligent assistant designed to offer tailored academic recommendations.

### Design Concept
We were inspired by the simplicity found in modern projects and applications. Our design centers on a clean main page featuring a unified dropdown view of courses, requirements, and all other essential elements needed for effective planning. This streamlined interface is enhanced by an AI assistant tab that leverages the personalized data you provide, such as courses taken, academic performance, and individual interests, to generate tailored course recommendations and provide targeted, data-driven advising responses.

### Development Process, Challenges, and Insights
With a robust design in place, our next step was to transform these concepts into a working prototype. The development of iGPS++ began with a brainstorming session aimed at defining our core functional and aesthetic requirements. We then divided responsibilities among front-end development, database management, and AI integration. While this initial division of labor presented challenges in synchronizing independently developed modules, these issues were resolved through a few hours of integration and continuous communication. This iterative process not only enhanced the system's reliability and maintainability but also helped us appreciate the value of collaborative problem solving.

### Features

- Fully-featured graphql database

    - GraphQL provides an easy-to-understand interface to the database, enabling user programs to avoid overfetching and naturally handle nested or recursive data structures.

- REST API Endpoints

    - REST API endpoints were used to simplify straightforward queries, such as retrieving course lists, while leveraging GraphQL for more complex and nested data interactions.

- Fully-featured front-end build with React

    - An intuitive front-end interface sets iGPS++ apart by clearly communicating degree requirements and offering seamless interaction with the AI assistant.

- A personalized AI assistant for all scheduling needs

    - A powerful AI chatbot is integrated into the scheduling process. It accesses your completed courses and remaining requirements to generate intelligent, personalized advising suggestions.

## 📝 Getting Started

### Clone the Repository

1. Clone the GitHub repo to a folder of your choice

        $ git clone https://github.com/ArchBTW-LuddyHackathonTeam/LuddyHackathonSP25

2. Move into the repository root directory

        $ cd LuddyHackathonSP25


### Install Dependencies and start the service

1. Move into the frontend directory

        $ cd /path/to/repo/frontend

2. Install node dependencies

        $ npm i

3. Build the frontend

        $ npm run build

4. Move into the backend directory

        $ cd /path/to/repo/backend

5. Install node dependencies

        $ npm i

5. Link the frontend with the server

        $ npm run setup

6. Build the server

        $ npm run build

7. Start the server

        $ npm run start
The frontend service should now be accessible locally at port `3321`, whereas the backend would be at port `3000`.
