import { Center } from "@chakra-ui/react";
import React from "react";
import "./App.css";
import PlayGround from "./PlayGround";

function App() {
  return (
    <>
      <Center height="50px">
        <h1 className="text-white text-xl font-bold">Greedy Snake</h1>
      </Center>

      <PlayGround />
    </>
  );
}

export default App;
