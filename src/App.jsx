import React, { useState } from 'react';
import WordBooks from './pages/WordBooks';
import WordListen from './pages/WordListen';
import { Tabs } from 'antd';
import './App.css';
import { defaultWordBooks } from './wordBookList/defaultWordBooks';

const App = () => {
  const [wordBooks, setWordBooks] = useState(defaultWordBooks);

  return (
    <div className="App">
      <Tabs
        defaultActiveKey="wordbooks"
        items={[
          {
            key: 'wordbooks',
            label: '单词本',
            children: (
              <WordBooks 
                wordBooks={wordBooks} 
                setWordBooks={setWordBooks} 
                onImportToListen={() => {}}
              />
            )
          },
          {
            key: 'listen',
            label: '听练',
            children: <WordListen wordBooks={wordBooks} />
          }
        ]}
      />
    </div>
  );
};

export default App;