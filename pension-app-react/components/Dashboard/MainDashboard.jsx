import { useState, useEffect } from 'react'

const MainDashboard = ({ user, onLogout, onNavigate }) => {
  const [stats, setStats] = useState({
    totalCalculations: 0,
    activeAgents: 0,
    monthlyGrowth: 0
  })

  useEffect(() => {
    // Simular carga de estadísticas
    setTimeout(() => {
      setStats({
        totalCalculations: 1247,
        activeAgents: 8,
        monthlyGrowth: 23.5
      })
    }, 1000)
  }, [])

  const dashboardOptions = [
    {
      id: 'calculator',
      title: 'Cotizador de Pensiones',
      description: 'Calcule rentas vitalicias y pensiones con nuestro sistema avanzado',
      icon: '🧮',
      color: '#28a745',
      action: () => onNavigate('calculator'),
      featured: true
    },
    {
      id: 'download',
      title: 'Descargar Software Desktop',
      description: 'Descargue la última versión del software para escritorio',
      icon: '⬇️',
      color: '#007bff',
      action: () => onNavigate('download'),
      featured: true,
      badge: 'NUEVO'
    },
    {
      id: 'agents',
      title: 'Panel de Agentes',
      description: 'Gestione clientes y visualice estadísticas de ventas',
      icon: '👥',
      color: '#6f42c1',
      action: () => onNavigate('agents')
    },
    {
      id: 'reports',
      title: 'Reportes y Análisis',
      description: 'Genere reportes detallados y análisis de mercado',
      icon: '📊',
      color: '#fd7e14',
      action: () => alert('Funcionalidad próximamente disponible')
    },
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Ajuste parámetros del sistema y preferencias',
      icon: '⚙️',
      color: '#6c757d',
      action: () => alert('Funcionalidad próximamente disponible')
    },
    {
      id: 'support',
      title: 'Soporte Técnico',
      description: 'Acceda a documentación y soporte especializado',
      icon: '🛠️',
      color: '#20c997',
      action: () => alert('Contacte soporte: soporte@finrisk.com')
    }
  ]

  const DashboardCard = ({ option }) => (
    <div
      onClick={option.action}
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: option.featured 
          ? '0 12px 40px rgba(0,0,0,0.15)' 
          : '0 6px 20px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: option.featured ? `2px solid ${option.color}` : '1px solid #e9ecef',
        position: 'relative',
        overflow: 'hidden',
        height: option.featured ? '220px' : '180px'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = option.featured 
          ? '0 16px 50px rgba(0,0,0,0.2)' 
          : '0 10px 30px rgba(0,0,0,0.15)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = option.featured 
          ? '0 12px 40px rgba(0,0,0,0.15)' 
          : '0 6px 20px rgba(0,0,0,0.1)'
      }}
    >
      {/* Badge para elementos nuevos */}
      {option.badge && (
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: '#dc3545',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.7em',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {option.badge}
        </div>
      )}

      <div style={{ 
        fontSize: option.featured ? '4em' : '3em', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        {option.icon}
      </div>
      
      <h3 style={{ 
        margin: '0 0 15px 0', 
        color: option.color,
        fontSize: option.featured ? '1.4em' : '1.2em',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        {option.title}
      </h3>
      
      <p style={{ 
        margin: 0, 
        color: '#666', 
        lineHeight: '1.5',
        textAlign: 'center',
        fontSize: option.featured ? '1em' : '0.9em'
      }}>
        {option.description}
      </p>

      {/* Indicador visual para elementos destacados */}
      {option.featured && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${option.color}, ${option.color}80)`
        }} />
      )}
    </div>
  )

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0033a1 0%, #004fe6 100%)', 
        color: 'white', 
        padding: '30px 0',
        boxShadow: '0 4px 20px rgba(0,51,161,0.3)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              margin: '0 0 10px 0', 
              fontSize: '2.5em',
              fontWeight: '300'
            }}>
              Finrisk Systems
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: '1.2em',
              opacity: 0.9
            }}>
              Bienvenido, {user?.username || 'Usuario'}
            </p>
          </div>
          <button 
            onClick={onLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1em',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.3)'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px'
      }}>
        {/* Estadísticas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '50px'
        }}>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '2.5em', marginBottom: '10px', color: '#28a745' }}>📈</div>
            <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Cálculos Totales</h3>
            <p style={{ margin: 0, fontSize: '1.8em', fontWeight: 'bold', color: '#0033a1' }}>
              {stats.totalCalculations.toLocaleString()}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '2.5em', marginBottom: '10px', color: '#007bff' }}>👥</div>
            <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Agentes Activos</h3>
            <p style={{ margin: 0, fontSize: '1.8em', fontWeight: 'bold', color: '#0033a1' }}>
              {stats.activeAgents}
            </p>
          </div>

          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ fontSize: '2.5em', marginBottom: '10px', color: '#ffc107' }}>📊</div>
            <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Crecimiento Mensual</h3>
            <p style={{ margin: 0, fontSize: '1.8em', fontWeight: 'bold', color: '#28a745' }}>
              +{stats.monthlyGrowth}%
            </p>
          </div>
        </div>

        {/* Opciones Principales */}
        <div>
          <h2 style={{ 
            margin: '0 0 30px 0', 
            color: '#333',
            fontSize: '2em',
            textAlign: 'center',
            fontWeight: '300'
          }}>
            Panel de Control
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '30px'
          }}>
            {dashboardOptions.map(option => (
              <DashboardCard key={option.id} option={option} />
            ))}
          </div>
        </div>

        {/* Información Adicional */}
        <div style={{ 
          marginTop: '60px',
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ 
            margin: '0 0 20px 0', 
            color: '#333',
            fontSize: '1.8em',
            fontWeight: '300'
          }}>
            Sistema de Gestión Integral de Pensiones
          </h3>
          <p style={{ 
            margin: '0 0 25px 0', 
            color: '#666',
            fontSize: '1.1em',
            lineHeight: '1.6',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Finrisk Systems le ofrece las herramientas más avanzadas para el cálculo y gestión 
            de pensiones, rentas vitalicias y seguros. Nuestro sistema integra funcionalidades 
            web y de escritorio para brindar la máxima flexibilidad y precisión en sus operaciones.
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px',
            flexWrap: 'wrap',
            marginTop: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>🔒</div>
              <strong style={{ color: '#333' }}>Seguridad Garantizada</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>⚡</div>
              <strong style={{ color: '#333' }}>Cálculos Instantáneos</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>📱</div>
              <strong style={{ color: '#333' }}>Multiplataforma</strong>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>🎯</div>
              <strong style={{ color: '#333' }}>Resultados Precisos</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainDashboard