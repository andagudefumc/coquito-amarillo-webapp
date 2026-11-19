import { ItemCarrito } from './ItemCarrito.js';

/**
 * Evidencia: Composición (usa ItemCarrito).
 */
export class Carrito {
    #items; // Map<sku, ItemCarrito>

    constructor() {
        this.#items = new Map();
    }

    get items() { return Array.from(this.#items.values()); }

    get subtotal() {
        return this.items.reduce((acc, item) => acc + item.subtotal, 0);
    }

    /**
     * Agrega un producto al carrito. Si ya existe, aumenta la cantidad.
     * @param {Producto} producto 
     * @param {number} cantidad 
     */
    agregar(producto, cantidad = 1) {
        if (this.#items.has(producto.sku)) {
            this.#items.get(producto.sku).agregarCantidad(cantidad);
        } else {
            producto.reservar(cantidad);
            this.#items.set(producto.sku, new ItemCarrito(producto, cantidad));
        }
    }

    /**
     * Quita cantidad de un producto.
     */
    quitar(sku, cantidad = 1) {
        if (!this.#items.has(sku)) throw new Error("Producto no está en el carrito.");
        const item = this.#items.get(sku);
        item.quitarCantidad(cantidad);
        if (item.cantidad === 0) {
            this.#items.delete(sku);
        }
    }
}