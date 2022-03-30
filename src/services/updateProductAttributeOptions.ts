import { accessor } from '@/store'
import { AttributeOption, ProductAttribute } from '@/interfaces/Attribute'

type SuccessfulOptionResult = { success: true; option: AttributeOption }
type FailedOptionResult = { success: false; error: any }

type UpdatedAttributesStructure = Omit<ProductAttribute, 'selected_options'> & {
  // eslint-disable-next-line camelcase
  selected_options: SuccessfulOptionResult | FailedOptionResult
}

/**
 * - Create not existing attribute options (without id)
 * - - Only when values are filled (value_number or value_date)
 * - Update all existing attribute options
 */
export const updateProductAttributeOptions = async (rawAttributes: ProductAttribute[]) => {
  const updatesPromises = rawAttributes
    .map((attribute) => attribute.selected_options.map((option) => ({ ...attribute, option })))
    .flat()
    .filter(({ option }) => option.value_date || option.value_number || option.name)
    .map(
      async (attribute): Promise<UpdatedAttributesStructure> => ({
        ...attribute,
        // TODO: fix extended store actions typings
        selected_options: attribute.option.id
          ? // @ts-ignore
            await accessor.attributes.updateOption({
              attributeId: attribute.id,
              optionId: attribute.option.id,
              option: attribute.option,
            })
          : // @ts-ignore
            await accessor.attributes.addOption({
              attributeId: attribute.id,
              option: attribute.option,
            }),
      }),
    )

  const updatedAttributes = await Promise.all(updatesPromises)

  const attributes = updatedAttributes
    .filter((a) => a.selected_options.success)
    .map(
      (a): ProductAttribute =>
        ({
          ...a,
          selected_options: [(a.selected_options as SuccessfulOptionResult).option],
        } as ProductAttribute),
    )

  return attributes
}
