import {
    Autocomplete as AutocompleteMui,
    type AutocompleteProps as AutocompleteMuiProps,
    TextField,
    type TextFieldProps,
} from "@mui/material";
import type { FormikProps, FormikValues } from "formik";
import type React from "react";
import { useId } from "react";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type AutocompleteProps<T = any, Multiple extends boolean = false> = {
    getOptionLabel?: (option: T) => string;
    endAdornment?: React.ReactNode;
} & Pick<
    AutocompleteMuiProps<T, Multiple, false | true, false | true>,
    | "id"
    | "sx"
    | "clearOnBlur"
    | "options"
    | "autoHighlight"
    | "defaultValue"
    | "renderOption"
    | "value"
    | "selectOnFocus"
    | "handleHomeEndKeys"
    | "fullWidth"
    | "size"
    | "filterOptions"
    | "onChange"
    | "loading"
    | "inputValue"
    | "multiple"
    | "onInputChange"
    | "disableClearable"
    | "freeSolo"
    | "onBlur"
    | "renderTags"
    | "getOptionDisabled"
> &
    Partial<
        Pick<
            AutocompleteMuiProps<T, Multiple, false | true, false | true>,
            | "renderInput"
            | "isOptionEqualToValue"
            | "onScroll"
            | "ListboxProps"
            | "noOptionsText"
            | "autoComplete"
            | "includeInputInList"
        >
    > &
    Pick<
        TextFieldProps,
        | "label"
        | "size"
        | "placeholder"
        | "error"
        | "helperText"
        | "disabled"
        | "InputLabelProps"
        | "name"
        | "InputProps"
    >;

export const Autocomplete = <T, Multiple extends boolean = false>({
    label,
    size,
    error,
    helperText,
    placeholder,
    getOptionLabel,
    endAdornment,
    InputProps,
    ...props
}: AutocompleteProps<T, Multiple>) => {
    const id = useId();
    return (
        <AutocompleteMui<T, Multiple, typeof props.disableClearable, typeof props.freeSolo>
            size={size}
            id={id}
            getOptionLabel={getOptionLabel ? (o) => (typeof o === "string" ? o : getOptionLabel(o)) : undefined}
            loadingText="Cargando..."
            renderInput={(params) => {
                return (
                    <TextField
                        label={label}
                        placeholder={placeholder}
                        {...params}
                        inputProps={{
                            ...params.inputProps,
                        }}
                        error={error}
                        helperText={helperText}
                        InputLabelProps={{
                            ...params.InputLabelProps,
                        }}
                        InputProps={{
                            ...params.InputProps,
                            ...InputProps,
                            endAdornment: (
                                <>
                                    {params.InputProps?.endAdornment}
                                    {InputProps?.endAdornment}
                                    {endAdornment}
                                </>
                            ),
                        }}
                    />
                );
            }}
            {...props}
        />
    );
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type AutocompleteFormikProps<T extends object = any, Values extends FormikValues = any> = {
    name: Paths<Values> | (string & {});
    getOptionValue: (option: T) => string | number | boolean;
    formik: FormikProps<Values>;
} & AutocompleteProps<T>;

export type AutocompleteFormikPublicProps<Values extends FormikValues = FormikValues> = {
    name: Paths<Values>;
    formik: FormikProps<Values>;
} & Pick<AutocompleteProps, "fullWidth">;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const AutocompleteFormik = <T extends object, Values extends FormikValues = any>({
    formik,
    label,
    disableClearable,
    placeholder,
    getOptionValue,
    InputLabelProps,
    ...props
}: AutocompleteFormikProps<T, Values>) => {
    const { error, touched, value: formkitValue } = formik.getFieldMeta(props.name);
    const id = useId();
    const value =
        props.options.find((option) => {
            return getOptionValue(option) === formkitValue;
        }) || null;

    return (
        <>
            <Autocomplete<T>
                value={value ?? null}
                {...props}
                id={id}
                onChange={async (_, option, reason, details) => {
                    await formik.setFieldValue(
                        props.name,
                        typeof option === "string" ? option : option === null ? undefined : getOptionValue(option),
                        true,
                    );
                    await props.onChange?.(_, option, reason, details);
                }}
                disableClearable={disableClearable}
                renderInput={(params) => {
                    return (
                        <TextField
                            label={label}
                            placeholder={placeholder}
                            {...params}
                            inputProps={{
                                ...params.inputProps,
                            }}
                            autoComplete="off"
                            error={props.error || (touched && Boolean(error))}
                            helperText={(touched && error) || props.helperText}
                            InputLabelProps={{
                                ...InputLabelProps,
                            }}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {params.InputProps?.endAdornment}
                                        {props.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    );
                }}
                onBlur={() => formik.setFieldTouched(props.name, true)}
                isOptionEqualToValue={(option, _) => getOptionValue(option) === formkitValue}
            />
        </>
    );
};
