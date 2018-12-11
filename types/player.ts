import { Timestamps } from "./meta";

export type LowercasePlayerPlatform =
  | "pc"
  | "ps4"
  | "xb1";

export type PlayerPlatform =
  | "PC"
  | "PS4"
  | "XB1";

export interface ProfessionalOrg {
  ProOrgId: string;
  DisplayName: string;
  TwitterHandle: string;
}

export interface PlayerSocialLinks {
  TwitterHandle?: string;
  TwitchHandle?: string;
  InstagramHandle?: string;
  FacebookHandle?: string;
}

export interface Player {
  PlayerId: string;
  IndexedName: string;
  DisplayName: string;
  Platform: PlayerPlatform;
  InAppSkin?: string;
  IsSkinChangeable?: boolean;
  IsPro?: boolean;
  ProOrgId?: string;
  IsTwitchLive?: boolean;
  SocialLinks?: PlayerSocialLinks;
  Timestamps: Timestamps;
}

export interface DetailedStats {
  TotalKills: number;
  TotalMatches: number;
  KillsPerMatch: string;
  KillsPerMinute: string;
  MatchesWon: number;
  Placings: {
    Top3: number;
    Top5: number;
    Top6: number;
    Top10: number;
    Top12: number;
    Top25: number;
  };
  KDRatio: string;
  WinPercentage: string;
  Score: number;
  TimePlayed: string;
}

export interface PlayerStats {
  PlayerId: string;
  Modes: {
    Solo: DetailedStats;
    Duo: DetailedStats;
    Squad: DetailedStats;
  };
  OverAllStats: DetailedStats;
  Timestamps: Timestamps;
}
