/**
 * Servicio para consumir la API de clima (Open-Meteo).
 * Evidencia: Abstracción y manejo de errores con valores de respaldo.
 */
export class ServicioClima {
    async actual(lat, lon) {
        try {
            const url = new URL("https://api.open-meteo.com/v1/forecast");
            url.search = new URLSearchParams({
                latitude: lat, longitude: lon, current: "temperature_2m,weather_code"
            });
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const { current } = await resp.json();
            return {
                temperatura: current.temperature_2m,
                codigo: current.weather_code,
                llueve: current.weather_code >= 51 // Códigos WMO de lluvia
            };
        } catch (error) {
            console.error("Error Clima:", error.message);
            // Valor de respaldo: asumimos tiempo seco
            return { temperatura: 20, codigo: 0, llueve: false, fuente: "Respaldo" };
        }
    }
}