import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {    
    background-color: #12141D;
    color: #FBFBFC;
    overflow-x: none;
  }

  * { 
    border: 0;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }

  button {
    cursor: pointer;
    background-color: transparent;
  }

  textarea:focus, input:focus{
    outline: none;
  }  
    
`
