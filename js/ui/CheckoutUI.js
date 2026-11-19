import { Producto } from '../modelo/Producto.js';
import { Carrito } from '../modelo/Carrito.js';
import { Cliente } from '../modelo/Cliente.js';
import { Transaccion } from '../modelo/Transaccion.js';
import { PagoTarjeta } from '../pagos/PagoTarjeta.js';
import { PagoPSE } from '../pagos/PagoPSE.js';
import { PagoNequi } from '../pagos/PagoNequi.js';
import { ServicioDivisas } from '../servicios/ServicioDivisas.js';
import { ServicioClima } from '../servicios/ServicioClima.js';
import { ServicioEnvio } from '../servicios/ServicioEnvio.js';

export class CheckoutUI {
    #carrito;
    #divisas;
    #clima;
    #envio;
    #cliente = null;
    #productos = [];
    #cotizacion = null;

    constructor() {
        this.#carrito = new Carrito();
        this.#divisas = new ServicioDivisas();
        this.#clima = new ServicioClima();
        this.#envio = new ServicioEnvio();
        this.#inicializar();
    }

    #log(mensaje) {
        const consola = document.getElementById('log-eventos');
        const p = document.createElement('p');
        p.textContent = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
        consola.prepend(p);
    }

    async #inicializar() {
        await this.#cargarProductos();
        this.#configurarEventos();
        this.#log("Simulador listo: Productos cargados.");
    }

    async #cargarProductos() {
        try {
            // Nota: Al usar Live Server, la ruta correcta desde la raíz es /data/...
            const resp = await fetch('./data/productos.json');
            const data = await resp.json();
            this.#productos = data.map(obj => Producto.desdeJSON(obj));
            this.#renderizarCatalogo();
        } catch (error) {
            this.#log(`Error cargando catálogo: ${error.message}`);
        }
    }

    #renderizarCatalogo() {
        const contenedor = document.getElementById('contenedor-productos');
        contenedor.innerHTML = '';
        this.#productos.forEach(p => {
            const div = document.createElement('div');
            div.className = 'producto';
            div.innerHTML = `
                <h4>${p.nombre}</h4>
                <p>SKU: ${p.sku} · Stock: <span id="stock-${p.sku}">${p.stock}</span></p>
                <p>Precio: $${p.precio.toLocaleString('es-CO')}</p>
                <button data-sku="${p.sku}">Agregar</button>
            `;
            div.querySelector('button').addEventListener('click', () => this.#agregarAlCarrito(p));
            contenedor.appendChild(div);
        });
    }

    #agregarAlCarrito(producto) {
        try {
            this.#carrito.agregar(producto, 1);
            document.getElementById(`stock-${producto.sku}`).textContent = producto.stock;
            this.#actualizarResumen();
            this.#log(`Agregado: ${producto.nombre} (1 und.)`);
        } catch (error) {
            alert(error.message);
        }
    }

    #actualizarResumen() {
        document.getElementById('subtotal').textContent = `$${this.#carrito.subtotal.toLocaleString('es-CO')}`;
    }

    #configurarEventos() {
               document.getElementById('form-cliente').addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            
            // Leer el valor del select y quitarle espacios por si acaso
            const ciudadSeleccionada = document.getElementById('ciudad').value.trim(); 
            
            if (!nombre || !correo || !ciudadSeleccionada) return alert("Complete todos los campos.");

            // Coordenadas aproximadas
            const coords = { 
                Medellin: {lat: 6.2442, lon: -75.5812}, 
                Bogota: {lat: 4.7110, lon: -74.0721}, 
                Cali: {lat: 3.4516, lon: -76.5320}, 
                Barranquilla: {lat: 10.9685, lon: -74.7813} 
            };

            // Verificamos si la ciudad existe en nuestro objeto de coordenadas
            if (!coords[ciudadSeleccionada]) {
                return alert("Ciudad no reconocida. Revisa el HTML.");
            }

            // Creamos el cliente
            this.#cliente = new Cliente(
                crypto.randomUUID(), 
                nombre, 
                correo, 
                { nombre: ciudadSeleccionada, ...coords[ciudadSeleccionada] }
            );
            
            document.getElementById('mensaje-cliente').textContent = `Cliente guardado: ${this.#cliente.describir()}`;
            this.#log(`Cliente registrado: ${nombre} en ${ciudadSeleccionada}`);
        });

        document.getElementById('btn-cotizar').addEventListener('click', () => this.#cotizarEnvio());
        document.getElementById('moneda').addEventListener('change', () => this.#convertirMoneda());
        document.getElementById('medio-pago').addEventListener('change', (e) => this.#renderizarCamposPago(e.target.value));
         this.#renderizarCamposPago(document.getElementById('medio-pago').value);
        document.getElementById('btn-pagar').addEventListener('click', () => this.#pagar());
    }

    async #cotizarEnvio() {
        if (!this.#cliente) return alert("Primero guarde el cliente.");
        try {
            const clima = await this.#clima.actual(this.#cliente.destino.lat, this.#cliente.destino.lon);
            const km = this.#envio.distanciaKm(this.#cliente.destino);
            const costo = this.#envio.costo(km, clima.llueve, this.#carrito.subtotal);
            this.#cotizacion = { km, clima, costo };
            
            document.getElementById('costo-envio').textContent = `$${costo.toLocaleString('es-CO')} (${Math.round(km)} km)`;
            document.getElementById('info-clima').textContent = `${clima.llueve ? 'Lluvia' : 'Despejado'} (${clima.temperatura}°C)`;
            this.#log(`Envío cotizado: ${Math.round(km)} km, costo $${costo}`);
            this.#actualizarTotales();
        } catch (error) {
            this.#log(`Error cotizando envío: ${error.message}`);
        }
    }

    async #convertirMoneda() {
        const moneda = document.getElementById('moneda').value;
        const totalCOP = this.#carrito.subtotal + (this.#cotizacion ? this.#cotizacion.costo : 0);
        if (moneda === 'COP') {
            document.getElementById('total-convertido').textContent = `$${totalCOP.toLocaleString('es-CO')} COP`;
        } else {
            const convertido = await this.#divisas.convertir(totalCOP, 'COP', moneda);
            document.getElementById('total-convertido').textContent = `${convertido.toFixed(2)} ${moneda}`;
        }
    }

    #renderizarCamposPago(medio) {
        const contenedor = document.getElementById('campos-pago');
        contenedor.innerHTML = '';
        if (medio === 'tarjeta') {
            contenedor.innerHTML = `
                <label for="num-tarjeta">Número de tarjeta:</label>
                <input type="text" id="num-tarjeta" placeholder="16 dígitos">
                <label for="titular">Titular:</label>
                <input type="text" id="titular" placeholder="Nombre del titular">
            `;
        } else if (medio === 'pse') {
            contenedor.innerHTML = `
                <label for="banco-pse">Banco:</label>
                <input type="text" id="banco-pse" placeholder="Ej. Bancolombia">
                <label for="usuario-pse">Usuario PSE:</label>
                <input type="text" id="usuario-pse" placeholder="Su usuario">
            `;
        } else if (medio === 'nequi') {
            contenedor.innerHTML = `
                <label for="celular-nequi">Celular Nequi:</label>
                <input type="text" id="celular-nequi" placeholder="10 dígitos">
            `;
        }
    }

    #actualizarTotales() {
        const subtotal = this.#carrito.subtotal;
        const envio = this.#cotizacion ? this.#cotizacion.costo : 0;
        document.getElementById('total').textContent = `$${(subtotal + envio).toLocaleString('es-CO')}`;
    }

    async #pagar() {
        if (!this.#cliente) return alert("Primero guarde el cliente.");
        if (this.#carrito.items.length === 0) return alert("El carrito está vacío.");
        if (!this.#cotizacion) return alert("Primero cotice el envío.");
        if (!document.getElementById('autorizacion').checked) return alert("Debe autorizar el tratamiento de datos.");

        const medio = document.getElementById('medio-pago').value;
        let pagoObj;

        try {
            if (medio === 'tarjeta') {
                pagoObj = new PagoTarjeta(document.getElementById('num-tarjeta').value, document.getElementById('titular').value);
            } else if (medio === 'pse') {
                pagoObj = new PagoPSE(document.getElementById('banco-pse').value, document.getElementById('usuario-pse').value);
            } else {
                pagoObj = new PagoNequi(document.getElementById('celular-nequi').value);
            }

            if (!pagoObj.validar()) throw new Error("Datos de pago inválidos.");

            const totalBase = this.#carrito.subtotal + this.#cotizacion.costo;
            const comision = totalBase * pagoObj.calcularComision();
            const totalFinal = totalBase + comision;

            const mensajePago = pagoObj.procesar(totalFinal);

            const transaccion = new Transaccion(
                this.#cliente,
                this.#carrito.items,
                this.#cotizacion,
                pagoObj,
                document.getElementById('moneda').value,
                "Tasa actual"
            );
            transaccion.estado = "Pagado";

            // Guardar en localStorage
            const historial = JSON.parse(localStorage.getItem('historialTransacciones') || '[]');
            historial.push(transaccion.toJSON());
            localStorage.setItem('historialTransacciones', JSON.stringify(historial));

            // Mostrar recibo
            document.getElementById('seccion-recibo').style.display = 'block';
            document.getElementById('contenido-recibo').innerHTML = `
                <p><strong>ID:</strong> ${transaccion.id}</p>
                <p><strong>Fecha:</strong> ${transaccion.fecha}</p>
                <p><strong>Estado:</strong> ${transaccion.estado}</p>
                <p><strong>Cliente:</strong> ${this.#cliente.describir()}</p>
                <p><strong>Total:</strong> $${totalFinal.toLocaleString('es-CO')}</p>
                <p><strong>Pago:</strong> ${mensajePago}</p>
            `;
            this.#log(`Transacción exitosa: ${transaccion.id}`);
            alert("Pago realizado con éxito.");
        } catch (error) {
            alert(`Error en el pago: ${error.message}`);
            this.#log(`Error en pago: ${error.message}`);
        }
    }
}