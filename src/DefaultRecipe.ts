export enum IngredientTypes {
  Flour = "flour",
  Salt = "salt",
  Starter = "starter",
  Water = "water",
}

export type Ingredient = {
  key: string;
  order: number;
  type: "flour" | "salt" | "starter" | "water";
  label: string;
  translateLabel: boolean;
  flourWeight: number;
  waterWeight: number;
  saltWeight: number;
};

export type Recipe = {
  id: string;
  version: number;
  ingredients: Ingredient[];
};

export const DefaultRecipe: Recipe = {
  id: "1",
  version: 1,
  ingredients: [
    {
      key: "1",
      order: 1,
      type: "starter",
      label: "starter",
      translateLabel: true,
      flourWeight: 75,
      waterWeight: 75,
      saltWeight: 0,
    },
    {
      key: "2",
      order: 2,
      type: "flour",
      label: "plainFlour",
      translateLabel: true,
      flourWeight: 375,
      waterWeight: 0,
      saltWeight: 0,
    },
    {
      key: "3",
      order: 3,
      type: "flour",
      label: "ryeFlour",
      translateLabel: true,
      flourWeight: 75,
      waterWeight: 0,
      saltWeight: 0,
    },
    {
      key: "4",
      order: 4,
      type: "flour",
      label: "wholemealFlour",
      translateLabel: true,
      flourWeight: 75,
      waterWeight: 0,
      saltWeight: 0,
    },
    {
      key: "5",
      order: 5,
      type: "salt",
      label: "salt",
      translateLabel: true,
      flourWeight: 0,
      waterWeight: 0,
      saltWeight: 15,
    },
    {
      key: "6",
      order: 6,
      type: "water",
      label: "water",
      translateLabel: true,
      flourWeight: 0,
      waterWeight: 360,
      saltWeight: 0,
    },
  ],
};
