import { useRef, useState, useCallback, useEffect } from 'react';
import ErrorPage from './components/ErrorPage.jsx';
import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { updateUserPlaces ,fetchUserPlaces } from './http.js';

function App() {
  const selectedPlace = useRef();
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState(null);
  const [userPlaces, setUserPlaces] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error , setError] = useState();

  const [modalIsOpen, setModalIsOpen] = useState(false);


  useEffect(()=>{
   
    const fetchUserPlacesfn = async ()=>{
      setIsFetching(true);
      try {
        const data = await fetchUserPlaces();
        
        setUserPlaces(data);
      } catch (error) {
        setError({message:error.message || 'failed to fetch user places'})
     
      }
      setIsFetching(false);
    }
    fetchUserPlacesfn();
  } , [])

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
       await updateUserPlaces([ selectedPlace , ...userPlaces ]);
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({message: error.message || 'Failed to update places.'})
    }
   
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

   try {
    await  updateUserPlaces(userPlaces.filter(place => place.id !== selectedPlace.current.id));
   } catch (error) {
    setUserPlaces(userPlaces);
    setErrorUpdatingPlaces({message:error.message || 'Failed to delete place'})
   }

    setModalIsOpen(false);
  }, [userPlaces]);

  function handleError(){
    setErrorUpdatingPlaces(null);
  }
  return (
    <>
    <Modal open={errorUpdatingPlaces} onClose={handleError}>
      {errorUpdatingPlaces && <ErrorPage title="An error occurred!" message={errorUpdatingPlaces.message}
      onConfirm = {handleError}
      ></ErrorPage>}
    </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <ErrorPage
        title="An error occurred!"
        message={error.message}
        />}
        {
          !error && (
          <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          isLoading={isFetching}
          loadingText="Fetching your places..."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
          )
        }
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
