import { useState } from 'react';

import { FormInterface } from '../interface';

function App() {
  
  const isValidEmail   : RegExp                     = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const [alert, setAlert]                           = useState<string>('Test');
  const [isEmptyTargetEmail, setIsEmptyTargetEmail] = useState<Boolean>(false);
  const [isEmptyTopic, setIsEmptyTopic]             = useState<Boolean>(false);
  const [isEmptyMessage, setIsEmptyMessage]         = useState<Boolean>(false);
  const [loading, setLoading]                       = useState<Boolean>(false);
  const [isSuccess, setIsSuccess]                   = useState<Boolean>(false);
  const [isEmptyCCEmail, setIsEmptyCCEmail]         = useState<Boolean>(false);
  const [form, setForm]                             = useState<FormInterface>({ targetEmail: '', topic: '', message: '', ccEmail: '' });
  let   timeoutId    : number;
    
  const onEmptyForm = (e : any) => {
    e.preventDefault();

    setForm(
      {
        targetEmail: '',
        topic: '',
        message:'',
        ccEmail: '',
      }
    );
    setFieldState('all', '', false, false);
  };

  const setFieldState = (field : string, alertMessage : string, loadingState : boolean, fieldState : boolean, event ?: any) => {
    switch (field) {
      case 'all':
        setLoading(loadingState);
        setIsEmptyTargetEmail(fieldState);
        setIsEmptyCCEmail(fieldState);
        setIsEmptyTopic(fieldState);
        setIsEmptyMessage(fieldState);
        setAlert(alertMessage);
        break;

      case 'targetEmail':
        setLoading(loadingState);
        setIsEmptyTargetEmail(fieldState);
        setAlert(alertMessage);
        break;

      case 'topic':
        setLoading(loadingState);
        setIsEmptyTopic(fieldState);
        setAlert(alertMessage);
        break;

      case 'message':
        setLoading(loadingState);
        setIsEmptyMessage(fieldState);
        setAlert(alertMessage);
        break;

      case 'ccEmail':
        setLoading(loadingState);
        setIsEmptyCCEmail(fieldState);
        setAlert(alertMessage);
        break;

      case 'success':
        setLoading(loadingState);
        setIsSuccess(fieldState);
        onEmptyForm(event);
        setAlert(alertMessage);
        break;

      default:
        setLoading(false);
        setIsEmptyTargetEmail(false);
        setIsEmptyCCEmail(false);
        setIsEmptyTopic(false);
        setIsSuccess(false);
        setIsEmptyMessage(false);
        setAlert('');
        break;
    }
  };

  const handleOnSubmitForm = (e : any) => {
    e.preventDefault();
    clearTimeout(timeoutId);
    setFieldState('all', '', true, false);

    if (!form.targetEmail.trim() && !form.topic.trim() && !form.message.trim()) {
      setFieldState('all', 'All fields must be filled.', false, true)
      timeoutId = setTimeout(() => {
        setFieldState('all', '', false, false);
      }, 3000);
      return;
    }

    if(!form.targetEmail.trim()) {
      setFieldState('targetEmail', 'Please write an email.', false, true);
      timeoutId = setTimeout(() => {
        setFieldState('targetEmail', '', false, false);
      }, 3000);
      return;
    }

    if(!form.topic.trim()) {
      setFieldState('topic', 'Please write a topic for the email.', false, true);
      timeoutId = setTimeout(() => {
        setFieldState('topic', '', false, false);
      }, 3000);
      return;
    }

    if(!form.message.trim()) {
      setFieldState('message', 'Please write a message.', false, true);
      timeoutId = setTimeout(() => {
        setFieldState('message', '', false, false);
      }, 3000);
      return;
    }

    if (!isValidEmail.test(form.targetEmail.trim())) {
      setFieldState('targetEmail', 'Please write a valid target email.', false, true);
      timeoutId = setTimeout(() => {
        setFieldState('targetEmail', '', false, false);
      }, 3000);
      return;
    }
    
    if (!isValidEmail.test(form.ccEmail.trim())) {
      setFieldState('ccEmail', 'Please write a valid CC email.', false, true);
      timeoutId = setTimeout(() => {
        setFieldState('ccEmail', '', false, false);
      }, 3000);
      return;
    }

    if(form.ccEmail.trim() === form.targetEmail.trim()) {
      setFieldState('all', 'CC and target email must be different.', false, true);
      timeoutId = setTimeout(() => {
        setFieldState('all', '', false, false);
      }, 3000);
      return;
    }

    timeoutId = setTimeout(() => {
      setFieldState('success', 'Email send successfully.', false, true, e);
      setTimeout(() => {
        setFieldState('default', '', false, false);
      }, 3000);
    }, 3000);
    
  };

  return (
    <>
      <form
        className='bg-white rounded-lg w-full p-6 flex flex-col gap-y-5 shadow-lg'
        onSubmit={(e : any) => handleOnSubmitForm(e)}
      >
        <h1 className='font-bold text-3xl pb-5 text-center'>Email Sender</h1>

        <div className='flex flex-col gap-y-1'>
          <label className='block w-fit font-bold text-lg' htmlFor="targetEmail">Email</label>
          <input
            type="email"
            placeholder='Target email'
            name='targetEmail'
            className='bg-white border-2 rounded-md px-3 py-2'
            value={form.targetEmail}
            onChange={(e : any) => setForm({...form, [e.target.name]: e.target.value})}
          />
          <p
            className={
              !loading && isEmptyTargetEmail && !isEmptyTopic && !isEmptyMessage && !isEmptyCCEmail
              ?
              'bg-red-500 text-white mt-3 font-bold mx-auto px-5 py-2 rounded-lg w-fit'
              :
              'hidden'
            }
          >
            {alert}
          </p>
        </div>

        <div className='flex flex-col gap-y-1'>
          <label className='block w-fit font-bold text-lg' htmlFor="targetEmail">Email (CC)</label>
          <input
            type="email"
            placeholder='CC email'
            name='ccEmail'
            className='bg-white border-2 rounded-md px-3 py-2'
            value={form.ccEmail}
            onChange={(e : any) => setForm({...form, [e.target.name]: e.target.value})}
          />
          <p
            className={
              !loading && !isEmptyTargetEmail && !isEmptyTopic && !isEmptyMessage && isEmptyCCEmail
              ?
              'bg-red-500 text-white mt-3 font-bold mx-auto px-5 py-2 rounded-lg w-fit'
              :
              'hidden'
            }
          >
            {alert}
          </p>
        </div>

        <div className='flex flex-col gap-y-1'>
          <label className='block w-fit font-bold text-lg' htmlFor="topic">Topic</label>
          <input
            type="text"
            placeholder='Email topic'
            name='topic'
            className='bg-white border-2 rounded-md px-3 py-2'
            value={form.topic}
            onChange={(e : any) => setForm({...form, [e.target.name]: e.target.value})}
          />
          <p
            className={
              !loading && !isEmptyTargetEmail && isEmptyTopic && !isEmptyMessage && !isEmptyCCEmail
              ?
              'bg-red-500 text-white mt-3 font-bold mx-auto px-5 py-2 rounded-lg w-fit'
              :
              'hidden'
            }
          >
            {alert}
          </p>
        </div>

        <div className='flex flex-col gap-y-1'>
          <label className='block w-fit font-bold text-lg' htmlFor="message">Message</label>
          <textarea
            placeholder='Email Message'
            name='message'
            rows={7}
            className='bg-white border-2 rounded-md px-3 py-2'
            value={form.message}
            onChange={(e : any) => setForm({...form, [e.target.name]: e.target.value})}
          ></textarea>
          <p
            className={
              !loading && !isEmptyTargetEmail && !isEmptyTopic && isEmptyMessage && !isEmptyCCEmail
              ?
              'bg-red-500 text-white mt-3 font-bold mx-auto px-5 py-2 rounded-lg w-fit'
              :
              'hidden'
            }
          >
            {alert}
          </p>
        </div>

        <div className='flex justify-between gap-5'>
        <button
          type='submit'
          className={
            form.targetEmail === '' && form.topic === '' && form.message === ''&& form.ccEmail === ''
            ?
            'bg-pink-400 text-white font-bold w-full flex justify-center items-center gap-2 p-3 rounded-md opacity-50'
            :
            'bg-pink-400 text-white font-bold w-full flex justify-center items-center gap-2 p-3 rounded-md'
          }
          disabled={!form.targetEmail && !form.topic && !form.message && !form.ccEmail  ? true : false}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          Send
        </button>

        <button
          type='button'
          className={
            !form.targetEmail && !form.topic  && !form.message && !form.ccEmail
            ?
            'bg-gray-800 text-white font-bold w-full flex justify-center items-center gap-2 p-3 rounded-md opacity-50'
            :
            'bg-gray-800 text-white font-bold w-full flex justify-center items-center gap-2 p-3 rounded-md'
          }
          onClick={(e : any) => onEmptyForm(e)}
          disabled={!form.targetEmail && !form.topic && !form.message && !form.ccEmail ? true : false}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          Reset
        </button>
        </div>

        <p
          className={
            !loading && isEmptyTargetEmail && isEmptyTopic && isEmptyMessage && isEmptyCCEmail
            ?
            'bg-red-500 text-white mt-3 font-bold mx-auto px-5 py-2 rounded-lg w-fit'
            :
            'hidden'
          }
        >
          {alert}
        </p>

        <p
          className={loading ? ' mt-3 font-bold mx-auto px-5 py-2 rounded-lg' : 'hidden'}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            className='h-10 w-10 animate-spin'
            style={{fill: 'rgb(244, 114, 182)'}}
          >
            {/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
            <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"/>
          </svg>
        </p>

        <p
          className={
            isSuccess
            ?
            'bg-pink-400 text-white mt-3 font-bold mx-auto px-5 py-2 rounded-lg w-fit'
            :
            'hidden'
          }
        >
          {alert}
        </p>
      </form>
    </>
  );
};

export default App;