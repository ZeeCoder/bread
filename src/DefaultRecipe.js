import {
  TYPE__FLOUR,
  TYPE__SALT,
  TYPE__STARTER,
  TYPE__WATER
} from "./Calculator/Calculator";

export default {
  id: "1",
  version: 1,
  ingredients: [
    {
      key: "1",
      order: 1,
      type: TYPE__STARTER,
      label: "starter",
      translateLabel: true,
      flourWeight: 75,
      waterWeight: 75,
      saltWeight: 0
    },
    {
      key: "2",
      order: 2,
      type: TYPE__FLOUR,
      label: "plainFlour",
      translateLabel: true,
      flourWeight: 375,
      waterWeight: 0,
      saltWeight: 0
    },
    {
      key: "3",
      order: 3,
      type: TYPE__FLOUR,
      label: "ryeFlour",
      translateLabel: true,
      flourWeight: 75,
      waterWeight: 0,
      saltWeight: 0
    },
    {
      key: "4",
      order: 4,
      type: TYPE__FLOUR,
      label: "wholemealFlour",
      translateLabel: true,
      flourWeight: 75,
      waterWeight: 0,
      saltWeight: 0
    },
    {
      key: "5",
      order: 5,
      type: TYPE__SALT,
      label: "salt",
      translateLabel: true,
      flourWeight: 0,
      waterWeight: 0,
      saltWeight: 15
    },
    {
      key: "6",
      order: 6,
      type: TYPE__WATER,
      label: "water",
      translateLabel: true,
      flourWeight: 0,
      waterWeight: 360,
      saltWeight: 0
    }
  ]
};
