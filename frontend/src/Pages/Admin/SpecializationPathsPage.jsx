import React from 'react'
import AddSpPath from '../../Components/Admin/AddSpPath'
import DeleteSpPath from '../../Components/Admin/DeleteSpPath';
import UpdateSpPath from '../../Components/Admin/UpdateSpPath';
import Tabs from "../../Components/Tabs"

const components = [<AddSpPath />, <UpdateSpPath />, <DeleteSpPath />];
const labels = ["Add SpPath", "Update SpPath", "Delete SpPath"];

function SpecializationPathsPage() {
  return (
    <Tabs components={components} labels={labels}/>
  )
}

export default SpecializationPathsPage