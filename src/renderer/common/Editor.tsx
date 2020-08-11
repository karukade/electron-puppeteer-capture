import React, { useState, useLayoutEffect, useRef } from "react"
import MonacoEditor, { ChangeHandler } from "react-monaco-editor"

const Editor: React.FC<{
  onChange: ChangeHandler
  height?: number
  value?: string
}> = ({ onChange, value = "", height = 300 }) => {
  const editorContainer = useRef<HTMLDivElement>(null)
  const [dimension, setDimension] = useState({
    width: 0,
    height: 0,
  })

  useLayoutEffect(() => {
    const setEditorDimension = () => {
      if (editorContainer.current) {
        setDimension({
          width: editorContainer.current.clientWidth,
          height: editorContainer.current.clientHeight,
        })
      }
    }

    let timer: number
    const onResize = () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(setEditorDimension, 1000)
    }

    setEditorDimension()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])
  return (
    <div
      ref={editorContainer}
      style={{
        minHeight: `${height}px`,
        border: "1px solid #d9d9d9",
      }}
    >
      <MonacoEditor
        value={value}
        width={dimension.width}
        height={dimension.height}
        language="javascript"
        onChange={onChange}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  )
}

export default React.memo(Editor)
