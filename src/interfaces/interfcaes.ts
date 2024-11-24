import { SlashCommandBuilder, CommandInteraction } from "discord.js";

// Interface defining the structure of a Command object
export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}

//Interfcaes for Anime Data

export interface Anime {
  id: number;
  title: {
    english?: string;
    romaji: string;
  };
  siteUrl: string;
  coverImage: {
    medium: string;
  };
  format: string;
}

export interface Media {
  format: string;
  title: {
    english?: string;
    romaji: string;
  };
  siteUrl: string;
  coverImage: {
    medium: string;
  };
  bannerImage: string;
}
export interface StaffMember {
  role: string; // The role of the staff member
  node: {
    name: {
      full: string | "Unknown"; // Full name of the staff member
    };
  };
}

export interface Staff {
  edges: StaffMember[]; // An array of staff members
}

export interface InfoMedia {
  title: {
    romaji: string;
    native: string;
  };
  format: string;
  description: string;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  genres: string[];
  source: string;
  chapters?: number; // For manga, if applicable
  volumes?: number; // For manga, if applicable
  episodes?: number; // For anime, if applicable
  averageScore?: number; // Out of 100
  status: string; // e.g., "RELEASING", "FINISHED"
  nextAiringEpisode?: {
    id: number;
    airingAt: number;
    episode: number;
  };
  coverImage: {
    large: string;
    medium: string;
  };
  siteUrl: string;
  bannerImage: string;
  staff: Staff;
}

export interface AiringSchedule {
  id: number;
  anime: Anime;
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
  media: Media;
}
//media query response structure
export interface AnimeResponse {
  data: {
    Page: {
      media: Anime[];
    };
  };
}

// Response interface for Anime/Manga or any format Info
export interface MediaInfoResponse {
  data: {
    Media: InfoMedia;
  };
}

//AiringSchedule query response structure
export interface AiringScheduleResponse {
  data: {
    Page: {
      airingSchedules: AiringSchedule[];
    };
  };
}
