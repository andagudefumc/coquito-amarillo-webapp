/**
 * Servicio para consumir la API de tasas de cambio (ExchangeRate-API).
 * Evidencia: Abstracción y manejo de errores con valores de respaldo.
 */
export class ServicioDivisas {
    static #URL = "https://open.er-api.com/v6/latest/USD";
    #cache = null;

    async #tasas() {
        if (this.#cache) return this.#cache;
        try {
            const resp = await fetch(ServicioDivisas.#URL);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            if (data.result !== "success") throw new Error("Respuesta inválida de API");
            this.#cache = { rates: data.rates, fecha: data.time_last_update_utc };
            return this.#cache;
        } catch (error) {
            console.error("Error Divisas:", error.message);
            // Valor de respaldo (hardcoded para que la compra continúe)
            return { rates: { COP: 4000, USD: 1, EUR: 0.92 }, fecha: "Valor de respaldo" };
        }
    }

    /**
     * Convierte un valor entre monedas.
     */
    async convertir(valor, de = "COP", a = "USD") {
        const { rates } = await this.#tasas();
        return (valor / rates[de]) * rates[a];
    }
}