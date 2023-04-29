import React, { useEffect, useState } from 'react'
// import SearchPaths from '../Components/SearchPaths'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPaths } from '../features/pathDetailsSlice'
import { Card, CardMedia } from '@mui/material'



function SpecializationPathsPage() {
	

	return (
		<>
			<div>SpecializationPathsPage</div>
			<Card>
				<CardMedia
					component="img"
					sx={{ 'object-fit': 'fill' }}
					// image={`data:image/png;base64,${details['photo']}`}

					// image={`data:image/png;base64,${paths_pic}`}
					alt="DP"
				// onClick={handleChangeProfile}
				/>


			</Card>
		</>
	)
}

export default SpecializationPathsPage