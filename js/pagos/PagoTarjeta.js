import { MedioPago } from './MedioPago.js';

/**
 * Evidencia: Herencia y Polimorfismo.
 */
export class PagoTarjeta extends MedioPago {
    #numeroTarjeta;
    #titular;

    constructor(numeroTarjeta, titular) {
        super();
        this.#numeroTarjeta = numeroTarjeta;
        this.#titular = titular;
    }

    validar() {
        // Validación simple: 16 dígitos numéricos
        return this.#numeroTarjeta.length === 16 && !isNaN(this.#numeroTarjeta) && this.#titular.trim() !== "";
    }

    procesar(monto) {
        if (!this.validar()) throw new Error("Datos de tarjeta inválidos.");
        return `Pago de $${monto.toLocaleString('es-CO')} procesado con Tarjeta (Titular: ${this.#titular}).`;
    }

    calcularComision() {
        // 3.5% de comisión
        return 0.035;
    }
}