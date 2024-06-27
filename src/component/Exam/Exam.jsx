import { useState } from 'react';

const ExamForm = () => {
  const [examTitle, setExamTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '' }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '' }]);
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = questions.map((question, qIndex) => (
      qIndex === index ? { ...question, questionText: event.target.value } : question
    ));
    setQuestions(newQuestions);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic
    console.log({ examTitle, description, questions });
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Exam Title</label>
          <input
            type="text"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Questions</h3>
          {questions.map((question, index) => (
            <div key={index} className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Question {index + 1}</label>
              <input
                type="text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuestion}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Question
          </button>
        </div>
        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamForm;
