import React from "react"

// Components
import ContentsContainer from "../common/ContentsContainer"
import LogicsList from "./LogicsList"
import LogicRegister from "./LogicRegister"

const Logics: React.FC = () => {
  return (
    <ContentsContainer>
      <LogicRegister />
      <LogicsList />
    </ContentsContainer>
  )
}

export default Logics
