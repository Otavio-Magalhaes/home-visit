import { Checkbox } from "./ui/checkbox.js";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form.js";

const CheckField = ({ form, name, label }: any) => (
    <FormField control={form.control} name={name} render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-2 space-y-0 border p-2 rounded bg-gray-50">
            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            <FormLabel className="font-normal text-xs cursor-pointer w-full">{label}</FormLabel>
        </FormItem>
    )} />
);

export default CheckField;