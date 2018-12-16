import React, { Component } from "react";
import styles from "./App.module.css";

const Input = ({ name, weight, scaleWeight, handleChange }) => (
  <div className={styles.inputWrapper}>
    <div>
      <input
        type="number"
        value={weight}
        className={styles.input}
        onChange={handleChange}
      />
    </div>
    <div className={styles.name}>{name}</div>
    <div className={styles.scaleWeight}>{scaleWeight}g</div>
  </div>
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

  getHydration() {
    const flourWeight =
      this.state.starter / 2 +
      this.state.flours.reduce((acc, flour) => acc + flour.weight, 0);

    const waterWeight = this.state.water + this.state.starter / 2;

    if (flourWeight === 0) {
      return "N/A";
    }

    return parseInt((waterWeight / flourWeight) * 100) + "%";
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

  render() {
    let scaleWeight = 0;

    const getScaleWeight = weight => (scaleWeight += weight);

    return (
      <div className={styles.root}>
        <div className={styles.hydration}>Hydration: {this.getHydration()}</div>
        <button className={styles.addFlourButton} onClick={this.addFlour}>
          Add Flour
        </button>
        <div>
          <Input
            name="Starter"
            weight={this.state.starter}
            scaleWeight={getScaleWeight(this.state.starter)}
            handleChange={this.handleStarterWeightChange}
          />
          {this.state.flours.map(({ name, weight }, index) => (
            <div key={index} className={styles.flourInputWrapper}>
              <Input
                name={name}
                weight={weight}
                scaleWeight={getScaleWeight(weight)}
                handleChange={this.handleFlourWeightChange.bind(this, index)}
              />
              {this.state.flours.length > 1 ? (
                <button
                  className={styles.removeFlourBtn}
                  onClick={this.removeFlour.bind(this, index)}
                >
                  -
                </button>
              ) : null}
            </div>
          ))}
          <Input
            name="Salt"
            weight={this.state.salt}
            scaleWeight={getScaleWeight(this.state.salt)}
            handleChange={this.handleSaltWeightChange}
          />
          <Input
            name="Water"
            weight={this.state.water}
            scaleWeight={getScaleWeight(this.state.water)}
            handleChange={this.handleWaterWeightChange}
          />
        </div>
      </div>
    );
  }
}

export default App;
