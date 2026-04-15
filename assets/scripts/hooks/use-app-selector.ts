import { useSelector } from 'react-redux';

import { type RootState } from '../lib/store';

const useAppSelector = useSelector.withTypes<RootState>();

export default useAppSelector;
