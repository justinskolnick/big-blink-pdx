import { useDispatch } from 'react-redux';

import { type AppDispatch } from '../lib/store';

const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export default useAppDispatch;
