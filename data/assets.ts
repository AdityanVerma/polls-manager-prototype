import type { Asset } from "@/types/poll";

/**
 * Mock learning assets for the Asset Poll workflow. Prototype only — no
 * backend; in a real system these would come from the LMS's content library.
 */
export const MOCK_ASSETS: Asset[] = [
  {
    id: "asset-01",
    title: "AI Fundamentals",
    assetType: "PDF",
    categories: ["AI", "Fundamentals"],
    description:
      "An introductory guide covering core concepts of artificial intelligence, machine learning, and neural networks.",
  },
  {
    id: "asset-02",
    title: "Cyber Security Essentials",
    assetType: "PDF",
    categories: ["Security", "IT"],
    description:
      "A comprehensive overview of cybersecurity best practices, common threat models, and incident response basics.",
  },
  {
    id: "asset-03",
    title: "Product Management Basics",
    assetType: "PDF",
    categories: ["Product", "Management"],
    description:
      "An introduction to product management frameworks, roadmapping, and stakeholder communication.",
  },
  {
    id: "asset-04",
    title: "Data Privacy and Compliance",
    assetType: "PDF",
    categories: ["Compliance", "Legal"],
    description:
      "A policy overview covering GDPR, CCPA, and other data privacy regulations relevant to employees.",
  },
  {
    id: "asset-05",
    title: "Workplace Safety Guidelines",
    assetType: "PDF",
    categories: ["Safety", "Compliance"],
    description:
      "Guidelines covering workplace safety protocols, emergency procedures, and hazard reporting.",
  },
  {
    id: "asset-06",
    title: "React Basics",
    assetType: "HTML",
    categories: ["Web Development", "Frontend"],
    description:
      "An interactive course covering React components, state, and props for building modern web UIs.",
  },
  {
    id: "asset-07",
    title: "Agile Development Workflow",
    assetType: "HTML",
    categories: ["Engineering", "Agile"],
    description:
      "An interactive module walking through Scrum ceremonies, sprint planning, and backlog grooming.",
  },
  {
    id: "asset-08",
    title: "Leadership 101",
    assetType: "MP4",
    categories: ["Leadership", "Soft Skills"],
    description:
      "A video course exploring foundational leadership principles and team management strategies.",
  },
  {
    id: "asset-09",
    title: "Onboarding Welcome Video",
    assetType: "MP4",
    categories: ["Onboarding", "HR"],
    description:
      "A welcome video introducing new hires to company culture, values, and key resources.",
  },
  {
    id: "asset-10",
    title: "Diversity and Inclusion Training",
    assetType: "MP4",
    categories: ["HR", "Culture"],
    description:
      "A video training session promoting inclusive workplace practices and unconscious bias awareness.",
  },
  {
    id: "asset-11",
    title: "Effective Communication Skills",
    assetType: "MP3",
    categories: ["Soft Skills", "Communication"],
    description:
      "An audio training session on active listening, clear messaging, and public speaking techniques.",
  },
  {
    id: "asset-12",
    title: "Company Org Chart",
    assetType: "PNG",
    categories: ["HR", "Reference"],
    description:
      "A visual diagram showing the current organizational structure and reporting lines.",
  },
  {
    id: "asset-13",
    title: "Sales Pitch Deck Snapshot",
    assetType: "JPG",
    categories: ["Sales", "Templates"],
    description:
      "A snapshot of the standard sales pitch deck layout used across the sales organization.",
  },
  {
    id: "asset-14",
    title: "Product Photography Guidelines",
    assetType: "JPEG",
    categories: ["Marketing", "Design"],
    description:
      "Reference imagery and style notes for shooting consistent, on-brand product photography.",
  },
  {
    id: "asset-15",
    title: "Company Handbook",
    assetType: "LINK",
    categories: ["HR", "Reference"],
    description:
      "A link to the full company handbook covering policies, benefits, and procedures.",
  },
];
