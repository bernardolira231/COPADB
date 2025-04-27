import Layout from "../../../components/Layout";
import { Container, Grid, Box } from "@mui/material";
import { useState } from "react";
import useEstudiantes from "../../../hooks/useEstudiantes";
import PageHeader from "./components/PageHeader";
import StudentsTable from "./components/StudentsTable";
import SearchBar from "./components/SearchBar";
import Actions from "./components/Actions";

const ListStudent = () => {
  const {
    estudiantes,
    loading,
    error,
    paginationInfo,
    searchTerm,
    setSearchTerm,
    fetchEstudiantes,
    deleteEstudiante,
  } = useEstudiantes();

  // Manejadores para la paginación
  const handleChangePage = (_event: unknown, newPage: number) => {
    fetchEstudiantes(newPage, paginationInfo.per_page);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    fetchEstudiantes(1, newRowsPerPage);
  };

  // Función para manejar la eliminación de un estudiante
  const handleDelete = async (id: number) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este estudiante?")
    ) {
      await deleteEstudiante(id);
    }
  };

  // Función para manejar la búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <Layout>
      <Container sx={{ mt: 3 }}>
        <PageHeader />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
            mt: 3,
          }}
        >
          <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
          <Actions />
        </Box>

        <StudentsTable
          estudiantes={estudiantes}
          loading={loading}
          error={error}
          page={paginationInfo.page}
          rowsPerPage={paginationInfo.per_page}
          totalCount={paginationInfo.total}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleDelete={handleDelete}
        />
      </Container>
    </Layout>
  );
};

export default ListStudent;
