import * as React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="flex flex-row">
            <div>
                <h1>Academic Planner</h1>
                <p>
                    The purpose of the Academic Planner project is to develop a software tool 
                    that helps students effectively plan and manage their academic activities. 
                    The Academic Planner will provide students with a comprehensive 
                    and user-friendly interface to help them keep track of their 
                    important academic events like coursework and completion details
                </p>
                <Link to="/admin/signin">
                    <button className="bg-transparent hover:bg-orange-500 text-orange-500 font-semibold hover:text-white py-2 px-4 mx-2 border border-orange-500 hover:border-transparent rounded">
                        Admin
                    </button>
                </Link>
                <Link to="/student/signin">
                    <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 mx-2 border border-blue-500 hover:border-transparent rounded">
                        Student
                    </button>
                </Link>
            </div>
            <div>
                <img src={require("../assets/home-page-books-image.jpeg")} className="Home-page-books-image" alt="Home-page-books-image" />
            </div>
        </div>
    )
};