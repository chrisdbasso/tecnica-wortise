import { Autocomplete } from "@/components/forms/autocomplete";
import { useDebounce } from "@/hooks/use-debounce";
import { Add, Clear, Delete } from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Portal,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import type { Filter } from "frappe-js-sdk/lib/db/types";
import { useMemo, useReducer, useState } from "react";

const translateOperator = (operator: Operator): Filter[1] => {
    return (
        (
            {
                contains: "like",
                equals: "=",
                startsWith: "like",
                endsWith: "like",
                isEmpty: "=",
                isNotEmpty: "!=",
                isAnyOf: "in",
            } satisfies Record<Operator, Filter[1]>
        )[operator] ?? "="
    );
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation
const formatFilterValue = (operator: Operator, value: any | any[]) => {
    return (
        (
            {
                contains: `%${value}%`,
                startsWith: `${value}%`,
                endsWith: `%${value}`,
                isEmpty: null,
                isNotEmpty: null,
                equals: value,
                isAnyOf: value,
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            } satisfies Record<Operator, any | any[]>
        )[operator] ?? value
    );
};

const OPERATOR_OPTIONS = [
    { value: "contains", label: "Contiene" },
    { value: "equals", label: "Igual a" },
    { value: "startsWith", label: "Empieza con" },
    { value: "endsWith", label: "Termina con" },
    { value: "isEmpty", label: "Está vacío" },
    { value: "isNotEmpty", label: "No está vacío" },
    { value: "isAnyOf", label: "Es alguno de" },
] as const;
type Operator = (typeof OPERATOR_OPTIONS)[number]["value"];

export type FilterModel = {
    id: string;
    field: string;
    operator: Operator;
    value: string | string[];
};
export type FieldOption = { value: string; label: string };

interface FilterPopupProps {
    open: boolean;
    onClose: () => void;
    filterModel: FilterModel[];
    setFilterModel: (model: FilterModel[]) => void;
    containerRef: React.RefObject<HTMLDivElement>;
    fieldOptions: [FieldOption, ...FieldOption[]];
}

export const useTableFilters = <T = unknown>() => {
    const [filterModel, setFilterModel] = useState<Array<FilterModel>>([]);
    const debouncedFilterModel = useDebounce(filterModel, 500);
    const frappeFilters = useMemo(() => {
        return debouncedFilterModel.map((filter) => {
            const operator = translateOperator(filter.operator as Operator);
            const value = formatFilterValue(filter.operator as Operator, filter.value);
            return [filter.field, operator, value] satisfies Filter<T>;
        });
    }, [debouncedFilterModel]);

    return [{ filterModel, debouncedFilterModel, frappeFilters }, setFilterModel] as const;
};

export function FilterPopup({
    open,
    onClose,
    filterModel,
    fieldOptions,
    setFilterModel,
    containerRef,
}: FilterPopupProps) {
    const defaultFilterModel = {
        id: crypto.randomUUID(),
        field: fieldOptions[0].value,
        operator: OPERATOR_OPTIONS[0].value,
        value: "",
    };
    const [{ localModel }, dispatch] = useReducer(
        (
            state: { localModel: FilterModel[] },
            action:
                | {
                      type: "update";
                      id: string;
                      filterModel: Partial<FilterModel>;
                  }
                | { type: "delete"; id: string }
                | { type: "reset" }
                | { type: "apply" }
                | { type: "add" },
        ) => {
            switch (action.type) {
                case "update":
                    return {
                        localModel: state.localModel.map((item) => {
                            if (item.id === action.id) {
                                return {
                                    ...item,
                                    ...action.filterModel,
                                };
                            }
                            return item;
                        }),
                    };
                case "delete":
                    return { localModel: state.localModel.filter((item) => item.id !== action.id) };
                case "reset":
                    return { localModel: [] };
                case "add":
                    return { localModel: [...state.localModel, defaultFilterModel] };
                case "apply":
                    setFilterModel(state.localModel);
                    onClose();
            }
            return state;
        },
        {
            localModel: filterModel.length ? filterModel : [defaultFilterModel],
        },
    );

    return (
        <>
            <Portal container={containerRef.current}>
                {filterModel.map((item) => {
                    const label = fieldOptions.find((option) => option.value === item.field)?.label ?? item.field;
                    const operatorLabel =
                        OPERATOR_OPTIONS.find((option) => option.value === item.operator)?.label ?? item.operator;
                    return (
                        <Chip
                            key={item.id}
                            label={`${label} ${operatorLabel.toLowerCase()}: "${item.value}"`}
                            size="small"
                            color="primary"
                            onDelete={() => {
                                dispatch({ type: "delete", id: item.id });
                                dispatch({ type: "apply" });
                            }}
                        />
                    );
                })}
            </Portal>

            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle component={Stack} direction="row" alignItems="center" spacing={1}>
                    <span>Filtros</span>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        {localModel.map((item) => (
                            <Stack key={item.id} direction="row" spacing={2} alignItems="center">
                                <Select
                                    size="small"
                                    value={item.field}
                                    name="field"
                                    onChange={(e) => {
                                        dispatch({
                                            type: "update",
                                            id: item.id,
                                            filterModel: { field: e.target.value },
                                        });
                                        dispatch({ type: "apply" });
                                    }}
                                    sx={{ minWidth: 200 }}
                                >
                                    {fieldOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    size="small"
                                    value={item.operator}
                                    name="operator"
                                    onChange={(e) => {
                                        dispatch({
                                            type: "update",
                                            id: item.id,
                                            filterModel: { operator: e.target.value as unknown as Operator },
                                        });
                                    }}
                                    sx={{ minWidth: 150 }}
                                >
                                    {OPERATOR_OPTIONS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {item.operator !== "isEmpty" &&
                                item.operator !== "isNotEmpty" &&
                                item.operator !== "isAnyOf" ? (
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={item.value}
                                        onChange={(e) => {
                                            dispatch({
                                                type: "update",
                                                id: item.id,
                                                filterModel: { value: e.target.value },
                                            });
                                        }}
                                    />
                                ) : item.operator === "isAnyOf" ? (
                                    <Autocomplete
                                        multiple
                                        size="small"
                                        options={[]} // You can provide predefined options here if needed
                                        freeSolo
                                        fullWidth
                                        value={Array.isArray(item.value) ? item.value : []}
                                        onChange={(_, newValue) => {
                                            dispatch({
                                                type: "update",
                                                id: item.id,
                                                filterModel: { value: newValue as any },
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} size="small" placeholder="Agregar valores..." />
                                        )}
                                    />
                                ) : (
                                    <Box flexGrow={1} />
                                )}

                                <IconButton
                                    onClick={() => {
                                        dispatch({ type: "delete", id: item.id });
                                    }}
                                    color="error"
                                >
                                    <Delete />
                                </IconButton>
                            </Stack>
                        ))}
                        <Button
                            startIcon={<Add />}
                            onClick={() => dispatch({ type: "add" })}
                            sx={{ alignSelf: "flex-start" }}
                        >
                            Agregar filtro
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    {" "}
                    <Button
                        onClick={() => dispatch({ type: "reset" })}
                        color="error"
                        startIcon={<Clear />}
                        disabled={localModel.length === 0}
                    >
                        Limpiar
                    </Button>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button onClick={() => dispatch({ type: "apply" })} variant="contained">
                        Aplicar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
