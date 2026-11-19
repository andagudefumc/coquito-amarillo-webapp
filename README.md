# 🛒 Tienda Web - Coquito Amarillo SAS

Prototipo funcional de una tienda web de una sola página (SPA) desarrollado como proyecto integrador para la asignatura **Lenguajes de Programación para la Web**. 

El sistema reemplaza los pedidos manuales por WhatsApp con un flujo transaccional completo que permite registrar un cliente, armar un carrito, cotizar envíos (con clima y geolocalización), convertir divisas y pagar con diferentes medios.

## 🏗️ Decisiones de Diseño (Justificación del modelo)

A partir del diagrama propuesto, se tomaron las siguientes decisiones para robustecer la arquitectura:

1. **Clase abstracta `MedioPago`:** Se implementó como clase base para `PagoTarjeta`, `PagoPSE` y `PagoNequi`. Esto evita la duplicación de código y obliga a que cada medio de pago implemente sus propios métodos `validar()` y `calcularComision()`, demostrando **polimorfismo** puro.
2. **Uso de `Map` en la clase `Carrito`:** Se decidió usar un `Map` en lugar de un arreglo para almacenar los ítems, indexados por el `sku` del producto. Esto optimiza la búsqueda (al agregar o quitar) a un tiempo constante O(1) y evita que un mismo producto se duplique en el carrito.
3. **Encapsulamiento estricto con `#`:** Todos los atributos de las clases de dominio (Producto, Cliente, Transaccion) son privados. Las modificaciones de estado (como el stock o los puntos de fidelidad) solo pueden realizarse a través de métodos controlados, garantizando que nunca se asigne un precio negativo o un stock inválido.

## 📂 Arquitectura del Proyecto

El proyecto sigue una arquitectura en capas, separando las responsabilidades y usando **Módulos ES6** (`import`/`export`):

```text
coquito-amarillo-webapp/
├── index.html            # Interfaz principal
├── css/
│   └── estilos.css       # Diseño responsive y accesible
├── data/
│   └── productos.json    # Datos iniciales del catálogo
└── js/
    ├── main.js           # Punto de entrada de la aplicación
    ├── modelo/           # Clases de dominio (Usuario, Cliente, Producto, Carrito, Transaccion)
    ├── pagos/            # Jerarquía de medios de pago (MedioPago, PagoTarjeta, PagoPSE, PagoNequi)
    ├── servicios/        # Consumo de APIs externas (Divisas, Clima, Envío)
    └── ui/               # Controlador (CheckoutUI)

    
---

### PASO 4: Copiar la Parte 3 (El Diagrama UML)


```markdown
## 📊 Diagrama de Clases (UML)

```mermaid
classDiagram
    class Usuario {
        <<abstract>>
        #id
        #nombre
        #correo
        +describir()*
    }
    class Cliente {
        #destino
        #puntosFidelidad
        +describir()
        +acumularPuntos()
    }
    Usuario <|-- Cliente

    class Producto {
        #sku
        #nombre
        #precio
        #stock
        +reservar(cantidad)
        +devolverStock(cantidad)
        +desdeJSON()$
    }

    class Carrito {
        #items: Map
        +agregar(p, cant)
        +quitar(sku, cant)
        +subtotal
    }
    class ItemCarrito {
        #producto
        #cantidad
        +subtotal
    }
    Carrito *-- ItemCarrito
    ItemCarrito --> Producto

    class MedioPago {
        <<abstract>>
        +validar()*
        +procesar(monto)*
        +calcularComision()*
    }
    class PagoTarjeta {
        +calcularComision()
    }
    class PagoPSE {
        +calcularComision()
    }
    class PagoNequi {
        +calcularComision()
    }
    MedioPago <|-- PagoTarjeta
    MedioPago <|-- PagoPSE
    MedioPago <|-- PagoNequi

    class Transaccion {
        #id
        #fecha
        #estado
        +pagar(medio)
        +toJSON()
        +fromJSON()$
    }