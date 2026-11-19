/**
 * Evidencia: Encapsulamiento y serialización (toJSON).
 */
export class Transaccion {
    #id;
    #fecha;
    #estado;
    #cliente;
    #items;
    #envio;
    #pago;
    #moneda;
    #tasa;

    constructor(cliente, items, envio, pago, moneda, tasa) {
        this.#id = crypto.randomUUID();
        this.#fecha = new Date().toISOString();
        this.#estado = "Pendiente";
        this.#cliente = cliente;
        this.#items = items;
        this.#envio = envio;
        this.#pago = pago;
        this.#moneda = moneda;
        this.#tasa = tasa;
    }

    get id() { return this.#id; }
    get fecha() { return this.#fecha; }
    get estado() { return this.#estado; }

    get total() {
        const subtotal = this.#items.reduce((acc, item) => acc + item.subtotal, 0);
        return subtotal + this.#envio.costo;
    }

    /**
     * Cambia el estado de la transacción (ej. Pagado).
     */
    set estado(nuevoEstado) { this.#estado = nuevoEstado; }

    /**
     * Serialización para localStorage.
     */
    toJSON() {
        return {
            id: this.#id,
            fecha: this.#fecha,
            estado: this.#estado,
            cliente: this.#cliente.describir(),
            items: this.#items.map(i => ({ sku: i.producto.sku, cantidad: i.cantidad, subtotal: i.subtotal })),
            envio: this.#envio,
            pago: this.#pago.constructor.name,
            moneda: this.#moneda,
            tasa: this.#tasa,
            total: this.total
        };
    }

    /**
     * Reconstrucción desde JSON (Método estático).
     */
    static fromJSON(obj) {
        return obj;
    }
}