import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  background-color: blue;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 30px;

  @media screen and (min-width: 768px) {
    width: 60%;
    margin-right: 20px;
    margin-bottom: 0;
    text-align: left;
  }
`;

const RightSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;

  @media (max-width: 768px) {
    display: none;
    
  }
`;

const Heading = styled.h1`
  font-size: 32px;
  margin-bottom: 20px;
  color: white;

  @media screen and (min-width: 768px) {
    font-size: 48px;
  }
`;

const Summary = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.5;
  color: white;

  @media screen and (min-width: 768px) {
    font-size: 18px;
    max-width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 40px;
    text-align: left;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 768px) {
    justify-content: flex-start;
  }
`;

const Button = styled.button`
  background-color: transparent;
  color: #ffa500;
  border: 2px solid #ffa500;
  padding: 10px 20px;
  margin: 10px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #ffa500;
    color: white;
  }
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

function HomePage() {
  return (
    <Container>
        <LeftSection>
        <Heading>Academic Planner</Heading>
            <Summary>
                The purpose of the Academic Planner project is to develop a software tool 
                that helps students effectively plan and manage their academic activities. 
                The Academic Planner will provide students with a comprehensive 
                and user-friendly interface to help them keep track of their
                important academic events like coursework and completion details
            </Summary>
            <ButtonContainer>
                <Link to="/admin/signin">
                    <Button>Admin</Button>
                </Link>
                <Link to="/student/signin">
                    <Button>Student</Button>
                </Link>
            </ButtonContainer>
        </LeftSection>
        <RightSection>
            <Image
            src={require("../assets/home-page-books-image.jpeg")}
            alt="Website Image"
            />
        </RightSection>
    </Container>
  );
}

export default HomePage;
