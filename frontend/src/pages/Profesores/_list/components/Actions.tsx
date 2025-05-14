import React from "react";
import { Button } from "@mui/material";
import { LuUserPlus } from "react-icons/lu";
import { Link } from "@tanstack/react-router";

const Actions = () => {
  return (
    <Link to="/profesores/agregar">
      <Button
        variant="contained"
        color="primary"
        startIcon={<LuUserPlus />}
        sx={{
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 500,
        }}
      >
        Agregar Usuario
      </Button>
    </Link>
  );
};

export default Actions;
