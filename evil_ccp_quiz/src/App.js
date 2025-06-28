import React, { useEffect, useState } from "react";
import questionsData from "./questions.json";
import './style.css';

function App() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        const data = questionsData.map(item => ({
            ...item,
            clicked: -1
        }))
        setQuestions(data);
    }, []);

    const handleAnswer = idx => {
        if (flag) return;
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestion] = {
            ...updatedQuestions[currentQuestion],
            clicked: idx
        };
        setQuestions(updatedQuestions);

        if (idx === questions[currentQuestion].answer) {
            setFlag(true);
            setScore(score + 1);
            console.log(q.clicked)
            setTimeout(() => {
                nextQuestion();
                setFlag(false);
            }, 1000);
        }
    };
    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) setCurrentQuestion(prev => prev + 1);
    }

    if (questions.length === 0) return <div>Loading...</div>;
    const q = questions[currentQuestion];

    return (
        <div className="App">
            <div className="game-container">
                <h1>支那のクイズ</h1>
                <h2>得点：{score}</h2>
                <p className="questions-title">{q.question}</p>
                <div className="questions-answer-option">
                    {q.options.map((opt, idx) => {
                        let className = '';
                        if (q.clicked === idx) {
                            className = idx === q.answer ? 'correct' : 'wrong';
                        }

                        return (
                            <button className={className}
                                key={idx} onClick={() => handleAnswer(idx)}>{opt}</button>
                        )
                    })}
                </div>
                <div onClick={nextQuestion}>次へ</div>
                <div>
                    Question {currentQuestion + 1} of {questions.length}
                </div>
                <br/>
                {q.link &&
                    <>
                        <span>出典：</span>
                        <a href={q.link} target="_blank">{q.link_title}</a>
                    </>
                }
            </div>
        </div>
    );
}

export default App;
