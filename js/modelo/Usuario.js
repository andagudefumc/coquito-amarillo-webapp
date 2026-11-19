/**
 * Clase abstracta que representa a un usuario del sistema.
 * Evidencia: Abstracción y Encapsulamiento.
 * @abstract
 */
export class Usuario {
    #id;
    #nombre;
    #correo;

    constructor(id, nombre, correo) {
        if (new.target === Usuario) {
            throw new TypeError("No se puede instanciar la clase abstracta Usuario.");
        }
        this.#id = id;
        this.#nombre = nombre;
        this.#correo = correo;
    }

    get id() { return this.#id; }
    get nombre() { return this.#nombre; }
    get correo() { return this.#correo; }

    /**
     * Método abstracto que debe ser implementado por las subclases.
     * @abstract
     */
    describir() {
        throw new Error("El método describir() debe ser implementado por la subclase.");
    }
}