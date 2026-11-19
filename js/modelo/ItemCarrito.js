/**
 * Evidencia: Composición (un carrito se compone de ítems).
 */
export class ItemCarrito {
    #producto;
    #cantidad;

    constructor(producto, cantidad) {
        this.#producto = producto;
        this.#cantidad = cantidad;
    }

    get producto() { return this.#producto; }
    get cantidad() { return this.#cantidad; }

    get subtotal() {
        return this.#producto.precio * this.#cantidad;
    }

    /**
     * Añade cantidad al ítem, validando stock.
     */
    agregarCantidad(cantidad) {
        this.#producto.reservar(cantidad);
        this.#cantidad += cantidad;
    }

    /**
     * Quita cantidad del ítem y devuelve stock.
     */
    quitarCantidad(cantidad) {
        if (cantidad > this.#cantidad) throw new Error("No puedes quitar más de lo que tienes.");
        this.#producto.devolverStock(cantidad);
        this.#cantidad -= cantidad;
    }
}