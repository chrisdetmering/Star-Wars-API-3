import React, {useState, useEffect} from 'react';
import ReactPaginate from 'react-paginate';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Input from './Components/Input'
import Table from './Components/Table'


const App = () => {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    axios.get('https://swapi.dev/api/people/')
      .then((res) =>  getMissingData(res.data.results))
  }, []);

  const getMissingData = async (characters) => {
    for (const character of characters) {
      character.homeworld = await getPlanets(character.homeworld);
      character.species = await getSpecies(character.species);
    };
    setCharacters(characters);
  };

  const getPlanets = async (planetUrl) => {
   const planetURLHTTPS = planetUrl.replace('http', 'https')
   const response = await axios.get(planetURLHTTPS);
   return response.data.name
  };
  
  const getSpecies = async (speciesArray) => {
    if (speciesArray.length === 0){
      return "Human";
    } else {
    const speciesURL = speciesArray[0].replace("http", "https")
    const response = await axios.get(speciesURL);
    return response.data.name
    };
  };

const handlePageChange = (pageNumber) => {
  axios.get(`https://swapi.dev/api/people/?page=${pageNumber}`)
  .then((res) => getMissingData(res.data.results))
}

const handleSearch = (search) => {
  axios.get(`https://swapi.dev/api/people/?search=${search}`)
  .then((res) => getMissingData(res.data.results))
}

  return (
    <div>
      <header className="text-center">
        <h1 className="font-weight-bold">Star Wars</h1>
      </header>
      <Input search={handleSearch} />
      <Table characters={characters} />
      <ReactPaginate
      pageCount="9"
      onPageChange={({ selected }) => {
        handlePageChange(selected + 1);
      }}
      containerClassName ="pagination justify-content-center" 
      className="page-item active"
      previousLinkClassName ="page-link"  
      pageClassName ="page-link" aria-hidden="true"
      nextLinkClassName ="page-link" 
      activeClassName ="active"
      />
    </div>
  );
}

export default App;
