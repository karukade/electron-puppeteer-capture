import React, { useState, useLayoutEffect, useRef } from "react"
import styled from "styled-components"
import { FixedSizeList } from "react-window"

import UrlListItem from "./UrlListItem"
import { StateType } from "../../shared/reducers"

//types
import { ArrayedUrlListType } from "../../main/services/urlListParser"

const Wrapper = styled.div`
  > * + * {
    border-top: solid 1px #e2e2e2;
  }
`

const UrlList: React.FC<{ list: ArrayedUrlListType }> = ({ list }) => {
  const [dimension, setDimension] = useState<{
    width: number
    height: number
  }>()
  const wrapper = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    let timer: number
    const set = () => {
      if (timer) window.cancelIdleCallback(timer)
      timer = window.requestIdleCallback(() =>
        setDimension({
          height: window.innerHeight,
          width: wrapper.current ? wrapper.current.clientWidth : 0,
        })
      )
    }
    window.addEventListener("resize", set)
    set()
    return () => {
      window.removeEventListener("resize", set)
    }
  }, [])
  return (
    <div ref={wrapper}>
      {dimension && (
        <FixedSizeList
          width={dimension.width}
          height={dimension.height}
          itemCount={list.length}
          itemSize={124}
        >
          {({ index, style }) => (
            <UrlListItem style={style} listItem={list[index]} />
          )}
        </FixedSizeList>
      )}
    </div>
  )
}

export default UrlList
