import { type FragmentType, getFragmentData } from "@/gql/discovery";
import { variantFragment } from "@/integrations/server/discovery/fragments/variant";

export default function resolveProductVariantsFragment(
  variants: (FragmentType<typeof variantFragment> | null)[] | null | undefined,
) {
  return variants?.map((variant) => getFragmentData(variantFragment, variant));
}
