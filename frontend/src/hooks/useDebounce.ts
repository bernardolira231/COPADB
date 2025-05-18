import { useState, useEffect } from 'react';

/**
 * Hook personalizado para aplicar debounce a un valor
 * Útil para retrasar la ejecución de operaciones costosas como llamadas a API
 * mientras el usuario está escribiendo
 * 
 * @param value El valor que se quiere debounce
 * @param delay Tiempo de retraso en milisegundos
 * @returns El valor con debounce aplicado
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configurar un temporizador para actualizar el valor después del retraso
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancelar el temporizador si el valor cambia o el componente se desmonta
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
