/**
 * Evidencia: Encapsulamiento (estado privado y reglas de negocio).
 */
export class Producto {
    #sku;
    #nombre;
    #precio;
    #stock;

    constructor(sku, nombre, precio, stock = 0) {
        this.#sku = sku;
        this.#nombre = nombre;
        this.#precio = precio;
        this.#stock = stock;
    }

    get sku() { return this.#sku; }
    get nombre() { return this.#nombre; }
    get precio() { return this.#precio; }
    get stock() { return this.#stock; }

    /**
     * Intenta reservar una cantidad. Si no hay stock, lanza error.
     * @param {number} cantidad 
     */
    reservar(cantidad) {
        if (cantidad <= 0) throw new RangeError("La cantidad debe ser positiva.");
        if (cantidad > this.#stock) throw new Error(`Stock insuficiente para ${this.#nombre}. Disponible: ${this.#stock}`);
        this.#stock -= cantidad;
    }

    /**
     * Devuelve stock al inventario (ej. al quitar del carrito).
     * @param {number} cantidad 
     */
    devolverStock(cantidad) {
        if (cantidad > 0) this.#stock += cantidad;
    }

    /**
     * Fábrica estática para crear instancias desde JSON.
     */
    static desdeJSON(obj) {
        return new Producto(obj.sku, obj.nombre, obj.precio, obj.stock);
    }
}