import React, { useContext } from "react";
import styled from "@emotion/styled/macro";
import { LanguageContext } from "../language-context";

const StyledLang = styled("div")`
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  background: green;
  color: white;
  padding: 0 10px;
  border-radius: 4px;
  line-height: 40px;
  width: 30px;
`;

const Lang = () => {
  const { language, changeLanguage } = useContext(LanguageContext);

  const handleClick = () => {
    if (language === "en") {
      changeLanguage("hu");
    } else {
      changeLanguage("en");
    }
  };

  return <StyledLang onClick={handleClick}>{language}</StyledLang>;
};

export default Lang;
