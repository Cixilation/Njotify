import styled, { keyframes, css } from "styled-components";

interface DarkGrayBackgroundProps {
  isVisible: boolean;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;


const DarkGrayBackground = styled.div<DarkGrayBackgroundProps>`
  position: fixed;
  top: 0;
  right: 0;
  width: 20vw;
  height: 100vh;
   background-color: #222;
   overflow-x:scroll;
  animation: ${({ isVisible }) => (isVisible && css`${slideIn} 1s forwards` )};
`;


export default DarkGrayBackground