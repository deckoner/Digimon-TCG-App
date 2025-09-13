export interface CardSimple {
  id: number;
  card_number: string;
  name: string;
  card_type: string;
  rarity: string;
  color_one: string;
  color_two?: string | null;
  color_three?: string | null;
  image_url: string;
  cost: number;
  stage?: string | null;
  attribute?: string | null;
  type_one: string;
  type_two?: string | null;
  bt_abbreviation: string;
  alternative: number;
}

export interface CardDetail extends CardSimple {
  dp?: number | null;
  evolution_cost_one?: number | null;
  evolution_cost_two?: number | null;
  effect?: string | null;
  evolution_effect?: string | null;
  security_effect?: string | null;
}
