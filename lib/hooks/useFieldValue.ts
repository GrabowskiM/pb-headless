import { useContext } from 'react';

import { FieldValueContext } from '../context/FieldValue';

const useFieldValue = () => useContext(FieldValueContext);

export default useFieldValue;
