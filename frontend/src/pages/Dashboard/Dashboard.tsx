import { useNavigate } from 'react-router-dom';

const Dashboard= () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Simples */}
      <nav className="bg-lasalle-blue shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center text-white">
                    🎓
                </div>
                <span className="text-white font-bold text-lg">Portal Enfermagem</span>
            </div>
            <button 
                onClick={handleLogout}
                className="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
                Sair
            </button>
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
            
            {/* Cartão de Boas Vindas */}
            <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Bem-vindo ao Sistema
                    </h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Seu login foi realizado com sucesso através do Google SSO.</p>
                    </div>
                    <div className="mt-5">
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Conexão Ativa
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid de Ações Rápidas (Placeholder) */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card 1 */}
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer border-l-4 border-nursing-teal">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Minhas Visitas
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            0
                        </dd>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer border-l-4 border-lasalle-blue">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                            Moradores Cadastrados
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            0
                        </dd>
                    </div>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;