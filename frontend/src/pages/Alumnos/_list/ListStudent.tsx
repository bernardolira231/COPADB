import React, { useState } from 'react';
import { Container, Grid, Box } from "@mui/material";
import useEstudiantes from "../../../hooks/useEstudiantes";
import Layout from "../../../components/Layout";
import PageHeader from "./components/PageHeader";
import StudentsTable from "./components/StudentsTable";
import SearchBar from "./components/SearchBar";
import Actions from "./components/Actions";
import ConfirmationModal from "./components/ConfirmationModal";

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

  // Estado para el modal de confirmación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);

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

  // Función para abrir el modal de confirmación
  const handleDeleteClick = (id: number) => {
    setStudentToDelete(id);
    setDeleteModalOpen(true);
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (studentToDelete !== null) {
      await deleteEstudiante(studentToDelete);
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setStudentToDelete(null);
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
            mb: 3,
          }}
        >
          <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
          <Actions />
        </Box>

        <StudentsTable
          estudiantes={estudiantes}
          loading={loading}
          error={error}
          page={paginationInfo.page - 1}
          rowsPerPage={paginationInfo.per_page}
          totalCount={paginationInfo.total}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleDelete={handleDeleteClick}
        />

        <ConfirmationModal
          open={deleteModalOpen}
          title="Eliminar estudiante"
          message="¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer."
          confirmButtonText="Eliminar"
          cancelButtonText="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDestructive={true}
        />
      </Container>
    </Layout>
  );
};

export default ListStudent;
