import { MedioPago } from './MedioPago.js';

/**
 * Evidencia: Herencia y Polimorfismo.
 */
export class PagoPSE extends MedioPago {
    #banco;
    #usuario;

    constructor(banco, usuario) {
        super();
        this.#banco = banco;
        this.#usuario = usuario;
    }

    validar() {
        return this.#banco.trim() !== "" && this.#usuario.trim() !== "";
    }

    procesar(monto) {
        if (!this.validar()) throw new Error("Debe ingresar el banco y el usuario PSE.");
        return `Pago de $${monto.toLocaleString('es-CO')} procesado vía PSE (Banco: ${this.#banco}).`;
    }

    calcularComision() {
        // 1.5% de comisión
        return 0.015;
    }
}