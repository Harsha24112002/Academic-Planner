import React from "react";
import Tabs from "../../Components/Tabs";
import AddSpPaths from "../../Components/Admin/AddSpPaths";
import UpdateSpPaths from "../../Components/Admin/UpdateSpPaths";
import DeleteSpPaths from "../../Components/Admin/DeleteSpPaths";

const components = [<AddSpPaths />, <UpdateSpPaths />, <DeleteSpPaths />];
const labels = ["Add Specialization Paths", "Update Specialization Paths", "Delete Specialization Paths"];


function SpPaths() {
	return (
		<Tabs components={components} labels={labels}/>
		)
}

export default SpPaths
