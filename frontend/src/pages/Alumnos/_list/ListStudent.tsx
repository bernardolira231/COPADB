import Layout from "../../../components/Layout";
import { Container } from "@mui/material";
import { useState } from "react";
import useEstudiantes from "../../../hooks/useEstudiantes";
import PageHeader from "./components/PageHeader";
import StudentsTable from "./components/StudentsTable";

const ListStudent = () => {
  const { estudiantes, loading, error, deleteEstudiante } = useEstudiantes();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Manejadores para la paginación
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para manejar la eliminación de un estudiante
  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
      await deleteEstudiante(id);
    }
  };

  return (
    <Layout>
      <Container sx={{ mt: 3 }}>
        <PageHeader />
        <StudentsTable 
          estudiantes={estudiantes}
          loading={loading}
          error={error}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleDelete={handleDelete}
        />
      </Container>
    </Layout>
  );
};

export default ListStudent;
