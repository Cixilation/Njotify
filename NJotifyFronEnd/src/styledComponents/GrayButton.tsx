import styled from "styled-components";

const GreyButton = styled.button`
  width: 90%;
  border-radius: 50px;
  background-color: #333;
  color: #fff;
  font-weight: 500;
  padding: 5px 5px;
  border: 1px solid rgba(255,255,255,0.5);

  &:hover {
    background-color: #555;
    border: 1px solid rgba(5,5,5,0.5);
  }

  &:active {
    background-color: #444;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(10,10,10 0.5);
  }
`;

export default GreyButton;
