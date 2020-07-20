import React from "react"

import { CaptureTargetInfo } from "../../main/services/urlListParser"

const Capture: React.FC<{ listItem: CaptureTargetInfo }> = ({ listItem }) => {
  // const { url, capturing, captureTargets, invalidUrl, done, status } = listItem
  return (
    <div>
      <div>{JSON.stringify(listItem)}</div>
    </div>
  )
}

export default Capture
