import React, { useRef, useState } from "react";
import io from 'socket.io-client'
import debounce from 'lodash.debounce'

import Editor from "@monaco-editor/react";

export default function App() {
  const editorRef = useRef();

  const socket = io()
  const [ message, setMessage ] = useState('')

  function handleEditorDidMount(_, editor) {
    socket.on('return', data => {
      setMessage(data.message)
    })

    editorRef.current = editor;
    editorRef.current.onDidChangeModelContent(
      debounce((event) => {
        socket.emit('code', editorRef.current.getValue())
      }, 3000)
    );
  }

  return (
    <>
      <Editor
        height="50vh"
        value="//write some code"
        editorDidMount={handleEditorDidMount}
        language="javascript"
        theme="dark"
      />
      <p>{message}</p>
    </>
  );
}