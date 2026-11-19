import { Usuario } from './Usuario.js';

/**
 * Evidencia: Herencia (hereda de Usuario).
 */
export class Cliente extends Usuario {
    #destino; // { nombre, lat, lon }
    #puntosFidelidad;

    constructor(id, nombre, correo, destino) {
        super(id, nombre, correo);
        this.#destino = destino;
        this.#puntosFidelidad = 0;
    }

    get destino() { return this.#destino; }
    get puntosFidelidad() { return this.#puntosFidelidad; }

    /**
     * Sobrescribe el método abstracto de Usuario.
     */
    describir() {
        return `Cliente: ${this.nombre} (${this.correo}) - Destino: ${this.#destino.nombre}`;
    }

    /**
     * Lógica de negocio: acumula puntos por compra.
     * @param {number} montoTotal 
     */
    acumularPuntos(montoTotal) {
        // 1 punto por cada $10.000 COP
        this.#puntosFidelidad += Math.floor(montoTotal / 10000);
        return this.#puntosFidelidad;
    }
}