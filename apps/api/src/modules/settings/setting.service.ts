import { SettingRepository } from "./setting.repository.js";
import { AppError } from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";

const ALLOWED_SETTING_KEYS = new Set([
  "company.name",
  "company.logo",
  "company.phone",
  "company.email",
  "company.address",
  "system.theme",
  "system.currency",
  "system.dateFormat",
  "system.timeFormat",
]);

function assertAllowedKey(key: string) {
  if (!ALLOWED_SETTING_KEYS.has(key)) {
    throw new AppError(
      `Unsupported setting: ${key}`,
      400,
    );
  }
}

function buildSettings(
  settings: Array<{
    key: string;
    value: string;
  }>,
) {
  const result: {
    company: Record<string, string>;
    system: Record<string, string>;
  } = {
    company: {},
    system: {},
  };

  for (const setting of settings) {
    const [section, key] = setting.key.split(".");

    if (section === "company" || section === "system") {
      result[section][key] = setting.value;
    }
  }

  return result;
}

export class SettingService {
  static async getAll() {
    const settings =
      await SettingRepository.findMany();

    return buildSettings(settings);
  }

  static async update(data: {
    company?: Record<string, string>;
    system?: Record<string, string>;
  }) {
    await prisma.$transaction(async (tx) => {
      if (data.company) {
        for (const [key, value] of Object.entries(
          data.company,
        )) {
          const settingKey = `company.${key}`;

          assertAllowedKey(settingKey);

          await SettingRepository.upsert(
            settingKey,
            value,
            tx,
          );
        }
      }

      if (data.system) {
        for (const [key, value] of Object.entries(
          data.system,
        )) {
          const settingKey = `system.${key}`;

          assertAllowedKey(settingKey);

          await SettingRepository.upsert(
            settingKey,
            value,
            tx,
          );
        }
      }
    });

    return SettingService.getAll();
  }
}