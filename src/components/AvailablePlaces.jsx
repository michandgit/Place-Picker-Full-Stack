import { useState } from 'react';
import Places from './Places.jsx';
import { useEffect } from 'react';
import ErrorPage from './ErrorPage.jsx';
import  { sortPlacesByDistance } from '../loc.js'
import { fetchAvailablePlaces } from '../http.js';
export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error , setError] = useState();


  useEffect(() => {

    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const resData = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position)=>{
            const sortedPlaces = sortPlacesByDistance(resData , position.coords.latitude,
              position.coords.longitude
            );
            setIsFetching(false);
            setAvailablePlaces(sortedPlaces)

        })
      } catch (error) {
        setIsFetching(false);
        setError(error);
      }
     
    }

    fetchPlaces();
  }, [])

  if(error){
    return <ErrorPage title={"An error occurred..."} message={error.message} ></ErrorPage>
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
