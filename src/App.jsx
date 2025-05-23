// --- React Frontend (App.jsx) ---
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// --- Componentes UI (simulando shadcn/ui) ---
// (Asegúrate que estos componentes estén definidos aquí o importados)
const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-6 ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 border-b border-gray-200 dark:border-gray-700 pb-3 ${className}`}>
    {children}
  </div>
);
const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);
const CardContent = ({ children, className = '' }) => (
  <div className={`text-sm text-gray-600 dark:text-gray-300 ${className}`}>
    {children}
  </div>
);
const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-150 ease-in-out ${className}`}
    {...props}
  />
);
const Button = ({ children, className = '', disabled, ...props }) => (
  <button
    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition duration-150 ease-in-out ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);
const Table = ({ children, className = '' }) => (
  <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700">
    <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
      {children}
    </table>
  </div>
);
const TableHeader = ({ children, className = '' }) => (
  <thead className={`bg-gray-50 dark:bg-gray-700 ${className}`}>
    {children}
  </thead>
);
const TableRow = ({ children, className = '' }) => (
  <tr className={`${className}`}>
    {children}
  </tr>
);
const TableHead = ({ children, className = '' }) => (
  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);
const TableBody = ({ children, className = '' }) => (
  <tbody className={`bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
    {children}
  </tbody>
);
const TableCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white ${className}`}>
    {children}
  </td>
);


// --- Constantes (Ej: Versión Data Dragon) ---
// Debe coincidir con la versión usada en el backend o ser una reciente
const DDRAGON_VERSION = "14.7.1"; // <-- ACTUALIZA ESTO PERIÓDICAMENTE

// --- Componentes de la Aplicación (Adaptados) ---

// Componente ProfileHeader actualizado para usar la URL real del icono
function ProfileHeader({ data }) {
    if (!data) return null;
    // Usa la URL real si existe, si no, un placeholder
    const iconUrl = data.profileIconUrl || `https://placehold.co/128x128/cccccc/ffffff?text=${data.gameName?.[0] || '?'}`;
    return (
        <Card className="mb-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <img
                    src={iconUrl} // <-- USA LA URL REAL
                    alt="Icono de Invocador"
                    className="w-24 h-24 rounded-full border-4 border-blue-300 dark:border-blue-700 shadow-md bg-gray-200 dark:bg-gray-700" // Añadido fondo por si tarda en cargar
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/cccccc/ffffff?text=Error'; }}
                />
                <div>
                    <h2 className="text-2xl font-bold">{data.gameName || 'Desconocido'}#{data.tagLine || '???'}</h2>
                    <p className="text-gray-600 dark:text-gray-400">Nivel {data.summonerLevel || 'N/A'}</p>
                    <p className="text-lg font-semibold mt-1">
                        {data.ranking && data.ranking.tier !== 'UNRANKED'
                            ? `${data.ranking.tier} ${data.ranking.rank} (${data.ranking.leaguePoints} LP)`
                            : 'Unranked'}
                    </p>
                    {data.ranking && data.ranking.tier !== 'UNRANKED' && data.ranking.winRate && (
                         <p className="text-sm text-gray-500 dark:text-gray-400">Winrate: {data.ranking.winRate}</p>
                    )}
                </div>
            </div>
        </Card>
    );
}

// Componente ChampionStats (sin cambios si el backend aún no envía mainChampions)
function ChampionStats({ champions }) {
    if (!champions || champions.length === 0) return <Card><CardContent>No hay datos de campeones principales disponibles.</CardContent></Card>;
    // ... (mismo código de tabla que antes si el backend enviara datos) ...
     return (
        <Card>
            <CardHeader><CardTitle>Campeones Principales (No implementado)</CardTitle></CardHeader>
            <CardContent>
                <p className="text-gray-400">Datos de maestría no implementados en el backend actual.</p>
            </CardContent>
        </Card>
     );
}

