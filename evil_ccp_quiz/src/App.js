import React, { useEffect, useState } from "react";
import DOMPurify from 'dompurify';

import './style.css';

function App() {
    const [question, setQuestion] = useState({});
    const [questionsLength, setQuestionsLength] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [flag, setFlag] = useState(false);

    const cleanHtml = DOMPurify.sanitize(question?.description?.replace(/\n/g, '<br/>'), {
        ALLOWED_ATTR: ['href', 'target', 'rel']
    });

    useEffect(() => {
        const fetchQuestion = async () => {
            setFlag(true);
            try {
                const id = currentQuestion + 1;

                const tokenRes = await fetch("https://shina-quiz-proxy.j5j2fgpfk7.workers.dev/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ question_id: id })
                });

                const tokenData = await tokenRes.json();

                if (!tokenData.success) {
                    setFlag(false);
                    return;
                }

                const { ts, token } = tokenData;
                const dataRes = await fetch("https://shina-quiz-proxy.j5j2fgpfk7.workers.dev/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ question_id: id, ts, token })
                });

                const data = await dataRes.json();

                if (data.success) {
                    if (questionsLength === 0) setQuestionsLength(data.total);
                    if (data.data && data.data.length > 0) {
                        setQuestion({
                            ...data.data[0],
                            clicked: -1
                        });
                    } else {
                        setCurrentQuestion(prev => prev + 1);
                    }
                } else {
                }
            } catch (err) {
            } finally {
                setFlag(false);
            }
        };

        fetchQuestion();
    }, [currentQuestion, questionsLength]);

    const handleAnswer = idx => {
        if (question.answer === question.clicked) return;
        setQuestion({
            ...question,
            clicked: idx
        })

        if (idx === question.answer) {
            setScore(score + 1);
        }
    };
    const nextQuestion = () => {
        if (flag) return;
        if (currentQuestion < questionsLength - 1) setCurrentQuestion(prev => prev + 1);
    }

    if (JSON.stringify(question) === "{}") return <div className="loading">読み込み中...</div>;


    return (
        <div className="App">
            <div className="game-container">
                <h1>{"支那のクイズ".replace(/支那/g, '中国')}</h1>
                <h2>得点：{score}</h2>
                <p className="questions-title">{question.question.replace(/支那/g, '中国')}</p>
                <div className="questions-answer-option">
                    {question?.options?.map((opt, idx) => {
                        let className = '';
                        if (question.clicked === idx) {
                            className = idx === question.answer ? 'correct' : 'wrong';
                        }

                        return (
                            <button className={className} key={idx} onClick={() => handleAnswer(idx)}>{ opt.replace(/支那/g, '中国') }</button>
                        )
                    })}
                </div>
                <div className="next-btn" onClick={nextQuestion}>次へ</div>
                <div className="question-count">Question {currentQuestion + 1} of {questionsLength}</div>
                {question.description && question.answer === question.clicked && (
                    <p className="description" dangerouslySetInnerHTML={{
                            __html: '📖説明：' + cleanHtml.replace(/支那/g, '中国')
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
