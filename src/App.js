import React, { useState, useContext } from "react";
import styles from "./App.module.css";
import AddToHomeScreen from "./AddToHomeScreen/AddToHomeScreen";
import Lang from "./Lang/Lang";
import { LanguageContext } from "./language-context";
import { version } from "../package.json";

const Row = ({
  name,
  weight,
  scaleWeight,
  handleChange,
  flourWeight,
  children
}) => (
  <tr className={styles.ingredient}>
    <td className={styles.inputWrapper}>
      <input
        type="number"
        value={weight}
        className={styles.input}
        onChange={handleChange}
      />
    </td>
    <td className={styles.name}>{name}</td>
    <td className={styles.scaleWeight}>
      {scaleWeight}g
      {flourWeight ? ` (${((weight / flourWeight) * 100).toFixed(2)}%)` : ""}
    </td>
    <td className={styles.buttonWrapper}>{children}</td>
  </tr>
);

const App = () => {
  const { trans: t } = useContext(LanguageContext);
  const [state, setState] = useState({
    salt: 15,
    water: 360,
    starter: 150,
    flours: [
      { name: "trans|PlainFlour", weight: 375 },
      { name: "trans|RyeFlour", weight: 75 },
      { name: "trans|WholemealFlour", weight: 75 }
    ]
  });

  const getFlourWeight = () =>
    state.starter / 2 +
    state.flours.reduce((acc, flour) => acc + flour.weight, 0);

  const getSummary = () => {
    const flourWeight = getFlourWeight();

    const waterWeight = state.water + state.starter / 2;

    if (flourWeight === 0) {
      return "N/A";
    }

    const hydration = parseInt((waterWeight / flourWeight) * 100);

    return {
      hydration,
      flourWeight,
      waterWeight
    };
  };

  const handleWeightChange = (name, weight) =>
    setState({ ...state, [name]: parseInt(weight) });
  const handleWaterWeightChange = ({ target }) =>
    handleWeightChange("water", target.value);
  const handleSaltWeightChange = ({ target }) =>
    handleWeightChange("salt", target.value);
  const handleStarterWeightChange = ({ target }) =>
    handleWeightChange("starter", target.value);
  const handleFlourWeightChange = (index, { target }) => {
    const flour = {
      ...state.flours[index],
      weight: parseInt(target.value)
    };

    const flours = [...state.flours];
    flours.splice(index, 1, flour);

    setState({ ...state, flours });
  };
  const removeFlour = index => {
    const flours = [...state.flours];

    flours.splice(index, 1);
    setState({ ...state, flours });
  };

  const addFlour = () =>
    setState({
      ...state,
      flours: state.flours.concat([{ name: "trans|Flour", weight: 0 }])
    });

  const renderSummary = () => {
    const { hydration, waterWeight, flourWeight } = getSummary();

    return (
      <td colSpan={4} className={styles.summary}>
        <div className={styles.hydrationBar}>
          <div
            className={styles.hydrationBarWater}
            style={{ width: `${hydration}%` }}
          />
          <div className={styles.hydrationBarLabel}>{hydration}%</div>
        </div>

        <div className={styles.summaryRow}>
          <div className={styles.summaryLabel}>
            <b>{t.water}:</b> {waterWeight}g
          </div>
          <div
            className={[styles.summaryLabel, styles.summaryLabelRight].join(
              " "
            )}
          >
            <b>{t.flour}:</b> {flourWeight}g
          </div>
        </div>
      </td>
    );
  };

  const flourWeight = getFlourWeight();

  let scaleWeight = 0;
  const getScaleWeight = weight => (scaleWeight += weight);

  return (
    <div className={styles.root}>
      <div className={styles.app}>
        <AddToHomeScreen />
        <div className={styles.titleRow}>
          <Lang />
          <button className={styles.addFlourButton} onClick={addFlour}>
            {t.addFlour}
          </button>
        </div>
        <table className={styles.ingredients} cellSpacing="0">
          <tbody>
            <Row
              name={t.starter}
              weight={state.starter}
              scaleWeight={getScaleWeight(state.starter)}
              handleChange={handleStarterWeightChange}
              flourWeight={flourWeight}
            />
            {state.flours.map(({ name, weight }, index) => (
              <Row
                key={index}
                name={name.indexOf("trans|") === 0 ? t[name] : name}
                weight={weight}
                scaleWeight={getScaleWeight(weight || 0)}
                handleChange={handleFlourWeightChange}
              >
                {state.flours.length > 1 ? (
                  <button
                    className={styles.removeFlourBtn}
                    onClick={removeFlour}
                  >
                    -
                  </button>
                ) : null}
              </Row>
            ))}
            <Row
              name={t.salt}
              weight={state.salt}
              scaleWeight={getScaleWeight(state.salt)}
              handleChange={handleSaltWeightChange}
              flourWeight={flourWeight}
            />
            <Row
              name={t.water}
              weight={state.water}
              scaleWeight={getScaleWeight(state.water)}
              handleChange={handleWaterWeightChange}
            />
            <tr className={styles.ingredient}>{renderSummary()}</tr>
          </tbody>
        </table>
      </div>

      <div className={styles.version}>v{version}</div>
      <h2 className={styles.contactTitle}>{t.contact}</h2>
      <div className={styles.contacts}>
        <a className={styles.contactButton} href="mailto:rpgmorpheus@gmail.com">
          E-mail
        </a>
        <a
          className={styles.contactButton}
          href="https://twitter.com/zeecoder"
          rel="noopener noreferrer"
          target="_blank"
        >
          Twitter
        </a>
      </div>
    </div>
  );
};

export default App;
