import { useState, useEffect } from 'react'

const DownloadCenter = ({ user }) => {
  const [downloadStats, setDownloadStats] = useState({
    totalDownloads: 0,
    lastUpdate: '',
    version: '1.0.0',
    fileSize: '45.2 MB'
  })
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  useEffect(() => {
    // Simular carga de estadísticas de descarga
    fetchDownloadStats()
  }, [])

  const fetchDownloadStats = async () => {
    try {
      // Aquí podrías hacer una llamada real a tu API
      // const response = await fetch('/api/download-stats')
      // const data = await response.json()
      
      // Por ahora simulamos los datos
      setTimeout(() => {
        setDownloadStats({
          totalDownloads: 1247,
          lastUpdate: '15 de Noviembre, 2024',
          version: '2.1.3',
          fileSize: '52.8 MB'
        })
      }, 1000)
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    setDownloadProgress(0)

    try {
      // Simular progreso de descarga
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)

      // Simular la descarga
      setTimeout(() => {
        clearInterval(progressInterval)
        setDownloadProgress(100)
        
        // Crear un enlace de descarga temporal
        const link = document.createElement('a')
        link.href = '/downloads/finrisk-desktop-v2.1.3.exe' // Ruta donde tendrás el archivo
        link.download = 'FinriskDesktop_v2.1.3.exe'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        setTimeout(() => {
          setIsDownloading(false)
          setDownloadProgress(0)
        }, 1000)
      }, 3000)

    } catch (error) {
      console.error('Error en la descarga:', error)
      setIsDownloading(false)
      setDownloadProgress(0)
      alert('Error al descargar el archivo. Por favor, intente nuevamente.')
    }
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header del Centro de Descargas */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '50px',
        background: 'linear-gradient(135deg, #0033a1 0%, #004fe6 100%)',
        color: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,51,161,0.3)'
      }}>
        <h1 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '2.5em',
          fontWeight: '300'
        }}>
          Centro de Descargas Finrisk
        </h1>
        <p style={{ 
          margin: 0, 
          fontSize: '1.2em',
          opacity: 0.9
        }}>
          Descarga la última versión del software de escritorio
        </p>
      </div>

      {/* Información del Software */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '30px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            fontSize: '3em', 
            marginBottom: '15px',
            color: '#28a745'
          }}>📋</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Versión Actual</h3>
          <p style={{ 
            margin: 0, 
            fontSize: '1.3em', 
            fontWeight: 'bold',
            color: '#0033a1'
          }}>
            {downloadStats.version}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            fontSize: '3em', 
            marginBottom: '15px',
            color: '#17a2b8'
          }}>📅</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Última Actualización</h3>
          <p style={{ 
            margin: 0, 
            fontSize: '1.1em',
            color: '#666'
          }}>
            {downloadStats.lastUpdate}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            fontSize: '3em', 
            marginBottom: '15px',
            color: '#ffc107'
          }}>💾</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Tamaño del Archivo</h3>
          <p style={{ 
            margin: 0, 
            fontSize: '1.3em',
            fontWeight: 'bold',
            color: '#666'
          }}>
            {downloadStats.fileSize}
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            fontSize: '3em', 
            marginBottom: '15px',
            color: '#dc3545'
          }}>📊</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Total Descargas</h3>
          <p style={{ 
            margin: 0, 
            fontSize: '1.3em',
            fontWeight: 'bold',
            color: '#0033a1'
          }}>
            {downloadStats.totalDownloads.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Área Principal de Descarga */}
      <div style={{
        background: 'white',
        padding: '50px',
        borderRadius: '12px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
        textAlign: 'center',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ 
          fontSize: '4em', 
          marginBottom: '25px',
          color: '#0033a1'
        }}>🖥️</div>
        
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '2.2em',
          color: '#333',
          fontWeight: '300'
        }}>
          Finrisk Desktop v{downloadStats.version}
        </h2>
        
        <p style={{ 
          margin: '0 0 35px 0', 
          fontSize: '1.2em',
          color: '#666',
          lineHeight: '1.6',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Software completo para el cálculo y gestión de pensiones y rentas vitalicias. 
          Incluye todas las funcionalidades avanzadas y herramientas de análisis.
        </p>

        {/* Barra de Progreso */}
        {isDownloading && (
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              background: '#e9ecef',
              borderRadius: '25px',
              height: '12px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #0033a1, #004fe6)',
                height: '100%',
                width: `${downloadProgress}%`,
                borderRadius: '25px',
                transition: 'width 0.3s ease-in-out'
              }} />
            </div>
            <p style={{ 
              margin: 0, 
              color: '#666',
              fontSize: '0.9em'
            }}>
              Descargando... {Math.round(downloadProgress)}%
            </p>
          </div>
        )}

        {/* Botón de Descarga */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          style={{
            background: isDownloading 
              ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
              : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            color: 'white',
            border: 'none',
            padding: '18px 50px',
            fontSize: '1.3em',
            fontWeight: 'bold',
            borderRadius: '50px',
            cursor: isDownloading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 20px rgba(40,167,69,0.3)',
            transform: isDownloading ? 'none' : 'translateY(0)',
            marginBottom: '25px'
          }}
          onMouseOver={(e) => {
            if (!isDownloading) {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 25px rgba(40,167,69,0.4)'
            }
          }}
          onMouseOut={(e) => {
            if (!isDownloading) {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 6px 20px rgba(40,167,69,0.3)'
            }
          }}
        >
          {isDownloading ? '⏳ Descargando...' : '⬇️ Descargar Finrisk Desktop'}
        </button>

        <div style={{ 
          fontSize: '0.9em', 
          color: '#666',
          marginTop: '20px'
        }}>
          <p style={{ margin: '5px 0' }}>
            <strong>Usuario:</strong> {user?.username || 'Agente'} | 
            <strong> Acceso autorizado</strong> ✅
          </p>
          <p style={{ margin: '5px 0' }}>
            Compatible con Windows 10/11 (64-bit)
          </p>
        </div>
      </div>

      {/* Información Adicional */}
      <div style={{ 
        marginTop: '40px',
        background: '#f8f9fa',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: '#333',
          textAlign: 'center'
        }}>
          Novedades de la Versión {downloadStats.version}
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px'
        }}>
          <div>
            <h4 style={{ color: '#0033a1', margin: '0 0 10px 0' }}>🚀 Mejoras de Rendimiento</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
              <li>Cálculos más rápidos y precisos</li>
              <li>Optimización de memoria</li>
              <li>Interfaz más fluida</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#0033a1', margin: '0 0 10px 0' }}>📊 Nuevas Funcionalidades</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
              <li>Reportes avanzados en Excel</li>
              <li>Gráficos interactivos mejorados</li>
              <li>Simulaciones múltiples</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownloadCenter