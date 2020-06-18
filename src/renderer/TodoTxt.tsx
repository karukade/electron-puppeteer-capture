import React from "react"

const Todo: React.FC<{ todo: string }> = ({ todo }) => <p>{todo}</p>

export default React.memo(Todo)
