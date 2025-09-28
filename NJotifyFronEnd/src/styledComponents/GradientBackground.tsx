import styled from 'styled-components';

const GradientBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(to top, black, #333);
  overflow-y: scroll;
  color: white;
`;

export default GradientBackground;