import React, { useEffect, useReducer, useContext } from "react";
import styles from "./Calculator.module.css";
import PropTypes from "prop-types";
import { LanguageContext } from "../language-context";
import nanoid from "nanoid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faTimes,
  faDivide
} from "@fortawesome/free-solid-svg-icons";

export const TYPE__SALT = "salt";
export const TYPE__WATER = "water";
export const TYPE__FLOUR = "flour";
export const TYPE__STARTER = "starter";

export const IngredientType = PropTypes.shape({
  key: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  type: PropTypes.oneOf([TYPE__SALT, TYPE__WATER, TYPE__FLOUR, TYPE__STARTER])
    .isRequired,
  flourWeight: PropTypes.number.isRequired,
  waterWeight: PropTypes.number.isRequired,
  saltWeight: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  translateLabel: PropTypes.bool.isRequired
});

const cleanInputValue = value => {
  const number = parseInt(value);

  if (isNaN(number)) {
    return "";
  }

  return number;
};

const reducer = (state, action) => {
  const { type, ...payload } = action;

  switch (type) {
    case "load":
      // Only return a new state if the recipe actually changed. (Doesn't load
      // if just the object reference changes for example)
      return state.id === payload.id ? state : payload;
    case "updateIngredient":
      return {
        ...state,
        ingredients: state.ingredients.map(ingredient => {
          if (payload.key === ingredient.key) {
            return { ...ingredient, ...payload };
          }

          return ingredient;
        })
      };
    case "removeIngredient":
      return {
        ...state,
        ingredients: state.ingredients.filter(
          ingredient => payload.key !== ingredient.key
        )
      };
    case "addIngredient":
      return {
        ...state,
        ingredients: [...state.ingredients, payload.ingredient]
      };
    case "multiply":
      return {
        ...state,
        ingredients: state.ingredients.map(ingredient => ({
          ...ingredient,
          flourWeight: ingredient.flourWeight * payload.multiplier,
          waterWeight: ingredient.waterWeight * payload.multiplier,
          saltWeight: ingredient.saltWeight * payload.multiplier
        }))
      };
    default:
      console.error("unrecognised action");
      return state;
  }
};

