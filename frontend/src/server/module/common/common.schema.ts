import { minValue, number, object } from "valibot";

export const commonPaginationSchema = object({
    page:number([minValue(0)]),
    range:number()
})