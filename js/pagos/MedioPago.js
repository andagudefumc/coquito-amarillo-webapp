/**
 * Clase abstracta para medios de pago.
 * Evidencia: Abstracción (define el contrato) y Polimorfismo (métodos que se sobrescriben).
 * @abstract
 */
export class MedioPago {
    constructor() {
        if (new.target === MedioPago) {
            throw new TypeError("No se puede instanciar la clase abstracta MedioPago.");
        }
    }

    /**
     * Valida los datos del medio de pago.
     * @abstract
     * @returns {boolean}
     */
    validar() {
        throw new Error("El método validar() debe ser implementado.");
    }

    /**
     * Procesa el pago.
     * @abstract
     * @param {number} monto 
     * @returns {string} Mensaje de éxito.
     */
    procesar(monto) {
        throw new Error("El método procesar() debe ser implementado.");
    }

    /**
     * Calcula la comisión del medio de pago.
     * @abstract
     * @returns {number}
     */
    calcularComision() {
        throw new Error("El método calcularComision() debe ser implementado.");
    }
}