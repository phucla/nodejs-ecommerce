import 'reflect-metadata';

/**
 * Define hellper filter exclude field
 * @param TypeClass
 * @param metadataKey
 * @param excludedValue
 * @param name
 */
export const filterMetadata = (
  TypeClass: { new (): any },
  metadataKey: string,
  excludedValue: string[],
  name?: string
) => {
  class CloneTypeClass extends TypeClass {}
  const metadata: string[] =
    Reflect.getMetadata(metadataKey, CloneTypeClass.prototype) || [];
  const metadataFilltered = metadata.filter(
    (item) => !excludedValue.includes(item)
  );
  const className: string = name || TypeClass.name;

  Reflect.defineMetadata(
    metadataKey,
    metadataFilltered,
    CloneTypeClass.prototype
  );

  Object.defineProperty(CloneTypeClass, 'name', {
    value: className,
  });

  return CloneTypeClass;
};
