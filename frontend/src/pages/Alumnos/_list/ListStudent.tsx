import Layout from "../../../components/Layout";
import { Container, Typography } from "@mui/material";

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
      </Container>
    </Layout>
  );
};

export default ListStudent;
