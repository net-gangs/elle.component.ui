import { Store } from '@tanstack/react-store';

export interface LessonChatMessage {
  id: string;
  role: "teacher" | "assistant";
  content: string;
  timestamp: string;
}

export interface LessonChat {
  id: string;
  title: string;
  focus: string;
  lastActivity: string;
  pinned?: boolean;
  tone: string;
  messages: LessonChatMessage[];
}

export interface LessonProjectSnapshot {
  objectives: string;
  standards: string;
  classes: string;
}

export interface LessonProject {
  id: string;
  name: string;
  subject: string;
  grade: string;
  unit: string;
  status: "draft" | "ready";
  classes: number;
  snapshot: LessonProjectSnapshot;
  chats: LessonChat[];
}

export const mockProjects: LessonProject[] = [
  {
    id: "proj-ecosystems",
    name: "Ecosystems Inquiry",
    subject: "Science",
    grade: "Grade 5",
    unit: "Unit 4 · Energy transfer",
    status: "draft",
    classes: 2,
    snapshot: {
      objectives:
        "Students explain how energy moves through producers, consumers, and decomposers in a biome.",
      standards: "NGSS 5-LS2-1 · TEKS 5.9B",
      classes: "Periods 2 & 4",
    },
    chats: [
      {
        id: "chat-launch",
        title: "Launch day discussion",
        focus: "Hook & discourse",
        lastActivity: "10:24 AM",
        pinned: true,
        tone: "curious",
        messages: [
          {
            id: "msg-launch-1",
            role: "teacher",
            content:
              "I want a low-prep hook that lets students share prior knowledge about food webs without feeling put on the spot.",
            timestamp: "10:18 AM",
          },
          {
            id: "msg-launch-2",
            role: "assistant",
            content:
              "Try a gallery walk with photos of local ecosystems. Ask students to place sticky notes describing how energy might flow through what they see.",
            timestamp: "10:18 AM",
          },
          {
            id: "msg-launch-3",
            role: "assistant",
            content:
              "Follow with a whip-around prompt: \"Where does the energy start in your scene?\" This keeps it fast and inclusive.",
            timestamp: "10:20 AM",
          },
        ],
      },
      {
        id: "chat-small-groups",
        title: "Small group coach",
        focus: "Differentiation",
        lastActivity: "Yesterday",
        tone: "structured",
        messages: [
          {
            id: "msg-small-1",
            role: "teacher",
            content:
              "Need three versions of the energy transfer mini-lab so my emerging readers can still access the task.",
            timestamp: "Yesterday",
          },
          {
            id: "msg-small-2",
            role: "assistant",
            content:
              "Use the same data table, but pre-highlight vocabulary for Group A and add sentence starters for Group B.",
            timestamp: "Yesterday",
          },
        ],
      },
    ],
  },
  {
    id: "proj-poetry",
    name: "Poetry Anthology",
    subject: "ELA",
    grade: "Grade 7",
    unit: "Unit 5 · Voice & form",
    status: "ready",
    classes: 3,
    snapshot: {
      objectives: "Writers experiment with figurative language to convey emotion in free verse.",
      standards: "CCSS W.7.3 · LA 7.4",
      classes: "Blocks A, B, C",
    },
    chats: [
      {
        id: "chat-feedback",
        title: "Feedback stems",
        focus: "Peer review",
        lastActivity: "Mon",
        tone: "warm",
        messages: [
          {
            id: "msg-feedback-1",
            role: "assistant",
            content:
              "Offer stems like \"A line that resonated with me...\" or \"Consider tightening...\" to keep feedback specific.",
            timestamp: "Mon",
          },
        ],
      },
      {
        id: "chat-publishing",
        title: "Publishing night",
        focus: "Family event",
        lastActivity: "Sun",
        tone: "celebratory",
        messages: [
          {
            id: "msg-publish-1",
            role: "teacher",
            content:
              "Need a short script students can use to introduce their poem during publishing night.",
            timestamp: "Sun",
          },
          {
            id: "msg-publish-2",
            role: "assistant",
            content:
              "Have them share the poem title, the mentor poet, and one craft move they tried. Keep it under 45 seconds.",
            timestamp: "Sun",
          },
        ],
      },
    ],
  },
];

interface LessonState {
  selectedProjectId: string;
  selectedChatId: string | null;
  projectsOpen: boolean;
  chatsOpen: boolean;
}

export const lessonStore = new Store<LessonState>({
  selectedProjectId: mockProjects[0]?.id ?? "",
  selectedChatId: mockProjects[0]?.chats[0]?.id ?? null,
  projectsOpen: true,
  chatsOpen: true,
});

export const setSelectedProjectId = (id: string) => {
  lessonStore.setState((state) => ({
    ...state,
    selectedProjectId: id,
    // Reset chat selection when project changes, or select first chat
    selectedChatId: mockProjects.find(p => p.id === id)?.chats[0]?.id ?? null
  }));
};

export const setSelectedChatId = (id: string | null) => {
  lessonStore.setState((state) => ({
    ...state,
    selectedChatId: id,
  }));
};

export const setProjectsOpen = (open: boolean) => {
  lessonStore.setState((state) => ({
    ...state,
    projectsOpen: open,
  }));
};

export const setChatsOpen = (open: boolean) => {
  lessonStore.setState((state) => ({
    ...state,
    chatsOpen: open,
  }));
};
