import { endpoints } from '@/api/endpoints';
import upfetch from '@/api/instance';
import { useGeminiChat } from '@/hooks/useGeminiChat';
import { useRefresh } from '@/hooks/useRefresh';
import '@/libs/gemini';
import { cn } from '@/utils/cn';
import { IKImage } from 'imagekitio-react';
import { ArrowUp, StopCircle } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import MarkDown from 'react-markdown';
import { ScaleLoader } from 'react-spinners';
import type { IImage } from '../../types';
import Upload from '../Upload';
import styles from './NewPrompt.module.css';
const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;

interface IProps {
  data: {
    _id: string;
    userId: string;
    history: Array<{
      role: 'user' | 'model';
      parts: [{ _id: string; text: string }];
      img: string;
    }>;
  };
}

export default function NewPrompt({ data }: IProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const history = data?.history.map((item) => ({
    role: item.role,
    parts: [
      {
        text: item.parts[0].text,
      },
    ],
    ...(item.img && { img: item.img }),
  }));

  const { sendMessage } = useGeminiChat({
    initialHistory: history,
  });
  const refreshChat = useRefresh(['chat', data?._id]);

  const [img, setImg] = useState<IImage>({
    isLoading: false,
    error: '',
    dbData: null,
    file: null,
  });
  const endRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasRun = useRef(false);

  const sendMessageAndUpdateDB = async ({
    text,
    isInitial = false,
  }: {
    text: string;
    isInitial?: boolean;
  }) => {
    if (!isInitial) setQuestion(text);
    try {
      setIsLoading(true);
      let finalAnswer = '';

      await sendMessage(text, img.file, (streamedText) => {
        finalAnswer = streamedText;
        setAnswer(streamedText);
      });
      const payload = {
        question: isInitial ? question : text.length ? text : undefined,
        answer: finalAnswer,
        img: img.dbData?.filePath || undefined,
      };

      await upfetch(`${endpoints.chatEndpoint.chat}/${data?._id}`, {
        method: 'PUT',
        body: payload,
        onSuccess: () => {
          refreshChat();
          formRef.current?.reset();
          setQuestion('');
          setAnswer('');
          setImg({
            isLoading: false,
            error: '',
            dbData: null,
            file: null,
          });
        },
        onError(error) {
          console.error(error);
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const text = formData.get('text') as string;

      if (!text.trim()) return;
      setQuestion(text);
      setAnswer('');
      inputRef.current?.focus();
      formRef.current?.reset();

      await sendMessageAndUpdateDB({ text, isInitial: false });
    } catch (err) {
      console.error('خطا در ارسال پیام:', err);
    }
  };

  useEffect(() => {
    if (!data) return;
    if (hasRun.current) return;
    if (data.history.length !== 1) return;
    hasRun.current = true;
    const sendInitialMessage = async () => {
      const firstDBMessage = data?.history[0].parts[0].text;
      await sendMessageAndUpdateDB({ text: firstDBMessage, isInitial: true });
    };
    sendInitialMessage();
  }, [data]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [data, question, answer, img.dbData, isLoading]);

  return (
    <>
      {img.isLoading && <div className=''>loading...</div>}
      {img?.dbData?.filePath && (
        <IKImage
          urlEndpoint={urlEndpoint}
          path={img.dbData.filePath}
          width={380}
        />
      )}
      {question && (
        <div className={cn(styles.message, styles.user)}>{question}</div>
      )}

      {answer && (
        <div className={cn(styles.message)}>
          <MarkDown>{answer}</MarkDown>
        </div>
      )}

      {isLoading && <ScaleLoader color='#fff' />}
      <div className={styles.endChat} ref={endRef}></div>
      <form onSubmit={handleSubmit} className={styles.newForm} ref={formRef}>
        <Upload setImg={setImg} />
        <input id='file' type='file' multiple={false} hidden />
        <textarea
          autoFocus
          name='text'
          ref={inputRef}
          placeholder='Ask anything...'
          rows={1}
          className={styles.textarea}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
          onChange={(e) => {
            const textarea = e.target;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
          }}
        />

        <button disabled={isLoading} type='submit'>
          {isLoading ? <StopCircle size={18} /> : <ArrowUp size={18} />}
        </button>
      </form>
    </>
  );
}
