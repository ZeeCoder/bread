import React, { useContext } from "react";
import Lang from "../Lang/Lang";
import { LanguageContext } from "../language-context";
import PackageJSON from "../../package.json";
import Calculator from "../Calculator/Calculator";
import { DefaultRecipe } from "../DefaultRecipe";
import SW from "../ServiceWorker/SW";
import styled from "@emotion/styled/macro";

const { version } = PackageJSON;

const UIRoot = styled.div`
  position: relative;
  font-family: sans-serif;
  padding: 30px 0 20px;
`;

const UIApp = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const UIAppTitleRow = styled.div`
  margin: 0 0 20px;
  padding: 0 10px;
  text-align: right;

  @media (min-width: 620px) {
    padding: 0;
  }
`;

const UIContactTitle = styled.h2`
  text-align: center;
  margin: 40px 0 5px;
  font-size: 20px;
`;

const UIContacts = styled.div`
  text-align: center;
`;

const UIContactButton = styled.a`
  display: inline-block;
  margin: 10px;
  font-weight: bold;
  color: black;
  text-decoration: none;
`;

const UIVersion = styled.div`
  text-align: center;
  opacity: 0.4;
  color: #444;
  margin-top: 10px;
`;

const App = () => {
  const { trans } = useContext(LanguageContext);

  return (
    <UIRoot>
      <SW />
      <UIApp>
        <UIAppTitleRow>
          <Lang />
        </UIAppTitleRow>
        <Calculator recipe={DefaultRecipe} />
      </UIApp>

      <UIContactTitle>{trans.contact}</UIContactTitle>
      <UIContacts>
        <UIContactButton href="mailto:contact@hubertviktor.com">
          E-mail
        </UIContactButton>
        <UIContactButton
          href="https://twitter.com/zeecoder"
          rel="noopener noreferrer"
          target="_blank"
        >
          Twitter
        </UIContactButton>
      </UIContacts>
      <UIVersion>v{version}</UIVersion>
    </UIRoot>
  );
};

export default App;
