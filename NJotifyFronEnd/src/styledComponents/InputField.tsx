import styled from 'styled-components';



const InputField = styled.input`
    background-color:black;
    padding: 10px;
    font-size: 14px;
    border: 1px solid white;
    border-radius: 4px;
    outline: none;
    color :white;
    width : 90%;
    
    &:focus {
    border-color: rgba(29, 185, 84);
  }
`;


export default InputField;