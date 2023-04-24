import * as React from 'react';
import CircularCreditProgressBar from './CircularCreditProgressBar';



// Call this function each time 'course_list' part updates
// need to use useEffect like functionality in maps page
// with details/course_list as props...
function CreditsCount({ details }) {

    // const course_list = details.course_list;
    const course_list = [
        {
            "course_id" : "CS1010",
            "elective" : "Departmental Core Theory",
            "course_credits" : 3
        },
        {
            "course_id" : "MA1020",
            "elective" : "Basic Sciences",
            "course_credits" : 3
        },
        {
            "course_id" : "MA1010",
            "elective" : "Basic Sciences",
            "course_credits" : 3
        },
        {
            "course_id" : "EE1001",
            "elective" : "Basic Sciences",
            "course_credits" : 3
        },
        {
          "course_id" : "EE1001",
          "elective" : "Basic Sciences",
          "course_credits" : 3
        },
        {
            "course_id" : "CS2010",
            "elective" : "Departmental Core Theory",
            "course_credits" : 3
        },
        {
            "course_id" : "CS2100",
            "elective" : "Departmental Core Lab",
            "course_credits" : 3
        },
        {
            "course_id" : "LA1020",
            "elective" : "Liberal/Creative Arts Elective",
            "course_credits" : 3
        },
        {
            "course_id" : "LA1020",
            "elective" : "Liberal/Creative Arts Elective",
            "course_credits" : 3
        },
        {
            "course_id" : "LA1020",
            "elective" : "Liberal/Creative Arts Elective",
            "course_credits" : 3
        },
        {
            "course_id" : "LA1020",
            "elective" : "Liberal/Creative Arts Elective",
            "course_credits" : 3
        },
        {
            "course_id" : "LA1020",
            "elective" : "Liberal/Creative Arts Elective",
            "course_credits" : 3
        },
        {
            "course_id" : "LA1020",
            "elective" : "Liberal/Creative Arts Elective",
            "course_credits" : 3
        },
        {
            "course_id" : "LA1020",
            "elective" : "Liberal/Creative Arts Elective",
            "course_credits" : 3
        },
        {
            "course_id" : "LA1020",
            "elective" : "Liberal/Creative Arts Elective",
            "course_credits" : 3
        }
    ]

    // get from backend only once
    // use useEffect
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