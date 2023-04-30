import React, { useState, useRef } from "react";
import "../css/CourseDescriptionPage.css";
// import {CCard, CCardBody, CCardImage, CCardTitle, CCardText, CButton} from '@coreui/react'

export default function CourseDescription() {

	const [xRotation, setXRotation] = useState(0);
	const [yRotation, setYRotation] = useState(0);
	const cardRef = useRef(null);
	const imgRef = useRef(null);
	const titleRef = useRef(null);
	const descRef = useRef(null);
	const sizesboxRef = useRef(null);
	const purchaseRef = useRef(null);

	function handleMouseEnter() {
		// const img = imgRef.current;
		// const title = titleRef.current;
		// const sizesBox = sizesboxRef.current;
		// const purchase = purchaseRef.current;
		// const desc = descRef.current
		// title.style.transform = "translateZ(150px)";
		// img.style.transform = "translateZ(100px) rotateZ(-45deg)";
		// sizesBox.style.transform = "translateZ(100px)";
		// purchase.style.transform = "translateZ(75px)";
		// desc.style.transform = "translateZ(75px)";
	  }
	  function handleMouseLeave() {
		// setXRotation(0);
		// setYRotation(0);
	
		// const img = imgRef.current;
		// const title = titleRef.current;
		// const sizesBox = sizesboxRef.current;
		// const purchase = purchaseRef.current;
		// title.style.transform = "translateZ(0px)";
		// img.style.transform = "translateZ(0px) rotateZ(0deg)";
		// sizesBox.style.transform = "translateZ(0px)";
		// purchase.style.transform = "translateZ(0px)";
	  }

	  function handleMouseMove(event) {
		// const card = cardRef.current;
		// const { offsetWidth: width, offsetHeight: height } = card;
		// const { clientX, clientY } = event;
		// const x = clientX - card.offsetLeft - width / 2;
		// const y = clientY - card.offsetTop - height / 2;
		// var mult = 40;
		// setXRotation((y / height) * mult);
		// setYRotation((x / width) * mult);
	  }

	return (
		<div className='card-container'>
			<div className='header2-row'>
			</div>
			<div className='header-row'>
				<div
					className="card-description1"
					ref={cardRef}
					>
					<h1 className="title-r" ref={titleRef}>
						Course/Elective Description
					</h1>
				</div>
			</div>
			<div className='header2-row'>
			</div>
			<div className='row'>
				<div
					className="card"
					ref={cardRef}
					>
					<h1 className="title" ref={titleRef}>
						Basic Sciences
					</h1>
					<p ref={descRef}>
						Courses which forms the base of Engineering. Includes basic math courses, physics, chemistry, etc.	
					</p>
				</div>
			
				<div
					className="card"
					ref={cardRef}
					>
					<h1 className="title" ref={titleRef}>
						Basic Engineering Skills
					</h1>
					<p ref={descRef}>
						Courses which are common to all engineering disciplines. Includes courses like Engineering Drawing, Engineering Mechanics, etc.	
					</p>
				</div>
			
				<div
					className="card"
					ref={cardRef}
					>
					<h1 className="title" ref={titleRef}>
						Departmental Core Theory
					</h1>
					<p ref={descRef}>
						Courses which are specific to the department. Includes courses like Data Structures, Algorithms, etc.	
					</p>
				</div>		
			</div>

			<div className='row'>
				<div
					className="card"
					ref={cardRef}
					>
					<h1 className="title" ref={titleRef}>
						Departmental Core Laboratory
					</h1>
					<p ref={descRef}>
						Laboratory courses which are specific to the department. Includes courses like Physics Lab, Bio-Med Lab, etc.	
					</p>
				</div>
			
				<div
					className="card"
					ref={cardRef}
					>
					<h1 className="title" ref={titleRef}>
						Departmental Electives
					</h1>
					<p ref={descRef}>
						Electives which are specific to the department. Includes courses like Advanced Data Structures, Machine Learning etc.	
					</p>
				</div>
			
				<div
					className="card"
					ref={cardRef}
					>
					<h1 className="title" ref={titleRef}>
						Free Electives
					</h1>
					<p ref={descRef}>
						Electives which are not specific to the department. Includes courses like Psychology, Economics, etc.	
					</p>
				</div>		
			</div>

			<div className='row'>
				<div
					className="card"
					ref={cardRef}
					>
					<h1 className="title" ref={titleRef}>
						Liberal/Creative Arts
					</h1>
					<p ref={descRef}>
						Courses which falls under literature and creativity.
					</p>
				</div>
			
				<div
					className="card"
					ref={cardRef}
					>
					<h1 className="title" ref={titleRef}>
						Professional Ethics
					</h1>
					<p ref={descRef}>
						Courses which teaches the ethics of the profession and social etiquittes.	
					</p>
				</div>
			
				<div
					className="card"
					ref={cardRef}
					>
					<h1 className="title" ref={titleRef}>
						Additional
					</h1>
					<p ref={descRef}>
						The courses which you're not sure to add in the current semester 
						and planning to convert in the future semesters.
					</p>
				</div>		
			</div>
		</div>
	);
}
