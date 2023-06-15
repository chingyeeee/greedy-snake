import React from "react";
import { Button } from "@chakra-ui/react";

const NewGame: React.FC = () => {
  return (
    <Button colorScheme="blue" onClick={() => location.reload()}>
      New game
    </Button>
  );
};

export default NewGame;
