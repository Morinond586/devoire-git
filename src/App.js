import { useEffect, useState } from 'react';
import './App.css';
import './normal.css';
import img from './img/email_send_24px.png';

const App = () => {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNewChat = () => {
    setMessage("");
    setValue("");
    setCurrentTitle("");
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage("");
    setValue("");
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({ message: value }),
      headers: { "Content-Type": "application/json" }
    };

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/completions', options);
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats(prev => [
        ...prev,
        { title: currentTitle, role: "user", content: value },
        { title: currentTitle, role: message.role, content: message.content }
      ]);
    }
  }, [message, currentTitle, value]);

  const currentChat = previousChats.filter(chat => chat.title === currentTitle);
  const uniqueTitles = Array.from(new Set(previousChats.map(chat => chat.title)));

  return (
    <div className="app">
      <section className='side-bar'>
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className='history'>
          {uniqueTitles.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by Morinond</p>
        </nav>
      </section>
      <section className='main'>
        {!currentTitle && <h1>MoriGPT</h1>}
        <ul className='feed'>
          {currentChat.map((chatMessage, index) => (
            <li key={index}>
              <p className='role'>{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className='bottom-section'>
          <div className='input-container'>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isLoading}
            />
            <div id='submit' onClick={getMessages} disabled={isLoading}>
              <img src={img} alt="send" />
            </div>
          </div>
          {isLoading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          <p className='info'>
            Chat GPT Mar 14 Version. Free Research Preview.
            Our goal is to make AI systems more natural and safe to interact with.
            Your feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
