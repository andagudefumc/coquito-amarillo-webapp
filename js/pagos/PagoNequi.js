import { MedioPago } from './MedioPago.js';

/**
 * Evidencia: Herencia y Polimorfismo.
 */
export class PagoNequi extends MedioPago {
    #celular;

    constructor(celular) {
        super();
        this.#celular = celular;
    }

    validar() {
        // Validación simple: 10 dígitos numéricos
        return this.#celular.length === 10 && !isNaN(this.#celular);
    }

    procesar(monto) {
        if (!this.validar()) throw new Error("Número de celular Nequi inválido (deben ser 10 dígitos).");
        return `Pago de $${monto.toLocaleString('es-CO')} procesado vía Nequi (Celular: ${this.#celular}).`;
    }

    calcularComision() {
        // 0% de comisión
        return 0;
    }
}