import { tool } from "@langchain/core/tools";
import miio from "miio";

// 配置你米家摄像头的物理信息
const CAMERA_CONFIG = {
  address: "192.168.1.4", // 替换为你的摄像头局域网 IP
  token: "474739356d684146705a6e5264726b68", // 替换为你的 32位 摄像头 Token
};

// 封装摄像头底层控制指令
async function controlXiaomiCamera(actions) {
  let device;
  try {
    // 1. 局域网连接摄像头
    device = await miio.device({
      address: CAMERA_CONFIG.address,
      token: CAMERA_CONFIG.token,
    });

    const results = [];

    // 2. 根据大模型抽取的参数执行动作
    if (actions.power) {
      const isPlay = actions.power === "on"; // on 代表开机看家，off 代表关机休眠

      // 💡 核心修改：针对 C500 双目版，同时向两个镜头（或者主全局开关）发送指令
      // 小米双目设备的休眠通常是通过设置属性(set_properties)来实现
      await device
        .call("set_properties", [
          { did: "camera", siid: 2, piid: 1, value: isPlay }, // 镜头1 (主/云台)
          { did: "camera", siid: 6, piid: 1, value: isPlay }, // 镜头2 (副/固定)
        ])
        .catch(async () => {
          // 备用方案：如果上面通用的 siid 失败，尝试双目合一的全局隐私遮蔽方法 'set_privacy'
          // 1 代表开启隐私（即休眠关闭），0 代表关闭隐私（即开启看家）
          return await device.call("set_privacy", [isPlay ? 0 : 1]);
        });

      results.push(
        `双目摄像头已同步切换为: ${isPlay ? "【双镜头开启看家】" : "【双镜头隐私休眠】"}`,
      );
    }

    if (actions.motor) {
      // 这里的参数通常需要查阅对应型号的指令，这里以常规云台版为例
      // 4个方向分别对应控制电机转动的特定参数
      const directionMap = {
        up: [1, 10], // 向上转动 10 度
        down: [2, 10], // 向下
        left: [3, 20], // 向左
        right: [4, 20], // 向右
      };

      await device.call("set_motor", directionMap[actions.motor]);
      results.push(`云台已向【${actions.motor}】转动`);
    }

    if (results.length === 0) {
      return {
        status: "success",
        message: "未执行任何操作，请提供明确的指令（如开关或转动）",
      };
    }

    return { status: "success", detail: results.join(", ") };
  } catch (error) {
    return {
      status: "error",
      message: `连接或控制摄像头失败: ${error.message}`,
    };
  } finally {
    // 3. 释放局域网连接
    if (device) {
      device.destroy();
    }
  }
}

// 🛠️ 导出给 LangChain 的标准摄像头控制 Tool
export const cameraControlTool = tool(
  async ({ power, motor }) => {
    const result = await controlXiaomiCamera({ power, motor });
    return JSON.stringify(result);
  },
  {
    name: "control_camera",
    description:
      "用于控制房间内的米家智能摄像头。可以控制摄像头的开关（休眠模式切换）以及调整摄像头的云台视线方向（上下左右转动）。",
    schema: {
      type: "object",
      properties: {
        power: {
          type: "string",
          enum: ["on", "off"],
          description:
            "打开或关闭摄像头。'on'代表开启看家工作，'off'代表让摄像头进入休眠隐私遮蔽状态。",
        },
        motor: {
          type: "string",
          enum: ["up", "down", "left", "right"],
          description: "控制摄像头镜头转动的方向。",
        },
      },
    },
  },
);
