import * as React from 'react';
import CircularCreditProgressBar from './CircularCreditProgressBar';



// Call this function each time 'course_list' part updates
// need to use useEffect like functionality in maps page
// with details/course_list as props...
function CreditsCount({ details }) {

    const course_list = details.course_list;

    // get from backend?  only once
    // use useEffect // or just place hardcoded config file :-)
    const course_types = {
        "Departmental Core Theory" : 20,
        "Departmental Core Lab" : 10,
        "Liberal/Creative Arts Elective" : 15,
        "Basic Sciences" : 20,
        "Basic Engineering" : 20,
        "Additional" : 0,
        "Departmental Elective" : 24,
        "Free Elective" : 20,
        "Unknown" : 0
    };

    var student_credit_count = Object.fromEntries(
        Object.keys(course_types).map(key => [key,0])
    );

    course_list.forEach(course => {
        if( student_credit_count.hasOwnProperty(course.elective) ) {
            student_credit_count[course.elective]+=1;
        } else {
            student_credit_count["Unknown"]+=1;
        }
    });

    const figure = [];
    for (const key in course_types) {
      const val = course_types[key]
      figure.push(<CircularCreditProgressBar 
                    value={(student_credit_count[key]*100)/course_types[key]} 
                    label1={`${student_credit_count[key]}/${course_types[key]}`}
                    label2={key}
                  />)
    }

    return (
      <div 
        style={{ 
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          width: `100%` ,
          padding: 2,
          margin: 10
        }}
      >
        {figure}
      </div>
      
    )
};

export default CreditsCount;