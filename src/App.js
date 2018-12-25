import React, { Component } from "react";
import styles from "./App.module.css";
import AddToHomeScreen from "./AddToHomeScreen/AddToHomeScreen";
import Lang from "./Lang/Lang";
import LanguageProvider from "./LanguageProvider";

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

class App extends Component {
  state = {
    salt: 15,
    water: 360,
    starter: 150,
    flours: [
      { name: "Plain Flour", weight: 375 },
      { name: "Rye Flour", weight: 75 },
      { name: "Wholemeal Flour", weight: 75 }
    ]
  };

  getFlourWeight() {
    return (
      this.state.starter / 2 +
      this.state.flours.reduce((acc, flour) => acc + flour.weight, 0)
    );
  }

  getSummary() {
    const flourWeight = this.getFlourWeight();

    const waterWeight = this.state.water + this.state.starter / 2;

    if (flourWeight === 0) {
      return "N/A";
    }

    const hydration = parseInt((waterWeight / flourWeight) * 100);

    return {
      hydration,
      flourWeight,
      waterWeight
    };
  }

  handleWeightChange = (name, weight) =>
    this.setState({ [name]: parseInt(weight) });

  handleWaterWeightChange = ({ target }) =>
    this.handleWeightChange("water", target.value);

  handleSaltWeightChange = ({ target }) =>
    this.handleWeightChange("salt", target.value);

  handleStarterWeightChange = ({ target }) =>
    this.handleWeightChange("starter", target.value);

  handleFlourWeightChange = (index, { target }) => {
    const flour = {
      ...this.state.flours[index],
      weight: parseInt(target.value)
    };

    const flours = [...this.state.flours];
    flours.splice(index, 1, flour);

    this.setState({ flours });
  };

  removeFlour = index => {
    const flours = [...this.state.flours];

    flours.splice(index, 1);
    this.setState({ flours });
  };

  addFlour = () =>
    this.setState({
      flours: this.state.flours.concat([{ name: "Flour", weight: 0 }])
    });

  renderSummary() {
    const { hydration, flourWeight, waterWeight } = this.getSummary();

    return (
      <td colSpan={4} className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Flour weight:</span>{" "}
          {flourWeight}g
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Water weight:</span>{" "}
          {waterWeight}g
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Hydration:</span> {hydration}%
        </div>
      </td>
    );
  }

  render() {
    const flourWeight = this.getFlourWeight();

    let scaleWeight = 0;
    const getScaleWeight = weight => (scaleWeight += weight);

    return (
      <LanguageProvider>
        <div className={styles.root}>
          <div className={styles.menu} />

          <div className={styles.app}>
            <AddToHomeScreen />
            <div className={styles.titleRow}>
              <Lang />
              <button className={styles.addFlourButton} onClick={this.addFlour}>
                Add Flour
              </button>
            </div>
            <table className={styles.ingredients} cellSpacing="0">
              <thead>
                <tr>
                  <th className={styles.thInput} align="left">
                    Grams
                  </th>
                  <th />
                  <th align="right">Scale</th>
                  <th className={styles.thButton} />
                </tr>
              </thead>
              <tbody>
                <Row
                  name="Starter"
                  weight={this.state.starter}
                  scaleWeight={getScaleWeight(this.state.starter)}
                  handleChange={this.handleStarterWeightChange}
                  flourWeight={flourWeight}
                />
                {this.state.flours.map(({ name, weight }, index) => (
                  <Row
                    key={index}
                    name={name}
                    weight={weight}
                    scaleWeight={getScaleWeight(weight)}
                    handleChange={this.handleFlourWeightChange.bind(
                      this,
                      index
                    )}
                  >
                    {this.state.flours.length > 1 ? (
                      <button
                        className={styles.removeFlourBtn}
                        onClick={this.removeFlour.bind(this, index)}
                      >
                        -
                      </button>
                    ) : null}
                  </Row>
                ))}
                <Row
                  name="Salt"
                  weight={this.state.salt}
                  scaleWeight={getScaleWeight(this.state.salt)}
                  handleChange={this.handleSaltWeightChange}
                  flourWeight={flourWeight}
                />
                <Row
                  name="Water"
                  weight={this.state.water}
                  scaleWeight={getScaleWeight(this.state.water)}
                  handleChange={this.handleWaterWeightChange}
                />
                <tr className={styles.ingredient}>{this.renderSummary()}</tr>
              </tbody>
            </table>
          </div>

          <h2 className={styles.contactTitle}>Contact</h2>
          <div className={styles.contacts}>
            <a
              className={styles.contactButton}
              href="mailto:rpgmorpheus@gmail.com"
            >
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
      </LanguageProvider>
    );
  }
}

export default App;
