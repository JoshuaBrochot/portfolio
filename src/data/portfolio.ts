export const PROFILE = {
  firstName: "Joshua",
  lastName: "BROCHOT",
  title: ["Étudiant BUT Informatique", "Développeur Web", "En stage au Luxembourg"],
  bio: "Salut ! Je suis étudiant en informatique, passionné par les nouvelles technologies et le développement logiciel. J'aime concevoir des projets bien structurés et créatifs, notamment des logiciels, des jeux et des sites web. Logique et curieux, j'adore acquérir de nouvelles compétences et explorer des idées novatrices.",
  email: "joshua.brochot@gmail.com",
  phone: "+33 07 68 84 93 38",
  birthdate: "2 septembre 2005",
  available: true,
  availableLabel: "disponible · stage fév–juin 2026",
  initials: "JB",
  avatarSrc: '/photo.jpg',
  socials: [
    { label: "GitHub", href: "https://github.com/JoshuaBrochot" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/joshua-brochot" },
    { label: "Email", href: "mailto:joshua.brochot@gmail.com" },
  ],
  stats: [
    { value: "BAC +3", label: "niveau" },
    { value: "3+", label: "projets" },
    { value: "2", label: "stages" },
  ],
};

export const INTERESTS = [
  {
    label: "Basketball",
    icon: "dribbble" as const,
    desc: "Sport collectif pratiqué, développe l'esprit d'équipe et la rigueur.",
  },
  {
    label: "Jeux vidéo",
    icon: "gamepad-2" as const,
    desc: "Passionné par les mécaniques de jeu et le game design. Source d'inspiration créative.",
  },
  {
    label: "Nouvelles technologies",
    icon: "cpu" as const,
    desc: "Veille tech constante : IA, web, systèmes embarqués.",
  },
];

export const EDUCATION = [
  {
    period: "2020 – 2023",
    school: "Lycée Saint-Exupéry",
    degree: "BAC général",
    detail: "Spécialités Mathématiques & NSI",
    current: false,
  },
  {
    period: "2023 – 2026",
    school: "IUT de Metz — Université de Lorraine",
    degree: "BUT 3 Informatique",
    detail: "Parcours développement logiciel",
    current: true,
  },

];

export const EXPERIENCES = [
  {
    period: "Avril – Mai 2025",
    company: "TMT",
    location: "Luxembourg",
    role: "Stage R&D",
    current: false,
    missions: [
      "Développement d'un système de détection pour maintenance prédictive",
      "Traitement et analyse d'images thermiques",
      "Création d'un système de calibration assistée",
    ],
    tags: ["Python", "Computer Vision", "Traitement d'image"],
  },
  {
    period: "Février 2026 – Juin 2026",
    company: "Paul Wurth",
    location: "Luxembourg",
    role: "Stage IT — Développement logiciel",
    current: true,
    missions: [
      "Refonte complète d'un logiciel de gestion de contrats et d'administration",
      "Conception et développement de l'interface utilisateur",
      "Participation aux choix d'architecture et de stack technique",
    ],
    tags: ["Développement web", "Gestion de projet", "UI/UX"],
  },

];

export const PROJECTS = [
  {
    id: "neuroom",
    number: "01",
    name: "NeuRoom",
    period: "2025 – 2026",
    desc: "Application mobile de reconnaissance visuelle des salles de l'IUT de Metz par intelligence artificielle. Architecture hexagonale complète, pipeline ML, panel d'administration et CI/CD.",
    missions: [
      "Application mobile React Native + Expo (iOS & Android)",
      "Backend FastAPI (Python) avec architecture hexagonale (ports & adapters)",
      "Modèle de deep learning ResNet50 via transfer learning (PyTorch)",
      "Constitution d'un dataset dédié (photos des salles IUT)",
      "Panel d'administration : MME (gestion dynamique des modèles), PVA (validation images), gestion dataset",
      "CI/CD GitHub Actions + déploiement VPS OVH",
      "Base de données PostgreSQL, authentification JWT + chiffrement Fernet",
    ],
    tags: ["React Native", "FastAPI", "PyTorch", "PostgreSQL", "Docker", "GitHub Actions", "Python"],
    color: "#0D0D1A",
    github: "https://github.com/invader237/sae5",
    live: "https://neuroom.fr",
    team: ["Diego Trivino", "Mathias Fries", "Alexandre Kesseler", "Joshua Brochot"],
  },
  {
    id: "iut-website",
    number: "02",
    name: "Site web IUT de Metz",
    period: "Janvier – Mai 2024",
    desc: "Développement complet d'un site web pour l'IUT de Metz. Utilisation des techniques web modernes, gestion des délais et travail en équipe.",
    missions: [
      "Utilisation des techniques web modernes",
      "Gestion des délais et du travail d'équipe",
    ],
    tags: ["HTML", "CSS", "PHP", "SQL"],
    color: "#131320",
    github: null,
    live: null,
    team: null,
  },
  {
    id: "detection-system",
    number: "03",
    name: "Système de détection thermique",
    period: "Avril – Mai 2025",
    desc: "Système de détection pour la maintenance prédictive d'une machine industrielle chez TMT Luxembourg. Traitement d'images thermiques et calibration assistée.",
    missions: [
      "Maintenance prédictive d'une machine industrielle",
      "Traitement et analyse d'images thermiques",
      "Création d'un système de calibration assistée",
    ],
    tags: ["Python", "Computer Vision", "R&D", "Traitement d'image"],
    color: "#0F1A13",
    github: null,
    live: null,
    team: null,
  },
];

export type SkillLevel = "expert" | "intermédiaire" | "débutant";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export const SKILLS: Record<string, Skill[]> = {
  Frontend: [
    { name: "HTML", level: "expert" },
    { name: "CSS", level: "expert" },
    { name: "JavaScript", level: "intermédiaire" },
    { name: "TypeScript", level: "intermédiaire" },
    { name: "React", level: "intermédiaire" },
    { name: "Next.js", level: "intermédiaire" },
    { name: "Tailwind", level: "intermédiaire" },
    { name: "Bootstrap", level: "intermédiaire" },
  ],
  Backend: [
    { name: "PHP", level: "expert" },
    { name: "Symfony", level: "intermédiaire" },
    { name: "Java", level: "intermédiaire" },
    { name: "Python", level: "expert" },
    { name: "FastAPI", level: "intermédiaire" },
    { name: "SQL", level: "expert" },
    { name: "PostgreSQL", level: "intermédiaire" },
    { name: "MongoDB", level: "débutant" },
  ],
  "DevOps & Outils": [
    { name: "Git", level: "expert" },
    { name: "GitLab", level: "intermédiaire" },
    { name: "Docker", level: "intermédiaire" },
    { name: "Linux", level: "intermédiaire" },
    { name: "Windows", level: "intermédiaire" },
    { name: "VS Code", level: "expert" },
    { name: "IntelliJ", level: "intermédiaire" },
    { name: "Figma", level: "expert" },
  ],
  "Mobile & autre": [
    { name: "Flutter", level: "débutant" },
    { name: "React Native", level: "intermédiaire" },
    { name: "PyTorch", level: "débutant" },
    { name: "Power Platform", level: "débutant" },
    { name: "IA", level: "débutant" },
    { name: "Overleaf", level: "expert" },
    { name: "Pack Office", level: "expert" },
  ],
};

export const SKILL_CATEGORIES = ["Tout", ...Object.keys(SKILLS)];
