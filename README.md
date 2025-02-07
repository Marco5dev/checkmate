# CheckMate - Todo List App

## CS50x Final Project 2025

By Mark Maher Eweida (marco5dev)

### Video Demo: [URL_HERE]

## Project Description

CheckMate is a modern task management application built using Next.js and React. It allows users to efficiently organize and track their daily tasks with a clean, intuitive interface. The project demonstrates the culmination of skills learned in CS50x, particularly in web development and user interface design.

### Key Features

- Task Management: Create, edit, and delete tasks
- Status Tracking: Mark tasks as complete or incomplete
- Priority System: Organize tasks by importance level
- Responsive Design: Works seamlessly on desktop and mobile devices
- Real-time Updates: Changes reflect immediately without page refresh

### Technical Implementation

The application leverages several modern web technologies:

- **Next.js 15**: For server-side rendering and routing
- **React**: For building the user interface components
- **Tailwind CSS**: For responsive and customizable styling
- **DaisyUI**: For pre-built UI components
- **CSS Modules**: For component-scoped styling
- **Vercel**: For deployment and hosting

### Project Structure

```
todo-list-app-cs50x/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   │   └── tasks/        # Task-related API endpoints
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Home page component
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── TaskList/         # Task list component
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── TaskForm/         # Task creation form
│   │   ├── index.tsx
│   │   └── styles.module.css
│   ├── TaskItem/         # Individual task component
│   │   ├── index.tsx
│   │   └── styles.module.css
│   └── ui/               # UI components
│       ├── Button.tsx
│       └── Input.tsx
├── lib/                  # Utility functions and helpers
│   ├── types.ts          # TypeScript types/interfaces
│   └── utils.ts          # Helper functions
├── public/               # Static assets
│   ├── images/
│   │   └── logo.png
│   ├── favicon.ico
│   └── robots.txt
├── styles/               # Global styles
│   └── globals.css
├── .eslintrc.json        # ESLint configuration
├── .gitignore            # Git ignore rules
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── postcss.config.js     # PostCSS configuration
├── README.md             # Project documentation
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

### How to Run

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Build the app:

```bash
npm run build
```

4. Start the App:

```bash
npm run start
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Design Decisions

- Chose Next.js for its built-in performance optimizations and server-side rendering capabilities
- Implemented Tailwind CSS for rapid UI development and consistent styling
- Used DaisyUI to maintain a professional look while reducing development time
- Implemented real-time updates for better user experience

### Challenges Overcome

1. **Authentication Implementation**

   - Implementing user authentication was one of the biggest challenges as it was my first time working with auth systems
   - Faced numerous errors with token validation and session management
   - Overcame these by thoroughly studying Next.js authentication documentation and implementing JWT-based auth with proper error handling
   - Successfully implemented secure login/signup flows after multiple iterations

2. **Dynamic Wallpaper System**

   - Encountered significant issues with wallpaper loading and rendering
   - Faced challenges with image optimization and responsive scaling
   - Resolved by implementing proper image loading strategies and adding error boundaries
   - Created a fallback system for failed wallpaper loads

3. **Rich Text Note Editor**
   - Building a note editor component was particularly challenging as it required deep understanding of React state management
   - Struggled with maintaining cursor position and formatting options
   - Solved by implementing a custom editor component using a third-party library
   - Added features like markdown support and real-time preview gradually

### Possible Future Improvements

- User authentication system
- Task categories and tags
- Data persistence with a database
- Task sharing capabilities
- Mobile application version

### About the Developer

My name is Mark Maher, and I'm a CS50x student from Egypt - Port Said. Prior to taking CS50x, I had alot of experince in programming. This course has been an incredible journey, starting from the basics of C programming and culminating in this web development project.

Throughout CS50x, I've learned fundamental concepts like algorithms, data structures, and software design principles. The transition from C to Python, and then to web development with JavaScript, has given me a comprehensive understanding of different programming paradigms.

This final project combines everything I've learned, particularly from Week 8 (HTML, CSS, JavaScript) and Week 9 (Flask, Python). While the technologies used (Next.js, React) go beyond CS50x's curriculum, the core principles learned in the course - especially regarding problem-solving and writing clean, efficient code - were instrumental in building this application.

I chose to create CheckMate because I wanted to solve a real-world problem while challenging myself with modern web technologies.
