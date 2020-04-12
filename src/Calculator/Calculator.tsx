import React, { useEffect, useReducer, useContext } from "react";
import { LanguageContext } from "../language-context";
import { nanoid } from "nanoid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faTimes,
  faDivide,
} from "@fortawesome/free-solid-svg-icons";
import { Ingredient, Recipe } from "../DefaultRecipe";
import styled from "@emotion/styled/macro";

const cleanInputValue = (value: string): number => {
  const number = parseInt(value);

  if (isNaN(number)) {
    return 0;
  }

  return number > 0 ? number : 0;
};

const UITable = styled.table`
  width: 100%;
`;

const UIIngredient = styled.tr`
  align-items: center;
  background: rgba(0, 0, 0, 0.1);

  &:nth-of-type(odd) {
    background: rgba(0, 0, 0, 0.15);
  }

  & td:first-of-type {
    width: 100px;
  }

  & td:last-of-type {
    width: 40px;
  }
`;

const UIIngredientLabel = styled.td`
  text-align: right;
  padding-left: 10px;
  word-break: break-word;
  font-weight: bold;
`;

const UIIngredientScaleWeight = styled.td`
  text-align: right;
  font-weight: bold;
  padding-left: 15px;
  padding-right: 5px;
`;

const UIIngredientWeightPercentage = styled.span`
  font-size: 14px;
  font-style: italic;
  margin-left: 10px;
  opacity: 0.5;
`;

const UIIngredientButtonWrapper = styled.td`
  text-align: center;
`;
const UIIngredientsFooter = styled.td`
  text-align: right;
  padding: 10px;
`;

const UIInput = styled.input`
  font-size: 20px;
  display: block;
  box-sizing: border-box;
  padding: 5px;
  padding-left: 10px;
  width: 100%;
  border: none;
  margin: 10px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.3);
`;

const UISummary = styled.td`
  background: rgba(0, 0, 0, 0.1);
  border-top: 2px solid;
  line-height: 25px;
  font-size: 18px;
  padding: 10px;
`;

const UISummaryRow = styled.div`
  display: flex;
`;

const UISummaryLabel = styled.div(({ right = false }: { right?: boolean }) => ({
  flex: 1,
  textAlign: right ? "right" : "initial",
}));

const UIHydrationBar = styled.div`
  height: 30px;
  background: #e8bf84;
  margin-bottom: 10px;
  position: relative;
`;

const UIHydrationBarWater = styled.div`
  background: #669be8;
  height: 100%;
  max-width: 100%;
`;

const UIHydrationBarLabel = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-weight: bold;
`;

const UIButton = styled.button(
  ({
    remove = false,
    add = false,
    multiply = false,
  }: {
    remove?: boolean;
    add?: boolean;
    multiply?: boolean;
  }) => `
    border: none;
    font-weight: bold;
    color: white;
    height: auto;
    line-height: 30px;
    text-align: center;
    border-radius: 4px;
    font-size: 22px;
    cursor: pointer;

    ${(remove && "background: red;") || ""}
    ${(add && "background: green;") || ""}
    ${
      (multiply &&
        `
        background: #4d98e8;
        font-size: 16px;
        margin: 4px;
      `) ||
      ""
    }
  `
);

const UIToolbar = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const UIMultipliers = styled.div`
  flex: 1;
  text-align: left;
