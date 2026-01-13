import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomepageData } from '../redux/productSlice';

export const useHomepageData = () => {
  const dispatch = useDispatch();
  const {
    categories,
    newArrivals,
    bestSellers,
    homepageDataLoading,
    homepageDataError,
  } = useSelector((state) => state.products);

  const hasData = categories.length > 0 && newArrivals.length > 0 && bestSellers.length > 0;
  const isEmpty = !homepageDataLoading && !hasData;
  
  const fetchAttempted = useRef(false);

  useEffect(() => {
    if (!fetchAttempted.current) {
      fetchAttempted.current = true;
      
      if (!hasData && !homepageDataLoading) {
        dispatch(fetchHomepageData());
      }
    }
  }, [dispatch, hasData, homepageDataLoading]);

  return {
    categories,
    newArrivals,
    bestSellers,
    loading: homepageDataLoading,
    error: homepageDataError,
    hasData,
    isEmpty,
  };
};