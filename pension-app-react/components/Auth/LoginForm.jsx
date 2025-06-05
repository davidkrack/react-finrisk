import { useState } from 'react'

const LoginForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showCredentials, setShowCredentials] = useState(false)

  // Credenciales disponibles para mostrar al usuario
  const availableCredentials = [
    { username: 'admin', password: 'admin', description: 'Administrador Principal' },
    { username: 'agente', password: 'agente123', description: 'Agente de Ventas' },
    { username: 'demo', password: 'demo', description: 'Usuario Demo' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Por favor complete todos los campos')
      setIsLoading(false)
      return
    }

    try {
      const result = await onLogin(credentials)
      
      if (!result.success) {
        setError(result.message || 'Credenciales incorrectas')
      }
    } catch (error) {
      setError('Error de conexión. Por favor, intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const fillCredentials = (username, password) => {
    setCredentials({ username, password })
    setError('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0033a1 0%, #004fe6 50%, #0066ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Fondo con patrón */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.3
      }} />

      <div style={{
        display: 'flex',
        gap: '30px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        maxWidth: '1000px',
        width: '100%'
      }}>
        {/* Formulario de Login */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '50px',
          width: '450px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          {/* Logo */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '40px' 
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #0033a1 0%, #004fe6 100%)',
              borderRadius: '50%',
              margin: '0 auto 20px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2em',
              color: 'white',
              fontWeight: 'bold'
            }}>
              F
            </div>
            <h1 style={{ 
              margin: '0 0 10px 0', 
              color: '#333',
              fontSize: '2.2em',
              fontWeight: '300'
            }}>
              Finrisk Systems
            </h1>
            <p style={{ 
              margin: 0, 
              color: '#666',
              fontSize: '1.1em'
            }}>
              Portal de Agentes
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '25px',
              border: '1px solid #f5c6cb',
              fontSize: '0.9em',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: 'bold',
                fontSize: '0.95em'
              }}>
                Usuario del Sistema
              </label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Ingrese su usuario"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '1em',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  background: isLoading ? '#f8f9fa' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0033a1'
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,51,161,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#333',
                fontWeight: 'bold',
                fontSize: '0.95em'
              }}>
                Contraseña del Sistema
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '1em',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s ease',
                  background: isLoading ? '#f8f9fa' : 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0033a1'
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,51,161,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                background: isLoading 
                  ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                  : 'linear-gradient(135deg, #0033a1 0%, #004fe6 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1.1em',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 6px 20px rgba(0,51,161,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 25px rgba(0,51,161,0.4)'
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 6px 20px rgba(0,51,161,0.3)'
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #ffffff40',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  🔐 Ingresar al Portal
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '30px',
            paddingTop: '25px',
            borderTop: '1px solid #e9ecef'
          }}>
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              style={{
                background: 'none',
                border: '1px solid #0033a1',
                color: '#0033a1',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9em',
                marginBottom: '15px'
              }}
            >
              {showCredentials ? '🔒 Ocultar' : '👁️ Ver'} Credenciales de Prueba
            </button>
            <p style={{ 
              margin: '0 0 10px 0', 
              color: '#666',
              fontSize: '0.9em'
            }}>
              ¿Necesita ayuda?
            </p>
            <p style={{ 
              margin: 0, 
              color: '#0033a1',
              fontSize: '0.9em'
            }}>
              <strong>Soporte:</strong> soporte@finrisk.com
            </p>
          </div>
        </div>

        {/* Panel de Credenciales */}
        {showCredentials && (
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '20px',
            padding: '30px',
            width: '400px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              color: '#333',
              textAlign: 'center',
              fontSize: '1.3em'
            }}>
              👤 Usuarios de Prueba
            </h3>
            
            <div style={{ marginBottom: '15px', fontSize: '0.9em', color: '#666', textAlign: 'center' }}>
              Haz clic en cualquier usuario para completar automáticamente el formulario:
            </div>
            
            {availableCredentials.map((cred, index) => (
              <div
                key={index}
                onClick={() => fillCredentials(cred.username, cred.password)}
                style={{
                  background: 'white',
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  padding: '15px',
                  marginBottom: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#0033a1'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,51,161,0.2)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '5px' }}>
                  {cred.description}
                </div>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  <strong>Usuario:</strong> {cred.username}
                </div>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  <strong>Contraseña:</strong> {cred.password}
                </div>
              </div>
            ))}
            
            <div style={{
              background: '#e3f2fd',
              border: '1px solid #2196f3',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '20px',
              fontSize: '0.85em',
              color: '#1976d2'
            }}>
              💡 <strong>Tip:</strong> Todos los usuarios tienen acceso completo al sistema de prueba.
            </div>
          </div>
        )}
      </div>

      {/* Estilos para la animación */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default LoginForm