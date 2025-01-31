import React, {FC, useEffect, useState} from 'react';
import {getLocations} from '~/api';
import Autocomplete from '~/components/autocomplete';
import {useFormikContext} from 'formik';
import {City} from '~/types/location';
import {useDebounce} from '~/hooks/use-debounce';
import {BasicSearchValues} from "~/components/basic-search-tab";

interface LocationAutocompleteProps {
}

const LocationAutocomplete: FC<LocationAutocompleteProps> = ({}) => {
    const [suggestionsCities, setSuggestionsCities] = useState<City[]>([]);
    const {values} = useFormikContext<BasicSearchValues>();
    const debouncedLocation = useDebounce(values.locationLabel, 500);

    useEffect(() => {
        if(!debouncedLocation || debouncedLocation.length < 2) return;
        const fetchSuggestionsCities = async () => {
            const citiesResponse = await getLocations({queryString: values.locationLabel});
            setSuggestionsCities(citiesResponse);
        }
        fetchSuggestionsCities();
    }, [debouncedLocation]);

    return (
        <Autocomplete hasChevron={false} label='Ubicación' name='location' inputLabel='locationLabel' options={suggestionsCities.map(c => (
            {value: c.id, label: `${c.nombre}${c.provincia && `, ${c.provincia}`}`}
        ))} />
    );
};

export default LocationAutocomplete;
