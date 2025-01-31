import { Grid, type GridProps, type TextFieldProps } from "@mui/material";
import {
    DateTimePicker as MuiDateTimePicker,
    type DateTimePickerProps as MuiDateTimePickerProps,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import type { FormikProps, FormikValues } from "formik";
import type React from "react";
import { useId } from "react";

export type DatePickerFormikProps<Values extends FormikValues> = {
    submitOnSelect?: boolean;
    gridProps?: false | GridProps;
    fullWidth?: boolean;
    name: Paths<Values> | (string & {});
    formik: Pick<
        FormikProps<Values>,
        | "handleBlur"
        | "getFieldMeta"
        | "setFieldValue"
        | "getFieldProps"
        | "setFieldTouched"
        | "handleChange"
        | "submitForm"
        | "isSubmitting"
    >;
} & Partial<
    Pick<MuiDateTimePickerProps<dayjs.Dayjs>, "label" | "disabled" | "onChange" | "disableFuture" | "shouldDisableDate">
> &
    Partial<Pick<TextFieldProps, "size" | "InputProps" | "helperText" | "sx">>;

export default function DateTimePickerFormik<Values extends FormikValues>({
    name,
    disabled,
    submitOnSelect,
    formik,
    InputProps,
    fullWidth,
    gridProps = { xs: 12, sm: 6 },
    ...otherProps
}: React.PropsWithChildren<DatePickerFormikProps<Values>>) {
    const { isSubmitting, setFieldValue, submitForm, handleBlur, setFieldTouched } = formik;
    const id = useId();
    const field = formik.getFieldMeta<string>(name as string);
    const input = (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MuiDateTimePicker<dayjs.Dayjs>
                {...otherProps}
                disabled={isSubmitting || disabled}
                value={(field.value && dayjs(field.value)) || null}
                slotProps={{
                    textField: {
                        id,
                        size: otherProps.size,
                        fullWidth,
                        variant: "outlined",
                        onBlur: handleBlur,
                        error: field.touched && Boolean(field.error),
                        helperText: !disabled && field.touched && field.error,
                        InputProps,
                    },
                }}
                onChange={async (date, ctx) => {
                    const value = date ? date.toDate() : "";
                    await setFieldValue(name, value, true);
                    await otherProps.onChange?.(date, ctx);
                    if (submitOnSelect) await submitForm();
                }}
                onSelectedSectionsChange={(_) => setFieldTouched(name, true, true)}
            />
        </LocalizationProvider>
    );
    if (gridProps === false) return input;
    return (
        <Grid item {...gridProps}>
            {input}
        </Grid>
    );
}
