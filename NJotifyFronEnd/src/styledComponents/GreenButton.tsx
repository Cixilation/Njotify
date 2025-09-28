import styled from "styled-components";

const GreenButton = styled.button`
  width: 45%;
  border-radius: 50px;
  background-color: rgba(29, 185, 84);
  color: black;
  font-weight: 800;
  padding: 5px 25px;

  &:hover {
    background-color: rgba(19, 145, 64);
    border: 1px solid rgba(19, 145, 64);
  }

  &:active {
    border: 1px solid rgba(19, 145, 64);
  }

  &:focus {
    border-color: rgba(29, 185, 84);
    outline: none;
  }
`;

export default GreenButton;
