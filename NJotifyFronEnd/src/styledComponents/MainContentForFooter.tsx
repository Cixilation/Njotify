import styled, { keyframes, css } from "styled-components";

interface MainContentProps {
  sideBar: boolean;
}


const expandWidth = keyframes`
  from {
    width: calc(100vw - 18vw);
  }
  to {
    width: calc(100vw - 18vw - 20vw);
  }
`;

const MainFooterContent = styled.div<MainContentProps>`
  width: ${({ sideBar }) => (sideBar ? 'calc(100vw - 18vw - 20vw)' : 'calc(100vw - 18vw)')};
  position: absolute;
  height: 30vh;
  left: 18vw;
  transition: width 1s ease;
  overflow-x: hidden;
  ${({ sideBar }) =>
    css`
      animation: ${sideBar && expandWidth } 1s forwards;
    `}
`;

export default MainFooterContent;
