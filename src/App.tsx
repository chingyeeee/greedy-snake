import React from "react";
import "./App.css";
import Canvas from "./Canvas";
import NewGame from "./NewGame";
import { Center, Divider } from "@chakra-ui/react";

function App() {
  return (
    <>
      <Canvas />
      <Center height="50px">
        <Divider orientation="horizontal" />
      </Center>
      <NewGame />
    </>
  );
}

export default App;
