const MainDashboard = ({ user, onLogout, onNavigate }) => {
  
    const handleDownloadSoftware = () => {
      // Aquí puedes poner la lógica para descargar el archivo .exe
      // Por ejemplo, un enlace directo al archivo o un endpoint del servidor
      alert('Descargando la última versión del software...\n\nEn un entorno real, aquí se descargaría el archivo .exe')
      
      // Ejemplo de descarga directa:
      // const link = document.createElement('a')
      // link.href = '/downloads/finrisk-desktop-latest.exe'
      // link.download = 'finrisk-desktop-latest.exe'
      // link.click()
    }
  
    return (
      <div style={{
        background: "url('/img/fondop.jpg') no-repeat center center fixed",
        backgroundSize: 'cover',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: '#0033a1',
          color: 'white',
          padding: '15px 0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5em' }}>Finrisk Systems</h1>
              <p style={{ margin: '5px 0 0', fontSize: '0.9em', opacity: 0.8 }}>
                Bienvenido, {user?.username}
              </p>
            </div>
            <button 
              onClick={onLogout}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </header>
  
        {/* Contenido principal */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff',
          textAlign: 'center',
          padding: '40px 20px'
        }}>
          <h2 style={{
            fontSize: '2.5em',
            marginBottom: '20px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Panel de Control Finrisk
          </h2>
          
          <p style={{
            fontSize: '1.2em',
            marginBottom: '40px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            Seleccione una opción para continuar
          </p>
  
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            maxWidth: '1000px',
            width: '100%'
          }}>
            {/* Cotizador Web */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#333',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              textAlign: 'center'
            }}
            onClick={() => onNavigate('calculator')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)'
            }}>
              <div style={{ fontSize: '3em', marginBottom: '15px' }}>🧮</div>
              <h3 style={{ 
                fontSize: '1.4em', 
                marginBottom: '15px',
                color: '#0033a1'
              }}>
                Cotizador de Rentas Privadas
              </h3>
              <p style={{ 
                fontSize: '1em', 
                lineHeight: '1.5',
                color: '#666'
              }}>
                Calcule pensiones y rentas vitalicias de forma interactiva con gráficos en tiempo real
              </p>
            </div>
  
            {/* Panel de Agentes */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#333',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              textAlign: 'center'
            }}
            onClick={() => onNavigate('agents')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)'
            }}>
              <div style={{ fontSize: '3em', marginBottom: '15px' }}>📊</div>
              <h3 style={{ 
                fontSize: '1.4em', 
                marginBottom: '15px',
                color: '#0033a1'
              }}>
                Dashboard de Agentes
              </h3>
              <p style={{ 
                fontSize: '1em', 
                lineHeight: '1.5',
                color: '#666'
              }}>
                Visualice estadísticas de clientes, cotizaciones y solicitudes de contacto
              </p>
            </div>
  
            {/* Descargar Software Desktop */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#333',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              textAlign: 'center'
            }}
            onClick={handleDownloadSoftware}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)'
            }}>
              <div style={{ fontSize: '3em', marginBottom: '15px' }}>💾</div>
              <h3 style={{ 
                fontSize: '1.4em', 
                marginBottom: '15px',
                color: '#0033a1'
              }}>
                Software Desktop
              </h3>
              <p style={{ 
                fontSize: '1em', 
                lineHeight: '1.5',
                color: '#666'
              }}>
                Descargue la última versión del software Finrisk para escritorio (.exe)
              </p>
              <div style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9em',
                marginTop: '15px',
                display: 'inline-block'
              }}>
                ⬇️ Descargar Ahora
              </div>
            </div>
  
            {/* Opciones adicionales - Panel de Control */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#333',
              padding: '30px',
              borderRadius: '15px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
              textAlign: 'center',
              opacity: 0.7
            }}
            onClick={() => alert('Funcionalidad en desarrollo')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.4)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)'
            }}>
              <div style={{ fontSize: '3em', marginBottom: '15px' }}>⚙️</div>
              <h3 style={{ 
                fontSize: '1.4em', 
                marginBottom: '15px',
                color: '#0033a1'
              }}>
                Configuración
              </h3>
              <p style={{ 
                fontSize: '1em', 
                lineHeight: '1.5',
                color: '#666'
              }}>
                Configuraciones del sistema y preferencias de usuario
              </p>
              <div style={{
                backgroundColor: '#ffc107',
                color: '#333',
                padding: '4px 12px',
                borderRadius: '15px',
                fontSize: '0.8em',
                marginTop: '15px',
                display: 'inline-block'
              }}>
                Próximamente
              </div>
            </div>
          </div>
  
          {/* Información adicional */}
          <div style={{
            marginTop: '50px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '800px'
          }}>
            <h4 style={{ marginBottom: '10px', color: '#ffc107' }}>
              💡 Información del Sistema
            </h4>
            <p style={{ fontSize: '0.9em', lineHeight: '1.4', margin: 0 }}>
              Sistema integrado de cálculo actuarial con conexión a servicios externos de Delphi 
              y generación de gráficos en tiempo real. Versión Web 2.0 - Desarrollado con React + Express.
            </p>
          </div>
        </main>
      </div>
    )
  }
  
  export default MainDashboard