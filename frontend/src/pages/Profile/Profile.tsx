import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, loading, error } = useAuth();

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
            <p className="text-red-500">No se encontró información del usuario</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <header className="p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-primary text-2xl font-bold">Mi Perfil</h1>
        </header>

        <div className="p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Nombre:</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Correo electrónico:</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-600">ID de Usuario:</p>
                <p className="font-medium">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Puedes agregar más secciones según los datos disponibles */}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
