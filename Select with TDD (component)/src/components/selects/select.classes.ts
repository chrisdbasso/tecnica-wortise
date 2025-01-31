
export interface BaseInputProps<T> {
    labelKey: keyof T;
    className?: string;
    value?: T;
    onChange?: (value: T | null) => void;
    disabled?: boolean;
}

export interface SelectProps<T> extends BaseInputProps<T> {
    label?: string;
    options?: T[];
    noOptionsText?: string;
    clearable?: boolean;
    autocomplete?: boolean;
    fetchData?: (search: string) => Promise<T[]>;
    minLengthToFetch?: number;
}
