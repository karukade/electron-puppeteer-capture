import React, { useEffect } from "react"

const Counter: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  useEffect(() => {
    console.log("effect call")
  }, [onClick])
  return (
    <div>
      <button onClick={onClick}>INC</button>
    </div>
  )
}

export default React.memo(Counter)
