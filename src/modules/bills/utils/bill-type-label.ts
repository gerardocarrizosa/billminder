export const getBillTypeLabel = (type: string): string => {
  switch (type) {
    case 'credit_card':
      return 'Tarjeta de crédito';
    case 'service':
      return 'Servicio';
    case 'subscription':
      return 'Subscripción';
    default:
      return 'Desconocido';
  }
};
