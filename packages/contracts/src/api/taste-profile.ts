import type { StyleCardMetadata } from '../style-cards.js';

export interface TasteProfile {
  styleCards: StyleCardMetadata[];
  updatedAt: number | null;
}

export interface TasteProfileResponse {
  profile: TasteProfile;
}

export interface AcceptStyleCardRequest {
  styleCard: StyleCardMetadata;
}

export interface AcceptStyleCardResponse {
  styleCard: StyleCardMetadata;
  profile: TasteProfile;
}
