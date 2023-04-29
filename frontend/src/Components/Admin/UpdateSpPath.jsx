import React from 'react'
import PathForm from './PathForm'
import SearchPaths from '../SearchPaths'
import { useSelector } from 'react-redux';

function UpdateSpPath() {

  const { details } = useSelector((state) => {
    console.log("AAAAA", state.pathDetails.details);
    return {
      details: state.pathDetails.details,
    };
  });
  return (

    <>
      <SearchPaths></SearchPaths>
      <div>UpdateSpPath</div>
      {Object.keys(details).length!=0 ? (<PathForm pathDetails={details} type="update"></PathForm>) : (<></>)
      }
    </>
  )
}

export default UpdateSpPath