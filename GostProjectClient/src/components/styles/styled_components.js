import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap");

  body, pre, input, textarea, select {
    font-family: "Montserrat", sans-serif;
  }

  textarea {
    max-width: 95%;
    min-width: 95%;
  }

  button {
    padding: 1em;
    font-size: 20px;
    border-radius: 12px;
    border: none;
    margin: 1em;
  }

  button:hover {
    cursor: pointer;
  }

  a {
    text-decoration: none;
  }

  a:hover {
    cursor: pointer;
  }

  input {
    padding: 1em;
    border-radius: 12px;
    width: 90%;
    margin: 1em;
    border: 1px solid #a8a8a8;
  }

  table {
    border-collapse: separate;
    border: 1px solid #a8a8a8;
    border-spacing: 0;
    overflow: hidden;
    border-radius: 12px;
    table-layout: fixed;
  }

  thead th,
  tbody th,
  tbody td {
    border-bottom: 1px solid #e4e4e4;
    padding: 0.5em;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  select {
    width: 90%;
    border-radius: 12px;
  }
`;

const Button = styled.button`
  padding: 1em;
  font-size: 20px;
  border-radius: 12px;
  border: none;
  margin: 1em;

  &:hover {
    cursor: pointer;
  }
`;

const Input = styled.input`
  padding: 1em;
  border-radius: 12px;
  width: 90%;
  margin: 1em;
  border: 1px solid #a8a8a8;

  ${(props) =>
    props.isInvalid &&
    `
    border-color: red;
    background-color: #ffcdd2;
  `}
`;

const BodyContainer = styled.div`
  padding: 8em 5em;
`;

const BtnBlue = styled(Button)`
  background-color: #004696;
  color: #ffffff;
`;

const BtnWhite = styled(Button)`
  background-color: #ffffff;
  color: #292929;
`;

const BtnGray = styled(Button)`
  background-color: #a8a8a8;
  color: #ffffff;
`;

const BtnDarkGray = styled(Button)`
  background-color: #292929;
  color: #ffffff;
`;

const BtnMidGray = styled(Button)`
  background-color: #818181;
  color: #ffffff;
`;

const BtnDeleteNormativeReference = styled.button`
  background-color: #004696;
  color: #ffffff;
  font-size: 16px;
  padding: 0.5em;
`;

const BlackA = styled.a`
  color: #000000;
`;

export {
  GlobalStyle,
  Button,
  Input,
  BodyContainer,
  BtnBlue,
  BtnWhite,
  BtnGray,
  BtnDarkGray,
  BtnMidGray,
  BtnDeleteNormativeReference,
  BlackA,
};
