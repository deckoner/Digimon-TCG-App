export interface CardSimple {
  id: number;
  card_number: string;
  name: string;
  card_type: number;
  rarity: number;
  color_one: number;
  color_two?: number | null;
  color_three?: number | null;
  image_url: string;
  cost?: number | null;
  stage?: number | null;
  attribute?: number | null;
  type_one: number;
  type_two?: number | null;
  bt_abbreviation: number;
  alternative: boolean;
}

export interface CardDetail extends CardSimple {
  dp?: number | null;
  evolution_cost_one?: number | null;
  evolution_cost_two?: number | null;
  effect?: string | null;
  evolution_effect?: string | null;
  security_effect?: string | null;
}
