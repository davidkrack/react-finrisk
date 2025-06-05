import { useState, useEffect } from 'react'

const AgentDashboard = () => {
  const [clientData, setClientData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [contactFilter, setContactFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [fieldFilter, setFieldFilter] = useState('all')
  const [stats, setStats] = useState({
    totalClients: 0,
    needsContact: 0,
    averageAmount: 0,
    monthlyClients: 0
  })

  const ITEMS_PER_PAGE = 20

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, contactFilter, fieldFilter])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Intentar obtener datos reales del servidor
      const response = await fetch('/api/client-data')
      
      if (response.ok) {
        const data = await response.json()
        setClientData(data)
        calculateStats(data)
      } else {
        // Si no hay datos reales, usar datos simulados
        const mockData = generateMockData()
        setClientData(mockData)
        calculateStats(mockData)
      }
    } catch (err) {
      console.warn('No se pudieron cargar datos reales, usando datos simulados:', err)
      // Usar datos simulados en caso de error
      const mockData = generateMockData()
      setClientData(mockData)
      calculateStats(mockData)
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = () => {
    const nombres = [
      'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Pedro Rodríguez',
      'Laura Fernández', 'Miguel Santos', 'Carmen Ruiz', 'José González', 'Isabel Torres',
      'Francisco Jiménez', 'Pilar Moreno', 'Antonio Álvarez', 'Rosa Herrera', 'Manuel Vargas'
    ]
    
    const emails = [
      'juan.perez@email.com', 'maria.garcia@email.com', 'carlos.lopez@email.com',
      'ana.martinez@email.com', 'pedro.rodriguez@email.com', 'laura.fernandez@email.com',
      'miguel.santos@email.com', 'carmen.ruiz@email.com', 'jose.gonzalez@email.com',
      'isabel.torres@email.com', 'francisco.jimenez@email.com', 'pilar.moreno@email.com',
      'antonio.alvarez@email.com', 'rosa.herrera@email.com', 'manuel.vargas@email.com'
    ]

    const telefonos = [
      '+51 987 654 321', '+51 956 789 123', '+51 912 345 678', '+51 987 321 654',
      '+51 945 678 912', '+51 923 456 789', '+51 967 891 234', '+51 934 567 891',
      '+51 978 912 345', '+51 989 123 456', '+51 912 678 345', '+51 945 321 987',
      '+51 956 234 678', '+51 967 345 912', '+51 978 456 123'
    ]

    const monedas = ['Soles', 'Dolares']
    
    return Array.from({ length: 50 }, (_, i) => ({
      ID_USUARIO: i + 1,
      ID_SIMULACION: i + 1,
      NOMBRE: nombres[i % nombres.length],
      EMAIL: emails[i % emails.length],
      TELEFONO: telefonos[i % telefonos.length],
      PRIMA_TOT: (Math.random() * 400000 + 100000).toFixed(2),
      MONEDA_PAGO_PENSION: monedas[Math.floor(Math.random() * monedas.length)],
      DESEA_SER_CONTACTADO: Math.random() > 0.6 ? 'S' : 'N',
      FECHA_CALCULO: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))
  }

  const calculateStats = (data) => {
    const total = data.length
    const needsContact = data.filter(client => client.DESEA_SER_CONTACTADO === 'S').length
    const avgAmount = data.reduce((sum, client) => sum + parseFloat(client.PRIMA_TOT || 0), 0) / total

    // Calcular clientes del mes actual
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyClients = data.filter(client => {
      const clientDate = new Date(client.FECHA_CALCULO)
      return clientDate.getMonth() === currentMonth && clientDate.getFullYear() === currentYear
    }).length

    setStats({
      totalClients: total,
      needsContact: needsContact,
      averageAmount: avgAmount,
      monthlyClients: monthlyClients
    })
  }

  const filteredData = clientData.filter(client => {
    const matchesContact = contactFilter === 'all' ? true : 
      contactFilter === 'yes' ? client.DESEA_SER_CONTACTADO === 'S' : 
      client.DESEA_SER_CONTACTADO === 'N'
    
    let matchesField = true
    switch(fieldFilter) {
      case 'nombre':
        matchesField = !!client.NOMBRE?.trim()
        break
      case 'email':
        matchesField = !!client.EMAIL?.trim()
        break
      case 'telefono':
        matchesField = !!client.TELEFONO?.trim()
        break
      case 'empty':
        matchesField = !client.NOMBRE?.trim() || !client.EMAIL?.trim() || !client.TELEFONO?.trim()
        break
      default:
        matchesField = true
    }
    
    const matchesSearch = !searchTerm || 
      (client.NOMBRE?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (client.EMAIL?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (client.TELEFONO || '').includes(searchTerm)

    return matchesContact && matchesField && matchesSearch
  })

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

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

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #0033a1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: '20px', color: '#666' }}>Cargando datos de clientes...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatCard 
          icon="👥"
          title="Total Clientes"
          value={stats.totalClients.toLocaleString()}
          color="#28a745"
        />
        <StatCard 
          icon="📞"
          title="Solicitudes de Contacto"
          value={stats.needsContact.toLocaleString()}
          color="#dc3545"
          subtitle={`${((stats.needsContact / stats.totalClients) * 100).toFixed(1)}% del total`}
        />
        <StatCard 
          icon="💰"
          title="Prima Promedio"
          value={`$${stats.averageAmount.toLocaleString('es-PE', { 
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          })}`}
          color="#007bff"
        />
        <StatCard 
          icon="📅"
          title="Clientes Este Mes"
          value={stats.monthlyClients.toLocaleString()}
          color="#ffc107"
        />
      </div>

      {/* Filtros */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Filtros de Búsqueda</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '15px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Estado de Contacto:
            </label>
            <select 
              value={contactFilter}
              onChange={(e) => setContactFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="all">Todos los contactos</option>
              <option value="yes">Desean ser contactados</option>
              <option value="no">No desean ser contactados</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Completitud de Datos:
            </label>
            <select 
              value={fieldFilter}
              onChange={(e) => setFieldFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="all">Todos los registros</option>
              <option value="nombre">Con nombre completo</option>
              <option value="email">Con email</option>
              <option value="telefono">Con teléfono</option>
              <option value="empty">Registros incompletos</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
              Buscar:
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e9ecef',
          background: '#f8f9fa'
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>
            Lista de Clientes ({filteredData.length} registros)
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                  Nombre
                </th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                  Email
                </th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                  Teléfono
                </th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                  Fecha Cotización
                </th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                  Moneda
                </th>
                <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                  Prima Total
                </th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #dee2e6', fontWeight: 'bold' }}>
                  Contactar
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ 
                    padding: '40px', 
                    textAlign: 'center', 
                    color: '#666',
                    fontSize: '1.1em'
                  }}>
                    No se encontraron registros con los filtros aplicados
                  </td>
                </tr>
              ) : (
                paginatedData.map((client, index) => (
                  <tr 
                    key={`${client.ID_USUARIO}-${client.ID_SIMULACION}`}
                    style={{
                      borderBottom: '1px solid #e9ecef',
                      transition: 'background-color 0.2s',
                      ':hover': { backgroundColor: '#f8f9fa' }
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 'bold', color: '#333' }}>
                        {client.NOMBRE || 'Sin nombre'}
                      </div>
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                      <span style={{ color: '#007bff' }}>
                        {client.EMAIL || 'Sin email'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                      {client.TELEFONO || 'Sin teléfono'}
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                      {client.FECHA_CALCULO ? 
                        new Date(client.FECHA_CALCULO).toLocaleDateString('es-PE') : 
                        'Sin fecha'
                      }
                    </td>
                    <td style={{ padding: '15px', verticalAlign: 'middle' }}>
                      <span style={{
                        background: client.MONEDA_PAGO_PENSION === 'Soles' ? '#e7f3ff' : '#fff3e0',
                        color: client.MONEDA_PAGO_PENSION === 'Soles' ? '#0066cc' : '#f57c00',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.85em',
                        fontWeight: 'bold'
                      }}>
                        {client.MONEDA_PAGO_PENSION || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right', verticalAlign: 'middle' }}>
                      <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                        ${parseFloat(client.PRIMA_TOT || 0).toLocaleString('es-PE', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85em',
                        fontWeight: 'bold',
                        background: client.DESEA_SER_CONTACTADO === 'S' ? '#d4edda' : '#f8d7da',
                        color: client.DESEA_SER_CONTACTADO === 'S' ? '#155724' : '#721c24'
                      }}>
                        {client.DESEA_SER_CONTACTADO === 'S' ? '✓ Sí' : '✗ No'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div style={{
            padding: '20px',
            borderTop: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8f9fa'
          }}>
            <div style={{ color: '#666', fontSize: '0.9em' }}>
              Mostrando {filteredData.length === 0 ? 0 : ((currentPage - 1) * ITEMS_PER_PAGE) + 1} a{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} de{' '}
              {filteredData.length} resultados
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  background: currentPage === 1 ? '#f8f9fa' : 'white',
                  color: currentPage === 1 ? '#6c757d' : '#495057',
                  borderRadius: '6px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ← Anterior
              </button>
              
              <span style={{ 
                padding: '8px 16px', 
                border: '1px solid #007bff',
                background: '#007bff',
                color: 'white',
                borderRadius: '6px',
                fontSize: '0.9em'
              }}>
                {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  background: (currentPage === totalPages || totalPages === 0) ? '#f8f9fa' : 'white',
                  color: (currentPage === totalPages || totalPages === 0) ? '#6c757d' : '#495057',
                  borderRadius: '6px',
                  cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AgentDashboard