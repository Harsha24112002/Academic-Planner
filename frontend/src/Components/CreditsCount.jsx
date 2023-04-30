import * as React from 'react';
import CircularCreditProgressBar from './CircularCreditProgressBar';



// Call this function each time 'course_list' part updates
// need to use useEffect like functionality in maps page
// with details/course_list as props...
function CreditsCount({ details }) {

    const course_list = details[0].course_list;
    const Courses = details[1]

    // get from backend?  only once
    // use useEffect // or just place hardcoded config file :-)
    const course_types = {
        "Departmental Core Theory" : 30,
        "Departmental Core Lab" : 12,
        "Liberal/Creative Arts Elective" : 12,
        "Basic Sciences" : 14,
        "Basic Engineering" : 15,
        "Additional" : 0,
        "Departmental Elective" : 30,
        "Free Elective" : 13,
        "Audit" : 0
    };

    var student_credit_count = Object.fromEntries(
        Object.keys(course_types).map(key => [key,0])
    );

    course_list.forEach(course => {
        if( student_credit_count.hasOwnProperty(course.elective) ) {
            student_credit_count[course.elective]+=Courses[course.course_id]['course_credits'];
        } else {
            student_credit_count["Audit"]+=1;
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
          overflowX: 'scroll',
          padding: 2,
          margin: 10
        }}
      >
        {figure}
      </div>
      
    )
};

export default CreditsCount;