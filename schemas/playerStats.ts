import { LowercasePlayerPlatform, PlayerPlatform, PlayerStats } from "../types/player";

interface GameModeStats {
  wins: number;
  top3: number;
  top5: number;
  top6: number;
  top10: number;
  top12: number;
  top25: number;
  "k/d": string;
  "win%": string;
  matches: number;
  kills: number;
  timePlayed: string;
  killsPerMatch: string;
  killsPerMin: string;
  score: number;
}

interface PlayerInfo {
  accountId: string;
  username: string;
  platform: LowercasePlayerPlatform;
}

interface PlayerStatsSchemaData {
  group: {
    solo: GameModeStats;
    duo: GameModeStats;
    squad: GameModeStats;
    info: PlayerInfo;
    lifetimeStats: {
      wins: number;
      top3s: number;
      top5s: number;
      top6s: number;
      top10s: number;
      top12s: number;
      top25s: number;
      "k/d": string;
      "win%": string;
      matches: number;
      kills: number;
      timePlayed: string;
      killsPerMatch: string;
      killsPerMin: string;
      score: number;
    };
  };
}

export const createPlayerStatsSchema = (playerStats: PlayerStatsSchemaData) => {
  const {
    group: {
      solo,
      duo,
      squad,
      info,
      lifetimeStats,
    },
  } = playerStats;

  // tslint:disable:object-literal-sort-keys
  const playerStatsItem: PlayerStats = {
    PlayerId: info.accountId,
    Modes: {
      Solo: {
        TotalKills: solo.kills,
        TotalMatches: solo.matches,
        KillsPerMatch: solo.killsPerMatch,
        KillsPerMinute: solo.killsPerMin,
        MatchesWon: solo.wins,
        Placings: {
          Top3: solo.top3,
          Top5: solo.top5,
          Top6: solo.top6,
          Top10: solo.top10,
          Top12: solo.top12,
          Top25: solo.top25,
        },
        KDRatio: solo["k/d"],
        WinPercentage: solo["win%"],
        Score: solo.score,
        TimePlayed: solo.timePlayed,
      },
      Duo: {
        TotalKills: duo.kills,
        TotalMatches: duo.matches,
        KillsPerMatch: duo.killsPerMatch,
        KillsPerMinute: duo.killsPerMin,
        MatchesWon: duo.wins,
        Placings: {
          Top3: duo.top3,
          Top5: duo.top5,
          Top6: duo.top6,
          Top10: duo.top10,
          Top12: duo.top12,
          Top25: duo.top25,
        },
        KDRatio: duo["k/d"],
        WinPercentage: duo["win%"],
        Score: duo.score,
        TimePlayed: duo.timePlayed,
      },
      Squad: {
        TotalKills: squad.kills,
        TotalMatches: squad.matches,
        KillsPerMatch: squad.killsPerMatch,
        KillsPerMinute: squad.killsPerMin,
        MatchesWon: squad.wins,
        Placings: {
          Top3: squad.top3,
          Top5: squad.top5,
          Top6: squad.top6,
          Top10: squad.top10,
          Top12: squad.top12,
          Top25: squad.top25,
        },
        KDRatio: squad["k/d"],
        WinPercentage: squad["win%"],
        Score: squad.score,
        TimePlayed: squad.timePlayed,
      },
    },
    OverAllStats: {
      TotalKills: lifetimeStats.kills,
      TotalMatches: lifetimeStats.matches,
      KillsPerMatch: lifetimeStats.killsPerMatch,
      KillsPerMinute: lifetimeStats.killsPerMin,
      MatchesWon: lifetimeStats.wins,
      Placings: {
        Top3: lifetimeStats.top3s,
        Top5: lifetimeStats.top5s,
        Top6: lifetimeStats.top6s,
        Top10: lifetimeStats.top10s,
        Top12: lifetimeStats.top12s,
        Top25: lifetimeStats.top25s,
      },
      KDRatio: lifetimeStats["k/d"],
      WinPercentage: lifetimeStats["win%"],
      Score: lifetimeStats.score,
      TimePlayed: lifetimeStats.timePlayed,
    },
    Timestamps: {
      UpdatedAt: new Date().toISOString(),
      CreatedAt: new Date().toISOString(),
    },
  };

  return playerStatsItem;
};

export const updatePlayerStatsSchema = (playerStats: PlayerStatsSchemaData, updatedAt: number) => {
  const {
    group: {
      solo,
      duo,
      squad,
      info,
      lifetimeStats,
    },
  } = playerStats;

  // tslint:disable:object-literal-sort-keys
  const playerStatsItem: any = {
    PlayerId: info.accountId,
    Modes: {
      Solo: {
        TotalKills: solo.kills,
        TotalMatches: solo.matches,
        KillsPerMatch: solo.killsPerMatch,
        KillsPerMinute: solo.killsPerMin,
        MatchesWon: solo.wins,
        Placings: {
          Top3: solo.top3,
          Top5: solo.top5,
          Top6: solo.top6,
          Top10: solo.top10,
          Top12: solo.top12,
          Top25: solo.top25,
        },
        KDRatio: solo["k/d"],
        WinPercentage: solo["win%"],
        Score: solo.score,
        TimePlayed: solo.timePlayed,
      },
      Duo: {
        TotalKills: duo.kills,
        TotalMatches: duo.matches,
        KillsPerMatch: duo.killsPerMatch,
        KillsPerMinute: duo.killsPerMin,
        MatchesWon: duo.wins,
        Placings: {
          Top3: duo.top3,
          Top5: duo.top5,
          Top6: duo.top6,
          Top10: duo.top10,
          Top12: duo.top12,
          Top25: duo.top25,
        },
        KDRatio: duo["k/d"],
        WinPercentage: duo["win%"],
        Score: duo.score,
        TimePlayed: duo.timePlayed,
      },
      Squad: {
        TotalKills: squad.kills,
        TotalMatches: squad.matches,
        KillsPerMatch: squad.killsPerMatch,
        KillsPerMinute: squad.killsPerMin,
        MatchesWon: squad.wins,
        Placings: {
          Top3: squad.top3,
          Top5: squad.top5,
          Top6: squad.top6,
          Top10: squad.top10,
          Top12: squad.top12,
          Top25: squad.top25,
        },
        KDRatio: squad["k/d"],
        WinPercentage: squad["win%"],
        Score: squad.score,
        TimePlayed: squad.timePlayed,
      },
    },
    OverAllStats: {
      TotalKills: lifetimeStats.kills,
      TotalMatches: lifetimeStats.matches,
      KillsPerMatch: lifetimeStats.killsPerMatch,
      KillsPerMinute: lifetimeStats.killsPerMin,
      MatchesWon: lifetimeStats.wins,
      Placings: {
        Top3: lifetimeStats.top3s,
        Top5: lifetimeStats.top5s,
        Top6: lifetimeStats.top6s,
        Top10: lifetimeStats.top10s,
        Top12: lifetimeStats.top12s,
        Top25: lifetimeStats.top25s,
      },
      KDRatio: lifetimeStats["k/d"],
      WinPercentage: lifetimeStats["win%"],
      Score: lifetimeStats.score,
      TimePlayed: lifetimeStats.timePlayed,
    },
    Timestamps: {
      UpdatedAt: new Date(updatedAt).toISOString(),
    },
  };

  return playerStatsItem;
};