// Componente MatchHistory actualizado para mostrar detalles
function DetailedMatchHistory({ matches }) {
     if (!matches || matches.length === 0) return <Card><CardContent>No hay historial reciente disponible.</CardContent></Card>;

     // Función para obtener URL del icono del campeón
     const getChampionIconUrl = (championName) => {
         if (!championName) return 'https://placehold.co/32x32/cccccc/ffffff?text=?';
         // Manejar casos especiales si el nombre del campeón tiene apóstrofes o espacios (ej: Kha'Zix -> Khazix, Dr. Mundo -> DrMundo)
         // Esta es una simplificación, Data Dragon tiene mapeos específicos a veces.
         // Nombres comunes que necesitan mapeo: Wukong -> MonkeyKing
         let formattedName = championName.replace(/['.\s]/g, '');
         if (formattedName === 'Wukong') formattedName = 'MonkeyKing';
         // Añadir más mapeos si son necesarios
         return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${formattedName}.png`;
     };

    return (
        <Card>
             <CardHeader><CardTitle>Historial Reciente (Detallado)</CardTitle></CardHeader>
             <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Campeón</TableHead>
                            <TableHead>K/D/A</TableHead>
                            <TableHead>Resultado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matches.map((match) => (
                            <TableRow key={match.matchId}>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={getChampionIconUrl(match.championName)}
                                            alt={match.championName}
                                            className="w-8 h-8 rounded-sm bg-gray-600" // Fondo para imagen
                                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/32x32/cccccc/ffffff?text=?'; }}
                                        />
                                        <span className="font-medium">{match.championName || '??'}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {/* Muestra KDA, usa '?' si algún valor falta */}
                                    {`${match.kills ?? '?'}/${match.deaths ?? '?'}/${match.assists ?? '?'}`}
                                </TableCell>
                                <TableCell className={match.win ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-600 dark:text-red-400 font-semibold'}>
                                    {/* Muestra resultado basado en 'win' boolean */}
                                    {typeof match.win === 'boolean' ? (match.win ? 'Victoria' : 'Derrota') : 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
             </CardContent>
        </Card>
    );
}


// --- Componente Principal App ---
function App() {
  const [searchInput, setSearchInput] = useState('');
  const [playerData, setPlayerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState('las');

  const handleInputChange = (e) => {
      setSearchInput(e.target.value);
  };

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    const trimmedInput = searchInput.trim();
    if (!trimmedInput || isLoading) return;
    const parts = trimmedInput.split('#');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
        setError("Formato inválido. Usa Nombre#TAG"); return;
    }
    const gameName = parts[0]; const tagLine = parts[1];
    setIsLoading(true); setError(null); setPlayerData(null);

    // ========================================================================
    // ====> ¡VERIFICA QUE ESTE NOMBRE SEA CORRECTO! <====
    const renderServiceName = 'lol-profile-backend'; // <-- Nombre de tu servicio en Render
    // ========================================================================
    const backendUrl = `https://${renderServiceName}.onrender.com/api/profile/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;

    console.log(`Llamando al backend: ${backendUrl}`);

    try {
      const response = await fetch(backendUrl);
      if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `Error del servidor: ${response.statusText} (${response.status})` }));
          throw new Error(errorData.message || `Error ${response.status} al contactar el backend`);
      }
      const data = await response.json();
      setPlayerData(data);
    } catch (err) {
      console.error("Error fetching data from backend:", err);
      setError(err.message || 'No se pudieron obtener los datos.');
    } finally {
      setIsLoading(false);
    }
  }, [searchInput, isLoading, region]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-200 dark:selection:bg-blue-800">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-300">Analizador de Perfiles LoL</h1>
             <p className="text-sm text-gray-500 dark:text-gray-400">(Conectado a Backend en Render)</p>
        </header>

        {/* Barra de Búsqueda */}
        <form onSubmit={handleSearch} className="flex items-center space-x-3 mb-6 max-w-lg mx-auto">
          <Input type="text" value={searchInput} onChange={handleInputChange} placeholder="NombreInvocador#TAG" aria-label="Riot ID (NombreInvocador#TAG)" className="flex-grow shadow-sm" disabled={isLoading} />
          <Button type="submit" disabled={isLoading || !searchInput.trim()} className="shadow-sm">
            {isLoading ? ( <span className="flex items-center justify-center"> <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Buscando... </span> ) : 'Buscar'}
          </Button>
        </form>

        {/* Estado de Carga y Error */}
        {isLoading && ( <div className="text-center text-gray-500 dark:text-gray-400 my-4"> Consultando datos del backend... </div> )}
        {error && !isLoading && ( <div className="text-center my-6 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-md max-w-lg mx-auto" role="alert"> <strong className="font-bold">Error: </strong> <span className="block sm:inline">{error}</span> </div> )}
        {!playerData && !isLoading && !error && ( <div className="text-center text-gray-500 dark:text-gray-400 mt-10"> <p>Ingresa un Riot ID (NombreInvocador#TAG) para buscar.</p> </div> )}

        {/* Resultados */}
        {playerData && !isLoading && (
          <div key={playerData.puuid} className="animate-fade-in mt-6">
             <ProfileHeader data={playerData} />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                 <ChampionStats champions={playerData.mainChampions} />
                 {/* Usamos el nuevo componente para historial detallado */}
                 <DetailedMatchHistory matches={playerData.matchHistory} />
             </div>
          </div>
        )}

        {/* Pie de página */}
        <footer className="text-center text-xs text-gray-500 dark:text-gray-400 mt-12 pt-4 border-t border-gray-200 dark:border-gray-700"> <p>Datos obtenidos a través de la API de Riot Games (vía backend en Render).</p> </footer>
      </div>
      {/* Estilos */}
      <style jsx global>{` @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } `}</style>
    </div>
  );
}
export default App;
