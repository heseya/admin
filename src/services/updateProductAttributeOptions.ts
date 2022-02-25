import { accessor } from '@/store'
import { AttributeOption, ProductAttribute } from '@/interfaces/Attribute'

type SuccessfulOptionResult = { success: true; option: AttributeOption }
type FailedOptionResult = { success: false; error: any }

type UpdatedAttributesStructure = Omit<ProductAttribute, 'selected_option'> & {
  // eslint-disable-next-line camelcase
  selected_option: SuccessfulOptionResult | FailedOptionResult
}

/**
 * - Create not existing attribute options (without id)
 * - - Only when values are filled (value_number or value_date)
 * - Update all existing attribute options
 */
export const updateProductAttributeOptions = async (rawAttributes: ProductAttribute[]) => {
  const updatesPromises = rawAttributes
    .filter(
      ({ selected_option: option }) => option.value_date || option.value_number || option.name,
    )
    .map(
      async (attribute): Promise<UpdatedAttributesStructure> => ({
        ...attribute,
        // TODO: fix extended store actions typings
        selected_option: attribute.selected_option.id
          ? // @ts-ignore
            await accessor.attributes.updateOption({
              attributeId: attribute.id,
              optionId: attribute.selected_option.id,
              option: attribute.selected_option,
            })
          : // @ts-ignore
            await accessor.attributes.addOption({
              attributeId: attribute.id,
              option: attribute.selected_option,
            }),
      }),
    )

  const updatedAttributes = await Promise.all(updatesPromises)

  const attributes = updatedAttributes
    .filter((a) => a.selected_option.success)
    .map(
      (a): ProductAttribute =>
        ({
          ...a,
          selected_option: (a.selected_option as SuccessfulOptionResult).option,
        } as ProductAttribute),
    )

  return attributes
}
