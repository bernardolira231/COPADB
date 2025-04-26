import Layout from "../../../components/Layout";
import { Box, Container, Typography } from "@mui/material";
import Actions from "./components/Actions";

const ListStudent = () => {
  return (
    <Layout>
      <Container sx={{ mt: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          color="primary"
          fontWeight="bold"
        >
          Listado de Estudiantes
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Actions />
        </Box>
      </Container>
    </Layout>
  );
};

export default ListStudent;
