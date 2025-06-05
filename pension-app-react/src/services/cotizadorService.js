// Servicio del cotizador - Lógica extraída de cotizador.js original
import { Calculo_RRPP } from './calculoRRPP.js';

// Variables globales del cotizador original
let url_root = 'http://ec2-54-177-111-101.us-west-1.compute.amazonaws.com:8005/datasnap/rest/TServerMethods1/';
let ServFunc = 'Calculo_Grupo_Opcion_VPS';
const FLASK_SERVER_URL = 'http://ec2-54-177-111-101.us-west-1.compute.amazonaws.com:5000';

// Función para capturar datos del formulario (adaptada para React)
export const captureFormData = (formData) => {
    const {
        name,
        email,
        phone,
        investedAmount,
        incomeDuration = 'single',
        beneficiaryOption = 'no',
        insuranceOption = 'no',
        refundOption = 'no',
        currencyOption = 'Soles',
        birthDate,
        gender = 'male'
    } = formData;

    const birthDateFormatted = formatDate(new Date(birthDate));
    const diffMonths = 0;

    // Llenar Json_in exactamente como en el original
    const Json_in = {
        Prima_Neta: investedAmount,
        Per_Diferido: "0",
        Seguro_Fallecimiento: beneficiaryOption === 'yes' ? 'Si' : 'No',
        Seguro_Devolucion: refundOption === 'yes' ? 'Si' : 'No',
        Seguro_Temporal: incomeDuration === 'single' ? 'No' : 'Si',
        Moneda_Seguro: currencyOption,
        Deseo_Contacto: "N",
        Benef_Array: []
    };

    // Llenar Json_Ben exactamente como en el original
    const Json_Ben = {
        Relacion: "TIT",
        Fecha_Nacimiento: birthDateFormatted,
        ID_Sexo: gender === 'male' ? 'SXM' : 'SXF',
        Porcent_Pago: "100",
        Salud: "SAN",
        Temporalidad_Pago: incomeDuration === 'single' ? '1320' : '240',
        Nombre: name,
        email: email,
        Telefono: phone
    };

    Json_in.Benef_Array = [Json_Ben];

    // Log para debugging (igual que el original)
    console.log('Datos capturados y normalizados:', {
        formulario: {
            incomeDuration,
            beneficiaryOption,
            insuranceOption,
            refundOption,
            currencyOption,
            birthDate: birthDateFormatted,
            gender,
            investedAmount,
            name,
            email,
            phone,
            deseoContacto: Json_in.Deseo_Contacto
        },
        Json_in,
        Json_Ben
    });

    return { Json_in, Json_Ben };
};

// Función para formatear fecha (igual que el original)
export const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Función para formatear fecha para gráficos
export const formatDateForGraph = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Función principal de cálculo (igual que el original)
export const calculatePension = async (formData) => {
    try {
        const { Json_in, Json_Ben } = captureFormData(formData);
        
        const Dat_Princ = [
            Json_in.Prima_Neta,
            Json_in.Per_Diferido,
            Json_in.Seguro_Fallecimiento,
            Json_in.Seguro_Devolucion,
            Json_in.Seguro_Temporal,
            '0',
            Json_in.Moneda_Seguro
        ];
        
        const Dat_Benef = [[
            Json_Ben.Relacion,
            Json_Ben.Fecha_Nacimiento,
            Json_Ben.ID_Sexo,
            Json_Ben.Porcent_Pago,
            Json_Ben.Salud,
            Json_Ben.Temporalidad_Pago
        ]];
        
        console.log('Enviando datos al servidor:', { Dat_Princ, Dat_Benef, url_root, ServFunc });
        
        const results = await Calculo_RRPP(Dat_Princ, Dat_Benef, url_root, ServFunc);
        console.log('Resultados recibidos:', results);
        return results;
    } catch (error) {
        console.error('Error en el cálculo:', error);
        throw error;
    }
};

// Función para generar gráficos (adaptada del original)
export const generateGraphsForResults = async (results, investedAmount, birthDate) => {
    if (!results || !Array.isArray(results) || results.length === 0) {
        throw new Error('No hay datos disponibles para generar los gráficos');
    }

    try {
        const birthDateFormatted = formatDateForGraph(birthDate);
        const etx1 = parseFloat(results[44]) || 0;
        const firstPension = parseFloat(results[2]);
        const firstTemporality = parseInt(results[7]);

        console.log('Datos para el gráfico:', {
            pension: firstPension,
            capital: parseFloat(investedAmount),
            mortalidad: etx1,
            fecha_nacimiento: birthDateFormatted,
            temporalidad: firstTemporality
        });

        const response = await fetch(`${FLASK_SERVER_URL}/generate-graph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pension: firstPension,
                capital: parseFloat(investedAmount),
                mortalidad: etx1,
                fecha_nacimiento: birthDateFormatted,
                temporalidad: firstTemporality
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al generar los gráficos:', error);
        throw error;
    }
};

// Función para generar gráfico específico por opción
export const generateGraphForOption = async (results, investedAmount, birthDate, optionIndex) => {
    try {
        const baseIndex = optionIndex * 11;
        const birthDateFormatted = formatDateForGraph(birthDate);
        const etx1 = parseFloat(results[44]) || 0;

        const response = await fetch(`${FLASK_SERVER_URL}/generate-graph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pension: parseFloat(results[baseIndex + 2]),
                capital: parseFloat(investedAmount),
                mortalidad: etx1,
                fecha_nacimiento: birthDateFormatted,
                temporalidad: parseInt(results[baseIndex + 7])
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error al cargar gráfico ${optionIndex + 1}:`, error);
        throw error;
    }
};

// Función para solicitar contacto (del original)
export const requestContact = async (formData) => {
    try {
        const currentData = captureFormData(formData);
        currentData.Json_in.Deseo_Contacto = "S";

        const results = await Calculo_RRPP(
            [
                currentData.Json_in.Prima_Neta,
                currentData.Json_in.Per_Diferido,
                currentData.Json_in.Seguro_Fallecimiento,
                currentData.Json_in.Seguro_Devolucion,
                currentData.Json_in.Seguro_Temporal,
                0,
                currentData.Json_in.Moneda_Seguro,
                "S"
            ],
            [[
                currentData.Json_Ben.Relacion,
                currentData.Json_Ben.Fecha_Nacimiento,
                currentData.Json_Ben.ID_Sexo,
                currentData.Json_Ben.Porcent_Pago,
                currentData.Json_Ben.Salud,
                currentData.Json_Ben.Temporalidad_Pago,
                currentData.Json_Ben.Nombre,
                currentData.Json_Ben.email,
                currentData.Json_Ben.Telefono
            ]],
            url_root,
            ServFunc
        );

        return results;
    } catch (error) {
        console.error('Error al procesar la solicitud de contacto:', error);
        throw error;
    }
};

// Función para actualizar montos de inversión según moneda
export const getInvestmentAmounts = (currency) => {
    const amounts = [];
    
    if (currency === 'Soles') {
        for (let i = 100000; i <= 500000; i += 50000) {
            amounts.push({
                value: i,
                label: i.toLocaleString('es-PE')
            });
        }
    } else {
        // Dólares
        amounts.push({
            value: 70000,
            label: '70,000'
        });
        
        for (let i = 100000; i <= 500000; i += 50000) {
            amounts.push({
                value: i,
                label: i.toLocaleString('es-PE')
            });
        }
    }
    
    return amounts;
};

// Configuraciones y constantes
export const CONFIG = {
    url_root,
    ServFunc,
    FLASK_SERVER_URL
};