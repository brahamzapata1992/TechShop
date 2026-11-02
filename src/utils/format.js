export const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'USD' }).format(value)

export const createOrderId = () => `TS-${Date.now().toString().slice(-8)}`