`;

type Actions =
  | LoadAction
  | UpdateIngredientAction
  | RemoveIngredientAction
  | AddIngredientAction
  | MultiplyAction;

type LoadAction = {
  type: "load";
  recipe: Recipe;
};
type UpdateIngredientAction = {
  type: "updateIngredient";
  ingredient: Partial<Ingredient>;
};
type RemoveIngredientAction = {
  type: "removeIngredient";
  ingredient: Partial<Ingredient>;
};
type AddIngredientAction = { type: "addIngredient"; ingredient: Ingredient };
type MultiplyAction = { type: "multiply"; multiplier: number };

const recipeReducer = (state: Recipe, action: Actions): Recipe => {
  switch (action.type) {
    case "load":
      // const { type: a, ...asd } = action;
      // Only return a new state if the recipe actually changed. (Doesn't load
      // if just the object reference changes for example)
      return state.id === action.recipe.id ? state : action.recipe;
    case "updateIngredient":
      return {
        ...state,
        ingredients: state.ingredients.map((ingredient: Ingredient) => {
          if (action.ingredient.key === ingredient.key) {
            return { ...ingredient, ...action.ingredient };
          }

          return ingredient;
        }),
      };
    case "removeIngredient":
      return {
        ...state,
        ingredients: state.ingredients.filter(
          (ingredient) => action.ingredient.key !== ingredient.key
        ),
      };
    case "addIngredient":
      return {
        ...state,
        ingredients: [...state.ingredients, action.ingredient],
      };
    case "multiply":
      return {
        ...state,
        ingredients: state.ingredients.map((ingredient) => {
          let changeset = {};
          if (ingredient.type === "salt") {
            changeset = {
              saltWeight: Math.round(ingredient.saltWeight * action.multiplier),
            };
          } else if (ingredient.type === "starter") {
            changeset = {
              flourWeight: Math.floor(
                ingredient.flourWeight * action.multiplier
              ),
              waterWeight: Math.ceil(
                ingredient.waterWeight * action.multiplier
              ),
            };
          } else if (ingredient.type === "flour") {
            changeset = {
              flourWeight: Math.round(
                ingredient.flourWeight * action.multiplier
              ),
            };
          } else {
            // water
            changeset = {
              waterWeight: Math.round(
                ingredient.waterWeight * action.multiplier
              ),
            };
          }

          return {
            ...ingredient,
            ...changeset,
          };
        }),
      };
    default:
      console.error("unrecognised action");
      return state;
  }
};

const Calculator = ({ recipe: loadedRecipe }: { recipe: Recipe }) => {
  const { trans } = useContext(LanguageContext);
  const [recipe, dispatch] = useReducer(recipeReducer, loadedRecipe);

  const renderRow = ({
    ingredient,
    scaleWeight,
    handleChange,
    renderButton,
  }: {
    ingredient: Ingredient;
    scaleWeight: number;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    renderButton: Function;
  }) => {
    const { key, label, translateLabel } = ingredient;
    const weight = getIngredientWeight(ingredient);

    return (
      <UIIngredient key={key}>
        <td>
          <UIInput type="number" value={weight || ""} onChange={handleChange} />
        </td>
        <UIIngredientLabel>
          {translateLabel ? trans[label] : label}
        </UIIngredientLabel>
        <UIIngredientScaleWeight>
          {scaleWeight}g
          <UIIngredientWeightPercentage>
            ({((weight / fullFlourWeight) * 100).toFixed(2)}%)
          </UIIngredientWeightPercentage>
        </UIIngredientScaleWeight>
        <UIIngredientButtonWrapper>{renderButton()}</UIIngredientButtonWrapper>
      </UIIngredient>
    );
  };

  const getSummary = () => {
    const flourWeight = ingredients.reduce((acc, ingredient) => {
      return acc + ingredient.flourWeight;
    }, 0);
    const waterWeight = ingredients.reduce((acc, ingredient) => {
      return acc + ingredient.waterWeight;
    }, 0);

    if (flourWeight === 0) {
      return "?";
    }

    const hydration = Math.round((waterWeight / flourWeight) * 100);

    return {
      hydration,
      flourWeight,
      waterWeight,
    };
  };

  const renderSummary = () => {
    const summary = getSummary();

    if (summary === "?") {
      return "?";
    }

    const { hydration, waterWeight, flourWeight } = summary;

    return (
      <UISummary colSpan={4}>
        <UIHydrationBar>
          <UIHydrationBarWater style={{ width: `${hydration}%` }} />
          <UIHydrationBarLabel>{hydration}%</UIHydrationBarLabel>
        </UIHydrationBar>
        <UISummaryRow>
          <UISummaryLabel>
            <b>{trans.water}:</b> {waterWeight}g
          </UISummaryLabel>
          <UISummaryLabel right={true}>
            <b>{trans.flour}:</b> {flourWeight}g
          </UISummaryLabel>
        </UISummaryRow>
      </UISummary>
    );
  };

  // Internalise loaded recipe state on change
  useEffect(() => {
    dispatch({ type: "load", recipe: loadedRecipe });
  }, [loadedRecipe.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const ingredients = [...recipe.ingredients].sort((a, b) =>
    a.order < b.order ? -1 : 1
  );

  const fullFlourWeight = ingredients.reduce(
    (acc, ingredient) => acc + ingredient.flourWeight,
    0
  );

  const getIngredientWeight = (ingredient: Ingredient) =>
    (ingredient.flourWeight || 0) +
    (ingredient.waterWeight || 0) +
    (ingredient.saltWeight || 0);

  let scaleWeight = 0;
  const getNextScaleWeight = (ingredient: Ingredient) =>
    (scaleWeight += getIngredientWeight(ingredient));

  return (
    <UITable cellSpacing="0">
      <tbody>
        {ingredients.map((ingredient) =>
          renderRow({
            ingredient,
            scaleWeight: getNextScaleWeight(ingredient),
            handleChange: (event) => {
              const value = cleanInputValue(event.target.value);
              const { key, type } = ingredient;

              const dispatchChangeSet = (changeSet: Partial<Ingredient>) =>
                dispatch({
                  type: "updateIngredient",
                  ingredient: { key, ...changeSet },
                });

              if (type === "starter") {
                // todo update the below lines when starter hydration can be changed
                const flourWeight = Math.floor(value / 2);
                const waterWeight = Math.ceil(value / 2);

                dispatchChangeSet({
                  flourWeight,
                  waterWeight,
                });
              } else if (type === "salt") {
                dispatchChangeSet({ saltWeight: value });
              } else if (type === "water") {
                dispatchChangeSet({ waterWeight: value });
              } else if (type === "flour") {
                dispatchChangeSet({ flourWeight: value });
              }
            },
            renderButton: () => {
              // todo make this fully dynamic instead of having unremovable ingredients
              if (ingredient.type === "flour") {
                return (
                  <UIButton
                    remove={true}
                    onClick={() =>
                      dispatch({
                        type: "removeIngredient",
                        ingredient: { key: ingredient.key },
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faMinus} size="xs" />
                  </UIButton>
                );
              }

              return null;
            },
          })
        )}
        <UIIngredient>
          <UIIngredientsFooter colSpan={4}>
            <UIToolbar>
              <UIMultipliers>
                <UIButton
                  multiply={true}
                  onClick={() =>
                    dispatch({
                      type: "multiply",
                      multiplier: 0.25,
                    })
                  }
                >
                  <FontAwesomeIcon icon={faDivide} size="xs" />4
                </UIButton>
                <UIButton
                  multiply={true}
                  onClick={() =>
                    dispatch({
                      type: "multiply",
                      multiplier: 0.5,
                    })
                  }
                >
                  <FontAwesomeIcon icon={faDivide} size="xs" />2
                </UIButton>
                <UIButton
                  multiply={true}
                  onClick={() =>
                    dispatch({
                      type: "multiply",
                      multiplier: 1.5,
                    })
                  }
                >
                  <FontAwesomeIcon icon={faTimes} size="xs" />
                  1.5
                </UIButton>
                <UIButton
                  multiply={true}
                  onClick={() =>
                    dispatch({
                      type: "multiply",
                      multiplier: 2,
                    })
                  }
                >
                  <FontAwesomeIcon icon={faTimes} size="xs" />2
                </UIButton>
              </UIMultipliers>
              <div>
                <UIButton
                  add={true}
                  onClick={() => {
                    // todo support adding with label and different types on top of flour
                    dispatch({
                      type: "addIngredient",
                      ingredient: {
                        type: "flour",
                        key: nanoid(5),
                        order: ingredients[ingredients.length - 1].order + 1,
                        flourWeight: 0,
                        waterWeight: 0,
                        saltWeight: 0,
                        label: "flour",
                        translateLabel: true,
                      },
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} size="xs" />
                </UIButton>
              </div>
            </UIToolbar>
          </UIIngredientsFooter>
        </UIIngredient>
        <tr>{renderSummary()}</tr>
      </tbody>
    </UITable>
  );
};

export default Calculator;
