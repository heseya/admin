import { accessor } from '@/store'
import { AttributeOption, ProductAttribute } from '@heseya/store-core'
import { groupBy } from 'lodash'

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
    .filter(({ option }) => option?.value_date || option?.value_number || option?.name)
    .map(
      async (attribute): Promise<UpdatedAttributesStructure> => ({
        ...attribute,
        selected_options: attribute.option.id
          ? await accessor.attributes.updateOption({
              attributeId: attribute.id,
              optionId: attribute.option.id,
              option: attribute.option,
            })
          : await accessor.attributes.addOption({
              attributeId: attribute.id,
              option: attribute.option,
            }),
      }),
    )

  const updatedAttributes = await Promise.all(updatesPromises)

  if (updatedAttributes.some((a) => !a.selected_options.success))
    throw new Error('Failed to update attribute options')

  // There are duplicated attributes, all with only one selected option (becouse they've been flatted before)
  const singleOptionAttributes = updatedAttributes
    .filter((a) => a.selected_options.success)
    .map(
      (a): ProductAttribute =>
        ({
          ...a,
          selected_options: [(a.selected_options as SuccessfulOptionResult).option],
        } as ProductAttribute),
    )

  // We need to group duplicated attributes by id, and merge their selected options
  const attributes = Object.values(groupBy(singleOptionAttributes, 'id')).map((attributes) => ({
    ...attributes[0],
    selected_options: attributes.map((a) => a.selected_options[0]),
  }))

  return attributes
}
