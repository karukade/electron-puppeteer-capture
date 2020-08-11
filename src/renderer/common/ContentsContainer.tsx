import styled from "styled-components"

const ContentsContainer = styled.div`
  padding: 40px 20px;
  > * + * {
    margin-top: 40px;
  }
`

export default ContentsContainer
