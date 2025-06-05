import { useState, useEffect } from 'react'
import LoginForm from '../components/Auth/LoginForm'
import MainDashboard from '../components/Dashboard/MainDashboard'
import PensionCalculator from '../components/Calculator/PensionCalculator'
import AgentDashboard from '../components/Dashboard/AgentDashboard'
import DownloadCenter from '../components/Download/DownloadCenter'
import './../src/index.css'

function App() {
  const [currentView, setCurrentView] = useState('login') // login, dashboard, calculator, agents, download
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      console.log('Verificando autenticación...')
      
      // Verificar si hay una sesión activa
      const response = await fetch('/auth/check-session')
      
      if (!response.ok) {
        console.log('Error en check-session:', response.status)
        setCurrentView('login')
        return
      }
      
      const data = await response.json()
      console.log('Respuesta de check-session:', data)

      if (data.loggedIn) {
        setUser({
          id: data.userId,
          username: data.username,
          name: data.name
        })
        setCurrentView('dashboard')
        console.log('Usuario autenticado:', data.username)
      } else {
        setCurrentView('login')
        console.log('No hay usuario autenticado')
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      setCurrentView('login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (credentials) => {
    try {
      console.log('Intentando login con:', credentials)
      
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      console.log('Respuesta del servidor:', response.status, response.statusText)

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        let errorMessage = 'Error de conexión'
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || `Error ${response.status}`
        } catch (jsonError) {
          errorMessage = `Error ${response.status}: ${response.statusText}`
        }
        
        console.error('Error en login:', errorMessage)
        return { success: false, message: errorMessage }
      }

      // Intentar parsear la respuesta JSON
      let data
      try {
        data = await response.json()
        console.log('Datos de login recibidos:', data)
      } catch (jsonError) {
        console.error('Error parseando JSON:', jsonError)
        return { success: false, message: 'Error en la respuesta del servidor' }
      }

      if (data.success) {
        setUser(data.user)
        setCurrentView('dashboard')
        console.log('Login exitoso para:', data.user.username)
        return { success: true }
      } else {
        console.log('Login fallido:', data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, message: 'Error de conexión con el servidor' }
    }
  }

  const handleLogout = async () => {
    try {
      console.log('Cerrando sesión...')
      
      const response = await fetch('/auth/logout')
      
      if (response.ok) {
        const data = await response.json()
        console.log('Logout response:', data)
      }
      
      // Independientemente de la respuesta, limpiar el estado local
      setUser(null)
      setCurrentView('login')
      console.log('Sesión cerrada localmente')
      
    } catch (error) {
      console.error('Error en logout:', error)
      // Aún así, cerrar sesión localmente
      setUser(null)
      setCurrentView('login')
    }
  }

  const navigateTo = (view) => {
    console.log('Navegando a:', view)
    setCurrentView(view)
  }

  // Componente de Header reutilizable
  const AppHeader = ({ title, showBackButton = true }) => (
    <div style={{ 
      background: '#0033a1', 
      color: 'white', 
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.5em' }}>{title}</h1>
      <div>
        {showBackButton && (
          <button 
            onClick={() => navigateTo('dashboard')}
            style={{
              background: 'none',
              border: '1px solid white',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ← Volver al Dashboard
          </button>
        )}
        <button 
          onClick={handleLogout}
          style={{
            background: '#dc3545',
            border: 'none',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="loading-spinner" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #0033a1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '20px', color: '#666' }}>Cargando Finrisk Systems...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Renderizar vistas según el estado actual
  switch (currentView) {
    case 'login':
      return <LoginForm onLogin={handleLogin} />
    
    case 'dashboard':
      return (
        <MainDashboard 
          user={user}
          onLogout={handleLogout}
          onNavigate={navigateTo}
        />
      )
    
    case 'calculator':
      return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
          <AppHeader title="Finrisk Systems - Cotizador de Pensiones" />
          <PensionCalculator />
        </div>
      )
    
    case 'agents':
      return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
          <AppHeader title="Finrisk Systems - Panel de Agentes" />
          <AgentDashboard />
        </div>
      )
    
    case 'download':
      return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
          <AppHeader title="Finrisk Systems - Centro de Descargas" />
          <DownloadCenter user={user} />
        </div>
      )
    
    default: 
      return <LoginForm onLogin={handleLogin} />
  }
}

export default App