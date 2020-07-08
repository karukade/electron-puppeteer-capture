import React from "react"
import styled from "styled-components"

type BtnTypes = "primary" | "secondary"

type PropsType = {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  type: BtnTypes
}

const StyledBtn = styled.button`
  display: inline-block;
  background-color: #000;
  text-align: center;
  color: #fff;
  padding: 20px 18px;
  min-width: 300px;
`

const Button: React.FC<PropsType> = ({ children, onClick, type }) => {
  return <StyledBtn onClick={onClick}>{children}</StyledBtn>
}

export default Button
