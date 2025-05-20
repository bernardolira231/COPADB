import React, { useState } from "react";
import { Container, Grid, Box } from "@mui/material";
import useProfesores from "../../../hooks/useProfesores";
import Layout from "../../../components/Layout";
import { PageHeader, ProfesoresTable, SearchBar, Actions, ConfirmationModal } from "./components";

const ListProfesores = () => {
  const {
    profesores,
    loading,
    error,
    paginationInfo,
    searchTerm,
    setSearchTerm,
    fetchProfesores,
    deleteProfesor,
  } = useProfesores();

  // Estado para el modal de confirmación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [profesorToDelete, setProfesorToDelete] = useState<number | null>(null);

  // Manejadores para la paginación
  const handleChangePage = (_event: unknown, newPage: number) => {
    fetchProfesores(newPage, paginationInfo.per_page);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    fetchProfesores(1, newRowsPerPage);
  };

  // Función para abrir el modal de confirmación
  const handleDeleteClick = (id: number) => {
    setProfesorToDelete(id);
    setDeleteModalOpen(true);
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (profesorToDelete !== null) {
      await deleteProfesor(profesorToDelete);
      setDeleteModalOpen(false);
      setProfesorToDelete(null);
    }
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setProfesorToDelete(null);
  };

  // Función para manejar la búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchProfesores(1, paginationInfo.per_page, term);
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PageHeader />
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
          <SearchBar
            searchTerm={searchTerm}
            onSearch={handleSearch}
          />
          <Actions />
        </Box>
        <ProfesoresTable
          profesores={profesores}
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
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="Eliminar Profesor"
          message="¿Estás seguro de que deseas eliminar este profesor? Esta acción no se puede deshacer."
        />
      </Container>
    </Layout>
  );
};

export default ListProfesores;
