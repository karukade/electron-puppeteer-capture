import React from "react"

import UrlListItem from "./UrlListItem"
import { StateType } from "../../shared/reducers"

const Capture: React.FC<{ list: NonNullable<StateType["urls"]["urls"]> }> = ({
  list,
}) => {
  return (
    <>
      {[...list].map(([key, listItem]) => (
        <UrlListItem key={key} listItem={listItem} />
      ))}
    </>
  )
}

export default Capture
