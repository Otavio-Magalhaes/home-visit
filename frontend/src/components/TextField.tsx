import { de } from "zod/v4/locales";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form.js";
import { Input } from "./ui/input.js";

const TextField = ({ form, name, label, placeholder }: any) => (
    <FormField control={form.control} name={name} render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
          </FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
        </FormItem>
    )} />
);

export default TextField;