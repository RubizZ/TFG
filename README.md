Este proyecto implementa un planificador inteligente de vuelos que busca la ruta más optima (mas barata o mas rápida) entre aeropuertos, permitiendo escalas intermedias obligatorias, utilizando algoritmos de búsqueda de grafos como Dijkstra y A*.
Los precios y combinaciones de vuelos se obtienen dinámicamente desde SerpAPI (Google Flights), minimizando el número de consultas mediante caché persistente en MongoDB.


APIs externas

SerpAPI – Google Flights
  Se utiliza para obtener:
    -Precios reales de vuelos
    -Tramos y escalas

El proyecto puede ejecutarse completamente con Docker.
Arranque: docker compose up --build
IMPORTANTE: Previamente se tiene que definir la key de SerpApi en .env como : SERPAPI_API_KEY=TU_KEY_DE_SERPAPI