const Calculator = ({ recipe: loadedRecipe }) => {
  const { trans } = useContext(LanguageContext);
  const [recipe, dispatch] = useReducer(reducer, loadedRecipe);

  const renderRow = ({
    ingredient,
    scaleWeight,
    handleChange,
    renderButton
  }) => {
    const { key, label, translateLabel } = ingredient;
    const weight = getIngredientWeight(ingredient);

    return (
      <tr className={styles.ingredient} key={key}>
        <td>
          <input
            type="number"
            value={weight}
            className={styles.input}
            onChange={handleChange}
          />
        </td>
        <td className={styles.label}>
          {translateLabel ? trans[label] : label}
        </td>
        <td className={styles.scaleWeight}>
          {scaleWeight}g
          <span className={styles.weightPercentage}>
            ({((weight / fullFlourWeight) * 100).toFixed(2)}%)
          </span>
        </td>
        <td className={styles.buttonWrapper}>{renderButton()}</td>
      </tr>
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

    const hydration = parseInt((waterWeight / flourWeight) * 100);

    return {
      hydration,
      flourWeight,
      waterWeight
    };
  };

  const renderSummary = () => {
    const { hydration, waterWeight, flourWeight } = getSummary();

    return (
      <td colSpan={4} className={styles.summary}>
        <div className={styles.hydrationBar}>
          <div
            className={styles.hydrationBarWater}
            style={{ width: `${hydration}%` }}
          />
          <div className={styles.hydrationBarLabel}>
            {hydration > 100 ? ">100" : hydration}%
          </div>
        </div>
        <div className={styles.summaryRow}>
          <div className={styles.summaryLabel}>
            <b>{trans.water}:</b> {waterWeight}g
          </div>
          <div className={`${styles.summaryLabel} ${styles.summaryLabelRight}`}>
            <b>{trans.flour}:</b> {flourWeight}g
          </div>
        </div>
      </td>
    );
  };

  // Internalise loaded recipe state on change
  useEffect(() => {
    dispatch({ type: "load", ...loadedRecipe });
  }, [loadedRecipe.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const ingredients = [...recipe.ingredients].sort((a, b) =>
    a.order < b.order ? -1 : 1
  );

  const fullFlourWeight = ingredients.reduce(
    (acc, ingredient) => acc + ingredient.flourWeight,
    0
  );

  const getIngredientWeight = ingredient =>
    (parseInt(ingredient.flourWeight) || 0) +
    (parseInt(ingredient.waterWeight) || 0) +
    (parseInt(ingredient.saltWeight) || 0);

  let scaleWeight = 0;
  const getNextScaleWeight = ingredient =>
    (scaleWeight += getIngredientWeight(ingredient));

  return (
    <table className={styles.root} cellSpacing="0">
      <tbody>
        {ingredients.map(ingredient =>
          renderRow({
            ingredient,
            scaleWeight: getNextScaleWeight(ingredient),
            handleChange: event => {
              const value = cleanInputValue(event.target.value);
              const { key, type } = ingredient;

              const dispatchChangeSet = changeSet =>
                dispatch({ type: "updateIngredient", key, ...changeSet });

              if (type === TYPE__STARTER) {
                // todo update the below lines when starter hydration can be changed
                dispatchChangeSet({
                  flourWeight: value / 2,
                  waterWeight: value / 2
                });
              } else if (type === TYPE__SALT) {
                dispatchChangeSet({ saltWeight: value });
              } else if (type === TYPE__WATER) {
                dispatchChangeSet({ waterWeight: value });
              } else if (type === TYPE__FLOUR) {
                dispatchChangeSet({ flourWeight: value });
              }
            },
            renderButton: () => {
              // todo make this fully dynamic instead of having unremovable ingredients
              if (ingredient.type === TYPE__FLOUR) {
                return (
                  <button
                    className={`${styles.btn} ${styles.btnRemove}`}
                    onClick={() =>
                      dispatch({
                        type: "removeIngredient",
                        key: ingredient.key
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faMinus} size="xs" />
                  </button>
                );
              }

              return null;
            }
          })
        )}
        <tr className={styles.ingredient}>
          <td colSpan={4} className={styles.ingredientEmpty}>
            <div className={styles.toolbar}>
              <div className={styles.multipliers}>
                <button
                  className={`${styles.btn} ${styles.btnMultiply}`}
                  onClick={() =>
                    dispatch({
                      type: "multiply",
                      multiplier: 0.25
                    })
                  }
                >
                  <FontAwesomeIcon icon={faDivide} size="xs" />4
                </button>
                <button
                  className={`${styles.btn} ${styles.btnMultiply}`}
                  onClick={() =>
                    dispatch({
                      type: "multiply",
                      multiplier: 0.5
                    })
                  }
                >
                  <FontAwesomeIcon icon={faDivide} size="xs" />2
                </button>
                <button
                  className={`${styles.btn} ${styles.btnMultiply}`}
                  onClick={() =>
                    dispatch({
                      type: "multiply",
                      multiplier: 1.5
                    })
                  }
                >
                  <FontAwesomeIcon icon={faTimes} size="xs" />
                  1.5
                </button>
                <button
                  className={`${styles.btn} ${styles.btnMultiply}`}
                  onClick={() =>
                    dispatch({
                      type: "multiply",
                      multiplier: 2
                    })
                  }
                >
                  <FontAwesomeIcon icon={faTimes} size="xs" />2
                </button>
              </div>
              <div>
                <button
                  className={`${styles.btn} ${styles.btnAdd}`}
                  onClick={() => {
                    // todo support adding with label and different types on top of flour
                    dispatch({
                      type: "addIngredient",
                      ingredient: {
                        type: TYPE__FLOUR,
                        key: nanoid(5),
                        order: ingredients[ingredients.length - 1].order + 1,
                        flourWeight: 0,
                        waterWeight: 0,
                        saltWeight: 0,
                        label: "flour",
                        translateLabel: true
                      }
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} size="xs" />
                </button>
              </div>
            </div>
          </td>
        </tr>
        <tr className={styles.summary}>{renderSummary()}</tr>
      </tbody>
    </table>
  );
};

Calculator.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
    ingredients: PropTypes.arrayOf(IngredientType).isRequired
  }).isRequired
};

export default Calculator;
