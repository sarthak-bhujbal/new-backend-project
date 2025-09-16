import { Model, ModelStatic } from "sequelize";

type UniqueTitleCheckConfig = {
  uniqueTitle: string[]; 
  errorMessage?: string;
};
export function uniqueTitleCheckHook<T extends Model>(config: UniqueTitleCheckConfig) {
  const { uniqueTitle, errorMessage } = config;

  return async function (instance: T) {
    const where: Record<string, any> = {};
    for (const field of uniqueTitle) {
      where[field] = (instance as any)[field];
    }

    if (Object?.values(where)?.some((v) => v == null)) {
      return;
    }

    const model = instance.constructor as ModelStatic<T>;

    const existing = await model?.findOne({ where });
    if (existing) {
      throw new Error(errorMessage || `Record with ${uniqueTitle?.join(", ")} already exists.`);
    }
  };
}
