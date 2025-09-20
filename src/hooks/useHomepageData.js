import { useEffect } from 'react';
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
    categoriesLastFetched,
    newArrivalsLastFetched,
    bestSellersLastFetched
  } = useSelector((state) => state.products);

  useEffect(() => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    const tenMinutes = 10 * 60 * 1000;
    
    const needsCategories = !categories.length || !categoriesLastFetched || (now - categoriesLastFetched > tenMinutes);
    const needsNewArrivals = !newArrivals.length || !newArrivalsLastFetched || (now - newArrivalsLastFetched > fiveMinutes);
    const needsBestSellers = !bestSellers.length || !bestSellersLastFetched || (now - bestSellersLastFetched > fiveMinutes);
    
    if (needsCategories || needsNewArrivals || needsBestSellers) {
      dispatch(fetchHomepageData());
    }
  }, [dispatch, categories.length, newArrivals.length, bestSellers.length, categoriesLastFetched, newArrivalsLastFetched, bestSellersLastFetched]);

  return {
    categories,
    newArrivals,
    bestSellers,
    loading: homepageDataLoading,
    error: homepageDataError,
    hasData: categories.length > 0 && newArrivals.length > 0 && bestSellers.length > 0
  };
};
