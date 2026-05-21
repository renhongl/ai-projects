import { tool } from "@langchain/core/tools";

// 模拟的机票后端 API 查询函数
async function mockFlightSearch(params) {
  // 模拟 API 延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 模拟返回的机票数据
  return [
    {
      airline: "中国东方航空",
      flightNumber: "MU5101",
      departureTime: `${params.departureDate} 08:00`,
      arrivalTime: `${params.departureDate} 10:45`,
      price: 1280,
      stops: 0,
    },
    {
      airline: "中国南方航空",
      flightNumber: "CZ3102",
      departureTime: `${params.departureDate} 13:30`,
      arrivalTime: `${params.departureDate} 16:20`,
      price: 1150,
      stops: 0,
    },
    {
      airline: "海南航空",
      flightNumber: "HU7181",
      departureTime: `${params.departureDate} 19:15`,
      arrivalTime: `${params.departureDate} 22:00`,
      price: 980,
      stops: 0,
    },
  ];
}

// 🛠️ 封装成 LangChain 标准的 Tool
export const flightSearchTool = tool(
  async ({ origin, destination, departureDate, returnDate }) => {
    try {
      const flights = await mockFlightSearch({
        origin,
        destination,
        departureDate,
        returnDate,
      });

      // Tool 返回给大模型的数据必须是字符串，通常用 JSON 序列化
      return JSON.stringify({
        status: "success",
        data: flights,
      });
    } catch (error) {
      return JSON.stringify({ status: "error", message: "暂未查询到相关航班" });
    }
  },
  {
    name: "search_flights",
    // 💡 description 极其重要！模型就是靠它来判断在什么场景下调用这个工具
    description:
      "用于查询两个城市之间的实时机票信息、航班号、起飞时间及价格。当用户提及想买机票、查航班、飞往某地时调用。",
    // 💡 参数定义（JSON Schema标准），引导模型精准提取用户输入的关键实体
    schema: {
      type: "object",
      properties: {
        origin: {
          type: "string",
          description: "出发城市或机场代码，例如：北京、上海、PEK、PVG",
        },
        destination: {
          type: "string",
          description: "到达城市或机场代码，例如：广州、深圳、CAN、SZX",
        },
        departureDate: {
          type: "string",
          description: "出发日期，格式必须为 YYYY-MM-DD，例如：2026-06-01",
        },
        returnDate: {
          type: "string",
          description: "返程日期（可选），格式必须为 YYYY-MM-DD",
        },
      },
      // 强制模型必须提取出出发地、目的地和出发时间
      required: ["origin", "destination", "departureDate"],
    },
  },
);
