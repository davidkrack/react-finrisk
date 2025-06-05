import { useState, useEffect } from 'react'

const PensionCalculator = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'male',
    investedAmount: '',
    incomeDuration: 'single',
    beneficiaryOption: 'no',
    insuranceOption: 'no',
    refundOption: 'no',
    currencyOption: 'Soles'
  })

  const [currentStep, setCurrentStep] = useState(1) // 1: form, 2: results
  const [isCalculating, setIsCalculating] = useState(false)
  const [results, setResults] = useState(null)
  const [investmentOptions, setInvestmentOptions] = useState([])

  // Configurar opciones de inversión según la moneda
  useEffect(() => {
    updateInvestmentOptions(formData.currencyOption)
  }, [formData.currencyOption])

  const updateInvestmentOptions = (currency) => {
    let options = []
    if (currency === 'Soles') {
      for (let i = 100000; i <= 500000; i += 50000) {
        options.push({ value: i, label: i.toLocaleString('es-PE') })
      }
    } else {
      options.push({ value: 70000, label: '70,000' })
      for (let i = 100000; i <= 500000; i += 50000) {
        options.push({ value: i, label: i.toLocaleString('es-PE') })
      }
    }
    setInvestmentOptions(options)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone', 'birthDate', 'investedAmount']
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Por favor complete el campo: ${getFieldLabel(field)}`)
        return false
      }
    }

    // Validar fecha de nacimiento
    const birthDate = new Date(formData.birthDate)
    const minDate = new Date('1939-01-01')
    const maxDate = new Date('2000-12-31')
    
    if (birthDate < minDate || birthDate > maxDate) {
      alert('La fecha de nacimiento debe estar entre 1939 y 2000')
      return false
    }

    return true
  }

  const getFieldLabel = (field) => {
    const labels = {
      name: 'Nombre',
      email: 'Email',
      phone: 'Teléfono',
      birthDate: 'Fecha de Nacimiento',
      investedAmount: 'Monto a Invertir'
    }
    return labels[field] || field
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleCalculate = async () => {
    if (!validateForm()) return

    setIsCalculating(true)
    
    try {
      // Preparar datos para el cálculo usando la estructura original
      const birthDate = formatDate(formData.birthDate)
      
      const Dat_Princ = [
        parseFloat(formData.investedAmount), // Prima_Neta
        0, // Per_Diferido
        formData.beneficiaryOption === 'yes' ? 'Si' : 'No', // Seguro_Fallecimiento
        formData.refundOption === 'yes' ? 'Si' : 'No', // Seguro_Devolucion
        formData.incomeDuration === 'single' ? 'No' : 'Si', // Seguro_Temporal
        0, // Campo adicional
        formData.currencyOption, // Moneda_Seguro
        'N' // Deseo_Contacto
      ]

      const Dat_Benef = [[
        'TIT', // Relacion
        birthDate, // Fecha_Nacimiento
        formData.gender === 'male' ? 'SXM' : 'SXF', // ID_Sexo
        '100', // Porcent_Pago
        'SAN', // Salud
        formData.incomeDuration === 'single' ? '1320' : '240', // Temporalidad_Pago
        formData.name, // Nombre
        formData.email, // Email
        formData.phone // Telefono
      ]]

      // URLs del sistema original
      const url_root = 'http://ec2-54-177-111-101.us-west-1.compute.amazonaws.com:8005/datasnap/rest/TServerMethods1/'
      const ServFunc = 'Calculo_Grupo_Opcion_VPS'

      // Simular la llamada al servicio original
      // En la implementación real, aquí usarías tu función Calculo_RRPP
      console.log('Datos para cálculo:', { Dat_Princ, Dat_Benef })
      
      // Simular resultados por ahora
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockResults = generateMockResults()
      setResults(mockResults)
      setCurrentStep(2)

    } catch (error) {
      console.error('Error en el cálculo:', error)
      alert('Error al calcular la pensión. Por favor, intente nuevamente.')
    } finally {
      setIsCalculating(false)
    }
  }

  const generateMockResults = () => {
    const baseAmount = parseFloat(formData.investedAmount)
    return Array.from({ length: 44 }, (_, i) => {
      if (i % 11 === 2) return (baseAmount * 0.08 * (1 + Math.random() * 0.2)).toFixed(2) // Pensión
      if (i % 11 === 7) return formData.incomeDuration === 'single' ? '1320' : '240' // Temporalidad
      if (i % 11 === 10) return formData.currencyOption // Moneda
      return (Math.random() * 1000).toFixed(2)
    })
  }

  const handleContactRequest = () => {
    alert('¡Gracias! Pronto un ejecutivo se pondrá en contacto con usted.')
  }

  const handleRecalculate = () => {
    setCurrentStep(1)
    setResults(null)
  }

  if (currentStep === 2 && results) {
    return <ResultsView 
      formData={formData} 
      results={results} 
      onContactRequest={handleContactRequest}
      onRecalculate={handleRecalculate}
    />
  }

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      background: 'white',
      minHeight: '100vh'
    }}>
      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '30px',
        borderBottom: '2px solid #ccc',
        paddingBottom: '10px'
      }}>
        <div style={{
          padding: '10px 20px',
          background: currentStep === 1 ? '#0066cc' : '#f0f0f0',
          color: currentStep === 1 ? 'white' : '#666',
          borderRadius: '5px 5px 0 0',
          fontWeight: 'bold',
          flex: 1,
          textAlign: 'center'
        }}>
          1. Ingreso de Información
        </div>
        <div style={{
          padding: '10px 20px',
          background: currentStep === 2 ? '#0066cc' : '#f0f0f0',
          color: currentStep === 2 ? 'white' : '#666',
          borderRadius: '5px 5px 0 0',
          fontWeight: 'bold',
          flex: 1,
          textAlign: 'center'
        }}>
          2. Resultados
        </div>
      </div>

      {/* Form Content */}
      <div style={{ padding: '0 20px' }}>
        {/* Preferencias de Pensión */}
        <FormSection title="¿Cuánto le gustaría que durara su pensión?">
          <RadioGroup
            name="incomeDuration"
            value={formData.incomeDuration}
            onChange={handleInputChange}
            options={[
              { value: 'single', label: 'Para toda la vida' },
              { value: 'joint', label: 'Por un período de tiempo' }
            ]}
          />
        </FormSection>

        <FormSection title="¿Le gustaría que en caso de muerte un beneficiario recibiera su pensión?">
          <RadioGroup
            name="beneficiaryOption"
            value={formData.beneficiaryOption}
            onChange={handleInputChange}
            options={[
              { value: 'yes', label: 'Sí' },
              { value: 'no', label: 'No' }
            ]}
          />
        </FormSection>

        <FormSection title="¿Desearía tener un seguro de vida durante la vigencia de la pensión?">
          <RadioGroup
            name="insuranceOption"
            value={formData.insuranceOption}
            onChange={handleInputChange}
            options={[
              { value: 'yes', label: 'Sí' },
              { value: 'no', label: 'No' }
            ]}
          />
        </FormSection>

        <FormSection title="¿Le gustaría que se le devolviera un monto de dinero si sobrevive el período de duración de la pensión?">
          <RadioGroup
            name="refundOption"
            value={formData.refundOption}
            onChange={handleInputChange}
            options={[
              { value: 'yes', label: 'Sí' },
              { value: 'no', label: 'No' }
            ]}
          />
        </FormSection>

        <FormSection title="¿En qué moneda desea recibir su pensión?">
          <RadioGroup
            name="currencyOption"
            value={formData.currencyOption}
            onChange={handleInputChange}
            options={[
              { value: 'Soles', label: 'Soles' },
              { value: 'Dolares', label: 'Dólares' }
            ]}
          />
        </FormSection>

        <FormSection title="¿Cuánto le gustaría invertir para su pensión?">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
            <span style={{ minWidth: '150px', fontWeight: 'bold' }}>Monto a Invertir $</span>
            <select
              name="investedAmount"
              value={formData.investedAmount}
              onChange={handleInputChange}
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            >
              <option value="">Seleccione un monto</option>
              {investmentOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </FormSection>

        {/* Divisor */}
        <div style={{ 
          borderTop: '2px dotted #000', 
          margin: '30px 0',
          paddingTop: '30px'
        }}>
          <h2 style={{ color: 'black', fontWeight: 'bold', fontSize: '18px' }}>
            Acerca de Usted
          </h2>
        </div>

        {/* Información Personal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <FormField
            label="Nombre"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              Sexo
            </label>
            <RadioGroup
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              options={[
                { value: 'male', label: 'Masculino' },
                { value: 'female', label: 'Femenino' }
              ]}
              inline
            />
          </div>

          <FormField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <FormField
            label="Fecha de Nacimiento"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            min="1939-01-01"
            max="2000-12-31"
            required
          />

          <FormField
            label="Teléfono"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Botón de Cálculo */}
        <div style={{ 
          textAlign: 'right', 
          marginTop: '40px',
          borderTop: '2px dotted #000',
          paddingTop: '20px'
        }}>
          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: 'bold',
              background: isCalculating ? '#6c757d' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isCalculating ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {isCalculating ? 'Calculando...' : 'Siguiente'}
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isCalculating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ marginTop: '20px', fontSize: '18px', color: '#333' }}>
            Calculando su pensión...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  )
}

// Componentes auxiliares
const FormSection = ({ title, children }) => (
  <div style={{ marginBottom: '25px' }}>
    <h2 style={{ 
      color: 'black', 
      fontWeight: 'bold', 
      fontSize: '18px',
      marginBottom: '15px'
    }}>
      {title}
    </h2>
    {children}
  </div>
)

const RadioGroup = ({ name, value, onChange, options, inline = false }) => (
  <div style={{ 
    display: inline ? 'flex' : 'block',
    gap: inline ? '15px' : '5px',
    alignItems: inline ? 'center' : 'flex-start'
  }}>
    {options.map(option => (
      <label key={option.value} style={{
        display: inline ? 'flex' : 'block',
        alignItems: 'center',
        marginBottom: inline ? 0 : '5px',
        fontSize: '14px',
        cursor: 'pointer'
      }}>
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          style={{ marginRight: '5px' }}
        />
        {option.label}
      </label>
    ))}
  </div>
)

const FormField = ({ label, type, name, value, onChange, required, min, max }) => (
  <div>
    <label style={{ 
      fontWeight: 'bold', 
      display: 'block', 
      marginBottom: '8px',
      color: '#000'
    }}>
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      min={min}
      max={max}
      style={{
        width: '100%',
        padding: '8px',
        fontSize: '14px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box'
      }}
    />
  </div>
)

// Componente de Resultados
const ResultsView = ({ formData, results, onContactRequest, onRecalculate }) => {
  const parseResults = (results) => {
    const options = []
    for (let i = 0; i < 4; i++) {
      const baseIndex = i * 11
      options.push({
        pension: parseFloat(results[baseIndex + 2]),
        currency: results[baseIndex + 10],
        temporality: parseInt(results[baseIndex + 7]) === 1320 ? 'Vitalicio' : `${results[baseIndex + 7]} meses`,
        guaranteed: results[baseIndex + 4] || '',
        deathBenefit: results[baseIndex + 5] || '',
        survivorBenefit: results[baseIndex + 6] || '',
        funeralExpense: results[baseIndex + 8] || '',
        totalReceived: results[baseIndex + 9] || ''
      })
    }
    return options
  }

  const optionsData = parseResults(results)

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      background: 'white'
    }}>
      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '30px',
        borderBottom: '2px solid #ccc'
      }}>
        <div style={{
          padding: '10px 20px',
          background: '#f0f0f0',
          color: '#666',
          flex: 1,
          textAlign: 'center'
        }}>
          1. Ingreso de Información
        </div>
        <div style={{
          padding: '10px 20px',
          background: '#0066cc',
          color: 'white',
          fontWeight: 'bold',
          flex: 1,
          textAlign: 'center'
        }}>
          2. Resultados
        </div>
      </div>

      {/* Información del Usuario */}
      <div style={{
        background: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '2px dashed #000'
      }}>
        <h2>Su Información</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div><strong>Nombre:</strong> {formData.name}</div>
          <div><strong>Email:</strong> {formData.email}</div>
          <div><strong>Teléfono:</strong> {formData.phone}</div>
          <div><strong>Monto Invertido:</strong> {parseInt(formData.investedAmount).toLocaleString()} {formData.currencyOption}</div>
          <div><strong>Duración:</strong> {formData.incomeDuration === 'single' ? 'Para toda la vida' : 'Por período de tiempo'}</div>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <h2>Resumen de Resultados Propuestos de Acuerdo a sus Preferencias</h2>
      <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ccc'
        }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>PENSIÓN</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Moneda</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Temporalidad</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Garantizado</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Monto por Fallecimiento</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Monto Supervivencia</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Gasto Sepelio</th>
              <th style={{ padding: '10px', border: '1px solid #ccc' }}>Monto Recibido Total</th>
            </tr>
          </thead>
          <tbody>
            {optionsData.map((option, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {option.pension.toFixed(2)}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {option.currency}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {option.temporality}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {option.guaranteed}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {option.deathBenefit}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {option.survivorBenefit}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {option.funeralExpense}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                  {option.totalReceived}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones de Acción */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px',
        marginTop: '30px'
      }}>
        <button
          onClick={onRecalculate}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Volver a calcular
        </button>
        <button
          onClick={onContactRequest}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Quiero que me Contacten
        </button>
      </div>
    </div>
  )
}

export default PensionCalculator