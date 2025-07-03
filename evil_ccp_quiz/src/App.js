import React, { useEffect, useState } from "react";
import './style.css';

function App() {
    const [question, setQuestion] = useState({});
    const [questionsLength, setQuestionsLength] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        fetch("https://shina-quiz-proxy.j5j2fgpfk7.workers.dev", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: currentQuestion + 1 })
        }).then(res => res.json())
            .then(data => {
                console.log("shina-quiz: ", data);
                setQuestionsLength(data.total)
                setQuestion({
                    ...data.data[0],
                    clicked: -1
                });
            })
    }, [currentQuestion]);

    const handleAnswer = idx => {
        if (flag) return;
        if (question.answer === question.clicked) return;
        setQuestion({
            ...question,
            clicked: idx
        })

        if (idx === question.answer) {
            setFlag(true);
            setScore(score + 1);
            setTimeout(() => {
                nextQuestion();
                setFlag(false);
            }, 1000);
        }
    };
    const nextQuestion = () => {
        if (currentQuestion < questionsLength - 1) setCurrentQuestion(prev => prev + 1);
    }

    if (questionsLength === 0) return <div>Loading...</div>;


    return (
        <div className="App">
            <div className="game-container">
                <h1>支那のクイズ</h1>
                <h2>得点：{score}</h2>
                <p className="questions-title">{question.question}</p>
                <div className="questions-answer-option">
                    {question.options.map((opt, idx) => {
                        let className = '';
                        if (question.clicked === idx) {
                            className = idx === question.answer ? 'correct' : 'wrong';
                        }

                        return (
                            <button className={className} key={idx} onClick={() => handleAnswer(idx)}>{opt}</button>
                        )
                    })}
                </div>
                <div onClick={nextQuestion}>次へ</div>
                <div>
                    Question {currentQuestion + 1} of {questionsLength}
                </div>
                <br/>
                {question.link &&
                    <>
                        <span>出典：</span>
                        <a href={question.link} target="_blank">{question.link_title}</a>
                    </>
                }
            </div>
        </div>
    );
}

export default App;
