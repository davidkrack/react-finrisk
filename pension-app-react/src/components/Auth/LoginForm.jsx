import { useState } from 'react'

const LoginForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Limpiar error al escribir
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!credentials.username || !credentials.password) {
      setError('Por favor complete todos los campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await onLogin(credentials)
      
      if (!result.success) {
        setError(result.message || 'Credenciales inválidas')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      margin: 0,
      padding: 0,
      background: "url('/img/bg.jpeg') no-repeat center top",
      backgroundSize: 'cover',
      fontFamily: 'sans-serif',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '320px',
        height: '480px',
        background: '#000',
        color: '#fff',
        padding: '70px 30px',
        borderRadius: '10px',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {/* Logo */}
        <img 
          src="/img/logo2.png" 
          alt="Finrisk Logo" 
          style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            position: 'absolute',
            top: '-65px',
            left: 'calc(50% - 65px)'
          }}
        />
        
        <h1 style={{
          margin: 0,
          padding: '0 0 20px',
          textAlign: 'center',
          fontSize: '22px'
        }}>
          Finrisk Systems
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          margin: '0 0 20px',
          color: '#ccc'
        }}>
          Portal de Agentes
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="username" style={{
              margin: 0,
              padding: 0,
              fontWeight: 'bold',
              display: 'block',
              fontSize: '14px'
            }}>
              Usuario:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="Usuario del sistema"
              required
              style={{
                width: '100%',
                marginBottom: '10px',
                border: 'none',
                borderBottom: '1px solid #fff',
                background: 'transparent',
                outline: 'none',
                height: '40px',
                color: '#fff',
                fontSize: '16px',
                paddingLeft: '0'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{
              margin: 0,
              padding: 0,
              fontWeight: 'bold',
              display: 'block',
              fontSize: '14px'
            }}>
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Contraseña del sistema"
              required
              style={{
                width: '100%',
                marginBottom: '10px',
                border: 'none',
                borderBottom: '1px solid #fff',
                background: 'transparent',
                outline: 'none',
                height: '40px',
                color: '#fff',
                fontSize: '16px',
                paddingLeft: '0'
              }}
            />
          </div>

          {error && (
            <div style={{
              color: '#ff6b6b',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '15px',
              padding: '10px',
              background: 'rgba(255, 107, 107, 0.1)',
              borderRadius: '4px',
              border: '1px solid rgba(255, 107, 107, 0.3)'
            }}>
              {error}
            </div>
          )}

          <input
            type="submit"
            value={loading ? "Ingresando..." : "Ingresar al Portal"}
            disabled={loading}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              height: '40px',
              background: loading ? '#666' : '#b80f22',
              color: '#fff',
              fontSize: '18px',
              borderRadius: '20px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          />
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <a href="#" style={{
            textDecoration: 'none',
            fontSize: '12px',
            lineHeight: '20px',
            color: 'darkgrey'
          }}>
            ¿Olvidó su contraseña?
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginForm