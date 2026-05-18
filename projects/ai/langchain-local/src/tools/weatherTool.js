import { tool } from "@langchain/core/tools";

export const weatherTool = tool(
  async ({ city }) => {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh&format=json`,
    );
    const geoData = await geoRes.json();

    const place = geoData?.results?.[0];
    if (!place) {
      return `City not found: ${city}`;
    }

    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`,
    );
    const weatherData = await weatherRes.json();
    const current = weatherData.current;

    return `${place.name}天气：
    - temperature: ${current.temperature_2m}
    - humidity: ${current.relative_humidity_2m}
    - wind_speed: ${current.wind_speed_10m}
    - weather_code: ${current.weather_code}
    `;
  },
  {
    name: "get_weather",
    description: "Get the current weather for a given city",
    schema: {
      type: "object",
      properties: {
        city: {
          type: "string",
          description: "City name, for example Singapore / Beijing / Tokyo",
        },
      },
      required: ["city"],
      additionalProperties: false,
    },
  },
);
