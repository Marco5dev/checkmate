# CheckMate - Todo List App

## CS50x Final Project 2025

By Mark Maher Eweida (marco5dev)

### Video Demo: [Video Link](https://youtu.be/wKu0s_gWPyM)
- **Project Title:** CheckMate
- **Name:** Mark Maher Eweida
- **Github & EDX username:** marco5dev
- **city and country:** Port Said, Egypt
- **Date:** 10/2/2025

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
project-root/
├── .env                      # Environment variables for the project
├── .gitignore                # Specifies files for Git to ignore
├── bun.lock                  # Dependency lock file for Bun
├── jsconfig.json             # JavaScript project configuration
├── next.config.mjs           # Next.js configuration file
├── package.json              # Project dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration file
├── README.md                 # Project documentation
├── tailwind.config.mjs       # Tailwind CSS configuration
│
├── public/                   # Static assets
│   ├── favicon.ico           # Website favicon
│   ├── logo.png              # Project logo
│   ├── manifest.json         # Web app manifest
│   ├── Fonts/                # Font files directory
│   │   ├── Edu_font/         # Edu font files
│   │   │   ├── EduAUVICWANTPre-Bold.ttf
│   │   │   ├── EduAUVICWANTPre-Medium.ttf
│   │   │   ├── EduAUVICWANTPre-Regular.ttf
│   │   │   ├── EduAUVICWANTPre-SemiBold.ttf
│   │   │   └── EduAUVICWANTPre-VariableFont_wght.ttf
│   │   └── Merriweather/     # Merriweather font files
│   │       ├── Merriweather-Black.ttf
│   │       ├── Merriweather-BlackItalic.ttf
│   │       ├── Merriweather-Bold.ttf
│   │       ├── Merriweather-BoldItalic.ttf
│   │       ├── Merriweather-Italic.ttf
│   │       ├── Merriweather-Light.ttf
│   │       ├── Merriweather-LightItalic.ttf
│   │       └── Merriweather-Regular.ttf
│   ├── previews/             # Preview images
│   │   ├── preview1.png
│   │   ├── preview2.png
│   │   ├── preview3.png
│   │   └── theme-preview.png
│   └── wallpapers/           # Wallpapers for the app
│       ├── Fantasy-Mountain.png
│       ├── Fog-Forest-Everforest.png
│       ├── Lake.png
│       ├── Lofi - Chill Room2.jpeg
│       ├── Lofi-Cafe1.png
│       ├── Lofi-Cafe2.png
│       ├── Lofi-Desktop-Man-Studying.png
│       ├── space.jpg
│       ├── Street.png
│       ├── Under_Starlit_Sky.png
│       ├── Video Game - The Blackstreets.jpeg
│       └── Wall.png
│
└── src/                      # Source code directory
    ├── middleware.js         # Middleware functions
    ├── app/                  # Next.js app directory
    │   ├── favicon.ico       # Favicon for the app
    │   ├── globals.css       # Global styles
    │   ├── layout.jsx        # Root layout component
    │   ├── page.jsx          # Home page component
    │   ├── sitemap.js        # Sitemap generator
    │   ├── actions/          # User-related actions
    │   │   └── user.js       # User action logic
    │   ├── api/              # API routes
    │   │   ├── auth/         # Authentication routes
    │   │   │   ├── logout/   # Logout endpoint
    │   │   │   │   └── route.js
    │   │   │   └── [...nextauth]/ # NextAuth route
    │   │   │       └── route.js
    │   │   ├── folders/      # Folder-related API
    │   │   │   └── route.js
    │   │   ├── notes/        # Notes-related API
    │   │   │   ├── route.js
    │   │   │   └── [id]/     # API for specific notes
    │   │   │       └── route.js
    │   │   ├── notes-folders/ # Notes and folder combination API
    │   │   │   ├── route.js
    │   │   │   └── [id]/
    │   │   │       └── route.js
    │   │   ├── og/           # Open Graph image generation
    │   │   │   └── route.jsx
    │   │   ├── profile/      # User profile API
    │   │   │   └── avatar/
    │   │   │       └── route.js
    │   │   ├── quotes/       # Quotes API
    │   │   │   └── route.js
    │   │   ├── tags/         # Tags API
    │   │   │   ├── route.js
    │   │   │   └── [id]/
    │   │   │       └── route.js
    │   │   ├── tasks/        # Task API
    │   │   │   └── route.js
    │   │   ├── upload/       # File upload API
    │   │   │   └── route.js
    │   │   ├── user-settings/ # User settings API
    │   │   │   └── route.js
    │   │   └── wallpapers/   # Wallpaper-related API
    │   │       └── route.js
    │   ├── home/             # Home page directory
    │   │   └── page.jsx
    │   ├── login/            # Login page directory
    │   │   ├── form.jsx
    │   │   └── page.jsx
    │   ├── notes/            # Notes page
    │   │   └── page.jsx
    │   ├── privacy/          # Privacy policy page
    │   │   └── page.jsx
    │   ├── profile/          # User profile page
    │   │   └── page.jsx
    │   ├── settings/         # User settings page
    │   │   └── page.jsx
    │   ├── tasks/            # Task management page
    │   │   └── page.jsx
    │   └── terms/            # Terms and conditions page
    │       └── page.jsx
    ├── components/           # Reusable components
    │   ├── Editor.jsx        # Rich text editor component
    │   ├── Header.jsx        # Header component
    │   ├── HeaderWrapper.jsx # Header wrapper component
    │   ├── HomeClient.jsx    # Client-side Home component
    │   ├── ImageCropModal.jsx # Image crop modal
    │   ├── ImageGallery.jsx  # Image gallery component
    │   ├── LegalPageLayout.jsx # Layout for legal pages
    │   ├── LoadingScreen.jsx # Loading screen component
    │   ├── LogoutButton.jsx  # Logout button
    │   ├── NotesClient.jsx   # Notes client component
    │   ├── PasswordModal.jsx # Password modal
    │   ├── ProfileDrawer.jsx # Profile drawer component
    │   ├── ProfileEditor.jsx # Profile editor
    │   ├── SettingsClient.jsx # Settings client component
    │   ├── TasksClient.jsx   # Task client component
    │   └── loadings/         # Loading skeleton components
    │       ├── LoadingAvatar.jsx
    │       ├── LoadingFolderItem.jsx
    │       ├── LoadingHeader.jsx
    │       └── LoadingTaskCard.jsx
    ├── constants/            # App constants and configurations
    │   └── legalContent.js
    ├── contexts/             # React context providers
    │   └── SettingsContext.jsx
    ├── lib/                  # Utility functions and helpers
    │   └── authOptions.js
    ├── models/               # Database models
    │   ├── DailyQuote.js
    │   ├── Folder.js
    │   ├── Notes.js
    │   ├── NotesFolder.js
    │   ├── Tags.js
    │   ├── Task.js
    │   ├── User.js
    │   └── UserSettings.js
    ├── svg/                  # SVG components
    │   ├── apple.jsx
    │   └── google.jsx
    └── utils/                # Utility functions
        ├── emailService.js
        ├── getUserData.js
        ├── mongodb.js
        └── SessionsProvider.jsx
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
