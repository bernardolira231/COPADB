import { useState } from "react";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import ChangePasswordModal from "./ChangePasswordModal";
import { Snackbar, Alert } from "@mui/material";

const Profile = () => {
  const { user, loading, initializing, error } = useAuth();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success' | 'error'}>({open: false, message: '', severity: 'success'});

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch('http://localhost:5328/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al cambiar la contraseña');
      }

      setSnackbar({
        open: true,
        message: 'Contraseña cambiada exitosamente',
        severity: 'success'
      });
      
      return Promise.resolve();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || 'Error al cambiar la contraseña',
        severity: 'error'
      });
      return Promise.reject(error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getUserInitials = () => {
    if (!user) return "U";

    const firstInitial = user.name ? user.name.charAt(0).toUpperCase() : "";
    const lastInitial = user.lastname_f
      ? user.lastname_f.charAt(0).toUpperCase()
      : "";

    if (!firstInitial && !lastInitial) return "U";
    if (!lastInitial) return firstInitial;

    return firstInitial + lastInitial;
  };

  // Si todavía está inicializando, mostramos un indicador de carga
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Inicializando aplicación...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen p-6">
          <div className="p-6 rounded-lg shadow-md">
            <p>Cargando perfil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen p-6">
          <div className="p-6 rounded-lg shadow-md">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen p-6">
          <div className="p-6 rounded-lg shadow-md">
            <p className="text-red-500">
              No se encontró información del usuario
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <header className="bg-white p-6 rounded-lg shadow-sm mb-6 flex items-center">
          <h1 className="text-primary text-2xl font-bold flex-1">Mi Perfil</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna izquierda con avatar */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-primary text-white rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                {getUserInitials()}
              </div>
              <h2 className="text-xl font-semibold text-center">
                {user.name} {user.lastname_m} {user.lastname_f}
              </h2>
              <p className="text-gray-500 text-center mt-1">{user.email}</p>
              <small className="text-gray-500 text-center mt-1">
                {user.rol === 1
                  ? "Administrador"
                  : user.rol === 2
                    ? "Administrativo"
                    : "Profesor"}
              </small>
              <div className="mt-4 w-full border-t border-gray-200 pt-4">
                <p className="text-gray-600 text-sm text-center">
                  ID de Usuario: {user.id}
                </p>
              </div>
            </div>
          </div>

          {/* Columna derecha con información */}
          <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
            <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">
              Información Personal
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Nombre
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {user.name || "-"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Apellido
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {user.lastname_f || "-"} {user.lastname_m || "-"}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Correo Electrónico
                </label>
                <div className="bg-gray-50 p-3 rounded-md">{user.email}</div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3 mt-6">
                  Seguridad de la Cuenta
                </h3>
                <div className="bg-gray-50 p-4 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">Contraseña</p>
                  </div>
                  <button 
                    className="text-primary hover:underline"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de cambio de contraseña */}
      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSubmit={handleChangePassword}
      />

      {/* Snackbar para mostrar mensajes */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Profile;
