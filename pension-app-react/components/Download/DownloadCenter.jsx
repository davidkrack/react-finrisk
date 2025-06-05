import { useState, useEffect } from 'react'

const DownloadCenter = ({ user }) => {
  const [downloadInfo, setDownloadInfo] = useState({
    files: [],
    totalFiles: 0,
    latestVersion: '1.0.0'
  })
  const [downloadStats, setDownloadStats] = useState({
    totalDownloads: 0,
    lastUpdate: '',
    version: '1.0.0',
    fileSize: '45.2 MB'
  })
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    fetchDownloadInfo()
    fetchDownloadStats()
  }, [])

  const fetchDownloadInfo = async () => {
    try {
      const response = await fetch('/api/download-info')
      if (response.ok) {
        const data = await response.json()
        setDownloadInfo(data)
        
        // Seleccionar el archivo más reciente por defecto
        if (data.files && data.files.length > 0) {
          const latestFile = data.files.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
          setSelectedFile(latestFile)
          
          setDownloadStats(prev => ({
            ...prev,
            version: latestFile.version,
            fileSize: latestFile.size
          }))
        }
      }
    } catch (error) {
      console.error('Error al cargar información de descarga:', error)
    }
  }

  const fetchDownloadStats = async () => {
    try {
      // Simular estadísticas por ahora
      setTimeout(() => {
        setDownloadStats(prev => ({
          ...prev,
          totalDownloads: 1247,
          lastUpdate: new Date().toLocaleDateString('es-PE')
        }))
      }, 1000)
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const handleDownload = async (file = selectedFile) => {
    if (!file) {
      alert('No hay archivos disponibles para descargar')
      return
    }

    setIsDownloading(true)
    setDownloadProgress(0)

    try {
      // Registrar la descarga
      await fetch('/api/download-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: file.name,
          userId: user?.id
        })
      })

      // Simular progreso de descarga
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            // Iniciar descarga real
            startRealDownload(file)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 200)

    } catch (error) {
      console.error('Error en la descarga:', error)
      setIsDownloading(false)
      setDownloadProgress(0)
      alert('Error al descargar el archivo. Por favor, intente nuevamente.')
    }
  }

  const startRealDownload = (file) => {
    // Crear un enlace de descarga
    const link = document.createElement('a')
    link.href = file.downloadUrl
    link.download = file.name
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Resetear estado después de un momento
    setTimeout(() => {
      setIsDownloading(false)
      setDownloadProgress(0)
    }, 1500)
  }

  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <div style={{
      background: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      border: '1px solid #e9ecef',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '2.5em', marginBottom: '10px', color }}>{icon}</div>
      <h3 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '0.9em' }}>{title}</h3>
      <p style={{ margin: '0 0 5px 0', fontSize: '1.8em', fontWeight: 'bold', color: '#0033a1' }}>
        {value}
      </p>
      {subtitle && (
        <p style={{ margin: 0, fontSize: '0.8em', color: '#666' }}>{subtitle}</p>
      )}
    </div>
  )

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

      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '30px',
        marginBottom: '40px'
      }}>
        <StatCard 
          icon="📋"
          title="Versión Actual"
          value={downloadStats.version}
          color="#28a745"
        />
        <StatCard 
          icon="📅"
          title="Última Actualización"
          value={downloadStats.lastUpdate || 'Cargando...'}
          color="#17a2b8"
        />
        <StatCard 
          icon="💾"
          title="Tamaño del Archivo"
          value={downloadStats.fileSize}
          color="#ffc107"
        />
        <StatCard 
          icon="📊"
          title="Total Descargas"
          value={downloadStats.totalDownloads.toLocaleString()}
          color="#dc3545"
        />
      </div>

      {/* Lista de Archivos Disponibles */}
      {downloadInfo.files && downloadInfo.files.length > 0 && (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Archivos Disponibles</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {downloadInfo.files.map((file, index) => (
              <div 
                key={index}
                onClick={() => setSelectedFile(file)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  border: selectedFile?.name === file.name ? '2px solid #0033a1' : '1px solid #e9ecef',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: selectedFile?.name === file.name ? '#f8f9ff' : 'white',
                  transition: 'all 0.3s ease'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>{file.name}</div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    Versión {file.version} • {file.size} • {file.date}
                  </div>
                </div>
                <div style={{
                  background: selectedFile?.name === file.name ? '#0033a1' : '#28a745',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.9em'
                }}>
                  {selectedFile?.name === file.name ? '✓ Seleccionado' : 'Seleccionar'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          {selectedFile ? selectedFile.name : 'Finrisk Desktop'}
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
          onClick={() => handleDownload()}
          disabled={isDownloading || !selectedFile}
          style={{
            background: isDownloading 
              ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
              : !selectedFile
              ? 'linear-gradient(135deg, #dee2e6 0%, #adb5bd 100%)'
              : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            color: 'white',
            border: 'none',
            padding: '18px 50px',
            fontSize: '1.3em',
            fontWeight: 'bold',
            borderRadius: '50px',
            cursor: (isDownloading || !selectedFile) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 20px rgba(40,167,69,0.3)',
            transform: (isDownloading || !selectedFile) ? 'none' : 'translateY(0)',
            marginBottom: '25px'
          }}
          onMouseOver={(e) => {
            if (!isDownloading && selectedFile) {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 25px rgba(40,167,69,0.4)'
            }
          }}
          onMouseOut={(e) => {
            if (!isDownloading && selectedFile) {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 6px 20px rgba(40,167,69,0.3)'
            }
          }}
        >
          {isDownloading 
            ? '⏳ Descargando...' 
            : !selectedFile 
            ? '❌ Selecciona un archivo'
            : '⬇️ Descargar Finrisk Desktop'
          }
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
          {selectedFile && (
            <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#0033a1' }}>
              Archivo seleccionado: {selectedFile.name} ({selectedFile.size})
            </p>
          )}
        </div>
      </div>

      {/* Mensaje si no hay archivos */}
      {(!downloadInfo.files || downloadInfo.files.length === 0) && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <h4>⚠️ No hay archivos disponibles</h4>
          <p>Por favor, sube los archivos .exe a la carpeta <code>public/downloads/</code></p>
        </div>
      )}
    </div>
  )
}

export default DownloadCenter