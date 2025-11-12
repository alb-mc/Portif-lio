import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Logo, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Alber",
  lastName: "Mendes",
  name: `Alber Mendes`,
  role: "Full Stack Software Engineer",
  avatar: "/images/PERFIL.jpg",
  email: "lumoltar@gmail.com",
  location: "America/Sao_Paulo", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Portuguese"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about creativity and engineering</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/alb-mc",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/alber-mendes-correa",
  },
  {
    name: "WhatsApp",
    icon: "whatsapp",
    link: "https://api.whatsapp.com/send/?phone=5537984119603&text&type=phone_number&app_absent=0",
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Hi, I´m <span style={{ color: 'green' }}>{person.name}</span></>,
  // Featured badge removed
  featured: {
    display: false,
    title: <></>,
    href: "",
  },
  subline: (
    <>
      Full Stack Software Engineer 
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Full Stack Software Engineer with solid experience in 
        designing and implementing efficient, intelligent and 
        scalable solutions.
        Skilled in backend development (Python, Node.js) and frontend 
        technologies (React, Vue), with additional knowledge in DevOps
        practices and Artificial Intelligence integration.
        <br/><br/>
        Experienced in applying SOLID principles and clean code practices
        to build robust systems architectures and deliver complete, 
        production-ready applications from prototype to deployment. 
        Focused on driving innovation, automation and technological 
        excellence through reliable, high-quality software solutions.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "UNOR",
        timeframe: "2023 - Present",
        role: "Full Stack Software Engineer",
        achievements: [
          <>
            AI Solutions: Development of three applications with integrated
            AI using Python, FastAPI, GPT, Gemini, and Google Cloud AI. Implementation of ETL, Hugging Face, and Machine Learning techniques for process automation and optimization.
          </>,
          <>
            Front-End: Participation in over ten projects using React and Next.js, creating responsive and high-performance interfaces. Application of UI/UX best practices, lazy 
            loading, and code splitting to enhance user experience.
          </>,
          <>
            Back-End: Implementation of multiple features with Node.js and Python, development and integration of REST APIs, SQL and NoSQL database modeling, and optimization of 
            performance and security.
          </>,
          <>
            Mobile: Contribution to React Native projects, focusing on bug fixing, performance improvements, and feature optimization.
          </>,
          <>
            DevOps: Use of Docker, Git/GitHub, and CI/CD pipelines, promoting automation, continuous integration, and best practices in version control.
          </>,
        ],
        images: [],
      },
      // Creativ3 entry removed as requested
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Federal University of São João del Rei - CCO",
        description: <>Pharmacy</>,
      },
      {
        name: "Grand University",
        description: <>Software Engineering</>,
      },
    ],
  },
  technical: {
    display: false, // hidden per request
    title: "Technical skills",
    skills: [
      {
        title: "Figma",
        description: (
          <>Able to prototype in Figma with Once UI with unnatural speed.</>
        ),
        tags: [
          {
            name: "Figma",
            icon: "figma",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [],
      },
      {
        title: "Next.js",
        description: (
          <>Building next gen apps with Next.js + Once UI + Supabase.</>
        ),
        tags: [
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
          {
            name: "Supabase",
            icon: "supabase",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [],
      },  
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Certifications",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Projects",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Books",
  title: `Books – ${person.name}`,
  description: `A book collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
