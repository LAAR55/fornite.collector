import { LowercasePlayerPlatform, Player, PlayerPlatform } from "../types/player";

interface PlayerSchemaData {
  id: string;
  displayName: string;
}

export const createPlayerSchema = (playerData: PlayerSchemaData, platform: LowercasePlayerPlatform) => {
  const {
    id,
    displayName,
  } = playerData;

  // tslint:disable:object-literal-sort-keys
  const playerItem: Player = {
    PlayerId: id,
    IndexedName: displayName.toLowerCase(),
    DisplayName: displayName,
    Platform: platform.toUpperCase() as PlayerPlatform,
    IsSkinChangeable: true,
    IsPro: false,
    Timestamps: {
      UpdatedAt: new Date().toISOString(),
      CreatedAt: new Date().toISOString(),
    },
  };

  return playerItem;
};
